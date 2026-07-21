<template>
  <div>
    <div v-for="n in jumlah" :key="n" class="card">
      <el-skeleton animated>
        <template slot="template">
          <div class="row row-top">
            <el-skeleton-item variant="image" class="sk-thumb" />
            <div class="grow">
              <el-skeleton-item variant="h3" style="width: 70%" />
              <el-skeleton-item variant="text" style="width: 45%; margin-top: 8px" />
              <el-skeleton-item variant="text" style="width: 90%; margin-top: 8px" />
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardSkeleton',
  props: {
    jumlah: { type: Number, default: 4 }
  }
}
</script>

<style scoped>
.sk-thumb {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  flex: none;
}
</style>
