import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LeaveRequest, LeaveType } from '../../types';
import { exportToCSV } from '../../utils/exportUtils';
import {
  CalendarDays,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  Download,
  AlertCircle,
  FileText,
  User,
  HeartPulse,
  Sparkles,
  X
} from 'lucide-react';

export const LeavesView: React.FC = () => {
  const {
    leaveRequests,
    employees,
    leaveBalances,
    submitLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    currentUser
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'pending' | 'approved' | 'rejected'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | LeaveType>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // New Leave Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newRequestForm, setNewRequestForm] = useState({
    employeeId: currentUser.employeeId || employees[0]?.id || '',
    leaveType: 'annual' as LeaveType,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: ''
  });

  // Review Modal (Approve / Reject)
  const [reviewingRequest, setReviewingRequest] = useState<LeaveRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewNotes, setReviewNotes] = useState('');

  const canApprove = currentUser.role === 'admin' || currentUser.role === 'hr' || currentUser.role === 'manager';

  // Calculate days difference
  const calculatedDays = useMemo(() => {
    try {
      const start = new Date(newRequestForm.startDate);
      const end = new Date(newRequestForm.endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  }, [newRequestForm.startDate, newRequestForm.endDate]);

  // Selected employee leave balance
  const currentEmpId = currentUser.role === 'employee' ? currentUser.employeeId : newRequestForm.employeeId;
  const currentEmpBalance = currentEmpId ? leaveBalances[currentEmpId] : null;

  // Filter requests
  const filteredRequests = useMemo(() => {
    return leaveRequests.filter(req => {
      // If employee, show only own requests
      if (currentUser.role === 'employee' && currentUser.employeeId) {
        if (req.employeeId !== currentUser.employeeId) return false;
      }

      const matchStatus = statusFilter === 'ALL' || req.status === statusFilter;
      const matchType = typeFilter === 'ALL' || req.leaveType === typeFilter;
      const matchSearch =
        req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchTerm.toLowerCase());

      return matchStatus && matchType && matchSearch;
    });
  }, [leaveRequests, currentUser, statusFilter, typeFilter, searchTerm]);

  // Handle submit leave request
  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === newRequestForm.employeeId);
    if (!emp) return;

    submitLeaveRequest({
      employeeId: emp.id,
      employeeName: emp.name,
      employeeCode: emp.code,
      department: emp.department,
      leaveType: newRequestForm.leaveType,
      startDate: newRequestForm.startDate,
      endDate: newRequestForm.endDate,
      daysCount: calculatedDays,
      reason: newRequestForm.reason
    });

    setIsNewModalOpen(false);
    setNewRequestForm({
      employeeId: currentUser.employeeId || employees[0]?.id || '',
      leaveType: 'annual',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      reason: ''
    });
  };

  const handleConfirmReview = () => {
    if (!reviewingRequest) return;
    if (reviewAction === 'approve') {
      approveLeaveRequest(reviewingRequest.id, reviewNotes);
    } else {
      rejectLeaveRequest(reviewingRequest.id, reviewNotes);
    }
    setReviewingRequest(null);
    setReviewNotes('');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'الرقم الوظيفي',
      'اسم الموظف',
      'القسم',
      'نوع الإجازة',
      'تاريخ البداية',
      'تاريخ النهاية',
      'عدد الأيام',
      'السبب',
      'الحالة',
      'تاريخ التقديم',
      'ملاحظات المعتمد'
    ];

    const rows = filteredRequests.map(r => [
      r.employeeCode,
      r.employeeName,
      r.department,
      r.leaveType === 'annual'
        ? 'سنوية'
        : r.leaveType === 'sick'
        ? 'مرضية'
        : r.leaveType === 'emergency'
        ? 'طارئة'
        : 'أخرى',
      r.startDate,
      r.endDate,
      r.daysCount,
      r.reason,
      r.status === 'approved' ? 'معتمدة' : r.status === 'rejected' ? 'مرفوضة' : 'قيد المراجعة',
      r.appliedAt,
      r.reviewNotes || ''
    ]);

    exportToCSV(`طلبات_الإجازات_${new Date().toISOString().split('T')[0]}`, headers, rows);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-indigo-600" />
            <span>نظام إدارة الإجازات والأرصدة</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            تقديم طلبات الإجازات السنوية والمرضية والطارئة، متابعة دورة الاعتماد، والتحكم بالأرصدة
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>تصدير Excel</span>
          </button>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-300 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>تقديم طلب إجازة</span>
          </button>
        </div>
      </div>

      {/* Leave Balances Cards (for current employee / user) */}
      {currentEmpBalance && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-3xl border border-indigo-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-900 block mb-1">
                رصيد الإجازات السنوية
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-indigo-700 font-sans">
                  {Math.max(0, currentEmpBalance.annualTotal - currentEmpBalance.annualUsed)}
                </span>
                <span className="text-xs text-slate-500 font-medium">يوم متبقي</span>
              </div>
              <span className="text-[11px] text-indigo-600 font-medium block mt-1">
                تم استهلاك {currentEmpBalance.annualUsed} من {currentEmpBalance.annualTotal} يوم
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
              <CalendarDays className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-3xl border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-900 block mb-1">
                رصيد الإجازات المرضية
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-700 font-sans">
                  {Math.max(0, currentEmpBalance.sickTotal - currentEmpBalance.sickUsed)}
                </span>
                <span className="text-xs text-slate-500 font-medium">يوم متاح</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium block mt-1">
                مستهلك: {currentEmpBalance.sickUsed} يوم (بتقرير طبي)
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
              <HeartPulse className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-3xl border border-amber-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-900 block mb-1">
                الإجازات العارضة (قانون العمل المصري)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-700 font-sans">
                  {Math.max(0, currentEmpBalance.emergencyTotal - currentEmpBalance.emergencyUsed)}
                </span>
                <span className="text-xs text-slate-500 font-medium">يوم متبقي</span>
              </div>
              <span className="text-[11px] text-amber-600 font-medium block mt-1">
                مستهلك: {currentEmpBalance.emergencyUsed} من أصل {currentEmpBalance.emergencyTotal} أيام قانونية
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-600/10 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="البحث بالاسم، القسم، أو سبب الإجازة..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">كافة الحالات</option>
              <option value="pending">بانتظار الموافقة (معلق)</option>
              <option value="approved">معتمدة</option>
              <option value="rejected">مرفوضة</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">كافة أنواع الإجازات</option>
              <option value="annual">إجازة اعتيادية سنوية</option>
              <option value="emergency">إجازة عارضة (قانون العمل المصري)</option>
              <option value="sick">إجازة مرضية (تأمين صحي)</option>
              <option value="maternity">إجازة وضع ورعاية طفل</option>
              <option value="unpaid">إجازة خاصة بدون مرتب</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3.5 px-4">الموظف</th>
                <th className="py-3.5 px-4">القسم</th>
                <th className="py-3.5 px-4">نوع الإجازة</th>
                <th className="py-3.5 px-4">الفترة والمدة</th>
                <th className="py-3.5 px-4">السبب</th>
                <th className="py-3.5 px-4">تاريخ التقديم</th>
                <th className="py-3.5 px-4">الحالة والاعتماد</th>
                {canApprove && <th className="py-3.5 px-4 text-center">إجراءات المراجعة</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    لا توجد طلبات إجازة مطابقة
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Employee */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        {req.employeeName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {req.employeeCode}
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {req.department}
                    </td>

                    {/* Leave Type */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">
                        {req.leaveType === 'annual' && 'سنوية اعتيادية'}
                        {req.leaveType === 'sick' && 'مرضية'}
                        {req.leaveType === 'emergency' && 'اضطرارية طارئة'}
                        {req.leaveType === 'maternity' && 'أمومة ورعاية'}
                        {req.leaveType === 'unpaid' && 'بدون راتب'}
                      </span>
                    </td>

                    {/* Period & Days */}
                    <td className="py-3 px-4">
                      <div className="font-sans text-[11px] text-slate-700">
                        من {req.startDate} إلى {req.endDate}
                      </div>
                      <span className="font-bold text-indigo-700 text-xs mt-0.5 inline-block">
                        {req.daysCount} أيام
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={req.reason}>
                      {req.reason || 'بدون سبب'}
                    </td>

                    {/* Applied Date */}
                    <td className="py-3 px-4 font-sans text-slate-500 text-[11px]">
                      {req.appliedAt}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {req.status === 'approved' && (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            معتمدة
                          </span>
                          {req.reviewedBy && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              بواسطة: {req.reviewedBy}
                            </div>
                          )}
                        </div>
                      )}

                      {req.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                          <Clock className="w-3.5 h-3.5" />
                          قيد المراجعة
                        </span>
                      )}

                      {req.status === 'rejected' && (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                            <XCircle className="w-3.5 h-3.5" />
                            مرفوضة
                          </span>
                          {req.reviewNotes && (
                            <div className="text-[10px] text-rose-600 mt-0.5 max-w-[120px] truncate" title={req.reviewNotes}>
                              السبب: {req.reviewNotes}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    {canApprove && (
                      <td className="py-3 px-4 text-center">
                        {req.status === 'pending' ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setReviewingRequest(req);
                                setReviewAction('approve');
                                setReviewNotes('');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors cursor-pointer"
                            >
                              موافقة
                            </button>
                            <button
                              onClick={() => {
                                setReviewingRequest(req);
                                setReviewAction('reject');
                                setReviewNotes('');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
                            >
                              رفض
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400">مكتمل</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Leave Request Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">تقديم طلب إجازة جديد</h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              {currentUser.role !== 'employee' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الموظف
                  </label>
                  <select
                    value={newRequestForm.employeeId}
                    onChange={e => setNewRequestForm({ ...newRequestForm, employeeId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-indigo-500"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.code}) - {emp.department}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  نوع الإجازة
                </label>
                <select
                  value={newRequestForm.leaveType}
                  onChange={e => setNewRequestForm({ ...newRequestForm, leaveType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="annual">إجازة اعتيادية سنوية (21 أو 30 يوماً)</option>
                  <option value="emergency">إجازة عارضة (مادة 51 قانون العمل - حد أقصى 6 أيام)</option>
                  <option value="sick">إجازة مرضية (بتقرير الهيئة العامة للتأمين الصحي)</option>
                  <option value="maternity">إجازة رعاية طفل ووضع (طبقاً لقانون الطفل والعمل)</option>
                  <option value="unpaid">إجازة خاصة بدون مرتب</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    تاريخ البداية
                  </label>
                  <input
                    type="date"
                    required
                    value={newRequestForm.startDate}
                    onChange={e => setNewRequestForm({ ...newRequestForm, startDate: e.target.value })}
                    className="w-full font-sans px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    تاريخ النهاية
                  </label>
                  <input
                    type="date"
                    required
                    value={newRequestForm.endDate}
                    onChange={e => setNewRequestForm({ ...newRequestForm, endDate: e.target.value })}
                    className="w-full font-sans px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Calculated days badge */}
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs">
                <span className="text-indigo-900 font-bold">المدة المحسوبة للإجازة:</span>
                <span className="font-black text-indigo-700 text-sm font-sans">{calculatedDays} أيام</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  سبب الإجازة وملاحظات إضافية <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="اكتب سبب طلب الإجازة بالتفصيل..."
                  value={newRequestForm.reason}
                  onChange={e => setNewRequestForm({ ...newRequestForm, reason: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-300 transition-colors"
                >
                  إرسال طلب الإجازة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Request Modal (Approve / Reject) */}
      {reviewingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-black text-slate-900 text-base mb-1">
              {reviewAction === 'approve' ? 'اعتماد وموافقة على الإجازة' : 'رفض طلب الإجازة'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              طلب إجازة للموظف <strong>{reviewingRequest.employeeName}</strong> لمدة {reviewingRequest.daysCount} أيام
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {reviewAction === 'approve' ? 'ملاحظات الاعتماد (اختياري)' : 'سبب الرفض (إلزامي)'}
              </label>
              <textarea
                rows={3}
                placeholder={
                  reviewAction === 'approve'
                    ? 'مثال: تمت الموافقة وتكليف الزميل بالمهام'
                    : 'مثال: تعذر القبول نظراً لضغط العمل والمشاريع القائمة'
                }
                value={reviewNotes}
                onChange={e => setReviewNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReviewingRequest(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmReview}
                className={`px-5 py-2 rounded-xl text-white text-xs font-bold shadow-md transition-colors ${
                  reviewAction === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                }`}
              >
                {reviewAction === 'approve' ? 'تأكيد الموافقة' : 'تأكيد الرفض'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
