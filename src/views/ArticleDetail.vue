<template>
  <div class="screen">
    <button class="tap kembali" @click="$router.back()">
      <i class="el-icon-arrow-left"></i><span>{{ $t('common.back') }}</span>
    </button>

    <CardSkeleton v-if="memuat" :jumlah="3" />

    <EmptyState
      v-else-if="!artikel"
      ikon="el-icon-warning-outline"
      :judul="$t('article.notFoundTitle')"
      :pesan="$t('article.notFoundText')"
    >
      <el-button type="primary" @click="$router.push('/')">{{ $t('article.notFoundAction') }}</el-button>
    </EmptyState>

    <template v-else>
      <article class="card artikel">
        <div class="cover">
          <span class="cover-inisial">{{ artikel.inisial }}</span>
        </div>

        <div class="artikel-isi">
          <h1 class="judul">{{ artikel.judul }}</h1>

          <div class="row penulis">
            <div class="thumb thumb-round">{{ artikel.inisialPenulis }}</div>
            <div class="grow">
              <p class="title nama-penulis">
                {{ artikel.penulis }}
                <i v-if="artikel.terverifikasi" class="el-icon-success verified" ></i>
              </p>
              <p class="muted">{{ artikel.sumber }} · {{ artikel.tanggal }}</p>
            </div>
          </div>

          <div class="pil-baris">
            <span class="pill"><i class="el-icon-view"></i> {{ $t('common.views', { n: views }) }}</span>
            <span class="pill">{{ artikel.baca }}</span>
          </div>

          <p v-for="(p, i) in artikel.isi" :key="'p-' + i" class="paragraf">{{ p }}</p>

          <div class="kaki">
            <button class="tap" :class="{ 'is-active': tersimpan }" @click="toggleSimpan">
              <i :class="tersimpan ? 'el-icon-star-on' : 'el-icon-collection-tag'"></i>
              <span>{{ tersimpan ? $t('common.saved') : $t('common.save') }}</span>
            </button>
            <button class="tap" @click="bagikan">
              <i class="el-icon-share"></i><span>{{ $t('common.share') }}</span>
            </button>
          </div>
        </div>
      </article>

      <section class="section">
        <div class="section-head">
          <h2 class="title">{{ $t('article.readerOther') }}</h2>
        </div>
        <BaseCard
          v-for="a in lainnya"
          :key="a.id"
          :inisial="a.inisial"
          :judul="a.judul"
          :subjudul="a.penulis + ' · ' + a.baca"
          clickable
          @click.native="$router.push('/artikel/' + a.id)"
        />
      </section>
    </template>
  </div>
</template>

<script>
import BaseCard from '@/components/BaseCard.vue'
import CardSkeleton from '@/components/CardSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import articles from '@/mock/articles.json'

export default {
  name: 'ArticleDetailView',
  components: { BaseCard, CardSkeleton, EmptyState },
  data () {
    return { memuat: true, artikel: null }
  },
  computed: {
    tersimpan () {
      return this.artikel ? this.$store.getters['bookmarks/isArtikelTersimpan'](this.artikel.id) : false
    },
    views () {
      return this.artikel ? this.artikel.views.toLocaleString('id-ID') : '0'
    },
    lainnya () {
      if (!this.artikel) return []
      return articles.filter((a) => a.id !== this.artikel.id).slice(0, 3)
    }
  },
  created () { this.muat() },
  beforeDestroy () { clearTimeout(this.timer) },
  watch: {
    '$route.params.id' () { this.muat() }
  },
  methods: {
    muat () {
      this.memuat = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.artikel = articles.filter((a) => a.id === this.$route.params.id)[0] || null
        this.memuat = false
      }, 500)
    },
    toggleSimpan () {
      this.$store.dispatch('bookmarks/toggleArtikel', this.artikel.id)
    },
    bagikan () {
      this.$message(this.$t('article.shared'))
    }
  }
}
</script>

<style scoped>
.kembali { margin: 0 0 6px -8px; }

.artikel { padding: 0; overflow: hidden; }

.cover {
  height: 120px;
  background: linear-gradient(120deg, var(--brand), #3fc9c0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-inisial { color: #fff; font-size: 38px; font-weight: 800; }

.artikel-isi { padding: 16px 14px; }

.judul { font-size: 21px; font-weight: 700; margin: 0 0 12px; line-height: 1.3; }

.penulis { padding-bottom: 10px; border-bottom: 1px solid var(--line); }
.nama-penulis { display: flex; align-items: center; gap: 6px; }
.verified { color: var(--brand); font-size: 14px; }

.pil-baris { display: flex; gap: 6px; margin: 10px 0 4px; flex-wrap: wrap; }

.paragraf { margin: 14px 0 0; font-size: 15px; line-height: 1.65; }

.kaki {
  display: flex;
  gap: 6px;
  margin-top: 18px;
  padding-top: 10px;
  border-top: 1px solid var(--line);
}
</style>
