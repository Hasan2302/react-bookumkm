// resources/js/Pages/Umkm/FormBuilder.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Home, FileText, Settings, LogOut, Save, Eye, Plus, Trash2, GripVertical,
  Type, Mail, Phone, Hash, Text, ChevronDown, Circle, Square,
  Scissors, WashingMachine, Wrench, Stethoscope, Sparkles, DollarSign, CreditCard, MessageSquare, Truck
} from 'lucide-react';
import api from '@/Services/Api';
import useUmkmStore from '@/Stores/useUmkmStore';

// ==================== SORTABLE FIELD ====================
function SortableField({ field, onUpdate, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className={`relative p-5 bg-white rounded-2xl border ${isDragging ? 'border-indigo-500 shadow-2xl z-50 scale-105' : 'border-gray-200 shadow-sm'} transition-all`}>
      <div className="flex items-start gap-4">
        <div className="mt-1 text-gray-400 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
          <GripVertical className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-4">
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate(field.id, { label: e.target.value })}
            className="w-full px-3 py-1 text-lg font-semibold bg-transparent border-0 outline-none focus:ring-2 focus:ring-indigo-500 focus:rounded-lg"
            placeholder="Masukkan label field..."
          />

            {['select', 'radio', 'checkbox'].includes(field.type) && (
            <div className="p-5 space-y-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50">
                {field.options?.map((opt, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
                    {/* LABEL OPSI */}
                    <input
                    type="text"
                    value={opt.label}
                    onChange={(e) => {
                        const newOpts = [...field.options];
                        newOpts[i] = { ...newOpts[i], label: e.target.value };
                        onUpdate(field.id, { options: newOpts });
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Nama opsi (contoh: Creambath)"
                    />

                    {/* INPUT HARGA */}
                    <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600">Rp</span>
                    <input
                        type="text"
                        value={opt.price || 0}
                        onChange={(e) => {
                        const newOpts = [...field.options];
                        newOpts[i] = { ...newOpts[i], price: parseInt(e.target.value) || 0 };
                        onUpdate(field.id, { options: newOpts });
                        }}
                        className="px-3 py-2 text-sm border rounded-lg w-28 focus:ring-2 focus:ring-green-500"
                        placeholder="0"
                    />
                    </div>

                    {/* TIPE (Opsional - misal: Senior, Junior, Owner) */}
                    <input
                    type="text"
                    value={opt.type || ''}
                    onChange={(e) => {
                        const newOpts = [...field.options];
                        newOpts[i] = { ...newOpts[i], type: e.target.value };
                        onUpdate(field.id, { options: newOpts });
                    }}
                    className="w-32 px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Tipe (opsional)"
                    />

                    {/* HAPUS OPSI */}
                    <button
                    onClick={() => onUpdate(field.id, { options: field.options.filter((_, idx) => idx !== i) })}
                    className="p-2 text-red-500 transition rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                ))}

                {/* TAMBAH OPSI BARU */}
                <button
                onClick={() => onUpdate(field.id, {
                    options: [...(field.options || []), { label: 'Pilihan Baru', price: 0, type: '' }]
                })}
                className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-white transition bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:scale-105">
                <Plus className="w-5 h-5" /> Tambah Opsi
                </button>
            </div>
            )}

          <div className="flex items-center justify-between pt-3">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => onUpdate(field.id, { required: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span>Wajib diisi</span>
            </label>
            <span className="px-3 py-1 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
              {field.type}
            </span>
          </div>
        </div>

        <button onClick={() => onDelete(field.id)} className="p-2 text-red-500 transition rounded-lg hover:bg-red-50">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// ==================== TEMPLATE PRESETS ====================
const templatePresets = [
  {
    name: 'Salon / Beauty', icon: <Scissors className="text-pink-600 w-9 h-9" />,
    color: 'from-pink-50 to-pink-100', border: 'border-pink-300',
    fields: [
      { type: 'text', label: 'Nama Lengkap', required: true },
      { type: 'phone', label: 'No. WhatsApp', required: true },
      { type: 'select', label: 'Pilih Treatment', required: true, options: ['Cukur Rambut', 'Creambath', 'Coloring', 'Manicure'] },
      { type: 'select', label: 'Pilih Stylist', required: true, options: ['Mas Budi', 'Mbak Sari', 'Mbak Rina'] },
      { type: 'textarea', label: 'Catatan Khusus', required: false },
    ]
  },
  {
    name: 'Laundry', icon: <WashingMachine className="text-blue-600 w-9 h-9" />,
    color: 'from-blue-50 to-blue-100', border: 'border-blue-300',
    fields: [
      { type: 'text', label: 'Nama Pelanggan', required: true },
      { type: 'phone', label: 'No. WhatsApp', required: true },
      { type: 'number', label: 'Berat Cucian (Kg)', required: true },
      { type: 'radio', label: 'Jenis Layanan', required: true, options: ['Cuci Setrika', 'Setrika Saja'] },
    ]
  },
  {
    name: 'Bengkel', icon: <Wrench className="text-gray-700 w-9 h-9" />,
    color: 'from-gray-50 to-gray-100', border: 'border-gray-300',
    fields: [
      { type: 'text', label: 'Nama Pemilik', required: true },
      { type: 'phone', label: 'No. HP', required: true },
      { type: 'text', label: 'No. Polisi Kendaraan', required: true },
      { type: 'textarea', label: 'Keluhan / Masalah', required: true },
    ]
  },
  {
    name: 'Klinik / Dokter', icon: <Stethoscope className="text-red-600 w-9 h-9" />,
    color: 'from-red-50 to-red-100', border: 'border-red-300',
    fields: [
      { type: 'text', label: 'Nama Pasien', required: true },
      { type: 'phone', label: 'No. WhatsApp', required: true },
      { type: 'select', label: 'Pilih Dokter', required: true, options: ['dr. Siti', 'dr. Budi'] },
      { type: 'textarea', label: 'Keluhan Kesehatan', required: true },
    ]
  },
];

const standardFields = [
    { type: 'text', label: 'Teks', icon: <Type className="w-5 h-5" /> },
    { type: 'email', label: 'Email', icon: <Mail className="w-5 h-5" /> },
    { type: 'phone', label: 'No. HP', icon: <Phone className="w-5 h-5" /> },
    { type: 'number', label: 'Angka', icon: <Hash className="w-5 h-5" /> },
    { type: 'textarea', label: 'Paragraf', icon: <Text className="w-5 h-5" /> },
    { type: 'select', label: 'Dropdown', icon: <ChevronDown className="w-5 h-5" /> },
    { type: 'radio', label: 'Pilih Satu', icon: <Circle className="w-5 h-5" /> },
    { type: 'checkbox', label: 'Kotak Centang', icon: <Square className="w-5 h-5" /> },
];

const advancedFields = [
    { label: 'Catatan', type: 'textarea', icon: <MessageSquare className="w-5 h-5" /> },
    { label: 'Alamat Antar/Jemput', type: 'textarea', icon: <Truck className="w-5 h-5" /> },
    { label: 'Metode Bayar', type: 'radio', icon: <CreditCard className="w-5 h-5" />, options: ['Tunai', 'QRIS', 'Transfer'] },
    { label: 'Deposit (Rp)', type: 'number', icon: <DollarSign className="w-5 h-5" /> },
];

// ==================== MAIN COMPONENT ====================
export default function FormBuilder() {
  const [fields, setFields] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openTemplates, setOpenTemplates] = useState(true);
  const [openStandard, setOpenStandard] = useState(false);
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const [openServices, setOpenServices] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { services: umkmServices, loading: umkmLoading } = useUmkmStore();

  const navItems = [
    { name: 'Dashboard', to: '/umkm/dashboard', icon: Home },
    { name: 'Form Builder', to: '/umkm/formbuilder', icon: FileText },
    { name: 'Pengaturan', to: '/umkm/settings', icon: Settings },
  ];

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // ==================== LOAD FORM DARI DATABASE ====================
// GANTI SELURUH useEffect INI DI FormBuilder.jsx
  useEffect(() => {
    const loadForm = async () => {
      setLoading(true);
      try {
        const res = await api.get('/formbuilder');
        const rawData = res.data.data || [];

        if (rawData.length > 0) {
          const loaded = rawData.map(item => ({
            id: item.id.toString(),
            label: item.label,
            type: item.type,
            required: Boolean(item.required),
            // INI YANG DIPERBAIKI: CEK DULU SEBELUM JSON.parse
            options: item.options
            ? (typeof item.options === 'string'
                ? JSON.parse(item.options).map(opt => ({
                    label: opt.label || opt,
                    price: opt.price || 0,
                    type: opt.type || ''
                    }))
                : Array.isArray(item.options)
                    ? item.options.map(o => typeof o === 'string' ? { label: o, price: 0 } : o)
                    : []
                )
            : [],
          }));

          // Urutkan berdasarkan sort_order
          loaded.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
          setFields(loaded);
        }
      } catch (err) {
        console.error('Gagal load form:', err);
        // Jangan biarkan error crash aplikasi
        setFields([]);
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, []);

  // ==================== SAVE FORM ====================
  const handleSave = async () => {
    try {
      const payload = fields.map((field, index) => ({
        label: field.label,
        type: field.type,
        required: field.required ? 1 : 0,
        options: field.options && field.options.length > 0
          ? field.options.map(o => ({
              label: o.label,
              price: parseInt(o.price) || 0,
              type: o.type || null
            }))
          : null,
        sort_order: index,
      }));

      await api.post('/formbuilder', { fields: payload });
      alert('Form berhasil disimpan dengan harga per opsi!');
    } catch (err) {
      console.error(err.response?.data);
      alert('Gagal menyimpan: ' + (err.response?.data?.message || 'Cek console'));
    }
  };

  // ==================== ADD FIELD & TEMPLATE ====================
 // GANTI addField & load dari DB jadi support price & type
  const addField = (type, label = 'Field Baru', options = [], required = false) => {
    setFields(prev => [...prev, {
      id: 'temp-' + Date.now(),
      type,
      label,
      required,
      // UBAH: options jadi array of object!
      options: ['select', 'radio', 'checkbox'].includes(type)
        ? (options.length > 0 ? options : [{ label: 'Pilihan 1', price: 0 }])
        : []
    }]);
  };

  const applyTemplate = (tmpl) => {
    tmpl.fields.forEach((f, i) => {
      setTimeout(() => addField(f.type, f.label, f.options || [], f.required), i * 80);
    });
    alert(`Template "${tmpl.name}" ditambahkan!`);
  };

  const updateField = (id, updates) => setFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  const deleteField = (id) => setFields(prev => prev.filter(f => f.id !== id));

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setFields(items => {
      const oldIdx = items.findIndex(i => i.id === active.id);
      const newIdx = items.findIndex(i => i.id === over.id);
      return arrayMove(items, oldIdx, newIdx);
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-3xl font-bold text-indigo-600">Memuat form...</div>;
  }

  return (
    <>
      {/* NAVBAR */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="px-4 py-3 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-8">
              {navItems.map(item => (
                <Link key={item.name} to={item.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === item.to ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <item.icon className="w-5 h-5" />
                  <span className="hidden sm:block">{item.name}</span>
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-medium md:block">Hi, {user.name}!</span>
              <button onClick={() => { localStorage.clear(); navigate('/'); }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg bg-red-50 hover:bg-red-100">
                <LogOut className="w-4 h-4" /> <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING SAVE BUTTON */}
      {fields.length > 0 && (
        <button onClick={handleSave}
          className="fixed z-50 flex items-center gap-3 py-4 text-lg font-bold text-white transition-all rounded-full shadow-2xl px-7 bg-gradient-to-r from-emerald-500 to-teal-600 bottom-20 right-6 hover:scale-105">
          <Save className="w-6 h-6" /> SIMPAN FORM
        </button>
      )}

      <div className="min-h-screen pb-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="px-4 py-6 mx-auto max-w-7xl">

          {!previewMode && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Form Builder</h1>
                  <p className="text-gray-600">Susun form booking dengan mudah</p>
                </div>
                <button onClick={() => setPreviewMode(true)}
                  className="flex items-center gap-2 px-6 py-3 font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700">
                  <Eye className="w-5 h-5" /> Preview Form
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                {/* TOOLBOX KIRI */}
                <div className="space-y-6">

                  {/* TEMPLATE CEPAT */}
                  <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
                    <button onClick={() => setOpenTemplates(!openTemplates)}
                      className="flex items-center justify-between w-full px-6 py-4 transition bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-purple-700" />
                        <h3 className="font-bold text-purple-900">Template Cepat</h3>
                      </div>
                      <ChevronDown className={`w-5 h-5 transition ${openTemplates ? 'rotate-180' : ''}`} />
                    </button>
                    {openTemplates && (
                      <div className="p-4 space-y-4">
                        {templatePresets.map((tmpl, i) => (
                          <button key={i} onClick={() => applyTemplate(tmpl)}
                            className={`w-full p-5 text-left transition-all rounded-xl border-2 bg-gradient-to-br ${tmpl.color} ${tmpl.border} hover:scale-105 hover:shadow-xl`}>
                            <div className="flex items-center gap-4">
                              {tmpl.icon}
                              <div>
                                <p className="font-bold text-gray-800">{tmpl.name}</p>
                                <p className="text-xs text-gray-600">{tmpl.fields.length} field</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* LAYANAN & HARGA */}
                  {!umkmLoading && umkmServices.length > 0 && (
                    <div className="overflow-hidden shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
                      <button onClick={() => setOpenServices(!openServices)}
                        className="flex items-center justify-between w-full px-6 py-5 transition bg-emerald-100 hover:bg-emerald-200">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-6 h-6 text-emerald-700" />
                          <h3 className="text-lg font-bold text-emerald-800">Layanan & Harga ({umkmServices.length})</h3>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-emerald-700 transition-transform ${openServices ? 'rotate-180' : ''}`} />
                      </button>
                      {openServices && (
                        <div className="p-4 space-y-3">
                          {umkmServices.map((s, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white border-2 rounded-xl border-emerald-200">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-100"><CreditCard className="w-5 h-5 text-emerald-700" /></div>
                                <span className="font-medium">{s.name}</span>
                              </div>
                              <div className="px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r from-emerald-600 to-teal-600">
                                Rp {Number(s.price).toLocaleString('id-ID')}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* FIELD STANDAR */}
                  <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
                    <button onClick={() => setOpenStandard(!openStandard)}
                      className="flex items-center justify-between w-full px-6 py-4 transition bg-gray-50 hover:bg-gray-100">
                      <h3 className="font-bold text-gray-800">Field Standar</h3>
                      <ChevronDown className={`w-5 h-5 transition ${openStandard ? 'rotate-180' : ''}`} />
                    </button>
                    {openStandard && (
                      <div className="p-4 space-y-3">
                        {standardFields.map((f, i) => (
                          <button key={i} onClick={() => addField(f.type, f.label)}
                            className="flex items-center w-full gap-3 p-4 transition border-2 border-transparent rounded-xl bg-gray-50 hover:bg-indigo-50 hover:border-indigo-500">
                            {f.icon} <span className="font-medium">{f.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="overflow-hidden shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
                        <button onClick={() => setOpenAdvanced(!openAdvanced)}
                        className="flex items-center justify-between w-full px-6 py-4 transition bg-emerald-100 hover:bg-emerald-200">
                        <h3 className="font-bold text-emerald-800">Field Tambahan</h3>
                        <ChevronDown className={`w-5 h-5 transition ${openAdvanced ? 'rotate-180' : ''}`} />
                        </button>
                        {openAdvanced && (
                        <div className="p-4 space-y-3">
                            {advancedFields.map((f, i) => (
                            <button key={i} onClick={() => addField(f.type)}
                                className="flex items-center w-full gap-3 p-4 transition bg-white border-2 rounded-xl border-emerald-200 hover:border-emerald-500">
                                {f.icon} <span className="font-medium">{f.label}</span>
                            </button>
                            ))}
                        </div>
                        )}
                    </div>
                </div>

                {/* CANVAS KANAN */}
                <div className="lg:col-span-3">
                  <div className="p-8 bg-white shadow-2xl rounded-3xl min-h-96">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-5">
                          {fields.length === 0 ? (
                            <div className="py-32 text-center text-gray-400">
                              <Sparkles className="w-20 h-20 mx-auto mb-6 opacity-60" />
                              <p className="text-xl font-medium">Pilih template cepat atau tambah field manual</p>
                            </div>
                          ) : (
                            fields.map(field => (
                              <SortableField key={field.id} field={field} onUpdate={updateField} onDelete={deleteField} />
                            ))
                          )}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* PREVIEW MODE */}
          {previewMode && (
            <div className="max-w-2xl py-12 mx-auto">
              <button onClick={() => setPreviewMode(false)} className="flex items-center gap-2 mb-6 font-bold text-indigo-600">
                ← Kembali ke Editor
              </button>
              <div className="p-10 bg-white shadow-2xl rounded-3xl">
                <h2 className="mb-10 text-3xl font-bold text-center text-gray-800">Form Booking Pelanggan</h2>
                <div className="space-y-8">
                  {fields.map(f => (
                    <div key={f.id}>
                      <label className="block mb-2 text-lg font-medium text-gray-700">
                        {f.label} {f.required && <span className="text-red-500">*</span>}
                      </label>
                      {f.type === 'textarea' ? <textarea className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200" rows="3" /> :
                       f.type === 'select' ? <select className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl"><option>Pilih</option>{f.options?.map(o => <option key={o}>{o}</option>)}</select> :
                       ['radio','checkbox'].includes(f.type) ? (
                         <div className="space-y-3">
                           {f.options?.map(o => (
                             <label key={o} className="flex items-center gap-3 text-lg">
                               <input type={f.type} name={f.id} className="w-5 h-5 text-indigo-600" /> <span>{o}</span>
                             </label>
                           ))}
                         </div>
                       ) : <input type={f.type} className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200" />}
                    </div>
                  ))}
                  <button className="w-full py-5 text-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:shadow-xl">
                    Kirim Booking
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden">
        <div className="grid grid-cols-3 py-3">
          {navItems.map(item => (
            <Link key={item.name} to={item.to}
              className={`flex flex-col items-center text-xs font-medium py-2 ${location.pathname === item.to ? 'text-indigo-600' : 'text-gray-500'}`}>
              <item.icon className="w-6 h-6 mb-1" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
