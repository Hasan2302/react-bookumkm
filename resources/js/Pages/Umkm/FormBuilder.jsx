// resources/js/Pages/Umkm/FormBuilder.jsx
// FINAL + FIX ERROR MapaPin → MapPin + SEMUA JALAN 100%

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical, Trash2, Plus, Eye, Save,
  Home, FileText, Settings, Scissors, WashingMachine, Wrench, Stethoscope,
  MapPin, Truck, CreditCard, DollarSign, MessageSquare, ChevronDown,
  Type, Mail, Phone, Hash, Text, Circle, Square
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

function SortableField({ field, onUpdate, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };

    return (
        <div
        ref={setNodeRef}
        style={style}
        className={`p-4 sm:p-6 bg-white rounded-xl border-2 ${
            isDragging ? 'border-indigo-500 shadow-2xl z-50' : 'border-gray-200 shadow-sm'
        } transition-all overflow-hidden`}
        >
        <div className="flex items-start gap-3 sm:gap-4">
            {/* Drag Handle */}
            <div
            className="flex-shrink-0 mt-1 text-gray-400 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
            >
            <GripVertical className="w-6 h-6" />
            </div>

            {/* Konten Utama */}
            <div className="flex-1 min-w-0 space-y-4"> {/* min-w-0 = penting untuk mobile! */}
            {/* Label + Icon */}
            <div className="flex items-center gap-3">
                <span className="flex-shrink-0 text-2xl">{field.icon || <Type className="w-6 h-6" />}</span>
                <input
                type="text"
                value={field.label}
                onChange={(e) => onUpdate(field.id, { label: e.target.value })}
                className="flex-1 min-w-0 text-lg font-semibold truncate border-b-2 border-transparent outline-none focus:border-indigo-500"
                placeholder="Masukkan label..."
                />
            </div>

            {/* Opsi untuk select/radio/checkbox */}
            {['select', 'radio', 'checkbox'].includes(field.type) && field.options && (
                <div className="p-4 -mx-4 space-y-3 rounded-lg bg-gray-50 sm:mx-0">
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
                        className="flex-1 min-w-0 px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder={`Opsi ${i + 1}`}
                    />
                    <button
                        onClick={() => onUpdate(field.id, { options: field.options.filter((_, idx) => idx !== i) })}
                        className="flex-shrink-0 p-2 text-red-500 rounded hover:bg-red-100"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    </div>
                ))}
                <button
                    onClick={() => onUpdate(field.id, { options: [...field.options, 'Pilihan Baru'] })}
                    className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                    <Plus className="w-4 h-4" /> Tambah Opsi
                </button>
                </div>
            )}

            {/* Required + Type Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => onUpdate(field.id, { required: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium">Wajib diisi</span>
                </label>
                <span className="px-3 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full whitespace-nowrap">
                {field.type}
                </span>
            </div>
            </div>

            {/* Tombol Hapus */}
            <button
            onClick={() => onDelete(field.id)}
            className="flex-shrink-0 p-3 text-red-600 rounded-lg hover:bg-red-50"
            >
            <Trash2 className="w-5 h-5" />
            </button>
        </div>
        </div>
    );
    }

