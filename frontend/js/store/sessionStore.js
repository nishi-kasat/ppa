window.roleHomeMap = { administrator: '/admin', company: '/company', student: '/student' };
window.sessionStore = Vue.reactive({
  loaded: false,
  role: null,
  async refresh() {
    const data = await window.api.get('/auth/check_session');
    this.role = data.logged_in ? data.role : null;
    this.loaded = true;
  },
  async logout() {
    await window.api.post('/auth/logout', {});
    this.role = null;
  },
});
