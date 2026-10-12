export function getStoredUser() {
  try {
    const raw = localStorage.getItem('xoeris_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem('xoeris_token') || '';
}

export function setSession(token, user) {
  if (token) localStorage.setItem('xoeris_token', token);
  if (user) localStorage.setItem('xoeris_user', JSON.stringify(user));
  localStorage.setItem('xoeris_chat_auth', 'true');
  window.dispatchEvent(new Event('xoeris_auth_change'));
}

export function clearSession() {
  localStorage.removeItem('xoeris_token');
  localStorage.removeItem('xoeris_user');
  localStorage.removeItem('xoeris_chat_auth');
  window.dispatchEvent(new Event('xoeris_auth_change'));
}

export async function syncUserFromDatabase() {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const apiUrl = window.location.hostname.includes('xoeris.com')
      ? 'https://api.xoeris.com/api/database1/sync'
      : '/api/database1/sync';

    let res = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).catch(() => null);

    if (!res || !res.ok) {
      if (apiUrl !== 'https://api.xoeris.com/api/database1/sync') {
        res = await fetch('https://api.xoeris.com/api/database1/sync', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(() => null);
      }
    }

    if (res && res.ok) {
      const data = await res.json();
      if (data.user) {
        localStorage.setItem('xoeris_user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('xoeris_auth_change'));
        return data.user;
      }
    }
  } catch (err) {
    console.warn('Failed to sync user from database:', err);
  }
  return getStoredUser();
}
