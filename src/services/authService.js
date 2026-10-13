// Cross-subdomain cookie helpers for *.xoeris.com
function getCookieDomain() {
  const hostname = window.location.hostname;
  if (hostname.includes('xoeris.com')) {
    return '; Domain=.xoeris.com';
  }
  return '';
}

function getSharedCookie(name) {
  try {
    const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[1]) : '';
  } catch {
    return '';
  }
}

function setSharedCookie(name, value, days = 30) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const domain = getCookieDomain();
    document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/${domain}; SameSite=Lax`;
  } catch {}
}

function deleteSharedCookie(name) {
  try {
    const domain = getCookieDomain();
    document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/${domain}; SameSite=Lax`;
    document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax`;
  } catch {}
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('xoeris_user');
    if (raw) return JSON.parse(raw);

    const fromCookie = getSharedCookie('xoeris_session_user');
    if (fromCookie) {
      const parsed = JSON.parse(fromCookie);
      try { localStorage.setItem('xoeris_user', JSON.stringify(parsed)); } catch {}
      return parsed;
    }

    const adminToken = localStorage.getItem('xoeris_admin_token') || sessionStorage.getItem('xoeris_admin_token');
    if (adminToken) {
      return {
        id: 'xoeris-admin',
        username: 'admin',
        email: 'admin@xoeris.com',
        name: 'Administrator',
        role: 'admin',
        is_admin: true,
        subscription_tier: 'ultra',
        subscription_status: 'active'
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function getStoredToken() {
  const local = localStorage.getItem('xoeris_token');
  if (local) return local;

  const adminToken = localStorage.getItem('xoeris_admin_token') || sessionStorage.getItem('xoeris_admin_token');
  if (adminToken) return adminToken;

  const fromCookie = getSharedCookie('xoeris_session_token') || getSharedCookie('xoeris_admin_token');
  if (fromCookie) {
    try { localStorage.setItem('xoeris_token', fromCookie); } catch {}
    return fromCookie;
  }
  return '';
}

export function isUserAdmin(user = null) {
  const u = user || getStoredUser();
  if (u && (u.role === 'admin' || u.is_admin === true || (u.email && u.email.toLowerCase() === 'admin@xoeris.com'))) {
    return true;
  }
  return Boolean(
    localStorage.getItem('xoeris_admin_token') ||
    sessionStorage.getItem('xoeris_admin_token') ||
    getSharedCookie('xoeris_admin_token')
  );
}

export function isUserUltra(user = null) {
  const u = user || getStoredUser();
  if (isUserAdmin(u)) return true; // Admin has all privileges
  if (!u) return false;
  const tier = (u.subscription_tier || '').toLowerCase();
  const status = (u.subscription_status || '').toLowerCase();
  return tier === 'ultra' && status !== 'expired';
}

export function setSession(token, user) {
  if (token) {
    localStorage.setItem('xoeris_token', token);
    setSharedCookie('xoeris_session_token', token);
  }
  if (user) {
    const userStr = JSON.stringify(user);
    localStorage.setItem('xoeris_user', userStr);
    setSharedCookie('xoeris_session_user', userStr);
  }
  localStorage.setItem('xoeris_chat_auth', 'true');
  setSharedCookie('xoeris_chat_auth', 'true');
  window.dispatchEvent(new Event('xoeris_auth_change'));
}

export function clearSession(reload = true) {
  localStorage.removeItem('xoeris_token');
  localStorage.removeItem('xoeris_user');
  localStorage.removeItem('xoeris_chat_auth');
  localStorage.removeItem('xoeris_admin_token');
  sessionStorage.removeItem('xoeris_admin_token');
  deleteSharedCookie('xoeris_session_token');
  deleteSharedCookie('xoeris_session_user');
  deleteSharedCookie('xoeris_chat_auth');
  deleteSharedCookie('xoeris_token');
  deleteSharedCookie('xoeris_admin_token');
  window.dispatchEvent(new Event('xoeris_auth_change'));
  if (reload && typeof window !== 'undefined') {
    window.location.reload();
  }
}

export async function syncUserFromDatabase() {
  let token = getStoredToken();

  try {
    const apiUrl = window.location.hostname.includes('xoeris.com')
      ? 'https://api.xoeris.com/api/database1/sync'
      : '/api/database1/sync';

    const reqHeaders = { 'Content-Type': 'application/json' };
    if (token) reqHeaders['Authorization'] = `Bearer ${token}`;

    let res = await fetch(apiUrl, {
      credentials: 'include',
      headers: reqHeaders
    }).catch(() => null);

    if (!res || !res.ok) {
      if (apiUrl !== 'https://api.xoeris.com/api/database1/sync') {
        res = await fetch('https://api.xoeris.com/api/database1/sync', {
          credentials: 'include',
          headers: reqHeaders
        }).catch(() => null);
      }
    }

    if (res && res.ok) {
      const data = await res.json();
      if (data.user) {
        const resolvedToken = data.token || token || getStoredToken();
        setSession(resolvedToken, data.user);
        return data.user;
      }
    }
  } catch (err) {
    console.warn('Failed to sync user from database:', err);
  }
  return getStoredUser();
}
