<template>
  <div class="searchbar">
    <el-input
      :value="value"
      :placeholder="placeholder"
      prefix-icon="el-icon-search"
      clearable
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    value: { type: String, default: '' },
    placeholder: { type: String, default: 'Cari apa hari ini?' }
  }
}
</script>

<style scoped>
.searchbar { margin-bottom: 10px; }
.searchbar >>> .el-input__inner { font-size: 15px; }
.searchbar >>> .el-input__icon { line-height: 44px; font-size: 16px; }
</style>
