window.CompanyApplicationsPage = {
  template: `<section class="card-glow panel p-4"><h2 class="section-title mb-3">Drive Applications</h2>
  <div class="row g-2 mb-3"><div class="col-md-8"><select v-model="driveId" class="form-select form-select-lg"><option disabled value="">Select drive</option><option v-for="d in drives" :value="d.drive_id" :key="d.drive_id">#{{ d.drive_id }} - {{ d.job_title }}</option></select></div><div class="col-md-4 d-grid"><button class="btn btn-primary btn-lg" @click="loadApps">Load Applications</button></div></div>
  <div class="table-responsive"><table class="table table-dark-custom align-middle"><thead><tr><th>Student</th><th>Status</th><th>Actions</th></tr></thead><tbody>
  <tr v-for="a in apps" :key="a.application_id"><td>{{ a.full_name }}</td><td>{{ a.status }}</td><td class="d-flex gap-2"><button class="btn btn-warning btn-sm" @click="setStatus(a.application_id, 'shortlisted')">Shortlist</button><button class="btn btn-success btn-sm" @click="setStatus(a.application_id, 'selected')">Select</button><button class="btn btn-danger btn-sm" @click="setStatus(a.application_id, 'rejected')">Reject</button></td></tr>
  </tbody></table></div></section>`,
  setup(_, { emit }) {
    const drives = Vue.ref([]); const driveId = Vue.ref(''); const apps = Vue.ref([]);
    Vue.onMounted(async()=>{ try{ const d = await window.api.get('/company/dashboard'); drives.value = d.drives || []; } catch(e){ emit('error', e.message); } });
    async function loadApps(){ if(!driveId.value) return emit('error', 'Please select a drive'); try{ apps.value = await window.api.get(`/company/applications/${driveId.value}`); } catch(e){ emit('error', e.message); } }
    async function setStatus(id, status){ try{ await window.api.post(`/company/update_status/${id}`, { status }); emit('flash', `Application marked ${status}`); await loadApps(); } catch(e){ emit('error', e.message); } }
    return { drives, driveId, apps, loadApps, setStatus };
  }
};
