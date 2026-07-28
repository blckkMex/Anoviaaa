import React, { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import {
  getToken, setToken, clearToken, login, getMe,
  adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  adminGetOffers, adminCreateOffer, adminUpdateOffer, adminDeleteOffer,
  adminGetSettings, adminSaveSettings,
  Product, Offer, Settings,
} from '../lib/api';
import {
  LogOut, Plus, Pencil, Trash2, Save, X,
  Package, Tag, Settings as SettingsIcon, ChevronLeft,
  Eye, EyeOff, Upload, Loader2, Store,
} from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Login Screen ───────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token } = await login(email, password);
      setToken(token);
      onLogin();
    } catch (err: any) {
      toast.error(err.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[var(--color-navy)] flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            A
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-navy)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>Admin Panel</h1>
          <p className="text-[var(--color-navy-muted)] mt-1">Sign in to manage your store</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border-2 border-[var(--color-bg-accent)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[var(--color-navy)] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@anovia.com"
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-[var(--color-bg-accent)] focus:border-[var(--color-navy)] outline-none text-[var(--color-navy)] bg-[var(--color-bg-light)] transition-colors font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--color-navy)] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-[var(--color-bg-accent)] focus:border-[var(--color-navy)] outline-none text-[var(--color-navy)] bg-[var(--color-bg-light)] transition-colors font-medium"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-navy-muted)] hover:text-[var(--color-navy)] p-1"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-navy)] text-white py-3.5 rounded-2xl font-bold text-base hover:bg-[var(--color-navy-light)] transition-colors shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--color-navy-muted)] mt-6">
          <a href="/" className="flex items-center justify-center gap-1 hover:text-[var(--color-navy)] transition-colors font-medium">
            <ChevronLeft size={16} /> Back to Anovia
          </a>
        </p>
      </div>
    </div>
  );
}

// ── Product Modal ──────────────────────────────────────────────────────────

const EMPTY_PRODUCT: Omit<Product, 'id'> = {
  name: '', category: '', description: '', price: '', imageUrl: '', inStock: true, sortOrder: 0,
};
const CATEGORIES = ['Necklaces', 'Earrings', 'Bangles', 'Rings', 'Hair Accessories', 'Gift Hampers', 'Other'];

