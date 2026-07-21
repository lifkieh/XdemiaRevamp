<template>
  <div class="chips" role="tablist">
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
    value: { type: String, default: '' }
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
