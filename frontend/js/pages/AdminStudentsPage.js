window.AdminStudentsPage = {
  template: `<section class="card-glow panel p-4"><h2 class="section-title mb-3">Students</h2>
  <div class="table-responsive"><table class="table table-dark-custom align-middle"><thead><tr><th>Name</th><th>Branch</th><th>CGPA</th><th>Year</th><th>Resume</th><th>Action</th></tr></thead><tbody>
  <tr v-for="s in students" :key="s.student_id"><td>{{ s.full_name }}</td><td>{{ s.branch }}</td><td>{{ s.cgpa }}</td><td>{{ s.graduation_year }}</td><td>{{ s.resume_path || '-' }}</td><td><button class="btn btn-danger btn-sm" @click="deactivate(s.user_id)">Deactivate</button></td></tr>
  </tbody></table></div></section>`,
  setup(_, { emit }) {
    const students = Vue.ref([]);
    async function load() { try { students.value = await window.api.get('/admin/students'); } catch (e) { emit('error', e.message); } }
    async function deactivate(userId) { try { await window.api.post(`/admin/deactivate_student/${userId}`, {}); emit('flash', 'Student deactivated'); await load(); } catch (e) { emit('error', e.message); } }
    Vue.onMounted(load); return { students, deactivate };
  }
};
