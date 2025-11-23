// resources/js/Pages/Umkm/FormBuilder.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Home, FileText, Settings, LogOut, Save, Eye, Plus, Trash2, GripVertical,
  Type, Mail, Phone, Hash, Text, ChevronDown, Circle, Square,
  Scissors, WashingMachine, Wrench, Stethoscope, MessageSquare, Truck, CreditCard, DollarSign
} from 'lucide-react';
import api from '@/Services/Api';
import useUmkmStore from '@/Stores/useUmkmStore';

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
            <div className="p-4 space-y-2 rounded-xl bg-gray-50">
              {field.options?.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...field.options];
                      newOpts[i] = e.target.value;
                      onUpdate(field.id, { options: newOpts });
                    }}
                    className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder={`Opsi ${i + 1}`}
                  />
                  <button onClick={() => onUpdate(field.id, { options: field.options.filter((_, idx) => idx !== i) })}
                    className="p-2 text-red-500 transition rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button onClick={() => onUpdate(field.id, { options: [...(field.options || []), 'Pilihan Baru'] })}
                className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                <Plus className="w-4 h-4" /> Tambah Opsi
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-3">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input type="checkbox" checked={field.required} onChange={e => onUpdate(field.id, { required: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
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

export default function FormBuilder() {
  const [fields, setFields] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openStandard, setOpenStandard] = useState(true);
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { services: umkmServices, loading: umkmLoading } = useUmkmStore();
  const [openServices, setOpenServices] = useState(true);

  const navItems = [
    { name: 'Dashboard', to: '/umkm/dashboard', icon: Home },
    { name: 'Form Builder', to: '/umkm/formbuilder', icon: FileText },
    { name: 'Pengaturan', to: '/umkm/settings', icon: Settings },
  ];

  const templates = [
    {
      name: 'Salon / Beauty',
      icon: <Scissors className="text-pink-600 w-14 h-14" />,
      fields: [
        { type: 'text', label: 'Nama Lengkap', required: true },
        { type: 'phone', label: 'No. WhatsApp', required: true },
        { type: 'select', label: 'Pilih Treatment', required: true, options: ['Cukur Rambut', 'Creambath', 'Coloring', 'Manicure'] },
        { type: 'select', label: 'Pilih Stylist', required: true, options: ['Mas Budi', 'Mbak Sari', 'Mbak Rina'] },
        { type: 'textarea', label: 'Catatan Khusus', required: false }
      ]
    },
    {
      name: 'Laundry',
      icon: <WashingMachine className="text-blue-600 w-14 h-14" />,
      fields: [
        { type: 'text', label: 'Nama Pelanggan', required: true },
        { type: 'phone', label: 'No. WhatsApp', required: true },
        { type: 'number', label: 'Berat Cucian (Kg)', required: true },
        { type: 'radio', label: 'Jenis Layanan', required: true, options: ['Cuci Kering Lipat', 'Cuci Setrika', 'Setrika Saja'] },
        { type: 'textarea', label: 'Alamat Jemput (jika ada)', required: false }
      ]
    },
    {
      name: 'Bengkel',
      icon: <Wrench className="text-gray-700 w-14 h-14" />,
      fields: [
        { type: 'text', label: 'Nama Pemilik', required: true },
        { type: 'phone', label: 'No. HP', required: true },
        { type: 'text', label: 'No. Polisi Kendaraan', required: true },
        { type: 'text', label: 'Merk & Tipe', required: true },
        { type: 'textarea', label: 'Keluhan / Masalah', required: true }
      ]
    },
    {
      name: 'Klinik / Dokter',
      icon: <Stethoscope className="text-red-600 w-14 h-14" />,
      fields: [
        { type: 'text', label: 'Nama Pasien', required: true },
        { type: 'phone', label: 'No. WhatsApp', required: true },
        { type: 'select', label: 'Pilih Dokter', required: true, options: ['dr. Siti', 'dr. Budi', 'dr. Andi'] },
        { type: 'textarea', label: 'Keluhan Kesehatan', required: true }
      ]
    },
    {
      name: 'Kosong',
      icon: <FileText className="text-gray-400 w-14 h-14" />,
      fields: []
    },
  ];

  const serviceFields = [
    {
      type: 'service',
      label: 'Layanan & Harga',
      icon: <DollarSign className="w-6 h-6" />,
      description: 'Tambahkan daftar layanan beserta harga'
    }
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

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get('/formbuilder');
        const data = res.data.data || [];
        setFields(data.map(f => ({
          ...f,
          id: f.id.toString(),
          options: f.options ? JSON.parse(f.options) : []
        })).sort((a, b) => a.sort_order - b.sort_order));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    try {
      await api.post('/formbuilder', { fields });
      alert('Form berhasil disimpan!');
    } catch (err) {
      alert('Gagal menyimpan');
    }
  };

  const addField = (type) => {
    setFields([...fields, {
      id: Date.now().toString(),
      type,
      label: 'Field Baru',
      required: false,
      options: ['select','radio','checkbox'].includes(type) ? ['Pilihan 1'] : []
    }]);
  };

  const updateField = (id, updates) => setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  const deleteField = (id) => setFields(fields.filter(f => f.id !== id));
  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (active.id !== over?.id) {
      setFields(items => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-3xl font-bold text-indigo-600">Memuat...</div>;

//   return JSON.stringify(umkmServices.data);
  return (
    <>
      {/* NAVBAR ATAS — SAMA DENGAN DASHBOARD */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="px-4 py-3 mx-auto max-w-7xl md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-8">
              {navItems.map((item) => (
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

      {/* TOMBOL SIMPAN FLOATING — LEBIH HALUS */}
      {fields.length > 0 && (
        <button onClick={handleSave}
          className="fixed z-50 flex items-center gap-3 py-4 text-lg font-bold text-white transition-all rounded-full shadow-2xl px-7 bg-gradient-to-r from-emerald-500 to-teal-600 bottom-20 right-6 hover:scale-105">
          <Save className="w-6 h-6" /> SIMPAN FORM
        </button>
      )}

      <div className="min-h-screen pb-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 md:pb-6">
        <div className="px-4 py-6 mx-auto max-w-7xl">

          {/* TEMPLATE SELECTION — LEBIH CANTIK */}
          {fields.length === 0 && !previewMode && (
            <div className="py-16 text-center">
                <h1 className="mb-4 text-4xl font-bold text-gray-900">Pilih Template Form Booking</h1>
                <p className="mb-12 text-lg text-gray-600">Langsung mulai dengan template sesuai bisnis Anda</p>
                <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
                {templates.map((tmpl, i) => (
                    <button
                    key={i}
                    onClick={() => {
                        if (tmpl.fields.length === 0) return;
                        const newFields = tmpl.fields.map((f, idx) => ({
                        ...f,
                        id: Date.now() + idx,
                        options: f.options || (['select','radio','checkbox'].includes(f.type) ? ['Pilihan 1'] : [])
                        }));
                        setFields(newFields);
                    }}
                    className={`group relative p-10 bg-white rounded-3xl shadow-xl transition-all duration-300 border-4
                        ${tmpl.fields.length === 0 ? 'border-gray-200 opacity-60 cursor-not-allowed' : 'border-transparent hover:border-indigo-500 hover:scale-110 hover:shadow-2xl place-items-center'}
                    `}
                    disabled={tmpl.fields.length === 0}
                    >
                    <div className="transition-transform group-hover:scale-110">
                        {tmpl.icon}
                    </div>
                    <p className="mt-6 text-lg font-bold text-gray-800">{tmpl.name}</p>
                    {tmpl.fields.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-3xl bg-opacity-90">
                        <p className="text-sm font-medium text-gray-500">Mulai dari Nol</p>
                        </div>
                    )}
                    </button>
                ))}
                </div>
            </div>
            )}

          {/* EDITOR UTAMA */}
          {fields.length > 0 && !previewMode && (
            <>
              <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Form Builder</h1>
                  <p className="text-gray-600">Susun form booking dengan mudah</p>
                </div>
                <button onClick={() => setPreviewMode(true)}
                  className="flex items-center gap-2 px-6 py-3 font-medium text-white transition bg-indigo-600 rounded-xl hover:bg-indigo-700">
                  <Eye className="w-5 h-5" /> Preview Form
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                {/* TOOLBOX KIRI — LEBIH KECIL & CANTIK */}
                <div className="space-y-6">

                    {/* LAYANAN & HARGA — STYLE SAMA PERSIS DENGAN FIELD TAMBAHAN */}
                    {!umkmLoading && umkmServices.length > 0 && (
                    <div className="overflow-hidden shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
                        <button
                        onClick={() => setOpenServices(!openServices)}
                        className="flex items-center justify-between w-full px-6 py-5 transition bg-emerald-100 hover:bg-emerald-200"
                        >
                        <div className="flex items-center gap-3">
                            <DollarSign className="w-6 h-6 text-emerald-700" />
                            <h3 className="text-lg font-bold text-emerald-800">
                            Layanan & Harga ({umkmServices.length})
                            </h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                            to="/umkm/settings"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                            >
                            <Plus className="w-4 h-4" /> Edit
                            </Link>
                            <ChevronDown className={`w-5 h-5 text-emerald-700 transition-transform ${openServices ? 'rotate-180' : ''}`} />
                        </div>
                        </button>

                        {openServices && (
                        <div className="p-4 space-y-3">
                            {umkmServices.map((service, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-4 transition-all bg-white border-2 rounded-xl border-emerald-200 hover:border-emerald-500 hover:shadow-md group"
                            >
                                <div className="flex items-center gap-3">
                                <div className="p-2 transition-colors rounded-lg bg-emerald-100 group-hover:bg-emerald-200">
                                    <CreditCard className="w-5 h-5 text-emerald-700" />
                                </div>
                                <span className="font-medium text-gray-800">{service.name}</span>
                                </div>

                                {/* BADGE HARGA — CANTIK & RINGKAS */}
                                <div className="px-1 py-1 text-[0.50rem] font-bold text-white rounded-full shadow-md bg-gradient-to-r from-emerald-600 to-teal-600">
                                Rp {Number(service.price).toLocaleString('id-ID')}
                                </div>
                            </div>
                            ))}
                        </div>
                        )}
                    </div>
                    )}

                    {/* BELUM ADA LAYANAN — CARD RINGKAS & KONSISTEN */}
                    {!umkmLoading && umkmServices.length === 0 && (
                    <div className="overflow-hidden shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
                        <div className="p-8 text-center">
                        <div className="inline-flex p-4 mb-4 bg-emerald-100 rounded-2xl">
                            <DollarSign className="w-10 h-10 text-emerald-700" />
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-emerald-800">Belum Ada Layanan</h3>
                        <p className="mb-5 text-sm text-emerald-700">Tambahkan layanan di pengaturan</p>
                        <Link
                            to="/umkm/settings"
                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white transition-shadow bg-emerald-600 rounded-xl hover:bg-emerald-700 hover:shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Tambah Layanan
                        </Link>
                        </div>
                    </div>
                    )}

                    {/* 2. FIELD STANDAR */}
                    <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
                        <button onClick={() => setOpenStandard(!openStandard)}
                        className="flex items-center justify-between w-full px-6 py-4 transition bg-gray-50 hover:bg-gray-100">
                        <h3 className="font-bold text-gray-800">Field Standar</h3>
                        <ChevronDown className={`w-5 h-5 transition ${openStandard ? 'rotate-180' : ''}`} />
                        </button>
                        {openStandard && (
                        <div className="p-4 space-y-3">
                            {standardFields.map((f, i) => (
                            <button key={i} onClick={() => addField(f.type)}
                                className="flex items-center w-full gap-3 p-4 transition border-2 border-transparent rounded-xl bg-gray-50 hover:bg-indigo-50 hover:border-indigo-500">
                                {f.icon} <span className="font-medium">{f.label}</span>
                            </button>
                            ))}
                        </div>
                        )}
                    </div>

                    {/* 3. FIELD TAMBAHAN */}
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

                {/* CANVAS — LEBIH BERSIH */}
                <div className="lg:col-span-3">
                  <div className="p-8 bg-white shadow-2xl rounded-3xl min-h-96">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-5">
                          {fields.map(field => (
                            <SortableField key={field.id} field={field} onUpdate={updateField} onDelete={deleteField} />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                    {fields.length === 0 && (
                      <div className="py-20 text-center text-gray-400">
                        <FileText className="w-20 h-20 mx-auto mb-4" />
                        <p className="text-lg">Pilih field dari sebelah kiri</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* PREVIEW MODE — SUPER REALISTIS */}
          {previewMode && (
            <div className="max-w-2xl py-12 mx-auto">
              <button onClick={() => setPreviewMode(false)} className="flex items-center gap-2 mb-6 font-bold text-indigo-600">
                ← Kembali ke Editor
              </button>
              <div className="p-10 bg-white shadow-2xl rounded-3xl">
                <h2 className="mb-10 text-3xl font-bold text-center">Form Booking Pelanggan</h2>
                <div className="space-y-8">
                  {fields.map(f => (
                    <div key={f.id}>
                      <label className="block mb-2 text-lg font-medium">
                        {f.label} {f.required && <span className="text-red-500">*</span>}
                      </label>
                      {f.type === 'textarea' ? <textarea className="w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500" rows="3" placeholder="Ketik di sini..." /> :
                       f.type === 'select' ? <select className="w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-indigo-200"><option>Pilih salah satu</option>{f.options?.map(o => <option key={o}>{o}</option>)}</select> :
                       ['radio','checkbox'].includes(f.type) ? (
                         <div className="space-y-3">
                           {f.options?.map(o => (
                             <label key={o} className="flex items-center gap-3 text-lg">
                               <input type={f.type} name={f.id} className="w-5 h-5" /> <span>{o}</span>
                             </label>
                           ))}
                         </div>
                       ) : <input type={f.type} className="w-full px-5 py-4 border-2 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500" placeholder="Masukkan di sini..." />}
                    </div>
                  ))}
                  <button className="w-full py-5 text-xl font-bold text-white transition bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:shadow-xl">
                    Kirim Booking
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE NAVBAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden">
        <div className="grid grid-cols-3 py-3">
          {navItems.map((item) => (
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
