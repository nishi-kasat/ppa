window.RegisterChoicePage = { template: `
<section class="d-flex justify-content-center py-4">
  <div class="card-glow panel p-4 p-lg-5 w-100" style="max-width:860px">
    <h2 class="page-title text-center mb-2">Register</h2>
    <div class="row g-4 mt-2">
      <div class="col-md-6"><div class="card-glow panel-soft p-4 h-100 text-center"><h3>Student</h3><router-link class="btn btn-primary w-100 mt-3" to="/register/student">Continue as Student</router-link></div></div>
      <div class="col-md-6"><div class="card-glow panel-soft p-4 h-100 text-center"><h3>Company</h3><router-link class="btn btn-primary w-100 mt-3" to="/register/company">Continue as Company</router-link></div></div>
    </div>
  </div>
</section>` };
