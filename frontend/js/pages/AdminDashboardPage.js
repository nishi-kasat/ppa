window.AdminDashboardPage = {
  template: `
  <section>
    <div class="text-center mb-4"><h1 class="page-title">Admin Dashboard</h1><p class="fs-2">Manage users, drives, and approvals.</p></div>
    <div class="row g-4 mb-4"><div class="col-lg-4" v-for="s in statsList" :key="s.label"><div class="card-glow panel p-4 text-center"><div class="section-title">{{ s.label }}</div><div class="display-4 fw-bold">{{ s.value }}</div></div></div></div>
    <div class="row g-4">
      <div class="col-lg-4" v-for="t in tiles" :key="t.path"><router-link :to="t.path" class="link-btn"><div class="card-glow panel p-4 tile-card d-flex flex-column justify-content-between"><h3 class="text-center text-white">{{ t.title }}</h3><button class="btn" :class="t.btn">{{ t.action }}</button></div></router-link></div>
    </div>
  </section>`,
  setup(_, { emit }) {
    const stats = Vue.reactive({ total_students: 0, total_companies: 0, total_drives: 0 });
    const tiles = [
      { title: 'Company Approval', action: 'View Companies', path: '/admin/companies', btn: 'btn-primary' },
      { title: 'Drive Approval', action: 'View Drives', path: '/admin/drives', btn: 'btn-primary' },
      { title: 'Student Management', action: 'View Students', path: '/admin/students', btn: 'btn-primary' },
      { title: 'Applications', action: 'View Applications', path: '/admin/applications', btn: 'btn-primary' },
      { title: 'Search', action: 'Search Records', path: '/admin/search', btn: 'btn-primary' },
      { title: 'Logout', action: 'Logout', path: '/login', btn: 'btn-danger' },
    ];
    const statsList = Vue.computed(() => [
      { label: 'Total Students', value: stats.total_students },
      { label: 'Total Companies', value: stats.total_companies },
      { label: 'Total Drives', value: stats.total_drives },
    ]);
    Vue.onMounted(async () => { try { Object.assign(stats, await window.api.get('/admin/dashboard')); } catch (e) { emit('error', e.message); } });
    return { statsList, tiles };
  }
};
