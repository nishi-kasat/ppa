window.AdminCompaniesPage = {
  template: `<section class="card-glow panel p-4"><h2 class="section-title mb-3">Company Registrations</h2>
  <div class="table-responsive"><table class="table table-dark-custom align-middle"><thead><tr><th>Company</th><th>HR</th><th>Website</th><th>Status</th><th>Actions</th></tr></thead><tbody>
  <tr v-for="c in companies" :key="c.company_id"><td>{{ c.company_name }}</td><td>{{ c.hr_contact }}</td><td>{{ c.website || '-' }}</td><td>{{ c.approval_status }}</td>
  <td class="d-flex gap-2"><button class="btn btn-success btn-sm" @click="act('approve_company', c.company_id)">Approve</button><button class="btn btn-warning btn-sm" @click="act('reject_company', c.company_id)">Reject</button><button class="btn btn-danger btn-sm" @click="act('blacklist_company', c.company_id)">Blacklist</button></td></tr>
  </tbody></table></div></section>`,
  setup(_, { emit }) {
    const companies = Vue.ref([]);
    async function load() { try { companies.value = await window.api.get('/admin/companies'); } catch (e) { emit('error', e.message); } }
    async function act(route, id) { try { await window.api.post(`/admin/${route}/${id}`, {}); emit('flash', 'Action successful'); await load(); } catch (e) { emit('error', e.message); } }
    Vue.onMounted(load); return { companies, act };
  }
};
