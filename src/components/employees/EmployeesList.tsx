import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Employee } from '../../types';
import { EmployeeModal } from './EmployeeModal';
import { EmployeeProfileModal } from './EmployeeProfileModal';
import { exportToCSV } from '../../utils/exportUtils';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Building,
  Briefcase,
  Phone,
  Mail,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  List,
  Fingerprint
} from 'lucide-react';

interface EmployeesListProps {
  onOpenQuickPunchFor: (employeeId: string) => void;
}

export const EmployeesList: React.FC<EmployeesListProps> = ({ onOpenQuickPunchFor }) => {
  const { employees, deleteEmployee, settings, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'active' | 'inactive'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const canManage = currentUser.role === 'admin' || currentUser.role === 'hr';

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone.includes(searchTerm) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDept = selectedDepartment === 'ALL' || emp.department === selectedDepartment;
      const matchBranch = selectedBranch === 'ALL' || emp.branch === selectedBranch;
      const matchStatus = selectedStatus === 'ALL' || emp.status === selectedStatus;

      return matchSearch && matchDept && matchBranch && matchStatus;
    });
  }, [employees, searchTerm, selectedDepartment, selectedBranch, selectedStatus]);

  // Handle Excel CSV export
  const handleExportCSV = () => {
    const headers = [
      'الرقم الوظيفي',
      'الاسم الكامل',
      'الرقم القومي (14 رقماً)',
      'الرقم التأميني',
      'البريد الإلكتروني',
      'رقم المحمول',
      'القسم',
      'المسمى الوظيفي',
      'الفرع',
      'تاريخ التعيين',
      'الحالة',
      'المرتب الأساسي (ج.م)'
    ];

    const rows = filteredEmployees.map(emp => [
      emp.code,
      emp.name,
      emp.nationalId || '',
      emp.insuranceNumber || '',
      emp.email,
      emp.phone,
      emp.department,
      emp.position,
      emp.branch,
      emp.hireDate,
      emp.status === 'active' ? 'نشط' : 'غير نشط',
      emp.baseSalary ? `${emp.baseSalary} ج.م` : ''
    ]);

    exportToCSV(`قائمة_الموظفين_${new Date().toISOString().split('T')[0]}`, headers, rows);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>إدارة شؤون الموظفين</span>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full border border-indigo-100">
              {filteredEmployees.length} موظف
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            إضافة وتعديل بيانات الموظفين، تحديد الأقسام والورديات والفروع ومتابعة حالاتهم
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>تصدير Excel (CSV)</span>
          </button>

          {canManage && (
            <button
              onClick={() => {
                setEditingEmployee(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-300 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة موظف جديد</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="البحث بالاسم، الرقم الوظيفي، الهاتف، أو المسمى..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">كافة الأقسام</option>
              {settings.departments.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">كافة الفروع</option>
              {settings.branches.map(b => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">جميع الحالات</option>
              <option value="active">نشط فقط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div>
            يتم عرض <strong className="text-slate-800">{filteredEmployees.length}</strong> من إجمالي {employees.length} موظف
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white shadow-2xs text-indigo-600 font-bold' : 'text-slate-500'
              }`}
              title="عرض الجدول"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white shadow-2xs text-indigo-600 font-bold' : 'text-slate-500'
              }`}
              title="عرض البطاقات"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Employee Content */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-base">لا توجد نتائج مطابقة لبحثك</h3>
          <p className="text-xs text-slate-400 mt-1">
            جرب تغيير معايير التصفية أو مسح عبارة البحث للعثور على الموظفين.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3.5 px-4">الموظف</th>
                  <th className="py-3.5 px-4">الرقم الوظيفي</th>
                  <th className="py-3.5 px-4">القسم / الوظيفة</th>
                  <th className="py-3.5 px-4">الفرع</th>
                  <th className="py-3.5 px-4">بيانات الاتصال</th>
                  <th className="py-3.5 px-4">تاريخ التعيين</th>
                  <th className="py-3.5 px-4">الحالة</th>
                  <th className="py-3.5 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Employee Avatar & Name */}
                    <td className="py-3 px-4">
                      <div
                        onClick={() => setViewingEmployee(emp)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20 group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 text-xs sm:text-sm">
                            {emp.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-sans">{emp.nationalId ? `هوية: ${emp.nationalId}` : ''}</div>
                        </div>
                      </div>
                    </td>

                    {/* Code */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">
                        {emp.code}
                      </span>
                    </td>

                    {/* Department & Position */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">{emp.department}</div>
                      <div className="text-[11px] text-slate-500">{emp.position}</div>
                    </td>

                    {/* Branch */}
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {emp.branch}
                    </td>

                    {/* Contacts */}
                    <td className="py-3 px-4">
                      <div className="text-[11px] font-sans text-slate-600 flex items-center gap-1.5 mb-0.5">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{emp.phone}</span>
                      </div>
                      <div className="text-[11px] font-sans text-slate-400 flex items-center gap-1.5 truncate max-w-[160px]">
                        <Mail className="w-3 h-3 text-indigo-500" />
                        <span>{emp.email}</span>
                      </div>
                    </td>

                    {/* Hire Date */}
                    <td className="py-3 px-4 font-sans text-slate-600">
                      {emp.hireDate}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {emp.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          نشط
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          غير نشط
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewingEmployee(emp)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="عرض الملف الكامل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onOpenQuickPunchFor(emp.id)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="تسجيل حضور أو انصراف"
                        >
                          <Fingerprint className="w-4 h-4" />
                        </button>

                        {canManage && (
                          <>
                            <button
                              onClick={() => {
                                setEditingEmployee(emp);
                                setIsAddModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setEmployeeToDelete(emp)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="حذف الموظف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map(emp => (
            <div
              key={emp.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <h4
                        onClick={() => setViewingEmployee(emp)}
                        className="font-bold text-slate-900 text-sm hover:text-indigo-600 cursor-pointer"
                      >
                        {emp.name}
                      </h4>
                      <span className="font-mono text-[11px] font-bold text-slate-500">
                        {emp.code}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      emp.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}
                  >
                    {emp.status === 'active' ? 'نشط' : 'غير نشط'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">الوظيفة:</span>
                    <span className="font-bold text-slate-800">{emp.position}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">القسم:</span>
                    <span className="font-medium text-slate-700">{emp.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">الفرع:</span>
                    <span className="font-medium text-slate-700">{emp.branch}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">الجوال:</span>
                    <span className="font-sans font-medium text-slate-700">{emp.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewingEmployee(emp)}
                  className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  عرض الملف
                </button>

                <button
                  onClick={() => onOpenQuickPunchFor(emp.id)}
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                  title="تسجيل بصمة"
                >
                  <Fingerprint className="w-4 h-4" />
                </button>

                {canManage && (
                  <>
                    <button
                      onClick={() => {
                        setEditingEmployee(emp);
                        setIsAddModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
                      title="تعديل"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEmployeeToDelete(emp)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingEmployee(null);
        }}
        employeeToEdit={editingEmployee}
      />

      {/* View Profile Dossier Modal */}
      <EmployeeProfileModal
        employee={viewingEmployee}
        onClose={() => setViewingEmployee(null)}
        onEdit={emp => {
          setEditingEmployee(emp);
          setIsAddModalOpen(true);
        }}
        onPunchForEmployee={id => {
          setViewingEmployee(null);
          onOpenQuickPunchFor(id);
        }}
      />

      {/* Delete Confirmation Modal */}
      {employeeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-900 text-lg mb-2">تأكيد حذف الموظف</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              هل أنت متأكد من حذف بيانات الموظف <strong>{employeeToDelete.name}</strong> ({employeeToDelete.code})؟ لن تتمكن من التراجع عن هذه الخطوة.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setEmployeeToDelete(null)}
                className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  deleteEmployee(employeeToDelete.id);
                  setEmployeeToDelete(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-300 transition-colors cursor-pointer"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
