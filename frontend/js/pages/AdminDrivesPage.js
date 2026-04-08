window.AdminDrivesPage = {
  template: `<section class="card-glow panel p-4"><h2 class="section-title mb-3">Placement Drives</h2>
  <div class="table-responsive"><table class="table table-dark-custom align-middle"><thead><tr><th>Company</th><th>Job</th><th>Eligibility</th><th>Deadline</th><th>Status</th><th>Actions</th></tr></thead><tbody>
  <tr v-for="d in drives" :key="d.drive_id"><td>{{ d.company_name }}</td><td>{{ d.job_title }}</td><td>{{ d.eligibility_branch }} / {{ d.eligibility_cgpa }} / {{ d.eligibility_year }}</td><td>{{ d.application_deadline }}</td><td>{{ d.status }}</td>
  <td class="d-flex gap-2"><button class="btn btn-success btn-sm" @click="act('approve_drive', d.drive_id)">Approve</button><button class="btn btn-warning btn-sm" @click="act('reject_drive', d.drive_id)">Reject</button></td></tr>
  </tbody></table></div></section>`,
  setup(_, { emit }) {
    const drives = Vue.ref([]);
    async function load() { try { drives.value = await window.api.get('/admin/drives'); } catch (e) { emit('error', e.message); } }
    async function act(route, id) { try { await window.api.post(`/admin/${route}/${id}`, {}); emit('flash', 'Action successful'); await load(); } catch (e) { emit('error', e.message); } }
    Vue.onMounted(load); return { drives, act };
  }
};
