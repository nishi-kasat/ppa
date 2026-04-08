window.CompanyCreateDrivePage = {
  template: `<section class="card-glow panel p-4"><h2 class="section-title mb-3">Create Placement Drive</h2>
  <form @submit.prevent="submit" class="row g-3">
    <div class="col-md-6"><input v-model="form.job_title" required class="form-control form-control-lg" placeholder="Job Title"></div>
    <div class="col-md-6"><input v-model="form.application_deadline" type="date" required class="form-control form-control-lg"></div>
    <div class="col-md-4"><input v-model="form.eligibility_branch" required class="form-control form-control-lg" placeholder="Eligibility Branch"></div>
    <div class="col-md-4"><input v-model.number="form.eligibility_cgpa" type="number" step="0.01" required class="form-control form-control-lg" placeholder="Minimum CGPA"></div>
    <div class="col-md-4"><input v-model.number="form.eligibility_year" type="number" required class="form-control form-control-lg" placeholder="Graduation Year"></div>
    <div class="col-md-12"><textarea v-model="form.job_description" required class="form-control form-control-lg" placeholder="Job Description"></textarea></div>
    <div class="col-md-3 d-grid"><button class="btn btn-primary btn-lg" :disabled="!approved">Submit</button></div>
  </form><p v-if="!approved" class="text-warning mt-2">Company approval required before creating drives.</p></section>`,
  setup(_, { emit }) {
    const form = Vue.reactive({ job_title: '', job_description: '', eligibility_branch: '', eligibility_cgpa: null, eligibility_year: null, application_deadline: '' });
    const approved = Vue.ref(false);
    Vue.onMounted(async()=>{ try{ const d = await window.api.get('/company/dashboard'); approved.value = d.company?.approval_status === 'approved'; } catch(e){ emit('error', e.message); } });
    async function submit(){ try{ await window.api.post('/company/create_drive', form); emit('flash', 'Drive created'); window.router.push('/company/drives'); } catch(e){ emit('error', e.message); } }
    return { form, approved, submit };
  }
};
