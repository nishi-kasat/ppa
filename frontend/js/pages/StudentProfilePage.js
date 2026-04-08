window.StudentProfilePage = {
  template: `<section class="card-glow panel p-4"><h2 class="section-title mb-3">Profile & Resume</h2>
  <form @submit.prevent="upload" class="row g-2" style="max-width:700px"><div class="col-md-8"><input ref="resume" type="file" class="form-control form-control-lg" accept=".pdf,.doc,.docx" required></div><div class="col-md-4 d-grid"><button class="btn btn-primary btn-lg">Upload Resume</button></div></form></section>`,
  setup(_, { emit }) {
    const resume = Vue.ref(null);
    async function upload(){ try{ const file = resume.value?.files?.[0]; if(!file) return emit('error', 'Select a file'); const fd = new FormData(); fd.append('resume', file); await window.api.post('/student/upload_resume', fd); emit('flash', 'Resume uploaded'); } catch(e){ emit('error', e.message); } }
    return { resume, upload };
  }
};
