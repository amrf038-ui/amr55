import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord, AttendanceStatus, Employee } from '../../types';
import { getTodayDateString } from '../../data/initialData';
import { exportToCSV, printCurrentReport } from '../../utils/exportUtils';
import {
  Clock,
  Calendar,
  Search,
  Filter,
  Download,
  Printer,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  CalendarHeart,
  Fingerprint,
  UserCheck,
  Building,
  Save,
  X
} from 'lucide-react';

interface AttendanceViewProps {
  onOpenQuickPunch: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ onOpenQuickPunch }) => {
  const {
    attendance,
    employees,
    shifts,
    currentUser,
    manualAddAttendance,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    settings
  } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AttendanceStatus>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Modal for manual record adding or editing
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  // Manual Form State
  const [manualForm, setManualForm] = useState({
    employeeId: employees[0]?.id || '',
    date: getTodayDateString(),
    checkIn: '08:00',
    checkOut: '16:00',
    status: 'present' as AttendanceStatus,
    lateMinutes: 0,
    notes: 'تسجيل يدوي من الإدارة'
  });

  const canManage = currentUser.role === 'admin' || currentUser.role === 'hr' || currentUser.role === 'manager';

  // Filter attendance for the selected date
  const recordsForDate = useMemo(() => {
    return attendance.filter(a => {
      // If employee role, only show own records
      if (currentUser.role === 'employee' && currentUser.employeeId) {
        if (a.employeeId !== currentUser.employeeId) return false;
      }
      return a.date === selectedDate;
    });
  }, [attendance, selectedDate, currentUser]);

  // Combined with employees list so we see who didn't check in yet!
  const fullDayList = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    recordsForDate.forEach(r => map.set(r.employeeId, r));

    return employees
      .filter(emp => {
        if (currentUser.role === 'employee' && currentUser.employeeId) {
          return emp.id === currentUser.employeeId;
        }
        return emp.status === 'active';
      })
      .map(emp => {
        const existing = map.get(emp.id);
        if (existing) return existing;

        // Placeholder for employee with no record yet
        const defaultShift = shifts.find(s => s.id === emp.shiftId) || shifts[0];
        const placeholder: AttendanceRecord = {
          id: `missing-${emp.id}-${selectedDate}`,
          employeeId: emp.id,
          employeeName: emp.name,
          employeeCode: emp.code,
          department: emp.department,
          branch: emp.branch,
          date: selectedDate,
          checkIn: null,
          checkOut: null,
          status: 'absent',
          lateMinutes: 0,
          earlyLeaveMinutes: 0,
          workHours: 0,
          overtimeHours: 0,
          method: 'manual',
          notes: 'لم يسجل حضور'
        };
        return placeholder;
      });
  }, [recordsForDate, employees, selectedDate, shifts, currentUser]);

  // Apply search and filter
  const filteredList = useMemo(() => {
    return fullDayList.filter(item => {
      const matchSearch =
        item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchDept = departmentFilter === 'ALL' || item.department === departmentFilter;

      return matchSearch && matchStatus && matchDept;
    });
  }, [fullDayList, searchTerm, statusFilter, departmentFilter]);

  // Stats for the day
  const stats = useMemo(() => {
    const present = fullDayList.filter(r => r.status === 'present').length;
    const late = fullDayList.filter(r => r.status === 'late').length;
    const leave = fullDayList.filter(r => r.status === 'leave').length;
    const absent = fullDayList.filter(r => r.status === 'absent' || !r.checkIn).length;
    const totalHours = fullDayList.reduce((acc, curr) => acc + (curr.workHours || 0), 0);

    return { present, late, leave, absent, totalHours };
  }, [fullDayList]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'التاريخ',
      'الرقم الوظيفي',
      'اسم الموظف',
      'القسم',
      'الفرع',
      'وقت الحضور',
      'وقت الانصراف',
      'ساعات العمل',
      'التأخير (دقيقة)',
      'الانصراف المبكر (دقيقة)',
      'الحالة',
      'طريقة التسجيل',
      'ملاحظات'
    ];

    const rows = filteredList.map(r => [
      r.date,
      r.employeeCode,
      r.employeeName,
      r.department,
      r.branch,
      r.checkIn || '-',
      r.checkOut || '-',
      r.workHours || 0,
      r.lateMinutes || 0,
      r.earlyLeaveMinutes || 0,
      r.status === 'present'
        ? 'حاضر'
        : r.status === 'late'
        ? 'متأخر'
        : r.status === 'leave'
        ? 'إجازة'
        : r.status === 'early_leave'
        ? 'انصراف مبكر'
        : 'غياب',
      r.method,
      r.notes || ''
    ]);

    exportToCSV(`كشف_حضور_${selectedDate}`, headers, rows);
  };

  // Open manual add modal
  const handleOpenAddManual = () => {
    setEditingRecord(null);
    setManualForm({
      employeeId: employees[0]?.id || '',
      date: selectedDate,
      checkIn: '08:00',
      checkOut: '16:00',
      status: 'present',
      lateMinutes: 0,
      notes: 'تسجيل يدوي إداري'
    });
    setIsManualModalOpen(true);
  };

  // Open manual edit modal
  const handleOpenEditManual = (rec: AttendanceRecord) => {
    setEditingRecord(rec);
    setManualForm({
      employeeId: rec.employeeId,
      date: rec.date,
      checkIn: rec.checkIn || '08:00',
      checkOut: rec.checkOut || '16:00',
      status: rec.status,
      lateMinutes: rec.lateMinutes || 0,
      notes: rec.notes || ''
    });
    setIsManualModalOpen(true);
  };

  const handleSaveManualRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === manualForm.employeeId);
    if (!emp) return;

    let workHours = 0;
    if (manualForm.checkIn && manualForm.checkOut) {
      const [inH, inM] = manualForm.checkIn.split(':').map(Number);
      const [outH, outM] = manualForm.checkOut.split(':').map(Number);
      let diff = outH * 60 + outM - (inH * 60 + inM);
      if (diff < 0) diff += 1440;
      workHours = Number((diff / 60).toFixed(2));
    }

    if (editingRecord && !editingRecord.id.startsWith('missing-')) {
      updateAttendanceRecord(editingRecord.id, {
        checkIn: manualForm.checkIn,
        checkOut: manualForm.checkOut,
        status: manualForm.status,
        lateMinutes: manualForm.lateMinutes,
        workHours,
        notes: manualForm.notes
      });
    } else {
      manualAddAttendance({
        employeeId: emp.id,
        employeeName: emp.name,
        employeeCode: emp.code,
        department: emp.department,
        branch: emp.branch,
        date: manualForm.date,
        checkIn: manualForm.checkIn,
        checkOut: manualForm.checkOut,
        status: manualForm.status,
        lateMinutes: manualForm.lateMinutes,
        earlyLeaveMinutes: 0,
        workHours,
        overtimeHours: 0,
        method: 'manual',
        notes: manualForm.notes
      });
    }

    setIsManualModalOpen(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-indigo-600" />
            <span>سجل الحضور والانصراف اليومي</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            متابعة دقيقة لمواعيد الدخول والخروج، التأخيرات، الغياب، واحتساب ساعات العمل الفعلية
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="text-xs sm:text-sm font-sans font-bold bg-transparent text-slate-800 focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={printCurrentReport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            title="طباعة كشف الحضور"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">طباعة</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            title="تصدير إلى إكسل"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>تصدير Excel</span>
          </button>

          {canManage && (
            <button
              onClick={handleOpenAddManual}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حركة يدوية</span>
            </button>
          )}

          <button
            onClick={onOpenQuickPunch}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-200 transition-all cursor-pointer"
          >
            <Fingerprint className="w-4 h-4" />
            <span>بصمة فورية</span>
          </button>
        </div>
      </div>

      {/* Daily Summary Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-[11px] font-bold text-slate-500 block mb-1">حاضرون في الموعد</span>
          <span className="text-2xl font-black text-emerald-600 font-sans">{stats.present}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-[11px] font-bold text-slate-500 block mb-1">المتأخرون</span>
          <span className="text-2xl font-black text-amber-600 font-sans">{stats.late}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-[11px] font-bold text-slate-500 block mb-1">الغياب</span>
          <span className="text-2xl font-black text-rose-600 font-sans">{stats.absent}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-[11px] font-bold text-slate-500 block mb-1">المجازون</span>
          <span className="text-2xl font-black text-purple-600 font-sans">{stats.leave}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-slate-500 block mb-1">إجمالي الساعات</span>
          <span className="text-2xl font-black text-indigo-700 font-sans">{stats.totalHours.toFixed(1)} س</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="البحث بالاسم، الرقم الوظيفي، أو القسم..."
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
              <option value="ALL">كافة حالات الحضور</option>
              <option value="present">حاضر في الموعد</option>
              <option value="late">متأخر</option>
              <option value="absent">غائب</option>
              <option value="leave">في إجازة</option>
              <option value="early_leave">انصراف مبكر</option>
            </select>
          </div>

          <div>
            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
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
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3.5 px-4">الموظف</th>
                <th className="py-3.5 px-4">القسم / الفرع</th>
                <th className="py-3.5 px-4">وقت الحضور</th>
                <th className="py-3.5 px-4">وقت الانصراف</th>
                <th className="py-3.5 px-4">ساعات العمل</th>
                <th className="py-3.5 px-4">التأخير</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4">طريقة التسجيل</th>
                <th className="py-3.5 px-4">ملاحظات</th>
                {canManage && <th className="py-3.5 px-4 text-center">إجراءات</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map(rec => (
                <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Employee Name & Code */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      {rec.employeeName}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      {rec.employeeCode}
                    </div>
                  </td>

                  {/* Department & Branch */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-700">{rec.department}</div>
                    <div className="text-[10px] text-slate-400">{rec.branch}</div>
                  </td>

                  {/* Check In */}
                  <td className="py-3 px-4">
                    {rec.checkIn ? (
                      <span className="font-sans font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                        {rec.checkIn}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>

                  {/* Check Out */}
                  <td className="py-3 px-4">
                    {rec.checkOut ? (
                      <span className="font-sans font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                        {rec.checkOut}
                      </span>
                    ) : (
                      <span className="text-slate-400">لم يسجل</span>
                    )}
                  </td>

                  {/* Work Hours */}
                  <td className="py-3 px-4">
                    <span className="font-sans font-black text-slate-800 text-xs">
                      {rec.workHours ? `${rec.workHours} س` : '0 س'}
                    </span>
                  </td>

                  {/* Late minutes */}
                  <td className="py-3 px-4">
                    {rec.lateMinutes > 0 ? (
                      <span className="font-sans font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                        {rec.lateMinutes} دقيقة
                      </span>
                    ) : (
                      <span className="text-slate-400">لا يوجد</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    {rec.status === 'present' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        حاضر
                      </span>
                    )}
                    {rec.status === 'late' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        متأخر
                      </span>
                    )}
                    {rec.status === 'absent' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        غائب
                      </span>
                    )}
                    {rec.status === 'leave' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                        إجازة
                      </span>
                    )}
                    {rec.status === 'early_leave' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        انصراف مبكر
                      </span>
                    )}
                  </td>

                  {/* Method */}
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {rec.method === 'biometric' && 'بصمة الإصبع'}
                    {rec.method === 'kiosk' && 'شاشة الكشك'}
                    {rec.method === 'self' && 'الخدمة الذاتية'}
                    {rec.method === 'manual' && 'يدوي إداري'}
                  </td>

                  {/* Notes */}
                  <td className="py-3 px-4 text-slate-500 text-[11px] truncate max-w-[150px]">
                    {rec.notes || '-'}
                  </td>

                  {/* Actions */}
                  {canManage && (
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditManual(rec)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="تعديل السجل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {!rec.id.startsWith('missing-') && (
                          <button
                            onClick={() => deleteAttendanceRecord(rec.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Record Add / Edit Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">
                {editingRecord ? 'تعديل سجل حضور الموظف' : 'إضافة حركة حضور يدوية'}
              </h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الموظف
                </label>
                <select
                  value={manualForm.employeeId}
                  disabled={Boolean(editingRecord)}
                  onChange={e => setManualForm({ ...manualForm, employeeId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-indigo-500"
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.code}) - {emp.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    وقت الحضور
                  </label>
                  <input
                    type="time"
                    value={manualForm.checkIn}
                    onChange={e => setManualForm({ ...manualForm, checkIn: e.target.value })}
                    className="w-full font-sans px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    وقت الانصراف
                  </label>
                  <input
                    type="time"
                    value={manualForm.checkOut}
                    onChange={e => setManualForm({ ...manualForm, checkOut: e.target.value })}
                    className="w-full font-sans px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الحالة
                  </label>
                  <select
                    value={manualForm.status}
                    onChange={e => setManualForm({ ...manualForm, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="present">حاضر</option>
                    <option value="late">متأخر</option>
                    <option value="absent">غائب</option>
                    <option value="leave">في إجازة</option>
                    <option value="early_leave">انصراف مبكر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    دقائق التأخير
                  </label>
                  <input
                    type="number"
                    value={manualForm.lateMinutes}
                    onChange={e => setManualForm({ ...manualForm, lateMinutes: Number(e.target.value) })}
                    className="w-full font-sans px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ملاحظات أو مبرر التعديل
                </label>
                <input
                  type="text"
                  placeholder="مثال: نسى الموظف البصمة وتم التحقق من وجوده"
                  value={manualForm.notes}
                  onChange={e => setManualForm({ ...manualForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-colors"
                >
                  حفظ السجل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
