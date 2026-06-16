import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import {
  Plus, Pencil, Trash2, X, Check, Loader2, AlertCircle,
  UserCircle, ImageIcon, ChevronDown, Link2, Link2Off, Users
} from 'lucide-react';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-561004a0`;

const TIERS = [
  { value: 'gembala_sidang',  label: 'Gembala Sidang',         color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
  { value: 'penerus_gembala', label: 'Penerus Gembala Sidang', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { value: 'wakil_gembala',   label: 'Wakil Gembala',          color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
  { value: 'pastoral',        label: 'Pastoral',               color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  { value: 'koordinator',     label: 'Koordinator Pelayanan',  color: 'bg-gray-100 border-gray-200 text-gray-700' },
];

interface TeamMember {
  id: string;
  name: string;
  role: string;
  tier: string;
  partnerId: string | null;
  order: number;
  photoUrl: string | null;
}

const emptyForm = () => ({
  name: '', role: '', tier: 'koordinator', order: 0,
  photoFile: null as File | null, photoPreview: null as string | null,
});

function toBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res((r.result as string).split(',')[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function AvatarUpload({ preview, onFile, onClear }: { preview: string | null; onFile: (f: File) => void; onClear: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={() => ref.current?.click()}
        className="relative w-24 h-24 rounded-full cursor-pointer overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors bg-gray-50 flex items-center justify-center"
      >
        {preview
          ? <img src={preview} alt="" className="w-full h-full object-cover" />
          : <UserCircle size={40} className="text-gray-300" />
        }
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <ImageIcon size={18} className="text-white" />
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      {preview && (
        <button onClick={onClear} className="text-xs text-red-500 hover:underline">Hapus foto</button>
      )}
    </div>
  );
}

export default function TeamManagement() {
  const { accessToken } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Partner link state
  const [linkingId, setLinkingId] = useState<string | null>(null); // the person who wants a partner
  const [filterTier, setFilterTier] = useState('');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken || publicAnonKey}`,
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/team`, { headers: { Authorization: `Bearer ${publicAnonKey}` } });
      const data = JSON.parse(await res.text());
      if (data.success) setMembers(data.members || []);
      else setError(data.error || 'Gagal memuat data');
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditId(null); setForm(emptyForm()); setShowForm(true); setError(''); };
  const openEdit = (m: TeamMember) => {
    setEditId(m.id);
    setForm({ name: m.name, role: m.role, tier: m.tier, order: m.order, photoFile: null, photoPreview: m.photoUrl || null });
    setShowForm(true); setError('');
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Nama tidak boleh kosong'); return; }
    setSaving(true); setError('');
    try {
      const payload: any = { name: form.name.trim(), role: form.role.trim(), tier: form.tier, order: Number(form.order) };
      if (form.photoFile) {
        payload.photoBase64 = await toBase64(form.photoFile);
        payload.photoMimeType = form.photoFile.type;
      }
      const url = editId ? `${API_URL}/team/${editId}` : `${API_URL}/team`;
      const res = await fetch(url, { method: editId ? 'PUT' : 'POST', headers, body: JSON.stringify(payload) });
      const data = JSON.parse(await res.text());
      if (!data.success) throw new Error(data.error || 'Gagal menyimpan');
      setShowForm(false); await fetchAll();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      // Unlink partner first
      const m = members.find(x => x.id === id);
      if (m?.partnerId) await unlinkPartnerOf(id, m.partnerId);
      const res = await fetch(`${API_URL}/team/${id}`, { method: 'DELETE', headers });
      const data = JSON.parse(await res.text());
      if (!data.success) throw new Error(data.error);
      setDeleteConfirm(null); await fetchAll();
    } catch (e: any) { setError(e.message); }
  };

  const unlinkPartnerOf = async (idA: string, idB: string) => {
    await Promise.all([
      fetch(`${API_URL}/team/${idA}`, { method: 'PUT', headers, body: JSON.stringify({ partnerId: null }) }),
      fetch(`${API_URL}/team/${idB}`, { method: 'PUT', headers, body: JSON.stringify({ partnerId: null }) }),
    ]);
  };

  const handleUnlink = async (m: TeamMember) => {
    if (!m.partnerId) return;
    await unlinkPartnerOf(m.id, m.partnerId);
    await fetchAll();
  };

  const handleLink = async (targetId: string) => {
    if (!linkingId || targetId === linkingId) return;
    // Link both ways
    await Promise.all([
      fetch(`${API_URL}/team/${linkingId}`, { method: 'PUT', headers, body: JSON.stringify({ partnerId: targetId }) }),
      fetch(`${API_URL}/team/${targetId}`,  { method: 'PUT', headers, body: JSON.stringify({ partnerId: linkingId }) }),
    ]);
    setLinkingId(null);
    await fetchAll();
  };

  const tierInfo = (val: string) => TIERS.find(t => t.value === val);
  const getPartner = (m: TeamMember) => m.partnerId ? members.find(x => x.id === m.partnerId) : null;

  const displayed = members.filter(m => !filterTier || m.tier === filterTier);

  // Group by tier
  const grouped = TIERS.map(t => ({ tier: t, items: displayed.filter(m => m.tier === t.value) })).filter(g => g.items.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tim Pelayanan</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola jajaran yang tampil di halaman Tentang Kami</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm">
          <Plus size={18} /> Tambah Orang
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Linking banner */}
      {linkingId && (() => {
        const person = members.find(m => m.id === linkingId);
        return (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 px-5 py-3.5 rounded-xl text-sm">
            <Link2 size={16} className="text-blue-600 flex-shrink-0" />
            <span className="text-blue-800 font-medium">Pilih partner untuk <strong>{person?.name}</strong> — klik "Jadikan Partner" pada orang yang dituju</span>
            <button onClick={() => setLinkingId(null)} className="ml-auto text-blue-500 hover:text-blue-700 flex items-center gap-1 text-xs"><X size={14} /> Batal</button>
          </div>
        );
      })()}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterTier('')} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${!filterTier ? 'bg-blue-700 text-white border-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          Semua
        </button>
        {TIERS.map(t => (
          <button key={t.value} onClick={() => setFilterTier(t.value)} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${filterTier === t.value ? 'bg-blue-700 text-white border-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400"><Loader2 size={28} className="animate-spin mr-3" /> Memuat...</div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4"><UserCircle size={28} className="text-gray-400" /></div>
          <p className="font-medium text-gray-600 mb-1">Belum ada data</p>
          <p className="text-sm text-gray-400">Klik "Tambah Orang" untuk mulai</p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ tier, items }) => (
            <div key={tier.value}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${tier.color}`}>{tier.label}</span>
                <span className="text-xs text-gray-400">{items.length} orang</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(m => {
                  const partner = getPartner(m);
                  const isLinkTarget = linkingId && linkingId !== m.id && !m.partnerId && m.tier === members.find(x => x.id === linkingId)?.tier;
                  return (
                    <div key={m.id} className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${isLinkTarget ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-100'}`}>
                      {/* Person info */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                          {m.photoUrl
                            ? <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                            : <UserCircle size={28} className="text-blue-300" />
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate">{m.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{m.role || '—'}</p>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium border ${tierInfo(m.tier)?.color}`}>{tierInfo(m.tier)?.label}</span>
                        </div>
                      </div>

                      {/* Partner info */}
                      {partner && (
                        <div className="flex items-center gap-2 bg-pink-50 border border-pink-100 rounded-xl px-3 py-2 mb-3">
                          <div className="w-7 h-7 rounded-full overflow-hidden bg-pink-100 flex-shrink-0">
                            {partner.photoUrl
                              ? <img src={partner.photoUrl} alt={partner.name} className="w-full h-full object-cover" />
                              : <UserCircle size={16} className="text-pink-300 m-auto mt-0.5" />
                            }
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">{partner.name}</p>
                            <p className="text-xs text-gray-400">Partner</p>
                          </div>
                          <button onClick={() => handleUnlink(m)} className="ml-auto text-red-400 hover:text-red-600 p-1 flex-shrink-0" title="Putus link partner">
                            <Link2Off size={14} />
                          </button>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-50">
                        {isLinkTarget ? (
                          <button onClick={() => handleLink(m.id)} className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold">
                            <Link2 size={13} /> Jadikan Partner
                          </button>
                        ) : (
                          <>
                            {!m.partnerId && !linkingId && (
                              <button onClick={() => setLinkingId(m.id)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-purple-200 text-purple-700 hover:bg-purple-50">
                                <Users size={12} /> Add Partner
                              </button>
                            )}
                            <button onClick={() => openEdit(m)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50">
                              <Pencil size={12} /> Edit
                            </button>
                            <button onClick={() => setDeleteConfirm(m.id)} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 ml-auto">
                              <Trash2 size={12} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h3 className="font-bold text-gray-900">{editId ? 'Edit Anggota' : 'Tambah Anggota Baru'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Photo */}
              <div className="flex justify-center">
                <AvatarUpload
                  preview={form.photoPreview}
                  onFile={f => setForm(prev => ({ ...prev, photoFile: f, photoPreview: URL.createObjectURL(f) }))}
                  onClear={() => setForm(f => ({ ...f, photoFile: null, photoPreview: null }))}
                />
              </div>

              {/* Tier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Jajaran *</label>
                <div className="relative">
                  <select
                    value={form.tier}
                    onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-9"
                  >
                    {TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Pdt. Nama Lengkap"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                <input
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  placeholder="Contoh: Gembala Sidang, Koordinator Worship..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urutan Tampil</label>
                <input
                  type="number" min="0" value={form.order}
                  onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
                  className="w-28 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">Angka kecil tampil lebih dulu dalam kelompok yang sama</p>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Batal</button>
              <button onClick={handleSubmit} disabled={saving}
                className="flex-1 bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-800 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</> : <><Check size={16} /> Simpan</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-600" /></div>
            <h3 className="font-bold text-gray-900 mb-2">Hapus Anggota?</h3>
            <p className="text-sm text-gray-500 mb-6">Foto dan data akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm">Batal</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
