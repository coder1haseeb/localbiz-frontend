'use client';
import SidebarMenuButton from '../../components/SidebarMenuButton.js';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery', icon: 'local_shipping', desc: 'Pay when your order arrives' },
  { value: 'pay_at_store', label: 'Pay at Store', icon: 'storefront', desc: 'Pay when you pick up in-store' },
  { value: 'jazzcash', label: 'JazzCash', icon: 'account_balance_wallet', desc: 'Pay via JazzCash mobile wallet' },
  { value: 'rapidgateway', label: 'Rapid Gateway (Test)', icon: 'credit_card', desc: 'Use the sandbox checkout' },
  { value: 'safepay', label: 'Safepay (Test)', icon: 'credit_card', desc: 'Pay through Safepay sandbox checkout' },
];

async function readApiResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Server temporarily unavailable (${response.status}). Please try again.`);
  }
  try {
    return await response.json();
  } catch {
    throw new Error(`Server returned an invalid response (${response.status}). Please try again.`);
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [manualStreet, setManualStreet] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [useManual, setUseManual] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/login'); return; }
    setLoading(true);
    setError('');
    try {
      const [cartRes, profileRes] = await Promise.all([
        fetch(`/api/v1/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/v1/customer/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const [cartData, profileData] = await Promise.all([
        readApiResponse(cartRes),
        readApiResponse(profileRes),
      ]);
      if (!cartRes.ok || !cartData.success) throw new Error(cartData.message || 'Could not load your cart.');
      if (!profileRes.ok || !profileData.success) throw new Error(profileData.message || 'Could not load your profile.');
      setCart(cartData.data);
      if (profileData.success) {
        const addrs = profileData.data.addresses || [];
        setAddresses(addrs);
        const def = addrs.find(a => a.isDefault) || addrs[0];
        if (def) setSelectedAddressId(def._id);
        else setUseManual(true);
      }
    } catch (err) {
      console.error('Failed to load checkout:', err);
      setError(err.message || 'Could not load checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const subtotal = cart?.items?.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0) || 0;
  // The order API currently charges item totals only.
  const grandTotal = subtotal;

  const needsMobile = ['jazzcash', 'easypaisa', 'rapidgateway'].includes(paymentMethod);
  const onlinePayment = needsMobile || paymentMethod === 'safepay';
  const storeCount = new Set(cart?.items?.map(item => String(item.product?.business?._id || item.product?.business))).size;

  const submitPaymentForm = (apiUrl, params) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = apiUrl;
    Object.entries(params).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  };

  const handlePlaceOrder = async () => {
    setError('');

    let deliveryAddress;
    if (useManual || addresses.length === 0) {
      if (!manualStreet.trim() || !manualCity.trim()) {
        setError('Please provide a delivery street and city.');
        return;
      }
      deliveryAddress = { street: manualStreet.trim(), city: manualCity.trim() };
    } else {
      const addr = addresses.find(a => a._id === selectedAddressId);
      if (!addr) {
        setError('Please select a delivery address.');
        return;
      }
      deliveryAddress = { street: addr.street, city: addr.city };
    }

    if (needsMobile && !/^[0-9]{10,}$/.test(mobileNumber)) {
      setError('Please enter a valid mobile number (10+ digits) for wallet payment.');
      return;
    }
    if (onlinePayment && storeCount > 1) {
      setError('Online checkout supports one store at a time. Please order from each store separately.');
      return;
    }

    setPlacing(true);
    const token = localStorage.getItem('authToken');

    let orderPlaced = false;
    try {
      const res = await fetch(`/api/v1/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ deliveryAddress, paymentMethod }),
      });
      const data = await readApiResponse(res);

      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to place order.');
        setPlacing(false);
        return;
      }

      orderPlaced = true;

      const orders = data.data.orders || [];
      const firstOrder = orders[0];

      if (onlinePayment && firstOrder) {
        const endpoint = paymentMethod;
        const payRes = await fetch(`/api/v1/payments/${endpoint}/initiate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ orderId: firstOrder.id, mobileNumber }),
        });
        const payData = await readApiResponse(payRes);
        if (payRes.ok && payData.success) {
          sessionStorage.setItem('pendingPaymentId', payData.data.paymentId);
          if (payData.data.status === 'paid') {
            router.push(`/orders/${firstOrder.id}`);
            return;
          }
          if (paymentMethod === 'rapidgateway' || paymentMethod === 'safepay') {
            window.location.assign(payData.data.redirectUrl);
            return;
          }
          submitPaymentForm(payData.data.apiUrl, payData.data.params);
          return;
        } else {
          setError(payData.message || 'Order placed, but payment initiation failed. You can retry from Order History.');
          setPlacing(false);
          setTimeout(() => router.push('/orders'), 2500);
          return;
        }
      }

      router.push('/orders');
    } catch (err) {
      console.error('Checkout failed:', err);
      setError(orderPlaced ? 'Order placed, but payment could not be started. Check Order History before trying again.' : 'Something went wrong. Please try again.');
      setPlacing(false);
      if (orderPlaced) setTimeout(() => router.push('/orders'), 2500);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f7f5ef]">
        <div className="w-8 h-8 border-4 border-[#31543d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); }
      `}</style>

      <div className="flex min-h-screen bg-[#f7f5ef]">
        <aside className="h-screen w-72 fixed left-0 top-0 bg-[#efeee7] flex flex-col p-4 space-y-2 font-['Inter'] text-[13px] font-medium z-40">
          <SidebarMenuButton />
          <div className="flex items-center gap-3 px-3 py-6 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#31543d] to-[#a96b4e] flex items-center justify-center text-white">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#253027] leading-none">LocalBiz</h1>
              <p className="text-[11px] text-slate-500 font-normal">Checkout</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            <Link href="/home" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg">
              <span className="material-symbols-outlined">storefront</span><span>Browse</span>
            </Link>
            <Link href="/cart" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg">
              <span className="material-symbols-outlined">shopping_cart</span><span>My Cart</span>
            </Link>
            <div className="flex items-center gap-3 px-4 py-3 bg-white text-[#31543d] shadow-sm rounded-lg font-semibold">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              <span>Checkout</span>
            </div>
          </nav>
        </aside>

        <main className="ml-72 flex-1 p-8">
          <h1 className="text-4xl font-bold text-[#253027] mb-8">Checkout</h1>

          {error && !cart ? (
            <div className="glass-card rounded-2xl p-16 text-center">
              <p role="alert" className="text-red-600 font-semibold mb-4">{error}</p>
              <button onClick={fetchData} className="px-6 py-2.5 bg-[#31543d] text-white text-sm font-semibold rounded-xl">Retry checkout</button>
            </div>
          ) : !cart?.items || cart.items.length === 0 ? (
            <div className="glass-card rounded-2xl p-16 text-center">
              <p className="text-[#253027] font-bold text-lg mb-2">Your cart is empty</p>
              <Link href="/home" className="px-6 py-2.5 bg-[#31543d] text-white text-sm font-semibold rounded-xl inline-block mt-2">Browse Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                {/* Delivery Address */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-[#253027] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#31543d]">location_on</span>
                    Delivery Address
                  </h3>

                  {addresses.length > 0 && !useManual && (
                    <div className="space-y-3 mb-4">
                      {addresses.map(addr => (
                        <label key={addr._id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr._id ? 'border-[#31543d] bg-[#31543d]/5' : 'border-slate-200'}`}>
                          <input type="radio" name="address" checked={selectedAddressId === addr._id} onChange={() => setSelectedAddressId(addr._id)} className="mt-1" />
                          <div>
                            <p className="font-bold text-sm text-[#253027]">{addr.label}{addr.isDefault && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Default</span>}</p>
                            <p className="text-xs text-slate-500 mt-1">{addr.street}, {addr.city}</p>
                          </div>
                        </label>
                      ))}
                      <button onClick={() => setUseManual(true)} className="text-xs font-semibold text-[#31543d] hover:underline">+ Use a different address</button>
                    </div>
                  )}

                  {(useManual || addresses.length === 0) && (
                    <div className="space-y-3">
                      <input value={manualStreet} onChange={e => setManualStreet(e.target.value)} placeholder="Street address" className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-[#31543d]" />
                      <input value={manualCity} onChange={e => setManualCity(e.target.value)} placeholder="City" className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-[#31543d]" />
                      {addresses.length > 0 && (
                        <button onClick={() => setUseManual(false)} className="text-xs font-semibold text-[#31543d] hover:underline">← Use a saved address</button>
                      )}
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-[#253027] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#31543d]">payments</span>
                    Payment Method
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PAYMENT_METHODS.map(pm => (
                      <label key={pm.value} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === pm.value ? 'border-[#31543d] bg-[#31543d]/5' : 'border-slate-200'}`}>
                        <input type="radio" name="pm" checked={paymentMethod === pm.value} onChange={() => setPaymentMethod(pm.value)} className="mt-1" />
                        <div>
                          <p className="font-bold text-sm text-[#253027] flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base">{pm.icon}</span>
                            {pm.label}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{pm.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {needsMobile && (
                    <div className="mt-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Mobile Number</label>
                      <input value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} placeholder="03xxxxxxxxx" className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-[#31543d]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-5 sticky top-8">
                <div className="glass-card rounded-3xl p-8 border border-white/50">
                  <h2 className="text-2xl font-bold text-[#253027] mb-6">Order Summary</h2>
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-1">
                    {cart.items.map(item => (
                      <div key={item._id} className="flex justify-between text-sm">
                        <span className="text-slate-600">{item.product?.name} × {item.quantity}</span>
                        <span className="font-semibold text-[#253027]">Rs. {((item.product?.price || 0) * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 pt-4 border-t border-slate-200 text-sm">
                    <div className="flex justify-between text-slate-500"><span>Subtotal</span><span className="font-semibold text-[#253027]">Rs. {subtotal.toLocaleString()}</span></div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between items-end">
                    <span className="text-xs uppercase font-bold text-slate-400">Grand Total</span>
                    <span className="text-3xl font-extrabold text-[#31543d]">Rs. {grandTotal.toLocaleString()}</span>
                  </div>

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-semibold">{error}</div>
                  )}

                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="w-full mt-6 py-4 bg-gradient-to-br from-[#31543d] to-[#a96b4e] text-white font-bold rounded-2xl shadow-lg hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {placing ? 'Placing Order...' : 'Place Order'}
                    {!placing && <span className="material-symbols-outlined">arrow_forward</span>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
