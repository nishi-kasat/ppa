window.api = {
  async req(url, options = {}) {
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers || {}),
      },
      ...options,
    });
    let payload = {};
    try { payload = await response.json(); } catch (_) {}
    if (!response.ok) throw new Error(payload.message || `Request failed (${response.status})`);
    return payload;
  },
  get(url) { return this.req(url); },
  post(url, body = {}, options = {}) {
    return this.req(url, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    });
  },
};