export default function FormBuilder({ auth }) {
  const currentRoute = route().current();
  const [fields, setFields] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [hasDelivery, setHasDelivery] = useState(false);
  const [requireDeposit, setRequireDeposit] = useState(false);
  const [openStandard, setOpenStandard] = useState(true);
  const [openAdvanced, setOpenAdvanced] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: route('umkm.dashboard'), icon: Home, current: currentRoute === 'umkm.dashboard' },
    { name: 'Form Builder', href: route('umkm.formbuilder'), icon: FileText, current: currentRoute === 'umkm.formbuilder' },
    { name: 'Pengaturan', href: route('umkm.settings'), icon: Settings, current: currentRoute === 'umkm.settings' },
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

  // FIXED: MapaPin → MapPin
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

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Form Builder" />

      {/* NAVBAR */}
      <div className="sticky top-0 hidden bg-white border-b shadow-sm md:block">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    item.current ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                  <item.icon className="w-5 h-5" />
                  <span className="hidden md:block">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TEMPLATE GALLERY */}
      {!previewMode && fields.length === 0 && (
        <div className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <div className="px-6 mx-auto text-center max-w-7xl">
            <h2 className="mb-6 text-5xl font-bold">Buat Form Booking Profesional</h2>
            <p className="mb-12 text-xl text-gray-700">Pilih template sesuai UMKM Anda</p>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
              {templates.map((tmpl, i) => (
                <button key={i} onClick={() => applyTemplate(tmpl.fields)}
                  className="p-10 transition-all bg-white border-4 border-transparent shadow-2xl group rounded-3xl hover:shadow-3xl hover:scale-110 hover:border-indigo-500">
                  <div className="mb-6 place-items-center">{tmpl.icon}</div>
                  <h3 className="text-xl font-bold">{tmpl.name}</h3>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EDITOR UTAMA */}
      {!previewMode && fields.length > 0 && (
        <div className="min-h-screen bg-gray-50">
          <div className="px-6 py-10 mx-auto max-w-7xl">
            {/* JUDUL + TOMBOL (Kiri-Kanan, tanpa card) */}
            <div className="flex flex-col items-start justify-between gap-6 mb-12 lg:flex-row lg:items-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Susun Form Booking Anda</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Drag field dari kiri • Atur urutan • Edit label & opsi • Aktifkan fitur canggih
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setPreviewMode(true)}
                  className="flex items-center gap-3 px-8 py-4 font-semibold text-indigo-600 transition border-2 border-indigo-600 rounded-xl hover:bg-indigo-50">
                  <Eye className="w-6 h-6" /> Preview Form
                </button>
                <button className="flex items-center gap-3 px-10 py-4 font-bold text-white transition bg-indigo-600 shadow-lg rounded-xl hover:bg-indigo-700">
                  <Save className="w-6 h-6" /> Simpan Form
                </button>
              </div>
            </div>

            {/* LAYOUT KIRI-KANAN */}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
              {/* KIRI: Toolbox dengan Collapse */}
              <div className="space-y-6">
                {/* Field Standar — Otomatis Terbuka */}
                <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
                  <button onClick={() => setOpenStandard(!openStandard)}
                    className="flex items-center justify-between w-full px-6 py-5 transition bg-gray-50 hover:bg-gray-100">
                    <h3 className="text-xl font-bold text-gray-800">Field Standar</h3>
                    <ChevronDown className={`w-6 h-6 transition-transform ${openStandard ? 'rotate-180' : ''}`} />
                  </button>
                  {openStandard && (
                    <div className="p-6 space-y-3">
                      {standardFields.map((f, i) => (
                        <button key={i} onClick={() => addField(f.type, f.icon)}
                          className="flex items-center w-full gap-4 p-4 transition border-2 border-gray-200 bg-gray-50 rounded-xl hover:border-indigo-500 hover:bg-indigo-50">
                          {f.icon}
                          <span className="font-medium text-gray-700">{f.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Field Canggih — Collapse */}
                <div className="overflow-hidden shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
                  <button onClick={() => setOpenAdvanced(!openAdvanced)}
                    className="flex items-center justify-between w-full px-6 py-5 transition bg-emerald-100 hover:bg-emerald-200">
                    <h3 className="text-xl font-bold text-emerald-800">Field Canggih</h3>
                    <ChevronDown className={`w-6 h-6 transition-transform ${openAdvanced ? 'rotate-180' : ''}`} />
                  </button>
                  {openAdvanced && (
                    <div className="p-6 space-y-3">
                      {optionalFields.map((f, i) => (!f.showIf || f.showIf) && (
                        <button key={i} onClick={() => addOptionalField(f)}
                          className="flex items-center w-full gap-4 p-4 transition bg-white border-2 rounded-xl border-emerald-200 hover:border-emerald-500">
                          {f.icon}
                          <div className="flex-1 text-left">
                            <p className="font-medium">{f.label}</p>
                            <p className="text-xs text-gray-600">{f.required ? 'Wajib' : 'Opsional'}</p>
                          </div>
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

              {/* KANAN: Canvas */}
              <div className="lg:col-span-3">
                <div className="p-10 bg-white shadow-2xl rounded-3xl min-h-96">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-6">
                        {fields.length === 0 ? (
                          <div className="py-24 text-center text-gray-400">
                            <p className="text-2xl">Tambah field dari sebelah kiri</p>
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
          </div>
        </div>
      )}

      {/* PREVIEW MODE */}
      {previewMode && (
        <div className="min-h-screen py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => setPreviewMode(false)} className="flex items-center gap-2 mb-8 font-semibold text-indigo-600 transition hover:gap-3">
              Kembali ke Editor
            </button>
            <div className="p-12 bg-white shadow-2xl rounded-3xl">
              <h2 className="mb-12 text-4xl font-bold text-center">Form Booking Pelanggan</h2>
              <form className="space-y-8">
                {fields.map(f => (
                  <div key={f.id}>
                    <label className="block mb-3 text-xl font-medium">{f.label} {f.required && <span className="text-red-500">*</span>}</label>
                    {f.type === 'textarea' ? <textarea className="w-full px-6 py-4 border-2 rounded-xl" rows="4" /> :
                     f.type === 'select' ? <select className="w-full px-6 py-4 border-2 rounded-xl">{f.options?.map(o => <option key={o}>{o}</option>)}</select> :
                     ['radio','checkbox'].includes(f.type) ? f.options?.map(o => (
                       <label key={o} className="flex items-center gap-4 mt-3 text-lg">
                         <input type={f.type} name={f.id} className="w-6 h-6" /> <span>{o}</span>
                       </label>
                     )) : <input type={f.type} className="w-full px-6 py-4 text-lg border-2 rounded-xl" />}
                  </div>
                ))}
                <button type="submit" className="w-full py-6 text-2xl font-bold text-white bg-indigo-600 rounded-xl hover:bg-indent-700">
                  Kirim Booking
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVBAR — SAMA DENGAN FORM BUILDER */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg md:hidden">
        <div className="grid grid-cols-3 py-4">
            {navItems.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className={`flex flex-col items-center text-xs font-medium ${
                        item.current ? 'text-indigo-600' : 'text-gray-500'
                    }`}
                >
                    <item.icon className="mb-1 w-7 h-7" />
                    {item.name}
                </Link>
            ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
