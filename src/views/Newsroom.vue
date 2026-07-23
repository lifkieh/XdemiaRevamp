<template>
  <div class="screen">
    <div class="row berita-head">
      <div class="grow">
        <h1 class="title-lg">{{ $t('newsroom.title') }}</h1>
        <p class="muted">{{ $t('newsroom.subtitle') }}</p>
      </div>
    </div>

    <FilterChips v-model="filter" :opsi="opsiFilter" :nilai="idFilter" bungkus />

    <CardSkeleton v-if="memuat" :jumlah="5" />

    <EmptyState
      v-else-if="hasil.length === 0"
      ikon="el-icon-reading"
      :judul="$t('newsroom.emptyTitle')"
      :pesan="$t('newsroom.emptyText')"
    />

    <template v-else>
      <div
        v-for="n in hasil"
        :key="n.id"
        class="card berita type-article is-clickable"
        @click="belumTersedia"
      >
        <div class="row row-top">
          <div class="thumb"><i class="el-icon-reading"></i></div>
          <div class="grow">
            <span class="tag-berita">{{ n.tag }}</span>
            <p class="title" data-content="true">{{ n.judul }}</p>
            <p class="muted"><span data-content="true">{{ n.sumber }}</span> · {{ $waktuRelatif(n.waktu) }} · {{ $t('common.readTime', { n: n.menitBaca }) }}</p>
          </div>
        </div>
        <p class="ringkasan" data-content="true">{{ n.ringkasan }}</p>
      </div>
    </template>
  </div>
</template>

<script>
import FilterChips from '@/components/FilterChips.vue'
import CardSkeleton from '@/components/CardSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import newsroom from '@/mock/newsroom.json'

export default {
  name: 'NewsroomView',
  components: { FilterChips, CardSkeleton, EmptyState },
  data () {
    return {
      memuat: true,
      data: [],
      filter: 'semua',
      idFilter: ['semua', 'Beasiswa', 'Building Blocks', 'Riset', 'Belajar', 'Komunitas', 'Kebijakan']
    }
  },
  computed: {
    opsiFilter () {
      return this.idFilter.map((id) => id === 'semua' ? this.$t('common.all') : id)
    },
    hasil () {
      if (this.filter === 'semua') return this.data
      return this.data.filter((n) => n.tag === this.filter)
    }
  },
  created () {
    this.timer = setTimeout(() => {
      this.data = newsroom
      this.memuat = false
    }, 500)
  },
  beforeDestroy () { clearTimeout(this.timer) },
  methods: {
    belumTersedia () { this.$message(this.$t('common.notAvailable')) }
  }
}
</script>

<style scoped>
.berita-head { margin: 4px 2px 12px; }
.berita-head .title-lg { margin-bottom: 2px; }

.berita { cursor: pointer; }

.tag-berita {
  display: inline-block;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--brand-dark);
  margin-bottom: 3px;
}

.ringkasan {
  margin: 10px 0 0;
  font-size: 14px;
  color: var(--muted);
}
</style>