function ProductModal({
  product, onSave, onClose,
}: {
  product: Partial<Product> | null;
  onSave: (data: Omit<Product, 'id'>, id?: number) => Promise<void>;
  onClose: () => void;
}) {
  const isNew = !product?.id;
  const [form, setForm] = useState<Omit<Product, 'id'>>({ ...EMPTY_PRODUCT, ...(product ?? {}) });
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof form, val: any) => setForm(f => ({ ...f, [key]: val }));

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return; }
    const b64 = await fileToBase64(file);
    set('imageUrl', b64);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form, product?.id);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b-2 border-[var(--color-bg-accent)] sticky top-0 bg-white z-10 rounded-t-3xl">
          <h3 className="text-xl font-bold text-[var(--color-navy)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            {isNew ? 'Add Product' : 'Edit Product'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--color-bg-alt)] text-[var(--color-navy-muted)]"><X size={20} /></button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Image */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-navy)] mb-2">Photo</label>
            <div className="flex items-start gap-4">
              {form.imageUrl ? (
                <div className="relative">
                  <img src={form.imageUrl} alt="preview" className="w-24 h-24 rounded-2xl object-cover border-2 border-[var(--color-bg-accent)]" />
                  <button type="button" onClick={() => set('imageUrl', '')}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--color-pink-dark)] text-white rounded-full flex items-center justify-center shadow">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-[var(--color-bg-accent)] flex items-center justify-center bg-[var(--color-bg-light)] text-[var(--color-navy-muted)]">
                  <Package size={24} />
                </div>
              )}
              <div className="flex-1">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--color-bg-accent)] rounded-xl text-sm font-bold text-[var(--color-navy)] hover:border-[var(--color-navy)] transition-colors"
                >
                  <Upload size={16} /> Upload Photo
                </button>
                <p className="text-xs text-[var(--color-navy-muted)] mt-1">JPG, PNG, WebP · max 5 MB</p>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                <div className="mt-2">
                  <input
                    type="url"
                    value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl}
                    onChange={e => set('imageUrl', e.target.value)}
                    placeholder="…or paste image URL"
                    className="w-full text-xs px-3 py-2 rounded-xl border-2 border-[var(--color-bg-accent)] focus:border-[var(--color-navy)] outline-none text-[var(--color-navy)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-navy)] mb-1">Product Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} required
              placeholder="e.g. Rose Gold Layered Necklace"
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-bg-accent)] focus:border-[var(--color-navy)] outline-none text-[var(--color-navy)] font-medium" />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-navy)] mb-1">Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-bg-accent)] focus:border-[var(--color-navy)] outline-none text-[var(--color-navy)] font-medium bg-white">
              <option value="">Select category…</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-navy)] mb-1">Price</label>
            <input value={form.price} onChange={e => set('price', e.target.value)}
              placeholder="e.g. ₹499 or Starting ₹299"
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-bg-accent)] focus:border-[var(--color-navy)] outline-none text-[var(--color-navy)] font-medium" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-navy)] mb-1">Description</label>
            <textarea value={form.description ?? ''} onChange={e => set('description', e.target.value)}
              rows={3} placeholder="Short description of this product…"
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-bg-accent)] focus:border-[var(--color-navy)] outline-none text-[var(--color-navy)] font-medium resize-none" />
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <label className="block text-sm font-bold text-[var(--color-navy)] mb-1">Display Order</label>
              <input type="number" value={form.sortOrder} onChange={e => set('sortOrder', Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-bg-accent)] focus:border-[var(--color-navy)] outline-none text-[var(--color-navy)] font-medium" />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <label className="text-sm font-bold text-[var(--color-navy)]">In Stock</label>
              <button type="button" onClick={() => set('inStock', !form.inStock)}
                className={`w-12 h-6 rounded-full transition-colors relative ${form.inStock ? 'bg-[var(--color-navy)]' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${form.inStock ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-[var(--color-bg-accent)] text-[var(--color-navy)] font-bold hover:bg-[var(--color-bg-alt)] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl bg-[var(--color-navy)] text-white font-bold hover:bg-[var(--color-navy-light)] transition-colors shadow-md disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isNew ? 'Add Product' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Products Tab ───────────────────────────────────────────────────────────

function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Partial<Product> | null | 'new'>(null);

  const load = async () => {
    setLoading(true);
    try { setProducts(await adminGetProducts()); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data: Omit<Product, 'id'>, id?: number) => {
    if (id) {
      await adminUpdateProduct(id, data);
      toast.success('Product updated');
    } else {
      await adminCreateProduct(data);
      toast.success('Product added');
    }
    await load();
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await adminDeleteProduct(id);
    toast.success('Deleted');
    setProducts(p => p.filter(x => x.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-navy)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>Products</h2>
          <p className="text-sm text-[var(--color-navy-muted)]">{products.length} products · shown on the main site</p>
        </div>
        <button onClick={() => setModal('new')}
          className="flex items-center gap-2 bg-[var(--color-navy)] text-white px-5 py-2.5 rounded-2xl font-bold shadow-md hover:bg-[var(--color-navy-light)] transition-colors">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[var(--color-navy)]" size={32} /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-navy-muted)]">
          <Package size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No products yet</p>
          <button onClick={() => setModal('new')} className="mt-4 text-[var(--color-navy)] underline font-bold text-sm">Add your first product</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border-2 border-[var(--color-bg-accent)] overflow-hidden hover:border-[var(--color-navy)] transition-colors group">
              {/* Image */}
              <div className="h-40 bg-[var(--color-bg-alt)] flex items-center justify-center overflow-hidden">
                {p.imageUrl
                  ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  : <Package size={40} className="text-[var(--color-navy-muted)] opacity-40" />}
              </div>
              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[var(--color-navy)] truncate">{p.name}</h3>
                    {p.category && <p className="text-xs text-[var(--color-navy-muted)] font-medium mt-0.5">{p.category}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <div className={`w-2 h-2 rounded-full ${p.inStock ? 'bg-green-500' : 'bg-red-400'}`} title={p.inStock ? 'In stock' : 'Out of stock'} />
                  </div>
                </div>
                {p.price && <p className="text-[var(--color-navy)] font-bold mt-2">{p.price}</p>}
                {p.description && <p className="text-xs text-[var(--color-navy-muted)] mt-1 line-clamp-2">{p.description}</p>}
                <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--color-bg-alt)]">
                  <button onClick={() => setModal(p)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-bold text-[var(--color-navy)] border-2 border-[var(--color-bg-accent)] rounded-xl hover:border-[var(--color-navy)] transition-colors">
                    <Pencil size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(p.id, p.name)}
                    className="flex items-center justify-center gap-1 py-2 px-3 text-sm font-bold text-red-500 border-2 border-red-100 rounded-xl hover:border-red-300 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(modal === 'new' || (modal && modal !== 'new')) && (
        <ProductModal
          product={modal === 'new' ? null : (modal as Product)}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

// ── Offers Tab ─────────────────────────────────────────────────────────────

function OffersTab() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const load = async () => {
    setLoading(true);
    try { setOffers(await adminGetOffers()); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newText.trim()) return;
    await adminCreateOffer({ text: newText.trim(), active: true, sortOrder: offers.length });
    setNewText('');
    toast.success('Offer added');
    await load();
  };

  const handleToggle = async (o: Offer) => {
    await adminUpdateOffer(o.id, { active: !o.active });
    setOffers(prev => prev.map(x => x.id === o.id ? { ...x, active: !x.active } : x));
  };

  const handleDelete = async (id: number) => {
    await adminDeleteOffer(id);
    toast.success('Removed');
    setOffers(prev => prev.filter(o => o.id !== id));
  };

  const saveEdit = async (id: number) => {
    if (!editText.trim()) return;
    await adminUpdateOffer(id, { text: editText.trim() });
    setOffers(prev => prev.map(o => o.id === id ? { ...o, text: editText.trim() } : o));
    setEditId(null);
    toast.success('Updated');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[var(--color-navy)] mb-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>Marquee & Offers</h2>
      <p className="text-sm text-[var(--color-navy-muted)] mb-6">These scroll across the pink stripe below the hero. Toggle them on or off.</p>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[var(--color-navy)]" size={32} /></div>
      ) : (
        <div className="space-y-3">
          {offers.map(o => (
            <div key={o.id} className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-colors ${o.active ? 'border-[var(--color-navy)] bg-white' : 'border-[var(--color-bg-accent)] bg-[var(--color-bg-light)] opacity-60'}`}>
              {editId === o.id ? (
                <>
                  <input value={editText} onChange={e => setEditText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveEdit(o.id); if (e.key === 'Escape') setEditId(null); }}
                    className="flex-1 px-3 py-1.5 rounded-xl border-2 border-[var(--color-navy)] outline-none text-[var(--color-navy)] font-medium text-sm"
                    autoFocus />
                  <button onClick={() => saveEdit(o.id)} className="text-[var(--color-navy)] hover:text-[var(--color-navy-light)]"><Save size={16} /></button>
                  <button onClick={() => setEditId(null)} className="text-[var(--color-navy-muted)]"><X size={16} /></button>
                </>
              ) : (
                <>
                  <span className="flex-1 font-semibold text-[var(--color-navy)]">{o.text}</span>
                  <button onClick={() => handleToggle(o)} title={o.active ? 'Hide' : 'Show'}
                    className="text-[var(--color-navy-muted)] hover:text-[var(--color-navy)] transition-colors p-1">
                    {o.active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button onClick={() => { setEditId(o.id); setEditText(o.text); }}
                    className="text-[var(--color-navy-muted)] hover:text-[var(--color-navy)] transition-colors p-1"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(o.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"><Trash2 size={16} /></button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add new */}
      <div className="flex gap-3 mt-6">
        <input
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Type a new marquee item…"
          className="flex-1 px-4 py-3 rounded-2xl border-2 border-[var(--color-bg-accent)] focus:border-[var(--color-navy)] outline-none text-[var(--color-navy)] font-medium"
        />
        <button onClick={handleAdd}
          className="flex items-center gap-2 px-5 bg-[var(--color-navy)] text-white rounded-2xl font-bold hover:bg-[var(--color-navy-light)] transition-colors shadow-md">
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}

// ── Settings Tab ───────────────────────────────────────────────────────────

const SETTINGS_FIELDS: { key: string; label: string; multiline?: boolean; section: string }[] = [
  { key: 'announcement_text', label: 'Announcement Bar Text', section: 'Header' },
  { key: 'hero_subtitle', label: 'Hero Subtitle', section: 'Hero' },
  { key: 'hero_body', label: 'Hero Body Text', multiline: true, section: 'Hero' },
  { key: 'story_heading', label: 'Our Story Heading', section: 'Our Story' },
  { key: 'story_body', label: 'Our Story Body', multiline: true, section: 'Our Story' },
  { key: 'story_founder', label: 'Founder Sign-off', section: 'Our Story' },
  { key: 'promise_heading', label: 'Promise Section Heading', section: 'The Promise' },
  { key: 'promise_body', label: 'Promise Section Body', multiline: true, section: 'The Promise' },
  { key: 'scoop_heading', label: 'Mystery Scoop Heading', section: 'Mystery Scoop' },
  { key: 'scoop_body', label: 'Mystery Scoop Body', multiline: true, section: 'Mystery Scoop' },
  { key: 'hampers_heading', label: 'Hampers Section Heading', section: 'Hampers' },
  { key: 'hampers_body', label: 'Hampers Section Body', multiline: true, section: 'Hampers' },
  { key: 'cta_heading', label: 'CTA Band Heading', section: 'CTA Band' },
  { key: 'cta_body', label: 'CTA Band Body', section: 'CTA Band' },
  { key: 'footer_tagline', label: 'Footer Tagline', multiline: true, section: 'Footer & Contact' },
  { key: 'whatsapp_url', label: 'WhatsApp Link (full URL)', section: 'Footer & Contact' },
  { key: 'instagram_handle', label: 'Instagram Handle', section: 'Footer & Contact' },
  { key: 'instagram_url', label: 'Instagram URL', section: 'Footer & Contact' },
];

function SettingsTab() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    adminGetSettings().then(s => { setSettings(s); setLoading(false); });
  }, []);

  const set = (key: string, val: string) => {
    setSettings(s => ({ ...s, [key]: val }));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminSaveSettings(settings);
      toast.success('Settings saved!');
      setDirty(false);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const sections = [...new Set(SETTINGS_FIELDS.map(f => f.section))];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-navy)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>Site Content</h2>
          <p className="text-sm text-[var(--color-navy-muted)]">Edit all text and links on the main site</p>
        </div>
        {dirty && (
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 bg-[var(--color-navy)] text-white px-5 py-2.5 rounded-2xl font-bold shadow-md hover:bg-[var(--color-navy-light)] transition-colors disabled:opacity-60">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save All
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[var(--color-navy)]" size={32} /></div>
      ) : (
        <div className="space-y-8">
          {sections.map(section => (
            <div key={section} className="bg-white rounded-2xl border-2 border-[var(--color-bg-accent)] p-6">
              <h3 className="text-lg font-bold text-[var(--color-navy)] mb-4 pb-3 border-b border-[var(--color-bg-alt)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {section}
              </h3>
              <div className="space-y-4">
                {SETTINGS_FIELDS.filter(f => f.section === section).map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-bold text-[var(--color-navy)] mb-1">{f.label}</label>
                    {f.multiline ? (
                      <textarea
                        value={settings[f.key] ?? ''}
                        onChange={e => set(f.key, e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-bg-accent)] focus:border-[var(--color-navy)] outline-none text-[var(--color-navy)] font-medium resize-none text-sm"
                      />
                    ) : (
                      <input
                        value={settings[f.key] ?? ''}
                        onChange={e => set(f.key, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--color-bg-accent)] focus:border-[var(--color-navy)] outline-none text-[var(--color-navy)] font-medium text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving || !dirty}
              className="flex items-center gap-2 bg-[var(--color-navy)] text-white px-8 py-3 rounded-2xl font-bold shadow-md hover:bg-[var(--color-navy-light)] transition-colors disabled:opacity-50">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {dirty ? 'Save All Changes' : 'All Changes Saved'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Dashboard Shell ────────────────────────────────────────────────────────

const NAV = [
  { key: 'products', label: 'Products', icon: Package },
  { key: 'offers', label: 'Marquee & Offers', icon: Tag },
  { key: 'content', label: 'Site Content', icon: SettingsIcon },
];

function Dashboard({ adminEmail, onLogout }: { adminEmail: string; onLogout: () => void }) {
  const [tab, setTab] = useState('products');

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b-2 border-[var(--color-bg-accent)] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-navy)] flex items-center justify-center text-white font-bold text-lg shadow-md" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            A
          </div>
          <div>
            <div className="font-bold text-[var(--color-navy)] leading-tight" style={{ fontFamily: 'Fredoka, sans-serif' }}>Anovia Admin</div>
            <div className="text-xs text-[var(--color-navy-muted)]">{adminEmail}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-sm text-[var(--color-navy-muted)] hover:text-[var(--color-navy)] border-2 border-[var(--color-bg-accent)] rounded-xl px-3 py-2 font-semibold transition-colors">
            <Store size={16} /> View Site
          </a>
          <button onClick={onLogout}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 border-2 border-red-100 hover:border-red-300 rounded-xl px-3 py-2 font-bold transition-colors">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-white border-r-2 border-[var(--color-bg-accent)] py-6 px-3 gap-1 shrink-0">
          {NAV.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all w-full text-left ${
                tab === key
                  ? 'bg-[var(--color-navy)] text-white shadow-md'
                  : 'text-[var(--color-navy)] hover:bg-[var(--color-bg-alt)]'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </aside>

        {/* Mobile tab bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[var(--color-bg-accent)] flex z-30">
          {NAV.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-bold transition-colors ${
                tab === key ? 'text-[var(--color-navy)]' : 'text-[var(--color-navy-muted)]'
              }`}
            >
              <Icon size={20} />
              {label.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 p-6 pb-24 md:pb-6 overflow-auto">
          {tab === 'products' && <ProductsTab />}
          {tab === 'offers' && <OffersTab />}
          {tab === 'content' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}

// ── Root Admin Component ───────────────────────────────────────────────────

export default function Admin() {
  const [state, setState] = useState<'loading' | 'login' | 'dashboard'>('loading');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = getToken();
    if (!token) { setState('login'); return; }
    getMe()
      .then(me => { setEmail(me.email); setState('dashboard'); })
      .catch(() => { clearToken(); setState('login'); });
  }, []);

  const handleLogin = async () => {
    try {
      const me = await getMe();
      setEmail(me.email);
      setState('dashboard');
    } catch {
      setState('login');
    }
  };

  const handleLogout = () => {
    clearToken();
    setState('login');
  };

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-[var(--color-bg-light)] flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--color-navy)]" size={40} />
      </div>
    );
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      {state === 'login' ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <Dashboard adminEmail={email} onLogout={handleLogout} />
      )}
    </>
  );
}
