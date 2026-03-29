export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(url, { ...options, headers, credentials: 'include' });
}