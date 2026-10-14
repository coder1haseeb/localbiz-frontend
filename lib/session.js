export const routeForRole = role => role === 'super_admin' ? '/admin/dashboard' : role === 'business_admin' ? '/dashboard' : '/home';

export function getSession() {
  if (typeof window === 'undefined') return null;
  try {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!token || !user?.role) return null;
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      clearSession();
      return null;
    }
    if (payload.role !== user.role) return null;
    return { token, user };
  } catch {
    return null;
  }
}

export function saveSession({ token, user, business }) {
  clearSession();
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
  if (business && user.role === 'business_admin') {
    const summary = { ...business };
    delete summary.logo;
    delete summary.coverImage;
    localStorage.setItem('userBusiness', JSON.stringify(summary));
  }
  window.dispatchEvent(new Event('localbiz:session'));
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  for (const key of ['authToken', 'user', 'userBusiness', 'userName', 'businessOwnerData', 'businessRegistrationDraft']) localStorage.removeItem(key);
  window.dispatchEvent(new Event('localbiz:session'));
}
