<template>
  <!-- Satu pola kartu, dipakai ulang di Jelajah, Belajar, Beasiswa, dan Tersimpan. -->
  <component :is="tag" class="card basecard" :class="{ 'is-clickable': clickable }" v-on="$listeners">
    <div class="row row-top">
      <div class="thumb" :class="{ 'thumb-round': bulat }">{{ inisial }}</div>

      <div class="grow">
        <p class="title clamp-2" data-content="true">{{ judul }}</p>
        <p v-if="subjudul" class="muted" data-content="true">{{ subjudul }}</p>
        <div v-if="$slots.meta" class="basecard-meta">
          <slot name="meta"></slot>
        </div>
      </div>

      <div v-if="$slots.action" class="basecard-action">
        <slot name="action"></slot>
      </div>
    </div>

    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
    inisial: { type: String, default: '?' },
    judul: { type: String, required: true },
    subjudul: { type: String, default: '' },
    bulat: { type: Boolean, default: false },
    clickable: { type: Boolean, default: false },
    tag: { type: String, default: 'div' }
  }
}
</script>

<style scoped>
.basecard { margin-bottom: 10px; }

.is-clickable { cursor: pointer; }
.is-clickable:hover { border-color: var(--brand); }

.basecard-meta {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.basecard-action {
  flex: none;
  display: flex;
  align-items: center;
}
</style>
