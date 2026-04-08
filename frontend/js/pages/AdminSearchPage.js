window.AdminSearchPage = {
  template: `<section class="card-glow panel p-4"><h2 class="section-title mb-3">Search Students & Companies</h2>
  <div class="row g-2 mb-3"><div class="col-md-9"><input v-model="q" class="form-control form-control-lg" placeholder="Search by name"></div><div class="col-md-3 d-grid"><button class="btn btn-primary btn-lg" @click="search">Search</button></div></div>
  <div class="row g-4"><div class="col-md-6"><h4>Students</h4><ul class="list-group"><li v-for="s in students" :key="s.student_id" class="list-group-item">{{ s.full_name }} - {{ s.branch }}</li></ul></div>
  <div class="col-md-6"><h4>Companies</h4><ul class="list-group"><li v-for="c in companies" :key="c.company_id" class="list-group-item">{{ c.company_name }} - {{ c.approval_status }}</li></ul></div></div></section>`,
  setup(_, { emit }) {
    const q = Vue.ref(''); const students = Vue.ref([]); const companies = Vue.ref([]);
    async function search(){ try{ const r = await window.api.get(`/admin/search?query=${encodeURIComponent(q.value)}`); students.value = r.students || []; companies.value = r.companies || []; } catch(e){ emit('error', e.message); } }
    return { q, students, companies, search };
  }
};
