<template>
  <div class="chips" :class="{ 'is-bungkus': bungkus }" role="tablist">
    <button
      v-for="chip in opsi"
      :key="chip"
      class="chip"
      :class="{ 'is-active': chip === value }"
      role="tab"
      :aria-selected="chip === value ? 'true' : 'false'"
      @click="$emit('input', chip)"
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
    // true = chip turun ke baris berikutnya, tidak ada yang terpotong
    bungkus: { type: Boolean, default: false }
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
