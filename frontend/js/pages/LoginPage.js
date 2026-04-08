window.LoginPage = {
  template: `
  <section class="d-flex justify-content-center py-4">
    <div class="card-glow panel p-4 p-md-5 w-100" style="max-width:640px">
      <h2 class="page-title text-center mb-4">Login</h2>
      <form @submit.prevent="login" class="row g-4">
        <div class="col-12"><label class="form-label fs-4">Username</label><input v-model.trim="form.username" required class="form-control form-control-lg"></div>
        <div class="col-12"><label class="form-label fs-4">Password</label><input :type="showPassword ? 'text' : 'password'" v-model="form.password" required class="form-control form-control-lg"></div>
        <div class="col-12 form-check ps-5"><input class="form-check-input" type="checkbox" v-model="showPassword" id="show-password"><label class="form-check-label fs-4" for="show-password">Show Password</label></div>
        <div class="col-12 d-grid"><button class="btn btn-primary btn-lg">Login</button></div>
      </form>
    </div>
  </section>`,
  setup(_, { emit }) {
    const form = Vue.reactive({ username: '', password: '' });
    const showPassword = Vue.ref(false);
    async function login() {
      try {
        const data = await window.api.post('/auth/login', form);
        window.sessionStore.role = data.role;
        emit('flash', 'Login successful');
        window.router.push(window.roleHomeMap[data.role]);
      } catch (e) { emit('error', e.message); }
    }
    return { form, showPassword, login };
  }
};
