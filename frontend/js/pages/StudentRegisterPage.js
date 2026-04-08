window.StudentRegisterPage = {
  template: `
  <section class="d-flex justify-content-center py-4"><div class="card-glow panel p-4 w-100" style="max-width:780px"><h2 class="page-title text-center mb-4">Student Registration</h2>
  <form @submit.prevent="submit" class="row g-3">
    <div class="col-md-6"><input v-model.trim="form.username" required class="form-control form-control-lg" placeholder="Username"></div>
    <div class="col-md-6"><input v-model="form.password" type="password" required class="form-control form-control-lg" placeholder="Password"></div>
    <div class="col-md-12"><input v-model.trim="form.full_name" required class="form-control form-control-lg" placeholder="Full Name"></div>
    <div class="col-md-4"><input v-model.trim="form.branch" required class="form-control form-control-lg" placeholder="Branch"></div>
    <div class="col-md-4"><input v-model.number="form.cgpa" type="number" step="0.01" min="0" max="10" required class="form-control form-control-lg" placeholder="CGPA"></div>
    <div class="col-md-4"><input v-model.number="form.graduation_year" type="number" required class="form-control form-control-lg" placeholder="Graduation Year"></div>
    <div class="col-12 d-grid"><button class="btn btn-primary btn-lg">Register Student</button></div>
  </form></div></section>`,
  setup(_, { emit }) {
    const form = Vue.reactive({ username: '', password: '', full_name: '', branch: '', cgpa: null, graduation_year: null });
    async function submit() { try { await window.api.post('/user/register_student', form); emit('flash', 'Student registered'); window.router.push('/login'); } catch (e) { emit('error', e.message); } }
    return { form, submit };
  }
};
