window.AdminApplicationsPage = {
  template: `<section class="card-glow panel p-4"><h2 class="section-title mb-3">All Applications</h2>
  <div class="table-responsive"><table class="table table-dark-custom align-middle"><thead><tr><th>Student</th><th>Drive</th><th>Status</th><th>Date</th></tr></thead><tbody>
  <tr v-for="a in apps" :key="a.application_id"><td>{{ a.full_name }}</td><td>{{ a.job_title }}</td><td>{{ a.status }}</td><td>{{ a.application_date }}</td></tr>
  </tbody></table></div></section>`,
  setup(_, { emit }) { const apps = Vue.ref([]); Vue.onMounted(async()=>{ try { apps.value = await window.api.get('/admin/applications'); } catch(e){ emit('error', e.message); } }); return { apps }; }
};
