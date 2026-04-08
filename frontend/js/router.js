window.routes = [
  { path: '/', component: window.LandingPage },
  { path: '/login', component: window.LoginPage },
  { path: '/register', component: window.RegisterChoicePage },
  { path: '/register/student', component: window.StudentRegisterPage },
  { path: '/register/company', component: window.CompanyRegisterPage },

  { path: '/admin', component: window.AdminDashboardPage, meta: { role: 'administrator' } },
  { path: '/admin/companies', component: window.AdminCompaniesPage, meta: { role: 'administrator' } },
  { path: '/admin/drives', component: window.AdminDrivesPage, meta: { role: 'administrator' } },
  { path: '/admin/students', component: window.AdminStudentsPage, meta: { role: 'administrator' } },
  { path: '/admin/applications', component: window.AdminApplicationsPage, meta: { role: 'administrator' } },
  { path: '/admin/search', component: window.AdminSearchPage, meta: { role: 'administrator' } },

  { path: '/company', component: window.CompanyDashboardPage, meta: { role: 'company' } },
  { path: '/company/create-drive', component: window.CompanyCreateDrivePage, meta: { role: 'company' } },
  { path: '/company/drives', component: window.CompanyDrivesPage, meta: { role: 'company' } },
  { path: '/company/applications', component: window.CompanyApplicationsPage, meta: { role: 'company' } },

  { path: '/student', component: window.StudentDashboardPage, meta: { role: 'student' } },
  { path: '/student/drives', component: window.StudentDrivesPage, meta: { role: 'student' } },
  { path: '/student/applications', component: window.StudentApplicationsPage, meta: { role: 'student' } },
  { path: '/student/profile', component: window.StudentProfilePage, meta: { role: 'student' } },

  { path: '/:pathMatch(.*)*', component: window.NotFoundPage },
];

window.router = VueRouter.createRouter({ history: VueRouter.createWebHistory(), routes: window.routes });

window.router.beforeEach(async (to) => {
  if (!window.sessionStore.loaded) {
    try { await window.sessionStore.refresh(); } catch (_) { window.sessionStore.loaded = true; }
  }
  if (!to.meta.role) return true;
  if (!window.sessionStore.role) return '/login';
  if (window.sessionStore.role !== to.meta.role) return window.roleHomeMap[window.sessionStore.role] || '/';
  return true;
});
