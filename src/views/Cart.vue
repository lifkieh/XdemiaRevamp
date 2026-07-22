<template>
  <div class="screen">
    <div class="row keranjang-head">
      <div class="grow">
        <h1 class="title-lg">{{ $t('cart.title') }}</h1>
        <p class="muted">{{ $t('cart.subtitle') }}</p>
      </div>
    </div>

    <el-tabs v-model="tab" class="tab-keranjang">
      <el-tab-pane name="item">
        <span slot="label"><i class="el-icon-shopping-cart-2"></i> {{ $t('cart.items', { n: jumlahItem }) }}</span>

        <EmptyState
          v-if="item.length === 0"
          ikon="el-icon-shopping-cart-2"
          :judul="$t('cart.emptyTitle')"
          :pesan="$t('cart.emptyText')"
        >
          <el-button type="primary" @click="$router.push('/learn')">{{ $t('cart.emptyAction') }}</el-button>
        </EmptyState>

        <template v-else>
          <BaseCard
            v-for="i in item"
            :key="i.id"
            :inisial="i.inisial"
            :judul="i.nama"
            :subjudul="i.penjual"
          >
            <template slot="meta">
              <span class="pill">{{ i.jenis }}</span>
              <span class="pill">{{ $t('cart.itemCount', { n: i.jumlah }) }}</span>
            </template>
            <div class="kaki">
              <span class="harga">{{ rupiah(i.harga * i.jumlah) }}</span>
              <button class="tap hapus" @click="hapus(i)">
                <i class="el-icon-delete"></i><span>{{ $t('cart.remove') }}</span>
              </button>
            </div>
          </BaseCard>

          <div class="card ringkasan">
            <div class="baris">
              <span class="muted">{{ $t('cart.summaryItems') }}</span>
              <span>{{ jumlahItem }}</span>
            </div>
            <div class="baris">
              <span class="muted">{{ $t('cart.subtotal') }}</span>
              <span>{{ rupiah(total) }}</span>
            </div>
            <div class="baris">
              <span class="muted">{{ $t('cart.serviceFee') }}</span>
              <span>{{ rupiah(biayaLayanan) }}</span>
            </div>
            <div class="baris total">
              <span>{{ $t('cart.total') }}</span>
              <span>{{ rupiah(total + biayaLayanan) }}</span>
            </div>
            <el-button type="primary" class="tombol-bayar" @click="checkout">
              <i class="el-icon-wallet"></i> {{ $t('cart.checkout') }}
            </el-button>
          </div>
        </template>
      </el-tab-pane>

      <el-tab-pane name="riwayat">
        <span slot="label"><i class="el-icon-time"></i> {{ $t('cart.history') }}</span>

        <BaseCard
          v-for="r in riwayat"
          :key="r.id"
          :inisial="r.inisial"
          :judul="r.nama"
          :subjudul="r.penjual + ' · ' + r.tanggal"
        >
          <template slot="meta">
            <span class="pill">{{ r.jenis }}</span>
            <span class="pill" :class="{ 'pill-warn': r.status === 'Dibatalkan' }">{{ r.status }}</span>
          </template>
          <div class="kaki">
            <span class="harga">{{ rupiah(r.harga) }}</span>
            <el-button size="small" @click="belumTersedia">{{ $t('cart.receipt') }}</el-button>
          </div>
        </BaseCard>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BaseCard from '@/components/BaseCard.vue'
import EmptyState from '@/components/EmptyState.vue'

export default {
  name: 'CartView',
  components: { BaseCard, EmptyState },
  data () {
    return { tab: 'item', biayaLayanan: 5000 }
  },
  computed: {
    item () { return this.$store.state.cart.item },
    riwayat () { return this.$store.state.cart.riwayat },
    jumlahItem () { return this.$store.getters['cart/jumlahItem'] },
    total () { return this.$store.getters['cart/total'] }
  },
  methods: {
    rupiah (n) { return 'Rp' + n.toLocaleString('id-ID') },
    hapus (i) {
      this.$store.dispatch('cart/hapus', i.id)
      this.$message({ message: this.$t('cart.removed', { name: i.nama }), type: 'info' })
    },
    checkout () {
      this.$message({ message: this.$t('cart.checkoutNote'), type: 'success' })
    },
    belumTersedia () { this.$message(this.$t('common.notAvailable')) }
  }
}
</script>

<style scoped>
.keranjang-head { margin: 4px 2px 8px; }
.keranjang-head .title-lg { margin-bottom: 2px; }

.tab-keranjang >>> .el-tabs__nav-wrap::after { height: 1px; background: var(--line); }
.tab-keranjang >>> .el-tabs__item { padding: 0 14px; }

.kaki {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--line);
}

.harga { font-weight: 700; font-size: 15px; }

.hapus { color: #c0392b; }
.hapus:hover { color: #c0392b; background: #fdeceb; }

.ringkasan { margin-top: 4px; }

.baris {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  border-bottom: 1px solid var(--line);
}

.baris.total {
  font-weight: 700;
  font-size: 16px;
  border-bottom: 0;
  padding-top: 12px;
}

.tombol-bayar { width: 100%; min-height: 46px; margin-top: 10px; }
</style>
