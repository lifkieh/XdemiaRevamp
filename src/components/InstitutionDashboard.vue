<template>
  <div>
    <div class="card sambutan">
      <div class="row">
        <div class="thumb thumb-round sambutan-avatar">{{ inisial }}</div>
        <div class="grow">
          <p class="title-lg" data-content="true">{{ $t('institution.title') }}</p>
          <p class="muted">{{ $t('institution.subtitle') }}</p>
        </div>
      </div>
    </div>

    <div class="stat-grid">
      <div class="card stat-kartu">
        <span class="stat-angka">12</span>
        <span class="muted stat-label">{{ $t('institution.stats.blocks') }}</span>
      </div>
      <div class="card stat-kartu">
        <span class="stat-angka">3.4K</span>
        <span class="muted stat-label">{{ $t('institution.stats.enrolments') }}</span>
      </div>
      <div class="card stat-kartu">
        <span class="stat-angka">5</span>
        <span class="muted stat-label">{{ $t('institution.stats.scholarships') }}</span>
      </div>
      <div class="card stat-kartu">
        <span class="stat-angka">18.9K</span>
        <span class="muted stat-label">{{ $t('institution.stats.views') }}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-head">
        <h2 class="title">{{ $t('institution.actionsTitle') }}</h2>
      </div>

      <button class="card aksi-baris" @click="belumTersedia">
        <div class="thumb aksi-ikon aksi-publish"><i class="el-icon-upload2"></i></div>
        <div class="grow">
          <p class="title">{{ $t('institution.actions.publish.title') }}</p>
          <p class="muted">{{ $t('institution.actions.publish.text') }}</p>
        </div>
        <i class="el-icon-arrow-right muted"></i>
      </button>

      <button class="card aksi-baris" @click="belumTersedia">
        <div class="thumb aksi-ikon aksi-manage"><i class="el-icon-collection"></i></div>
        <div class="grow">
          <p class="title">{{ $t('institution.actions.manage.title') }}</p>
          <p class="muted">{{ $t('institution.actions.manage.text') }}</p>
        </div>
        <i class="el-icon-arrow-right muted"></i>
      </button>

      <button class="card aksi-baris" @click="belumTersedia">
        <div class="thumb aksi-ikon aksi-monetize"><i class="el-icon-coin"></i></div>
        <div class="grow">
          <p class="title">{{ $t('institution.actions.monetize.title') }}</p>
          <p class="muted">{{ $t('institution.actions.monetize.text') }}</p>
        </div>
        <i class="el-icon-arrow-right muted"></i>
      </button>
    </div>

    <div class="section">
      <div class="section-head">
        <h2 class="title">{{ $t('institution.activityTitle') }}</h2>
      </div>
      <div class="card">
        <div v-for="a in aktivitas" :key="a.id" class="aktivitas-baris">
          <span class="titik" :class="'titik-' + a.tipe"></span>
          <div class="grow">
            <p class="title" data-content="true">{{ a.teks }}</p>
            <p class="muted">{{ $waktuRelatif(a.waktu) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InstitutionDashboard',
  data () {
    return {
      aktivitas: [
        { id: 1, tipe: 'publish', teks: 'Building Block "LCA for charging infrastructure" diterbitkan', waktu: { jam: 3 } },
        { id: 2, tipe: 'enrol', teks: '48 mahasiswa baru mendaftar ke Statistika Dasar untuk Data', waktu: { hari: 1 } },
        { id: 3, tipe: 'review', teks: 'Building Block baru menunggu tinjauan editor', waktu: { hari: 2 } }
      ]
    }
  },
  computed: {
    inisial () { return this.$store.getters['user/inisial'] }
  },
  methods: {
    belumTersedia () { this.$message(this.$t('common.notAvailable')) }
  }
}
</script>

<style scoped>
.sambutan { margin-bottom: 12px; }
.sambutan-avatar { width: 48px; height: 48px; background: var(--brand); color: #fff; }

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 6px;
}

.stat-kartu {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-angka {
  font-family: var(--font-head);
  font-weight: 800;
  font-size: 22px;
  color: var(--brand-dark);
}

.stat-label { font-size: 12px; }

.aksi-baris {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: left;
  font-family: inherit;
  cursor: pointer;
}

.aksi-ikon { color: #fff; font-size: 19px; }
.aksi-publish { background: var(--brand); }
.aksi-manage { background: var(--accent); }
.aksi-monetize { background: var(--brand-ink, var(--brand-dark)); }

.aktivitas-baris {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-top: 1px solid var(--line);
}

.aktivitas-baris:first-child { border-top: 0; padding-top: 0; }

.titik {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex: none;
}

.titik-publish { background: var(--brand); }
.titik-enrol { background: var(--accent); }
.titik-review { background: #e08a3c; }
</style>
