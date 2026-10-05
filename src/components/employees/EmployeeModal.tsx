import React, { useState, useEffect } from 'react';
import { Employee, Shift } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, Save, Image, Building2, Briefcase, Calendar, Phone, Mail, CreditCard, Shield } from 'lucide-react';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: Employee | null;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534751516642-a171ed292022?w=150&auto=format&fit=crop&q=80'
];

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  employeeToEdit
}) => {
  const { addEmployee, updateEmployee, settings, shifts, employees } = useApp();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    email: '',
    phone: '',
    nationalId: '',
    insuranceNumber: '',
    department: '',
    position: '',
    branch: '',
    hireDate: new Date().toISOString().split('T')[0],
    status: 'active' as 'active' | 'inactive',
    avatar: PRESET_AVATARS[0],
    shiftId: shifts[0]?.id || 'shift-1',
    baseSalary: 18000,
    gender: 'male' as 'male' | 'female'
  });

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        code: employeeToEdit.code,
        name: employeeToEdit.name,
        email: employeeToEdit.email,
        phone: employeeToEdit.phone,
        nationalId: employeeToEdit.nationalId || '',
        insuranceNumber: employeeToEdit.insuranceNumber || '',
        department: employeeToEdit.department,
        position: employeeToEdit.position,
        branch: employeeToEdit.branch,
        hireDate: employeeToEdit.hireDate,
        status: employeeToEdit.status,
        avatar: employeeToEdit.avatar,
        shiftId: employeeToEdit.shiftId || shifts[0]?.id || 'shift-1',
        baseSalary: employeeToEdit.baseSalary || 18000,
        gender: employeeToEdit.gender || 'male'
      });
    } else {
      // Auto-suggest next employee code
      const nextNum = employees.length + 1001;
      setFormData({
        code: `EMP-${nextNum}`,
        name: '',
        email: '',
        phone: '01',
        nationalId: '',
        insuranceNumber: '',
        department: settings.departments[0] || 'تكنولوجيا المعلومات والتحول الرقمي',
        position: '',
        branch: settings.branches[0] || 'المقر الرئيسي - القرية الذكية (الجيزة)',
        hireDate: new Date().toISOString().split('T')[0],
        status: 'active',
        avatar: PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)],
        shiftId: shifts[0]?.id || 'shift-1',
        baseSalary: 20000,
        gender: 'male'
      });
    }
  }, [employeeToEdit, isOpen, settings, shifts, employees.length]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      alert('يرجى ملء اسم الموظف ورقمه الوظيفي');
      return;
    }

    if (employeeToEdit) {
      updateEmployee(employeeToEdit.id, formData);
    } else {
      addEmployee(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              {employeeToEdit ? <Briefcase className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {employeeToEdit ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد إلى المنظومة'}
              </h3>
              <p className="text-xs text-indigo-200">
                أدخل كافة البيانات الشخصية والمهنية للموظف بدقة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              صورة الموظف الشخصية
            </label>
            <div className="flex items-center gap-4">
              <img
                src={formData.avatar}
                alt="Selected"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md"
              />
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: av })}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        formData.avatar === av
                          ? 'border-indigo-600 scale-105 ring-2 ring-indigo-300'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  placeholder="أو ضع رابط صورة مخصص (URL)"
                  value={formData.avatar}
                  onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الاسم الرباعي <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: م. أحمد عبد الله الغامدي"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Employee Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الرقم الوظيفي <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="EMP-1010"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                className="w-full font-sans px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                البريد الإلكتروني العملي <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="name@nile-tech.com.eg"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full font-sans px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رقم المحمول المصري <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="01XXXXXXXXX"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full font-sans px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* National ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الرقم القومي المصري (14 رقماً)
              </label>
              <input
                type="text"
                maxLength={14}
                placeholder="29XXXXXXXXXXXX"
                value={formData.nationalId}
                onChange={e => setFormData({ ...formData, nationalId: e.target.value })}
                className="w-full font-sans px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Social Insurance Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الرقم التأميني (التأمينات الاجتماعية)
              </label>
              <input
                type="text"
                placeholder="مثال: 18923451"
                value={formData.insuranceNumber}
                onChange={e => setFormData({ ...formData, insuranceNumber: e.target.value })}
                className="w-full font-sans px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                المسمى الوظيفي <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: مطور برمجيات / أخصائي تسويق"
                value={formData.position}
                onChange={e => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                القسم الإداري
              </label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-indigo-500"
              >
                {settings.departments.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الفرع ومقر العمل
              </label>
              <select
                value={formData.branch}
                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-indigo-500"
              >
                {settings.branches.map(b => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Shift Assignment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الوردية المعتمدة
              </label>
              <select
                value={formData.shiftId}
                onChange={e => setFormData({ ...formData, shiftId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-indigo-500"
              >
                {shifts.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.startTime} - {s.endTime})
                  </option>
                ))}
              </select>
            </div>

            {/* Hire Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                تاريخ التعيين والالتحاق
              </label>
              <input
                type="date"
                value={formData.hireDate}
                onChange={e => setFormData({ ...formData, hireDate: e.target.value })}
                className="w-full font-sans px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Base Salary */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                المرتب الأساسي (جنيه مصري - ج.م)
              </label>
              <input
                type="number"
                value={formData.baseSalary}
                onChange={e => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
                className="w-full font-sans px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                حالة الموظف
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="active">نشط (على رأس العمل)</option>
                <option value="inactive">غير نشط (معلق / في إجازة غير مدفوعة / مستقيل)</option>
              </select>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-300 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{employeeToEdit ? 'حفظ التعديلات' : 'إضافة الموظف الآن'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
