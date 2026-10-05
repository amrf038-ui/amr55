import React, { useState } from 'react';
import { Employee, AttendanceRecord, LeaveRequest } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Briefcase,
  Mail,
  Phone,
  Building,
  Calendar,
  CreditCard,
  Clock,
  Fingerprint,
  CalendarDays,
  ShieldCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface EmployeeProfileModalProps {
  employee: Employee | null;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
  onPunchForEmployee: (employeeId: string) => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  employee,
  onClose,
  onEdit,
  onPunchForEmployee
}) => {
  const { attendance, leaveRequests, leaveBalances, shifts } = useApp();
  const [activeTab, setActiveTab] = useState<'info' | 'attendance' | 'leaves'>('info');

  if (!employee) return null;

  const empShift = shifts.find(s => s.id === employee.shiftId);
  const empAttendance = attendance.filter(a => a.employeeId === employee.id);
  const empLeaves = leaveRequests.filter(l => l.employeeId === employee.id);
  const balance = leaveBalances[employee.id] || {
    employeeId: employee.id,
    annualTotal: 30,
    annualUsed: 0,
    sickTotal: 15,
    sickUsed: 0,
    emergencyTotal: 5,
    emergencyUsed: 0
  };

  const remainingAnnual = Math.max(0, balance.annualTotal - balance.annualUsed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-right">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 border border-white/15">
                  {employee.code}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    employee.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {employee.status === 'active' ? '● موظف نشط' : '● غير نشط'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white">{employee.name}</h2>
              <p className="text-indigo-200 text-sm mt-0.5">{employee.position}</p>

              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-indigo-200/80">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{employee.department}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{employee.branch}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>التعيين: {employee.hireDate}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col gap-2">
              <button
                onClick={() => onPunchForEmployee(employee.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Fingerprint className="w-4 h-4" />
                <span>تسجيل بصمة</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onEdit(employee);
                }}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-colors cursor-pointer"
              >
                تعديل البيانات
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'info'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-indigo-200 hover:text-white hover:bg-white/10'
              }`}
            >
              البيانات الشخصية والتعاقدية
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'attendance'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-indigo-200 hover:text-white hover:bg-white/10'
              }`}
            >
              سجل الحضور ({empAttendance.length})
            </button>
            <button
              onClick={() => setActiveTab('leaves')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'leaves'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-indigo-200 hover:text-white hover:bg-white/10'
              }`}
            >
              رصيد الإجازات والطلبات
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-semibold text-slate-400 mb-1">البريد الإلكتروني</div>
                  <div className="text-sm font-bold text-slate-900 font-sans flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    <span>{employee.email}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-semibold text-slate-400 mb-1">رقم الجوال</div>
                  <div className="text-sm font-bold text-slate-900 font-sans flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>{employee.phone}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-semibold text-slate-400 mb-1">الرقم القومي المصري (14 رقماً)</div>
                  <div className="text-sm font-bold text-slate-900 font-sans flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    <span>{employee.nationalId || 'غير محدد'}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-semibold text-slate-400 mb-1">الرقم التأميني (التأمينات الاجتماعية)</div>
                  <div className="text-sm font-bold text-slate-900 font-sans flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>{employee.insuranceNumber || 'غير مسجل'}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-semibold text-slate-400 mb-1">المرتب الأساسي (شهرياً)</div>
                  <div className="text-sm font-bold text-slate-900 font-sans">
                    {employee.baseSalary ? `${employee.baseSalary.toLocaleString('ar-EG')} ج.م` : 'غير محدد'}
                  </div>
                </div>
              </div>

              {/* Shift info box */}
              <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
                <h4 className="font-bold text-sm text-indigo-950 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>الوردية المعينة وساعات العمل</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">اسم الوردية:</span>
                    <span className="font-bold text-slate-800">{empShift?.name || 'الافتراضية'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">ساعات الدوام:</span>
                    <span className="font-bold text-slate-800 font-sans">
                      {empShift?.startTime} - {empShift?.endTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">فترة السماح بالتأخير:</span>
                    <span className="font-bold text-emerald-700">{empShift?.gracePeriodMins || 15} دقيقة</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-3">
              {empAttendance.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  لا توجد حركات حضور مسجلة لهذا الموظف
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                        <th className="py-2.5 px-3">التاريخ</th>
                        <th className="py-2.5 px-3">وقت الحضور</th>
                        <th className="py-2.5 px-3">وقت الانصراف</th>
                        <th className="py-2.5 px-3">ساعات العمل</th>
                        <th className="py-2.5 px-3">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {empAttendance.map(rec => (
                        <tr key={rec.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-sans font-bold text-slate-800">
                            {rec.date}
                          </td>
                          <td className="py-2.5 px-3 font-sans">
                            {rec.checkIn || '-'}
                          </td>
                          <td className="py-2.5 px-3 font-sans">
                            {rec.checkOut || '-'}
                          </td>
                          <td className="py-2.5 px-3 font-sans font-bold text-indigo-700">
                            {rec.workHours ? `${rec.workHours} س` : '-'}
                          </td>
                          <td className="py-2.5 px-3">
                            {rec.status === 'present' && (
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                                حاضر
                              </span>
                            )}
                            {rec.status === 'late' && (
                              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                                متأخر ({rec.lateMinutes} د)
                              </span>
                            )}
                            {rec.status === 'absent' && (
                              <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold">
                                غياب
                              </span>
                            )}
                            {rec.status === 'leave' && (
                              <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold">
                                إجازة
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'leaves' && (
            <div className="space-y-6">
              {/* Balances widgets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-center">
                  <span className="text-xs font-bold text-indigo-900 block mb-1">الرصيد السنوي المتبقي</span>
                  <span className="text-2xl font-black text-indigo-700 font-sans">{remainingAnnual}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">من {balance.annualTotal} يوم اعتيادي</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 text-center">
                  <span className="text-xs font-bold text-amber-900 block mb-1">الإجازات العارضة المتبقية</span>
                  <span className="text-2xl font-black text-amber-700 font-sans">{Math.max(0, balance.emergencyTotal - balance.emergencyUsed)}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">من أصل {balance.emergencyTotal} أيام قانونية</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                  <span className="text-xs font-bold text-emerald-900 block mb-1">إجازات سنوية مستهلكة</span>
                  <span className="text-2xl font-black text-emerald-700 font-sans">{balance.annualUsed}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">أيام معتمدة</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-center">
                  <span className="text-xs font-bold text-purple-900 block mb-1">الإجازات المرضية</span>
                  <span className="text-2xl font-black text-purple-700 font-sans">{balance.sickUsed}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">من رصيد {balance.sickTotal} يوم</span>
                </div>
              </div>

              {/* Requests history */}
              <div>
                <h4 className="font-bold text-sm text-slate-800 mb-3">سجل طلبات الإجازات السابقة</h4>
                {empLeaves.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    لا توجد طلبات إجازة مسجلة
                  </div>
                ) : (
                  <div className="space-y-2">
                    {empLeaves.map(leave => (
                      <div
                        key={leave.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">
                            إجازة {leave.leaveType === 'annual' ? 'سنوية' : 'طارئة'} ({leave.daysCount} أيام)
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            الفترة: من {leave.startDate} إلى {leave.endDate}
                          </div>
                          {leave.reason && (
                            <div className="text-slate-400 text-[10px] mt-1">السبب: {leave.reason}</div>
                          )}
                        </div>
                        <div>
                          {leave.status === 'approved' && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                              معتمدة
                            </span>
                          )}
                          {leave.status === 'pending' && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">
                              قيد المراجعة
                            </span>
                          )}
                          {leave.status === 'rejected' && (
                            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold">
                              مرفوضة
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
