<template>
  <div class="login-screen">
    <router-link to="/" class="back-brand">
      <img :src="logo" alt="Xdemia">
    </router-link>

    <div class="login-card">
      <h1>{{ $t('landing.login.title') }}</h1>

      <div class="login-field">
        <label>{{ $t('landing.login.email') }}</label>
        <input v-model="email" type="email" :placeholder="$t('landing.login.emailPh')" autocomplete="email">
      </div>

      <div class="login-field">
        <label>{{ $t('landing.login.password') }}</label>
        <div class="login-pw-wrap">
          <input v-model="password" :type="lihatSandi ? 'text' : 'password'" :placeholder="$t('landing.login.password')" autocomplete="current-password" @keyup.enter="masuk">
          <button type="button" class="login-show" @click="lihatSandi = !lihatSandi">
            {{ lihatSandi ? $t('landing.login.hide') : $t('landing.login.show') }}
          </button>
        </div>
      </div>

      <p v-if="galat" class="login-galat">{{ galat }}</p>

      <label class="login-check">
        <input v-model="ingat" type="checkbox"> {{ $t('landing.login.keep') }}
      </label>

      <button type="button" class="btn-pill btn-pill-primary login-signin" @click="masuk">
        {{ $t('landing.login.signin') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      ingat: false,
      lihatSandi: false,
      galat: '',
      logo: require('@/assets/assets/brand/logo-solid.png')
    }
  },
  methods: {
    masuk () {
      this.galat = ''
      const ok = this.$store.dispatch('auth/login', { email: this.email, password: this.password })
      if (!ok) {
        this.galat = this.$t('landing.login.error')
        return
      }
      const tujuan = this.$route.query.next || '/home'
      this.$router.push(tujuan)
    }
  }
}
</script>

<style scoped>
.login-screen {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 28px;
}

.back-brand img { height: 32px; display: block; }

.login-card {
  width: 100%;
  max-width: 360px;
  background: #fff;
  border-radius: var(--radius);
  box-shadow: 0 24px 56px -20px rgba(8, 40, 45, .25);
  padding: 28px 26px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.login-card h1 {
  font-family: var(--font-head);
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 4px;
  color: var(--text);
}

.login-field { display: flex; flex-direction: column; gap: 5px; }
.login-field label { font-family: var(--font-head); font-size: .78rem; font-weight: 600; color: var(--muted); }
.login-field input {
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  padding: 11px 12px;
  font-family: var(--font-body);
  font-size: .92rem;
  color: var(--text);
  outline: none;
  width: 100%;
  min-height: var(--tap);
}
.login-field input:focus { border-color: var(--brand); }

.login-pw-wrap { position: relative; display: flex; align-items: center; }
.login-pw-wrap input { padding-right: 58px; }
.login-show {
  position: absolute; right: 12px;
  font-family: var(--font-head); font-size: .76rem; font-weight: 600;
  color: var(--brand-dark); background: none; border: none; cursor: pointer; padding: 0;
}

.login-galat { color: #c0392b; font-size: .82rem; margin: -6px 0 0; }

.login-check {
  display: flex; align-items: center; gap: 8px;
  font-size: .84rem; color: var(--muted); cursor: pointer;
}

.login-signin {
  margin-top: 4px;
  border: none;
  cursor: pointer;
  justify-content: center;
  width: 100%;
  min-height: var(--tap);
}
</style>
