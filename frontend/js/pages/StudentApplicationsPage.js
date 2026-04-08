window.StudentApplicationsPage = {
  template: `<section class="card-glow panel p-4"><h2 class="section-title mb-3">My Application History</h2>
  <div class="table-responsive"><table class="table table-dark-custom align-middle"><thead><tr><th>Job Title</th><th>Status</th><th>Applied Date</th></tr></thead><tbody>
  <tr v-for="a in applications" :key="a.job_title + a.application_date"><td>{{ a.job_title }}</td><td>{{ a.status }}</td><td>{{ a.application_date }}</td></tr>
  </tbody></table></div><button class="btn btn-outline-info" @click="exportCsv">Export CSV (Async Job)</button></section>`,
  setup(_, { emit }) {
    const applications = Vue.ref([]);
    Vue.onMounted(async()=>{ try{ applications.value = await window.api.get('/student/applications'); } catch(e){ emit('error', e.message); } });
    async function exportCsv(){ try{ const r = await window.api.get('/student/export_csv'); emit('flash', `Export job started: ${r.task_id}`); } catch(e){ emit('error', e.message); } }
    return { applications, exportCsv };
  }
};
