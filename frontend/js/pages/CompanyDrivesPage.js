window.CompanyDrivesPage = {
  template: `<section class="card-glow panel p-4"><h2 class="section-title mb-3">My Drives</h2>
  <div class="table-responsive"><table class="table table-dark-custom"><thead><tr><th>ID</th><th>Title</th><th>Applicants</th></tr></thead><tbody>
    <tr v-for="d in drives" :key="d.drive_id"><td>{{ d.drive_id }}</td><td>{{ d.job_title }}</td><td>{{ d.applicants }}</td></tr>
  </tbody></table></div></section>`,
  setup(_, { emit }) { const drives = Vue.ref([]); Vue.onMounted(async()=>{ try{ const d = await window.api.get('/company/dashboard'); drives.value = d.drives || []; } catch(e){ emit('error', e.message); } }); return { drives }; }
};
