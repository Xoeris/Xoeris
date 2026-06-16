import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import {
  Plus, Pencil, Trash2, Package, X, Check, Loader2, AlertCircle,
  Tag, ChevronDown, ArrowUpDown, Search, FolderOpen, Settings2
} from 'lucide-react';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-561004a0`;

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  condition: 'good' | 'needs_repair' | 'broken';
  purchaseDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const CONDITION_LABELS: Record<string, { label: string; color: string }> = {
  good:         { label: 'Baik',             color: 'bg-emerald-100 text-emerald-700' },
  needs_repair: { label: 'Perlu Perbaikan',  color: 'bg-amber-100 text-amber-700' },
  broken:       { label: 'Rusak',            color: 'bg-red-100 text-red-700' },
};

const DEFAULT_CATEGORIES = [
  'Sound System', 'Proyektor & Layar', 'Kursi & Meja', 'Alat Musik',
  'Elektronik', 'Perlengkapan Ibadah', 'Kebersihan', 'Lainnya',
];

const SORT_OPTIONS = [
  { value: 'name-asc',      label: 'Nama A–Z' },
  { value: 'name-desc',     label: 'Nama Z–A' },
  { value: 'qty-asc',       label: 'Jumlah Terkecil' },
  { value: 'qty-desc',      label: 'Jumlah Terbesar' },
  { value: 'date-desc',     label: 'Terbaru' },
  { value: 'date-asc',      label: 'Terlama' },
];

const emptyForm = () => ({
  name: '', category: '', quantity: '', unit: '',
  location: '', condition: 'good' as const, purchaseDate: '', notes: '',
});

export default function InventoryManagement() {
  const { accessToken, user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';
  const canEdit = isSuperAdmin || user?.permissions?.editInventaris || false;

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Categories state (persisted in localStorage)
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gjt_inventory_categories');
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch { return DEFAULT_CATEGORIES; }
  });
  const [showCatManager, setShowCatManager] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editCatIdx, setEditCatIdx] = useState<number | null>(null);
  const [editCatVal, setEditCatVal] = useState('');

  // Filter / sort
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterCondition, setFilterCondition] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  // Form
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken || publicAnonKey}`,
  };

  const saveCategories = (cats: string[]) => {
    setCategories(cats);
    localStorage.setItem('gjt_inventory_categories', JSON.stringify(cats));
  };

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/inventory/items`, { headers });
      const text = await res.text();
      const data = JSON.parse(text);
      if (data.success) setItems(data.items || []);
      else setError(data.error || 'Gagal memuat data');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, []);

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm());
    setShowForm(true);
    setError('');
  };

  const openEdit = (item: InventoryItem) => {
    setEditId(item.id);
    setForm({
      name: item.name, category: item.category,
      quantity: String(item.quantity), unit: item.unit,
      location: item.location, condition: item.condition,
      purchaseDate: item.purchaseDate || '', notes: item.notes || '',
    });
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Nama item tidak boleh kosong'); return; }
    if (!form.quantity || isNaN(Number(form.quantity))) { setError('Jumlah harus berupa angka'); return; }
    setSaving(true);
    setError('');
    try {
      const url = editId ? `${API_URL}/inventory/items/${editId}` : `${API_URL}/inventory/items`;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method, headers,
        body: JSON.stringify({ ...form, quantity: parseInt(form.quantity) }),
      });
      const data = JSON.parse(await res.text());
      if (!data.success) throw new Error(data.error || 'Gagal menyimpan');
      setShowForm(false);
      await loadItems();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/inventory/items/${id}`, { method: 'DELETE', headers });
      const data = JSON.parse(await res.text());
      if (!data.success) throw new Error(data.error);
      setDeleteConfirm(null);
      await loadItems();
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Category manager actions
  const addCategory = () => {
    const name = newCatName.trim();
    if (!name || categories.includes(name)) return;
    saveCategories([...categories, name]);
    setNewCatName('');
  };

  const deleteCategory = (idx: number) => {
    saveCategories(categories.filter((_, i) => i !== idx));
  };

  const saveEditCategory = (idx: number) => {
    const name = editCatVal.trim();
    if (!name) return;
    const updated = [...categories];
    updated[idx] = name;
    saveCategories(updated);
    setEditCatIdx(null);
  };

  // Filter + sort
  const displayed = items
    .filter(item => {
      const q = search.toLowerCase();
      if (q && !item.name.toLowerCase().includes(q) && !item.category.toLowerCase().includes(q) && !item.location.toLowerCase().includes(q)) return false;
      if (filterCat && item.category !== filterCat) return false;
      if (filterCondition && item.condition !== filterCondition) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':  return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'qty-asc':   return a.quantity - b.quantity;
        case 'qty-desc':  return b.quantity - a.quantity;
        case 'date-asc':  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const usedCategories = [...new Set(items.map(i => i.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Inventaris Gereja</h2>
          <p className="text-sm text-gray-500 mt-1">{items.length} item terdaftar</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCatManager(true)}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Settings2 size={16} /> Kelola Kategori
          </button>
          {canEdit && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm"
            >
              <Plus size={18} /> Tambah Item
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama, kategori, lokasi..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Category filter */}
        <div className="relative">
          <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            className="pl-8 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Condition filter */}
        <div className="relative">
          <select
            value={filterCondition}
            onChange={e => setFilterCondition(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer pr-8"
          >
            <option value="">Semua Kondisi</option>
            <option value="good">Baik</option>
            <option value="needs_repair">Perlu Perbaikan</option>
            <option value="broken">Rusak</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="pl-8 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 size={28} className="animate-spin mr-3" /> Memuat data...
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <Package size={28} className="text-gray-400" />
          </div>
          <p className="font-medium text-gray-600 mb-1">
            {items.length === 0 ? 'Belum ada data inventaris' : 'Tidak ada item yang cocok'}
          </p>
          <p className="text-sm text-gray-400">
            {items.length === 0 ? 'Klik "Tambah Item" untuk mulai mencatat' : 'Coba ubah filter atau kata pencarian'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-700">Nama Item</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-700">Kategori</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-700">Jumlah</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-700">Lokasi</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-700">Kondisi</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayed.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        <Tag size={10} />{item.category || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-700">{item.quantity} <span className="text-gray-400 text-xs">{item.unit}</span></td>
                    <td className="px-5 py-4 text-gray-600">{item.location || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CONDITION_LABELS[item.condition]?.color}`}>
                        {CONDITION_LABELS[item.condition]?.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {canEdit ? (
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => openEdit(item)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors">
                            <Pencil size={13} /> Edit
                          </button>
                          <button onClick={() => setDeleteConfirm(item.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 text-right block">View only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {displayed.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full mt-1">
                      <Tag size={9} />{item.category || '—'}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CONDITION_LABELS[item.condition]?.color}`}>
                    {CONDITION_LABELS[item.condition]?.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 mb-3">
                  <span>Jumlah: <strong className="text-gray-700">{item.quantity} {item.unit}</strong></span>
                  <span>Lokasi: <strong className="text-gray-700">{item.location || '—'}</strong></span>
                </div>
                {canEdit && (
                  <div className="flex gap-2 pt-2 border-t border-gray-50">
                    <button onClick={() => openEdit(item)} className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50">
                      <Pencil size={13} /> Edit
                    </button>
                    <button onClick={() => setDeleteConfirm(item.id)} className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Category Manager Modal ── */}
      {showCatManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <div>
                <h3 className="font-bold text-gray-900">Kelola Kategori</h3>
                <p className="text-xs text-gray-500 mt-0.5">Tambah, edit, atau hapus kategori barang</p>
              </div>
              <button onClick={() => setShowCatManager(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Add new category */}
              <div className="flex gap-2">
                <input
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCategory()}
                  placeholder="Nama kategori baru..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addCategory}
                  className="flex items-center gap-1.5 bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors"
                >
                  <Plus size={16} /> Tambah
                </button>
              </div>

              {/* Category list */}
              <div className="space-y-2">
                {categories.map((cat, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                    <FolderOpen size={15} className="text-blue-400 flex-shrink-0" />
                    {editCatIdx === idx ? (
                      <>
                        <input
                          value={editCatVal}
                          onChange={e => setEditCatVal(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && saveEditCategory(idx)}
                          autoFocus
                          className="flex-1 border border-blue-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={() => saveEditCategory(idx)} className="text-emerald-600 hover:text-emerald-700 p-1"><Check size={15} /></button>
                        <button onClick={() => setEditCatIdx(null)} className="text-gray-400 hover:text-gray-600 p-1"><X size={15} /></button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm font-medium text-gray-800">{cat}</span>
                        {usedCategories.includes(cat) && (
                          <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                            {items.filter(i => i.category === cat).length} item
                          </span>
                        )}
                        <button onClick={() => { setEditCatIdx(idx); setEditCatVal(cat); }} className="text-blue-500 hover:text-blue-700 p-1"><Pencil size={14} /></button>
                        <button onClick={() => deleteCategory(idx)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={14} /></button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={() => setShowCatManager(false)}
                className="w-full bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-800"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h3 className="font-bold text-gray-900">{editId ? 'Edit Item' : 'Tambah Item Baru'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Item *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Contoh: Speaker TOA, Kursi Plastik..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <div className="relative">
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-9"
                  >
                    <option value="">— Pilih Kategori —</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Qty + Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah *</label>
                  <input
                    type="number"
                    min="0"
                    value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
                  <input
                    value={form.unit}
                    onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                    placeholder="Unit, Pcs, Set..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                <input
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="Ruang Ibadah, Gudang, Kantor..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kondisi</label>
                <div className="flex gap-2">
                  {(['good', 'needs_repair', 'broken'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setForm(f => ({ ...f, condition: c }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${form.condition === c ? CONDITION_LABELS[c].color + ' border-current' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                    >
                      {CONDITION_LABELS[c].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purchase Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pembelian</label>
                <input
                  type="date"
                  value={form.purchaseDate}
                  onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  placeholder="Catatan tambahan tentang item ini..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Batal</button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-800 disabled:opacity-50 flex items-center justify-center gap-2"
              >
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
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Hapus Item?</h3>
            <p className="text-sm text-gray-500 mb-6">Data inventaris ini akan dihapus permanen.</p>
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
