<template>
  <div class="chips" :class="{ 'is-bungkus': bungkus }" role="tablist">
    <button
      v-for="(chip, i) in opsi"
      :key="chip + '-' + i"
      class="chip"
      :class="{ 'is-active': aktif(i) }"
      role="tab"
      :aria-selected="aktif(i) ? 'true' : 'false'"
      @click="pilih(i)"
    >
      {{ chip }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'FilterChips',
  props: {
    opsi: { type: Array, required: true },
    value: { type: String, default: '' },
    // nilai kanonik sejajar dengan opsi; kalau diisi, yang dikirim id-nya, bukan labelnya
    nilai: { type: Array, default: null },
    // true = chip turun ke baris berikutnya, tidak ada yang terpotong
    bungkus: { type: Boolean, default: false }
  },
  methods: {
    kunci (i) { return this.nilai ? this.nilai[i] : this.opsi[i] },
    aktif (i) { return this.kunci(i) === this.value },
    pilih (i) { this.$emit('input', this.kunci(i)) }
  }
}
</script>

<style scoped>
.chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 2px 8px;
  scrollbar-width: none;
}

.chips::-webkit-scrollbar { display: none; }

/* mode bungkus: semua chip selalu kelihatan, yang tidak muat turun baris */
.chips.is-bungkus {
  flex-wrap: wrap;
  overflow-x: visible;
  gap: 8px;
  row-gap: 8px;
}

.chip {
  flex: none;
  min-height: var(--tap);
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
}

.chip:hover { border-color: var(--brand); color: var(--brand); }

.chip.is-active {
  background: var(--brand);
  border-color: var(--brand);
  color: #fff;
}
</style>
