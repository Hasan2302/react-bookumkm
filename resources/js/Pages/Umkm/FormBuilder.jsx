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
import MetronicLayout from '@/Layouts/MetronicLayout';

// ==================== SORTABLE FIELD ====================
function SortableField({ field, onUpdate, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className={`relative p-6 bg-white rounded-xl border ${isDragging ? 'border-primary shadow-lg z-50 scale-[1.02]' : 'border-gray-200 shadow-sm hover:border-gray-300'} transition-all`}>
      <div className="flex items-start gap-4">
        <div className="mt-1 text-gray-400 cursor-grab active:cursor-grabbing hover:text-primary transition-colors" {...attributes} {...listeners}>
          <GripVertical className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-4">
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate(field.id, { label: e.target.value })}
            className="w-full px-0 py-1 text-lg font-bold bg-transparent border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 transition-colors placeholder-gray-300"
            placeholder="Field Label"
          />

            {['select', 'radio', 'checkbox'].includes(field.type) && (
            <div className="p-5 space-y-4 rounded-lg bg-gray-50 border border-gray-100">
                {field.options?.map((opt, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-200 shadow-sm rounded-lg">
                    {/* LABEL OPSI */}
                    <input
                    type="text"
                    value={opt.label}
                    onChange={(e) => {
                        const newOpts = [...field.options];
                        newOpts[i] = { ...newOpts[i], label: e.target.value };
                        onUpdate(field.id, { options: newOpts });
                    }}
                    className="flex-1 px-3 py-2 text-sm font-medium border-gray-200 rounded-md focus:border-primary focus:ring-0"
                    placeholder="Option Name"
                    />

                    {/* INPUT HARGA */}
                    <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">Rp</span>
                    <input
                        type="text"
                        value={opt.price || 0}
                        onChange={(e) => {
                        const newOpts = [...field.options];
                        newOpts[i] = { ...newOpts[i], price: parseInt(e.target.value) || 0 };
                        onUpdate(field.id, { options: newOpts });
                        }}
                        className="px-3 py-2 text-sm border-gray-200 rounded-md w-24 focus:border-success focus:ring-0 text-right"
                        placeholder="0"
                    />
                    </div>

                    {/* TIPE */}
                    <input
                    type="text"
                    value={opt.type || ''}
                    onChange={(e) => {
                        const newOpts = [...field.options];
                        newOpts[i] = { ...newOpts[i], type: e.target.value };
                        onUpdate(field.id, { options: newOpts });
                    }}
                    className="w-24 px-3 py-2 text-xs border-gray-200 rounded-md focus:border-info focus:ring-0"
                    placeholder="Type (opt)"
                    />

                    {/* HAPUS OPSI */}
                    <button
                    onClick={() => onUpdate(field.id, { options: field.options.filter((_, idx) => idx !== i) })}
                    className="p-2 text-gray-400 transition rounded-md hover:bg-danger/10 hover:text-danger">
                    <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                ))}

                {/* TAMBAH OPSI BARU */}
                <button
                onClick={() => onUpdate(field.id, {
                    options: [...(field.options || []), { label: 'New Option', price: 0, type: '' }]
                })}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-primary transition bg-primary/10 rounded-lg hover:bg-primary hover:text-white">
                <Plus className="w-4 h-4" /> Add Option
                </button>
            </div>
            )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer text-gray-600 hover:text-gray-900">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => onUpdate(field.id, { required: e.target.checked })}
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <span>Required</span>
            </label>
            <span className="px-2 py-1 text-[10px] font-bold text-gray-500 bg-gray-100 rounded uppercase tracking-wide">
              {field.type}
            </span>
          </div>
        </div>

        <button onClick={() => onDelete(field.id)} className="p-2 text-gray-400 transition rounded-lg hover:bg-danger/10 hover:text-danger">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// ==================== TEMPLATE PRESETS ====================
const templatePresets = [
  {
    name: 'Salon / Beauty', icon: <Scissors className="text-pink-600 w-8 h-8" />,
    color: 'bg-pink-50', border: 'border-pink-200',
    fields: [
      { type: 'text', label: 'Nama Lengkap', required: true },
      { type: 'phone', label: 'No. WhatsApp', required: true },
      { type: 'select', label: 'Pilih Treatment', required: true, options: ['Cukur Rambut', 'Creambath', 'Coloring', 'Manicure'] },
      { type: 'select', label: 'Pilih Stylist', required: true, options: ['Mas Budi', 'Mbak Sari', 'Mbak Rina'] },
      { type: 'textarea', label: 'Catatan Khusus', required: false },
    ]
  },
  {
    name: 'Laundry', icon: <WashingMachine className="text-blue-600 w-8 h-8" />,
    color: 'bg-blue-50', border: 'border-blue-200',
    fields: [
      { type: 'text', label: 'Nama Pelanggan', required: true },
      { type: 'phone', label: 'No. WhatsApp', required: true },
      { type: 'number', label: 'Berat Cucian (Kg)', required: true },
      { type: 'radio', label: 'Jenis Layanan', required: true, options: ['Cuci Setrika', 'Setrika Saja'] },
    ]
  },
  {
    name: 'Bengkel', icon: <Wrench className="text-gray-700 w-8 h-8" />,
    color: 'bg-gray-50', border: 'border-gray-200',
    fields: [
      { type: 'text', label: 'Nama Pemilik', required: true },
      { type: 'phone', label: 'No. HP', required: true },
      { type: 'text', label: 'No. Polisi Kendaraan', required: true },
      { type: 'textarea', label: 'Keluhan / Masalah', required: true },
    ]
  },
  {
    name: 'Klinik / Dokter', icon: <Stethoscope className="text-red-600 w-8 h-8" />,
    color: 'bg-red-50', border: 'border-red-200',
    fields: [
      { type: 'text', label: 'Nama Pasien', required: true },
      { type: 'phone', label: 'No. WhatsApp', required: true },
      { type: 'select', label: 'Pilih Dokter', required: true, options: ['dr. Siti', 'dr. Budi'] },
      { type: 'textarea', label: 'Keluhan Kesehatan', required: true },
    ]
  },
];

const standardFields = [
    { type: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
    { type: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { type: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4" /> },
    { type: 'number', label: 'Number', icon: <Hash className="w-4 h-4" /> },
    { type: 'textarea', label: 'Textarea', icon: <Text className="w-4 h-4" /> },
    { type: 'select', label: 'Dropdown', icon: <ChevronDown className="w-4 h-4" /> },
    { type: 'radio', label: 'Radio', icon: <Circle className="w-4 h-4" /> },
    { type: 'checkbox', label: 'Checkbox', icon: <Square className="w-4 h-4" /> },
];

const advancedFields = [
    { label: 'Notes', type: 'textarea', icon: <MessageSquare className="w-4 h-4" /> },
    { label: 'Address', type: 'textarea', icon: <Truck className="w-4 h-4" /> },
    { label: 'Payment', type: 'radio', icon: <CreditCard className="w-4 h-4" />, options: ['Tunai', 'QRIS', 'Transfer'] },
    { label: 'Deposit', type: 'number', icon: <DollarSign className="w-4 h-4" /> },
];

// ==================== MAIN COMPONENT ====================
export default function FormBuilder() {
  const [fields, setFields] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openTemplates, setOpenTemplates] = useState(true);
  const [openStandard, setOpenStandard] = useState(true);
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const [openServices, setOpenServices] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { services: umkmServices, loading: umkmLoading } = useUmkmStore();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

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

          loaded.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
          setFields(loaded);
        }
      } catch (err) {
        console.error('Gagal load form:', err);
        setFields([]);
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, []);

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
          : [],
        sort_order: index,
      }));

      await api.post('/formbuilder', { fields: payload });
      alert('Form berhasil disimpan!');
    } catch (err) {
      console.error(err.response?.data);
      alert('Gagal menyimpan: ' + (err.response?.data?.message || 'Cek console'));
    }
  };

  const addField = (type, label = 'New Field', options = [], required = false) => {
    setFields(prev => [...prev, {
      id: 'temp-' + Date.now(),
      type,
      label,
      required,
      options: ['select', 'radio', 'checkbox'].includes(type)
        ? (options.length > 0 ? options : [{ label: 'Option 1', price: 0 }])
        : []
    }]);
  };

  const applyTemplate = (tmpl) => {
    tmpl.fields.forEach((f, i) => {
      setTimeout(() => addField(f.type, f.label, f.options || [], f.required), i * 80);
    });
    alert(`Template "${tmpl.name}" applied!`);
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
    return (
        <MetronicLayout>
            <div className="flex items-center justify-center h-96">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        </MetronicLayout>
    );
  }

  return (
    <MetronicLayout title="Form Builder" breadcrumbs={['Tools', 'Form Builder']}>
      {/* FLOATING SAVE BUTTON */}
      {fields.length > 0 && (
        <button onClick={handleSave}
          className="fixed z-50 flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold text-white transition-all rounded-lg shadow-lg bg-primary bottom-6 sm:bottom-10 right-6 sm:right-10 hover:bg-primary-active hover:shadow-xl">
          <Save className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">SAVE FORM</span><span className="sm:hidden">SAVE</span>
        </button>
      )}

      <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {!previewMode && (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-4">
                {/* TOOLBOX KIRI */}
                <div className="space-y-6">

                  {/* TEMPLATE CEPAT */}
                  <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                    <button onClick={() => setOpenTemplates(!openTemplates)}
                      className="flex items-center justify-between w-full px-6 py-4 transition bg-gray-50 hover:bg-gray-100">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-warning" />
                        <h3 className="font-bold text-gray-800 text-sm">Quick Templates</h3>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition ${openTemplates ? 'rotate-180' : ''}`} />
                    </button>
                    {openTemplates && (
                      <div className="p-4 space-y-3">
                        {templatePresets.map((tmpl, i) => (
                          <button key={i} onClick={() => applyTemplate(tmpl)}
                            className={`w-full p-4 text-left transition-all rounded-lg border border-dashed ${tmpl.border} ${tmpl.color} hover:shadow-md`}>
                            <div className="flex items-center gap-3">
                              {tmpl.icon}
                              <div>
                                <p className="font-bold text-gray-800 text-sm">{tmpl.name}</p>
                                <p className="text-[10px] text-gray-500">{tmpl.fields.length} fields</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* FIELD STANDAR */}
                  <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                    <button onClick={() => setOpenStandard(!openStandard)}
                      className="flex items-center justify-between w-full px-6 py-4 transition bg-gray-50 hover:bg-gray-100">
                      <h3 className="font-bold text-gray-800 text-sm">Standard Fields</h3>
                      <ChevronDown className={`w-4 h-4 transition ${openStandard ? 'rotate-180' : ''}`} />
                    </button>
                    {openStandard && (
                      <div className="p-4 grid grid-cols-2 gap-2">
                        {standardFields.map((f, i) => (
                          <button key={i} onClick={() => addField(f.type, f.label)}
                            className="flex flex-col items-center justify-center gap-2 p-3 transition border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 hover:text-primary">
                            {f.icon} <span className="text-xs font-medium">{f.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* LAYANAN & HARGA */}
                  {!umkmLoading && umkmServices.length > 0 && (
                    <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                      <button onClick={() => setOpenServices(!openServices)}
                        className="flex items-center justify-between w-full px-6 py-4 transition bg-gray-50 hover:bg-gray-100">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-5 h-5 text-success" />
                          <h3 className="text-sm font-bold text-gray-800">Services ({umkmServices.length})</h3>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openServices ? 'rotate-180' : ''}`} />
                      </button>
                      {openServices && (
                        <div className="p-4 space-y-2">
                          {umkmServices.map((s, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                <span className="text-xs font-medium text-gray-700">{s.name}</span>
                              </div>
                              <div className="text-xs font-bold text-success">
                                Rp {Number(s.price).toLocaleString('id-ID')}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                        <button onClick={() => setOpenAdvanced(!openAdvanced)}
                        className="flex items-center justify-between w-full px-6 py-4 transition bg-gray-50 hover:bg-gray-100">
                        <h3 className="font-bold text-gray-800 text-sm">Advanced Fields</h3>
                        <ChevronDown className={`w-4 h-4 transition ${openAdvanced ? 'rotate-180' : ''}`} />
                        </button>
                        {openAdvanced && (
                        <div className="p-4 space-y-2">
                            {advancedFields.map((f, i) => (
                            <button key={i} onClick={() => addField(f.type)}
                                className="flex items-center w-full gap-3 p-3 transition bg-white border border-gray-200 rounded-lg hover:border-primary hover:text-primary">
                                {f.icon} <span className="text-sm font-medium">{f.label}</span>
                            </button>
                            ))}
                        </div>
                        )}
                    </div>
                </div>

                {/* CANVAS KANAN */}
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Form Editor</h2>
                        <button onClick={() => setPreviewMode(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary hover:text-white transition-colors">
                        <Eye className="w-4 h-4" /> Preview
                        </button>
                    </div>

                  <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl min-h-[600px]">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4 max-w-3xl mx-auto">
                          {fields.length === 0 ? (
                            <div className="py-32 text-center text-gray-400">
                              <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-20" />
                              <p className="text-lg font-medium">Your form is empty</p>
                              <p className="text-sm">Select a template or add fields to start</p>
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
          )}

          {/* PREVIEW MODE */}
          {previewMode && (
            <div className="max-w-2xl py-8 mx-auto">
              <button onClick={() => setPreviewMode(false)} className="flex items-center gap-2 mb-6 font-bold text-primary hover:underline">
                ← Back to Editor
              </button>
              <div className="p-8 bg-white shadow-lg rounded-xl border border-gray-100">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-gray-900">Booking Form</h2>
                    <p className="text-gray-500">Please fill out the form below</p>
                </div>
                
                <div className="space-y-6">
                  {fields.map(f => (
                    <div key={f.id}>
                      <label className="block mb-2 text-sm font-bold text-gray-800">
                        {f.label} {f.required && <span className="text-danger">*</span>}
                      </label>
                      {f.type === 'textarea' ? <textarea className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:border-primary focus:ring-0 transition-colors" rows="3" /> :
                       f.type === 'select' ? <select className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:border-primary focus:ring-0 transition-colors"><option>Select...</option>{f.options?.map(o => <option key={o}>{o}</option>)}</select> :
                       ['radio','checkbox'].includes(f.type) ? (
                         <div className="space-y-3">
                           {f.options?.map(o => (
                             <label key={o} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                               <input type={f.type} name={f.id} className="w-4 h-4 text-primary border-gray-300 focus:ring-primary" /> 
                               <span className="text-sm font-medium text-gray-700">{o}</span>
                             </label>
                           ))}
                         </div>
                       ) : <input type={f.type} className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:border-primary focus:ring-0 transition-colors" />}
                    </div>
                  ))}
                  <button className="w-full py-4 text-lg font-bold text-white bg-primary rounded-xl hover:bg-primary-active shadow-lg shadow-primary/30 transition-all mt-8">
                    Submit Booking
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </MetronicLayout>
  );
}
