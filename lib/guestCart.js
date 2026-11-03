export const GUEST_CART_KEY = 'addtocartasloggedout';

const validId = id => typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);

export function readGuestCart() {
  if (typeof window === 'undefined') return [];
  try {
    const stored = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
    if (!Array.isArray(stored)) return [];
    const totals = new Map();
    for (const item of stored) {
      if (!validId(item?.productId) || !Number.isInteger(item.quantity) || item.quantity < 1) continue;
      totals.set(item.productId, Math.min(999, (totals.get(item.productId) || 0) + item.quantity));
    }
    return [...totals].map(([productId, quantity]) => ({ productId, quantity }));
  } catch { return []; }
}

export function writeGuestCart(items) {
  if (!items.length) localStorage.removeItem(GUEST_CART_KEY);
  else localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('localbiz:cart'));
}

let pendingAdd = Promise.resolve();

export function addGuestItem(productId, quantity = 1) {
  const operation = pendingAdd.then(async () => {
    if (!validId(productId) || !Number.isInteger(quantity) || quantity < 1) return false;
    const items = readGuestCart();
    const ids = [...new Set([...items.map(item => item.productId), productId])];
    const stores = await Promise.all(ids.map(async id => {
      const response = await fetch(`/api/v1/products/${id}`);
      const data = await response.json();
      const business = data.data?.business;
      const storeId = typeof business === 'string' ? business : business?._id;
      if (!response.ok || !data.success || !storeId) throw new Error('A product is unavailable. Remove unavailable items from your cart and try again.');
      return storeId;
    }));
    if (new Set(stores).size > 1) throw new Error('Your cart can contain items from one store at a time. Complete your current order or empty the cart before shopping at another store.');
    const existing = items.find(item => item.productId === productId);
    if (existing) existing.quantity = Math.min(999, existing.quantity + quantity);
    else items.push({ productId, quantity });
    writeGuestCart(items);
    return true;
  });
  pendingAdd = operation.catch(() => {});
  return operation;
}

export function guestCartCount() {
  return readGuestCart().length;
}

export async function mergeGuestCart(token) {
  if (!token) return;
  for (const item of readGuestCart()) {
    try {
      const response = await fetch('/api/v1/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(item),
      });
      if (!response.ok) continue;
      writeGuestCart(readGuestCart().filter(current => current.productId !== item.productId));
    } catch { /* Leave the item available for a later login. */ }
  }
}
