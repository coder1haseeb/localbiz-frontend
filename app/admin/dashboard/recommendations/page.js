'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SidebarMenuButton from '../../../../components/SidebarMenuButton.js';
import { clearSession } from '../../../../lib/session.js';

const feedbackNames = ['No action', 'Viewed', 'Added to cart', 'Purchased'];
const scoreText = value => Number.isFinite(value) ? value.toFixed(3) : '—';

function ProgressCard({ label, value, target, note }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-bold text-[#253027]">{value}<span className="text-base font-medium text-slate-400"> / {target}</span></p>
    <div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-[#31543f]" style={{ width: `${Math.min(100, (value / Math.max(target, 1)) * 100)}%` }} /></div>
    <p className="mt-2 text-xs text-slate-500">{note}</p>
  </div>;
}

function RankingColumn({ title, rows, scoreKey, rankKey, color }) {
  const sorted = [...rows].sort((a, b) => a[rankKey] - b[rankKey]);
  const scores = sorted.map(row => row[scoreKey]);
  const low = Math.min(...scores);
  const high = Math.max(...scores);
  return <div className="rounded-2xl border border-slate-200 bg-white p-5">
    <h3 className="font-bold text-[#253027]">{title}</h3>
    <p className="mb-5 mt-1 text-xs text-slate-500">Bars compare products within this ranking only.</p>
    <div className="space-y-4">
      {sorted.map(row => <div key={`${row.productId}-${row.shownPosition}`}>
        <div className="mb-1 flex justify-between gap-3 text-sm"><span className="truncate font-medium text-[#253027]">#{row[rankKey]} {row.productName}</span><span className="shrink-0 tabular-nums text-slate-500">{scoreText(row[scoreKey])}</span></div>
        <div className="h-3 rounded-full bg-slate-100"><div className={`h-3 rounded-full ${color}`} style={{ width: `${high === low ? 80 : 16 + 84 * ((row[scoreKey] - low) / (high - low))}%` }} /></div>
      </div>)}
    </div>
  </div>;
}

export default function AdminRecommendationPage() {
  const router = useRouter();
  const [view, setView] = useState('all');
  const [page, setPage] = useState(1);
  const [requestId, setRequestId] = useState('');
  const [insights, setInsights] = useState(null);
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);

  const authToken = useCallback(() => {
    const token = localStorage.getItem('authToken');
    let user;
    try { user = JSON.parse(localStorage.getItem('user') || '{}'); } catch { user = {}; }
    if (!token || user?.role !== 'super_admin') {
      router.replace('/admin/login');
      return null;
    }
    return token;
  }, [router]);

  const loadTraining = useCallback(async () => {
    const token = authToken();
    if (!token) return;
    const response = await fetch('/api/v1/admin/recommendations/training', {
      headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || 'Could not load training status.');
    setTraining(result.data);
    return result.data;
  }, [authToken]);

  useEffect(() => {
    const token = authToken();
    if (!token) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ view, page: String(page) });
        if (requestId) params.set('requestId', requestId);
        const response = await fetch(`/api/v1/admin/recommendations/insights?${params}`, {
          headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || 'Could not load recommendation data.');
        if (!cancelled) { setInsights(result.data); setError(''); }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [authToken, view, page, requestId, refresh]);

  useEffect(() => {
    loadTraining().catch(err => setError(err.message));
  }, [loadTraining, refresh]);

  useEffect(() => {
    if (training?.state !== 'running') return;
    const timer = setInterval(() => {
      loadTraining().then(next => {
        if (next?.state !== 'running') setRefresh(value => value + 1);
      }).catch(err => setError(err.message));
    }, 3000);
    return () => clearInterval(timer);
  }, [training?.state, loadTraining]);

  async function train() {
    const token = authToken();
    if (!token || busy || training?.state === 'running') return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/v1/admin/recommendations/train', {
        method: 'POST', headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok && response.status !== 409) throw new Error(result.message || 'Could not start training.');
      setTraining(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const summary = insights?.summary;
  const sample = insights?.sample;
  const rows = sample?.rows || [];
  const model = insights?.model;
  return <div className="min-h-screen bg-[#f7f5ef] text-[#253027]">
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col space-y-2 bg-[#efeee7] p-4 font-[var(--font-body-face)]">
      <SidebarMenuButton />
      <div className="mb-4 flex items-center gap-3 px-3 py-6"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white"><span className="material-symbols-outlined">admin_panel_settings</span></div><div><h1 className="text-lg font-bold leading-none">LocalBiz</h1><p className="text-[11px] text-slate-500">Super Admin</p></div></div>
      <nav className="mt-3 flex-1 space-y-1 text-sm font-semibold">
        <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-white"><span className="material-symbols-outlined">domain_verification</span>Store Approvals</Link>
        <Link href="/admin/dashboard/users" className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-white"><span className="material-symbols-outlined">group</span>Users</Link>
        <Link href="/admin/dashboard/categories" className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-white"><span className="material-symbols-outlined">category</span>Categories</Link>
        <Link href="/admin/dashboard/reports" className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-white"><span className="material-symbols-outlined">insights</span>Reports</Link>
        <div className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 text-red-600 shadow-sm"><span className="material-symbols-outlined">model_training</span>AI Recommendations</div>
        <Link href="/notifications" className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-white"><span className="material-symbols-outlined">notifications</span>Notifications</Link>
      </nav>
      <button onClick={() => { clearSession(); router.replace('/login'); }} className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50"><span className="material-symbols-outlined">logout</span>Logout</button>
    </aside>

    <main className="ml-72 space-y-7 p-8">
      <header className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-bold">Recommendation training</h1><p className="mt-1 text-sm text-slate-600">Inspect feedback, validation, and product rankings used by the model.</p></div><div className="flex gap-2"><button onClick={() => setRefresh(value => value + 1)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold">Refresh</button><button onClick={train} disabled={busy || training?.state === 'running'} className="rounded-lg bg-[#31543f] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{training?.state === 'running' ? 'Training…' : 'Train now'}</button></div></header>
      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {loading && !insights ? <p className="rounded-xl bg-white p-6 text-sm text-slate-500">Loading recommendation data…</p> : null}

      {summary && <>
        <div className="grid gap-4 md:grid-cols-3">
          <ProgressCard label="Available requests" value={summary.availableRequests} target={summary.requirements.minRequests} note={`${summary.eligibleRequests} mature · ${summary.pendingRequests} provisional`} />
          <ProgressCard label="Requests with feedback" value={summary.availablePositiveRequests} target={summary.requirements.minPositiveRequests} note={`${summary.positiveRequests} mature positive requests`} />
          <ProgressCard label="Validation requests" value={summary.availableValidationRequests} target={summary.requirements.minValidationRequests} note={`${summary.availableValidationPositiveRequests} with observed positive feedback in the later 20%`} />
        </div>
        <div className={`rounded-xl border p-4 text-sm ${summary.canTrainNow ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
          <strong>{summary.canTrainNow ? 'Enough observed feedback to attempt training now.' : 'More feedback is needed before training can run.'}</strong> Recent requests are included with provisional labels that may change during the first 24 hours. {summary.ready ? 'The mature-data requirements are also met.' : 'The mature-data requirements are not yet met.'}
          {summary.nextEligibleAt && <> Next request becomes eligible around {new Date(summary.nextEligibleAt).toLocaleString()}.</>}
          {summary.truncated && <> This preview is capped at 50,000 records, so counts may be incomplete.</>}
        </div>
      </>}

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold">Model output</h2>
        <p className="mt-1 text-sm text-slate-600">{training?.message || 'Loading training status…'}</p>
        {!model ? <p className="mt-4 text-sm text-slate-500">No validated learned model is active. Recommendations currently use the hybrid ranker.</p> : <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div><p className="text-xs uppercase text-slate-500">Trained</p><p className="mt-1 font-semibold">{new Date(model.trainedAt).toLocaleString()}</p></div>
          <div><p className="text-xs uppercase text-slate-500">Model NDCG@4</p><p className="mt-1 text-2xl font-bold text-[#31543f]">{scoreText(model.validationNdcg)}</p></div>
          <div><p className="text-xs uppercase text-slate-500">Hybrid NDCG@4</p><p className="mt-1 text-2xl font-bold">{scoreText(model.baselineNdcg)}</p></div>
          <div><p className="text-xs uppercase text-slate-500">Trees</p><p className="mt-1 text-2xl font-bold">{model.treeCount}</p><p className="mt-1 text-xs text-slate-500">{model.source === 'provisional_feedback' ? 'Provisional feedback' : model.source === 'synthetic_demo' ? 'Demo feedback' : 'Mature feedback'}</p></div>
        </div>}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold">Recommendation requests</h2><p className="text-sm text-slate-500">Select a request to inspect its product features and observed feedback.</p></div><div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">{['all', 'eligible', 'pending'].map(option => <button key={option} onClick={() => { setView(option); setPage(1); setRequestId(''); }} className={`rounded-md px-3 py-2 text-xs font-semibold capitalize ${view === option ? 'bg-[#31543f] text-white' : 'text-slate-600'}`}>{option}</button>)}</div></div>
        <div className="grid gap-5 xl:grid-cols-[310px_minmax(0,1fr)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            {!insights?.requests?.length ? <p className="p-4 text-sm text-slate-500">No requests in this view.</p> : insights.requests.map(item => <button key={item.requestId} onClick={() => setRequestId(item.requestId)} className={`mb-2 w-full rounded-xl border p-3 text-left text-sm ${(sample?.requestId === item.requestId) ? 'border-[#31543f] bg-green-50' : 'border-slate-100 hover:bg-slate-50'}`}>
              <span className="block font-semibold">{new Date(item.shownAt).toLocaleString()}</span><span className="mt-1 block text-xs text-slate-500">{item.productCount} products · {item.eligible ? 'Eligible' : 'Waiting 24h'} · {item.positive ? 'Feedback observed' : 'No feedback yet'}</span>
            </button>)}
            <div className="flex items-center justify-between border-t border-slate-100 px-2 pt-3 text-xs"><button disabled={page <= 1} onClick={() => { setPage(page - 1); setRequestId(''); }} className="disabled:opacity-30">Previous</button><span>{page} / {Math.max(1, insights?.pagination?.totalPages || 1)}</span><button disabled={page >= (insights?.pagination?.totalPages || 1)} onClick={() => { setPage(page + 1); setRequestId(''); }} className="disabled:opacity-30">Next</button></div>
          </div>
          <div className="space-y-5">
            {!sample ? <div className="rounded-2xl bg-white p-6 text-sm text-slate-500">Select a recommendation request to see its ranking.</div> : <>
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm"><strong>{sample.eligible ? 'Eligible training request' : 'Pending request'}</strong><span className="ml-2 text-slate-500">Shown {new Date(sample.shownAt).toLocaleString()}. {sample.eligible ? 'Feedback labels are final.' : 'Feedback labels may change until 24 hours have passed.'}</span></div>
              <div className="grid gap-4 lg:grid-cols-2"><RankingColumn title="Hybrid ranking" rows={rows} scoreKey="baselineScore" rankKey="hybridRank" color="bg-[#31543f]" />{model ? <RankingColumn title="Learned model ranking" rows={rows} scoreKey="modelScore" rankKey="modelRank" color="bg-red-500" /> : <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">The learned ranking appears after a validated model is saved.</div>}</div>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5"><h3 className="mb-3 font-bold">Training rows</h3><table className="w-full min-w-[670px] text-left text-sm"><thead><tr className="border-b text-xs uppercase text-slate-500"><th className="py-3">Product</th><th>Shown</th><th>Feedback label</th><th>Hybrid rank</th><th>Model rank</th><th>Features</th></tr></thead><tbody>{rows.map(row => <tr key={`${row.productId}-${row.shownPosition}`} className="border-b last:border-0"><td className="py-3 font-medium">{row.productName}</td><td>#{row.shownPosition}</td><td>{feedbackNames[row.feedbackLabel] || 'Unknown'}</td><td>#{row.hybridRank}</td><td>{row.modelRank ? `#${row.modelRank}` : '—'}</td><td><details><summary className="cursor-pointer text-[#31543f]">View values</summary><div className="mt-2 space-y-1 text-xs text-slate-600">{row.features.map(feature => <div key={feature.name}>{feature.name}: {scoreText(feature.value)}</div>)}</div></details></td></tr>)}</tbody></table></div>
            </>}
          </div>
        </div>
      </section>
    </main>
  </div>;
}
