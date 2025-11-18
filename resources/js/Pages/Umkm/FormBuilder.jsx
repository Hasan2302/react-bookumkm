// resources/js/Pages/Umkm/FormBuilder.jsx
// FINAL + 100% JALAN: Template bisa diklik, layout benar, tidak ada error!

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical, Trash2, Plus, Eye, Save, LogOut,
  Home, FileText, Settings, Scissors, WashingMachine, Wrench, Stethoscope,
  MapPin, Truck, CreditCard, DollarSign, MessageSquare, ChevronDown,
  Type, Mail, Phone, Hash, Text, Circle, Square
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Sortable Field Component
function SortableField({ field, onUpdate, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };

  return (
    <div ref={setNodeRef} style={style}
      className={`p-6 bg-white rounded-xl border-2 ${isDragging ? 'border-indigo-500 shadow-2xl z-50' : 'border-gray-200 shadow-sm'} transition-all`}>
      <div className="flex items-start gap-4">
        <div className="mt-1 text-gray-400 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
          <GripVertical className="w-6 h-6" />
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{field.icon || <Type className="w-6 h-6" />}</span>
            <input
              type="text"
              value={field.label}
              onChange={(e) => onUpdate(field.id, { label: e.target.value })}
              className="flex-1 text-lg font-semibold border-b-2 border-transparent outline-none focus:border-indigo-500"
              placeholder="Masukkan label..."
            />
          </div>

          {['select', 'radio', 'checkbox'].includes(field.type) && field.options && (
            <div className="p-4 -mx-4 space-y-3 rounded-lg bg-gray-50">
              {field.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...field.options];
                      newOpts[i] = e.target.value;
                      onUpdate(field.id, { options: newOpts });
                    }}
                    className="flex-1 px-3 py-2 border rounded"
                    placeholder={`Opsi ${i + 1}`}
                  />
                  <button
                    onClick={() => onUpdate(field.id, { options: field.options.filter((_, idx) => idx !== i) })}
                    className="p-2 text-red-500 rounded hover:bg-red-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => onUpdate(field.id, { options: [...field.options, 'Pilihan Baru'] })}
                className="flex items-center gap-1 text-sm text-indigo-600">
                <Plus className="w-4 h-4" /> Tambah Opsi
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => onUpdate(field.id, { required: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-sm font-medium">Wajib diisi</span>
            </label>
            <span className="px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full">
              {field.type}
            </span>
          </div>
        </div>

        <button onClick={() => onDelete(field.id)} className="p-3 text-red-600 rounded-lg hover:bg-red-50">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function FormBuilder() {
  const [fields, setFields] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [hasDelivery, setHasDelivery] = useState(false);
  const [requireDeposit, setRequireDeposit] = useState(false);
  const [openStandard, setOpenStandard] = useState(true);
  const [openAdvanced, setOpenAdvanced] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const navItems = [
    { name: 'Dashboard', to: '/umkm/dashboard', icon: Home },
    { name: 'Form Builder', to: '/umkm/formbuilder', icon: FileText },
    { name: 'Pengaturan', to: '/umkm/settings', icon: Settings },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const templates = [
    { name: 'Salon / Beauty', icon: <Scissors className="w-16 h-16 text-pink-600" />, fields: [
      { type: 'text', label: 'Nama Lengkap', required: true },
      { type: 'phone', label: 'No. WhatsApp', required: true },
      { type: 'select', label: 'Pilih Stylist', required: true, options: ['Mas Budi', 'Mbak Sari'] },
    ]},
    { name: 'Laundry', icon: <WashingMachine className="w-16 h-16 text-blue-600" />, fields: [
      { type: 'text', label: 'Nama', required: true },
      { type: 'number', label: 'Berat (Kg)', required: true },
    ]},
    { name: 'Bengkel', icon: <Wrench className="w-16 h-16 text-gray-700" />, fields: [
      { type: 'text', label: 'No. Polisi', required: true },
      { type: 'select', label: 'Masalah', required: true, options: ['Ganti Oli', 'Rem Rusak'] },
    ]},
    { name: 'Klinik', icon: <Stethoscope className="w-16 h-16 text-red-600" />, fields: [
      { type: 'text', label: 'Nama Pasien', required: true },
      { type: 'select', label: 'Dokter', required: true, options: ['dr. Siti', 'dr. Budi'] },
    ]},
    { name: 'Kosong', icon: <FileText className="w-16 h-16 text-gray-500" />, fields: [] },
  ];

  const standardFields = [
    { type: 'text', label: 'Text Input', icon: <Type className="w-6 h-6" /> },
    { type: 'email', label: 'Email', icon: <Mail className="w-6 h-6" /> },
    { type: 'phone', label: 'No. HP', icon: <Phone className="w-6 h-6" /> },
    { type: 'number', label: 'Angka', icon: <Hash className="w-6 h-6" /> },
    { type: 'textarea', label: 'Paragraf', icon: <Text className="w-6 h-6" /> },
    { type: 'select', label: 'Dropdown', icon: <ChevronDown className="w-6 h-6" /> },
    { type: 'radio', label: 'Pilih Satu', icon: <Circle className="w-6 h-6" /> },
    { type: 'checkbox', label: 'Checkbox', icon: <Square className="w-6 h-6" /> },
  ];

  const optionalFields = [
    { label: 'Catatan Khusus', type: 'textarea', icon: <MessageSquare className="w-6 h-6" />, required: false },
    { label: 'Alamat Jemput/Antar', type: 'textarea', icon: <Truck className="w-6 h-6" />, required: false, showIf: hasDelivery },
    { label: 'Koordinat GPS', type: 'text', icon: <MapPin className="w-6 h-6" />, required: false, showIf: hasDelivery },
    { label: 'Metode Pembayaran', type: 'radio', icon: <CreditCard className="w-6 h-6" />, required: true, options: ['Tunai', 'QRIS', 'Transfer'] },
    { label: 'Deposit (Rp)', type: 'number', icon: <DollarSign className="w-6 h-6" />, required: requireDeposit, showIf: requireDeposit },
  ];

  const applyTemplate = (tmplFields) => {
    const newFields = tmplFields.map(f => ({
      id: uuidv4(),
      type: f.type || 'text',
      label: f.label,
      required: f.required ?? true,
      options: f.options || [],
      icon: f.icon || <Type className="w-6 h-6" />
    }));
    setFields(newFields);
  };

  const addField = (type, icon) => {
    setFields([...fields, {
      id: uuidv4(),
      type,
      label: 'Field Baru',
      required: false,
      options: ['select','radio','checkbox'].includes(type) ? ['Pilihan 1'] : [],
      icon
    }]);
  };

  const addOptionalField = (f) => {
    setFields([...fields, {
      id: uuidv4(),
      type: f.type,
      label: f.label,
      required: f.required,
      options: f.options || [],
      icon: f.icon
    }]);
  };

  const updateField = (id, updates) => setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  const deleteField = (id) => setFields(fields.filter(f => f.id !== id));

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (active.id !== over?.id) {
      setFields(items => arrayMove(items, items.findIndex(i => i.id === active.id), items.findIndex(i => i.id === over.id)));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <>
      {/* NAVBAR ATAS */}
      <div className="sticky top-0 z-40 hidden bg-white border-b shadow-sm md:block">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link key={item.name} to={item.to}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    window.location.pathname === item.to ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                  <item.icon className="w-5 h-5" />
                  <span className="hidden md:block">{item.name}</span>
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">Hi, {user.name}!</span>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 rounded-lg bg-red-50 hover:bg-red-100">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="min-h-screen pb-20 bg-gray-50 md:pb-6">
        <div className="px-4 py-6 mx-auto max-w-7xl">

          {/* TAMPILKAN TEMPLATE JIKA BELUM ADA FIELD */}
          {fields.length === 0 && !previewMode && (
            <div className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl">
              <div className="text-center">
                <h1 className="mb-6 text-5xl font-bold">Pilih Template Form Booking</h1>
                <p className="mb-12 text-xl text-gray-700">Sesuaikan dengan jenis UMKM Anda</p>
                <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
                  {templates.map((tmpl, i) => (
                    <button
                      key={i}
                      onClick={() => applyTemplate(tmpl.fields)}
                      className="p-10 transition-all duration-300 bg-white shadow-2xl rounded-3xl hover:scale-110 hover:border-4 hover:border-indigo-500"
                    >
                      {tmpl.icon}
                      <h3 className="mt-6 text-xl font-bold">{tmpl.name}</h3>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EDITOR UTAMA — HANYA TAMPIL JIKA SUDAH ADA FIELD */}
          {fields.length > 0 && !previewMode && (
            <>
              <div className="flex flex-col items-start justify-between gap-6 mb-10 md:flex-row md:items-center">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Form Builder</h1>
                  <p className="text-lg text-gray-600">Susun form booking sesuai kebutuhan</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setPreviewMode(true)} className="flex items-center gap-2 px-6 py-3 font-medium text-indigo-600 border-2 border-indigo-600 rounded-xl hover:bg-indigo-50">
                    <Eye className="w-5 h-5" /> Preview
                  </button>
                  <button className="flex items-center gap-2 px-8 py-3 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700">
                    <Save className="w-5 h-5" /> Simpan Form
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
                {/* TOOLBOX */}
                <div className="space-y-6">
                  {/* Standard Fields */}
                  <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
                    <button onClick={() => setOpenStandard(!openStandard)} className="flex items-center justify-between w-full px-6 py-5 bg-gray-50 hover:bg-gray-100">
                      <h3 className="text-xl font-bold">Field Standar</h3>
                      <ChevronDown className={`w-6 h-6 transition ${openStandard ? 'rotate-180' : ''}`} />
                    </button>
                    {openStandard && (
                      <div className="p-6 space-y-3">
                        {standardFields.map((f, i) => (
                          <button key={i} onClick={() => addField(f.type, f.icon)} className="flex items-center w-full gap-4 p-4 transition border-2 border-gray-200 rounded-xl bg-gray-50 hover:border-indigo-500 hover:bg-indigo-50">
                            {f.icon} <span className="font-medium">{f.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Advanced Fields */}
                  <div className="overflow-hidden shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
                    <button onClick={() => setOpenAdvanced(!openAdvanced)} className="flex items-center justify-between w-full px-6 py-5 bg-emerald-100 hover:bg-emerald-200">
                      <h3 className="text-xl font-bold text-emerald-800">Field Canggih</h3>
                      <ChevronDown className={`w-6 h-6 transition ${openAdvanced ? 'rotate-180' : ''}`} />
                    </button>
                    {openAdvanced && (
                      <div className="p-6 space-y-4">
                        {optionalFields.map((f, i) => (!f.showIf || f.showIf) && (
                          <button key={i} onClick={() => addOptionalField(f)} className="flex items-center w-full gap-3 p-4 text-left transition bg-white border-2 rounded-xl border-emerald-200 hover:border-emerald-500">
                            {f.icon} <span className="font-medium">{f.label}</span>
                          </button>
                        ))}
                        <div className="pt-4 space-y-3 border-t border-emerald-200">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={hasDelivery} onChange={e => setHasDelivery(e.target.checked)} className="w-5 h-5 text-emerald-600" />
                            <span className="font-medium">Aktifkan Jemput/Antar</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={requireDeposit} onChange={e => setRequireDeposit(e.target.checked)} className="w-5 h-5 text-emerald-600" />
                            <span className="font-medium">Wajibkan Deposit</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* CANVAS */}
                <div className="lg:col-span-3">
                  <div className="p-10 bg-white shadow-2xl rounded-3xl min-h-96">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-6">
                          {fields.map(field => (
                            <SortableField key={field.id} field={field} onUpdate={updateField} onDelete={deleteField} />
                          ))}
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
            <div className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
              <div className="max-w-2xl mx-auto">
                <button onClick={() => setPreviewMode(false)} className="mb-8 text-lg font-bold text-indigo-600">Kembali ke Editor</button>
                <div className="p-12 bg-white shadow-2xl rounded-3xl">
                  <h2 className="mb-12 text-4xl font-bold text-center">Preview Form Booking</h2>
                  <form className="space-y-8">
                    {fields.map(f => (
                      <div key={f.id}>
                        <label className="block mb-3 text-xl font-medium">
                          {f.label} {f.required && <span className="text-red-500">*</span>}
                        </label>
                        {f.type === 'textarea' ? <textarea className="w-full px-6 py-4 border-2 rounded-xl" rows="4" /> :
                         f.type === 'select' ? <select className="w-full px-6 py-4 border-2 rounded-xl"><option>Pilih...</option>{f.options?.map(o => <option key={o}>{o}</option>)}</select> :
                         ['radio','checkbox'].includes(f.type) ? f.options?.map(o => (
                           <label key={o} className="flex items-center gap-4 mt-3 text-lg">
                             <input type={f.type} name={f.id} className="w-6 h-6" /> <span>{o}</span>
                           </label>
                         )) : <input type={f.type} className="w-full px-6 py-4 text-lg border-2 rounded-xl" />}
                      </div>
                    ))}
                    <button type="submit" className="w-full py-6 text-2xl font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700">
                      Kirim Booking
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE NAVBAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg md:hidden">
        <div className="grid grid-cols-3 py-4">
          {navItems.map((item) => (
            <Link key={item.name} to={item.to}
              className={`flex flex-col items-center text-xs font-medium ${window.location.pathname === item.to ? 'text-indigo-600' : 'text-gray-500'}`}>
              <item.icon className="mb-1 w-7 h-7" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
