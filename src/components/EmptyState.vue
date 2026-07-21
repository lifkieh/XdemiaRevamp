<template>
  <div class="empty">
    <i :class="ikon"></i>
    <p class="title">{{ judul }}</p>
    <p class="muted">{{ pesan }}</p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    ikon: { type: String, default: 'el-icon-box' },
    judul: { type: String, default: 'Belum ada apa-apa di sini' },
    pesan: { type: String, default: 'Coba ubah pencarian atau filternya.' }
  }
}
</script>

<style scoped>
.empty {
  text-align: center;
  padding: 40px 20px;
  background: var(--card);
  border: 1px dashed var(--line);
  border-radius: var(--radius);
}

.empty i {
  font-size: 34px;
  color: var(--brand);
  margin-bottom: 10px;
  display: block;
}

.empty .title { margin-bottom: 4px; }
</style>
