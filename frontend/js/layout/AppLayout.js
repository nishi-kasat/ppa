window.AppLayout = {
  template: `
  <div class="page-wrap">
    <nav class="navbar top-nav sticky-top">
      <div class="container-fluid px-4 py-2">
        <router-link class="brand" to="/">📍 ParkSmart</router-link>
        <div class="d-flex gap-2 align-items-center">
          <router-link v-if="isLoggedIn" :to="roleHome" class="btn btn-outline-dark">Dashboard</router-link>
          <button v-if="isLoggedIn" @click="logout" class="btn btn-danger">Logout</button>
        </div>
      </div>
    </nav>
    <main class="container-fluid px-lg-5 py-4">
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <router-view @flash="flash" @error="setError" />
    </main>
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index:1090">
      <div class="toast text-bg-dark border-0" ref="toastRef">
        <div class="d-flex">
          <div class="toast-body">{{ message }}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    </div>
  </div>`,
  setup() {
    const message = Vue.ref('');
    const error = Vue.ref('');
    const toastRef = Vue.ref(null);
    let toast;

    Vue.onMounted(async () => {
      toast = new bootstrap.Toast(toastRef.value, { delay: 2500 });
      if (!window.sessionStore.loaded) {
        try { await window.sessionStore.refresh(); } catch (_) { window.sessionStore.loaded = true; }
      }
    });

    const isLoggedIn = Vue.computed(() => Boolean(window.sessionStore.role));
    const roleHome = Vue.computed(() => window.roleHomeMap[window.sessionStore.role] || '/');

    async function logout() { await window.sessionStore.logout(); location.assign('/'); }
    function flash(msg) { message.value = msg; error.value = ''; toast?.show(); }
    function setError(msg) { error.value = msg; }

    return { message, error, toastRef, flash, setError, isLoggedIn, roleHome, logout };
  },
};
