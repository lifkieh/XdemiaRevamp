<template>
  <!-- Satu isi, dua bungkus: drawer penuh di mobile, panel mengambang di desktop -->
  <div class="overlay-akar">
    <el-drawer
      v-if="!isDesktop"
      :visible="terbuka"
      direction="rtl"
      size="100%"
      :with-header="false"
      :custom-class="'overlay-drawer ' + kelas"
      @update:visible="onVisible"
    >
      <div class="overlay-isi">
        <slot></slot>
      </div>
    </el-drawer>

    <template v-else>
      <div v-if="terbuka" class="latar" @click="$emit('tutup')"></div>
      <transition name="panel-masuk">
        <div v-if="terbuka" class="panel" :class="kelas">
          <div class="overlay-isi">
            <slot></slot>
          </div>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
export default {
  name: 'OverlayPanel',
  props: {
    terbuka: { type: Boolean, default: false },
    kelas: { type: String, default: '' }
  },
  computed: {
    isDesktop () { return this.$store.getters['layout/isDesktop'] }
  },
  watch: {
    // kalau layar mengecil saat panel terbuka, tutup supaya tidak ada sisa elemen
    isDesktop () { if (this.terbuka) this.$emit('tutup') }
  },
  methods: {
    onVisible (nilai) { if (!nilai) this.$emit('tutup') }
  }
}
</script>

<style scoped>
.latar {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(16, 32, 42, .16);
}

.panel {
  position: fixed;
  top: 72px;
  right: 24px;
  z-index: 2001;
  width: 380px;
  height: min(70vh, 560px);
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: 0 12px 32px rgba(16, 32, 42, .18);
  overflow: hidden;
}

.overlay-isi { height: 100%; }

.panel-masuk-enter-active,
.panel-masuk-leave-active { transition: opacity .16s ease, transform .16s ease; }

.panel-masuk-enter,
.panel-masuk-leave-to { opacity: 0; transform: translateY(-8px); }
</style>

<style>
.overlay-drawer { max-width: 480px; }
.overlay-drawer .el-drawer__body { padding: 0; height: 100%; overflow: hidden; }
</style>
