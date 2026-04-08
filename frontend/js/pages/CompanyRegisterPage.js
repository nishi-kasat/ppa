window.CompanyRegisterPage = {
  template: `
  <section class="d-flex justify-content-center py-4"><div class="card-glow panel p-4 w-100" style="max-width:780px"><h2 class="page-title text-center mb-4">Company Registration</h2>
  <form @submit.prevent="submit" class="row g-3">
    <div class="col-md-6"><input v-model.trim="form.username" required class="form-control form-control-lg" placeholder="Username"></div>
    <div class="col-md-6"><input v-model="form.password" type="password" required class="form-control form-control-lg" placeholder="Password"></div>
    <div class="col-md-12"><input v-model.trim="form.company_name" required class="form-control form-control-lg" placeholder="Company Name"></div>
    <div class="col-md-6"><input v-model.trim="form.hr_contact" required class="form-control form-control-lg" placeholder="HR Contact"></div>
    <div class="col-md-6"><input v-model.trim="form.website" class="form-control form-control-lg" placeholder="Website"></div>
    <div class="col-12 d-grid"><button class="btn btn-primary btn-lg">Register Company</button></div>
  </form></div></section>`,
  setup(_, { emit }) {
    const form = Vue.reactive({ username: '', password: '', company_name: '', hr_contact: '', website: '' });
    async function submit() { try { await window.api.post('/user/register_company', form); emit('flash', 'Company registered'); window.router.push('/login'); } catch (e) { emit('error', e.message); } }
    return { form, submit };
  }
};
