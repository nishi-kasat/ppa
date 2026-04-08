window.CompanyDashboardPage = {
  template: `<section><div class="text-center mb-4"><h1 class="page-title">Company Dashboard</h1></div>
  <div class="row g-4 mb-4"><div class="col-lg-4"><div class="card-glow panel p-4 text-center"><div class="section-title">Company</div><div class="display-6 fw-bold">{{ company.company_name || '-' }}</div></div></div>
  <div class="col-lg-4"><div class="card-glow panel p-4 text-center"><div class="section-title">Approval</div><div class="display-6 fw-bold">{{ company.approval_status || '-' }}</div></div></div>
  <div class="col-lg-4"><div class="card-glow panel p-4 text-center"><div class="section-title">Drives</div><div class="display-6 fw-bold">{{ drives.length }}</div></div></div></div>
  <div class="row g-4"><div class="col-lg-4" v-for="t in tiles" :key="t.path"><router-link :to="t.path" class="link-btn"><div class="card-glow panel p-4 tile-card d-flex flex-column justify-content-between"><h3 class="text-center text-white">{{ t.title }}</h3><button class="btn btn-primary">{{ t.action }}</button></div></router-link></div></div></section>`,
  setup(_, { emit }) {
    const company = Vue.reactive({}); const drives = Vue.ref([]);
    const tiles = [{ title: 'Create Placement Drive', action: 'Create', path: '/company/create-drive' }, { title: 'Manage Drives', action: 'View Drives', path: '/company/drives' }, { title: 'View Applications', action: 'Drive Applicants', path: '/company/applications' }];
    Vue.onMounted(async()=>{ try{ const d = await window.api.get('/company/dashboard'); Object.assign(company, d.company || {}); drives.value = d.drives || []; } catch(e){ emit('error', e.message); } });
    return { company, drives, tiles };
  }
};
