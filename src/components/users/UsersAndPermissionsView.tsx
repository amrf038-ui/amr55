import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SystemUser, UserRole } from '../../types';
import {
  ShieldCheck,
  UserPlus,
  Edit,
  Trash2,
  Check,
  X,
  Shield,
  Briefcase,
  Users,
  User,
  ArrowRightLeft,
  Lock,
  Mail
} from 'lucide-react';

export const UsersAndPermissionsView: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, currentUser, setCurrentUser, switchRole } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'hr' as UserRole,
    status: 'active' as 'active' | 'inactive',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'hr',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: SystemUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }
    setIsModalOpen(false);
  };

  // RBAC Matrix
  const permissionsMatrix = [
    { feature: 'لوحة التحكم والإحصائيات الحية', admin: true, hr: true, manager: true, employee: true },
    { feature: 'إدارة وتعديل بيانات الموظفين', admin: true, hr: true, manager: false, employee: false },
    { feature: 'تسجيل وتعديل الحضور اليدوي', admin: true, hr: true, manager: false, employee: false },
    { feature: 'اعتماد ورفض طلبات الإجازات', admin: true, hr: true, manager: true, employee: false },
    { feature: 'إنشاء وتعديل الورديات', admin: true, hr: true, manager: false, employee: false },
    { feature: 'استخراج وتصدير التقارير الرسمية', admin: true, hr: true, manager: true, employee: false },
    { feature: 'إدارة المستخدمين والأدوار', admin: true, hr: false, manager: false, employee: false },
    { feature: 'سجل العمليات والتدقيق (Audit Logs)', admin: true, hr: true, manager: false, employee: false },
    { feature: 'إعدادات المنشأة وربط البصمة', admin: true, hr: false, manager: false, employee: false }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <span>المستخدمون ونظام الصلاحيات (RBAC)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            إدارة حسابات مستخدمي النظام وتحديد مستويات الأذونات والصلاحيات بدقة لحماية البيانات الحساسة
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-300 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة مستخدم جديد</span>
        </button>
      </div>

      {/* Users List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">حسابات المستخدمين النشطة</h3>
          <span className="text-xs text-slate-500">{users.length} مستخدمين</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-4">المستخدم</th>
                <th className="py-3 px-4">البريد الإلكتروني</th>
                <th className="py-3 px-4">الدور والصلاحية</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4">آخر دخول</th>
                <th className="py-3 px-4 text-center">إجراءات واختبار</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/20" />
                      <div>
                        <div className="font-bold text-slate-900">{u.name}</div>
                        {currentUser.id === u.id && (
                          <span className="text-[10px] text-emerald-600 font-bold">
                            (أنت مسجل الدخول به حالياً)
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-sans text-slate-600">{u.email}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        u.role === 'admin'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : u.role === 'hr'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          : u.role === 'manager'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}
                    >
                      {u.role === 'admin' && 'مدير النظام (Admin)'}
                      {u.role === 'hr' && 'مسؤول الموارد البشرية'}
                      {u.role === 'manager' && 'مدير قسم'}
                      {u.role === 'employee' && 'موظف'}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold">
                      نشط
                    </span>
                  </td>

                  <td className="py-3 px-4 font-sans text-slate-500 text-[11px]">{u.lastLogin || 'الآن'}</td>

                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setCurrentUser(u)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          currentUser.id === u.id
                            ? 'bg-slate-100 text-slate-400 cursor-default'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>{currentUser.id === u.id ? 'الجلسة الحالية' : 'تسجيل دخول به'}</span>
                      </button>

                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {users.length > 1 && (
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix Comparison Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6">
        <div className="mb-4">
          <h3 className="font-bold text-slate-900 text-base">مصفوفة الصلاحيات حسب مستوى المستخدم (Permissions Matrix)</h3>
          <p className="text-xs text-slate-500">مقارنة واضحة للصلاحيات المخولة لكل دور لمنع الوصول للبيانات الحساسة</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3 px-4">الوظيفة / الصلاحية</th>
                <th className="py-3 px-4 text-center">مدير النظام</th>
                <th className="py-3 px-4 text-center">مسؤول HR</th>
                <th className="py-3 px-4 text-center">مدير القسم</th>
                <th className="py-3 px-4 text-center">الموظف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-800">{item.feature}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex p-1 rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.hr ? (
                      <span className="inline-flex p-1 rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-full bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.manager ? (
                      <span className="inline-flex p-1 rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-full bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.employee ? (
                      <span className="inline-flex p-1 rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-full bg-slate-100 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-slate-900 text-base mb-4">
              {editingUser ? 'تعديل بيانات المستخدم والصلاحية' : 'إضافة مستخدم جديد'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full font-sans px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">مستوى الصلاحية (الدور)</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="admin">مدير النظام (كامل الصلاحيات والإعدادات)</option>
                  <option value="hr">مسؤول الموارد البشرية (الموظفين، الحضور، الإجازات)</option>
                  <option value="manager">مدير القسم (الموافقة على إجازات القسم)</option>
                  <option value="employee">الموظف (تسجيل حضور وعرض ملفه فقط)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  حفظ الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
