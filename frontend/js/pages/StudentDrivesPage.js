window.StudentDrivesPage = {
  template: `<section class="card-glow panel p-4"><h2 class="section-title mb-3">Approved Placement Drives</h2>
  <div class="row g-2 mb-3"><div class="col-md-9"><input v-model="q" class="form-control form-control-lg" placeholder="Search drive by job title"></div><div class="col-md-3 d-grid"><button class="btn btn-primary btn-lg" @click="search">Search</button></div></div>
  <div class="row g-3"><div class="col-lg-4" v-for="d in drives" :key="d.drive_id"><div class="card-glow panel-soft p-3 h-100 d-flex flex-column justify-content-between"><div><h4>{{ d.job_title }}</h4><p>{{ d.job_description }}</p><ul><li>Branch: {{ d.eligibility_branch }}</li><li>CGPA: {{ d.eligibility_cgpa }}+</li><li>Year: {{ d.eligibility_year }}</li><li>Deadline: {{ d.application_deadline }}</li></ul></div><button class="btn btn-primary" :disabled="applied[d.drive_id]" @click="apply(d.drive_id)">{{ applied[d.drive_id] ? 'Applied' : 'Apply' }}</button></div></div></div></section>`,
  setup(_, { emit }) {
    const q = Vue.ref(''); const drives = Vue.ref([]); const applied = Vue.reactive({});
    async function refreshApplied(){ const d = await window.api.get('/student/dashboard'); Object.keys(applied).forEach((k)=>delete applied[k]); for(const a of (d.applications||[])) applied[a.drive_id]=true; }
    async function loadDrives(){ drives.value = (await window.api.get('/student/dashboard')).drives || []; }
    async function init(){ try{ await loadDrives(); await refreshApplied(); } catch(e){ emit('error', e.message); } }
    async function search(){ try{ drives.value = await window.api.get(`/student/search_drives?query=${encodeURIComponent(q.value)}`); await refreshApplied(); } catch(e){ emit('error', e.message); } }
    async function apply(driveId){ try{ await window.api.post(`/student/apply/${driveId}`, {}); emit('flash', 'Application submitted'); await init(); } catch(e){ emit('error', e.message); } }
    Vue.onMounted(init); return { q, drives, applied, search, apply };
  }
};
