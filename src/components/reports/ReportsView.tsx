import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord, Employee, LeaveRequest } from '../../types';
import { exportToCSV, printCurrentReport } from '../../utils/exportUtils';
import { getTodayDateString } from '../../data/initialData';
import {
  FileBarChart,
  Calendar,
  Filter,
  Download,
  Printer,
  Search,
  Building,
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  FileText
} from 'lucide-react';

type ReportType = 'attendance' | 'delays' | 'hours' | 'leaves' | 'individual';

export const ReportsView: React.FC = () => {
  const { employees, attendance, leaveRequests, leaveBalances, settings } = useApp();

  const [reportType, setReportType] = useState<ReportType>('attendance');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState(getTodayDateString());
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedEmpId, setSelectedEmpId] = useState('ALL');

  // Filtered attendance records based on date range and dept/branch
  const filteredAttendance = useMemo(() => {
    return attendance.filter(rec => {
      const matchDate = rec.date >= startDate && rec.date <= endDate;
      const matchDept = selectedDept === 'ALL' || rec.department === selectedDept;
      const matchBranch = selectedBranch === 'ALL' || rec.branch === selectedBranch;
      const matchEmp = selectedEmpId === 'ALL' || rec.employeeId === selectedEmpId;

      return matchDate && matchDept && matchBranch && matchEmp;
    });
  }, [attendance, startDate, endDate, selectedDept, selectedBranch, selectedEmpId]);

  // Filtered leaves
  const filteredLeaves = useMemo(() => {
    return leaveRequests.filter(req => {
      const matchDept = selectedDept === 'ALL' || req.department === selectedDept;
      const matchEmp = selectedEmpId === 'ALL' || req.employeeId === selectedEmpId;
      const matchDate = req.startDate >= startDate && req.startDate <= endDate;
      return matchDept && matchEmp && matchDate;
    });
  }, [leaveRequests, selectedDept, selectedEmpId, startDate, endDate]);

  // Aggregate numbers
  const summaryStats = useMemo(() => {
    const totalRecords = filteredAttendance.length;
    const presentRecords = filteredAttendance.filter(r => r.status === 'present').length;
    const lateRecords = filteredAttendance.filter(r => r.status === 'late').length;
    const totalLateMins = filteredAttendance.reduce((acc, curr) => acc + (curr.lateMinutes || 0), 0);
    const totalWorkHours = filteredAttendance.reduce((acc, curr) => acc + (curr.workHours || 0), 0);
    const totalOvertime = filteredAttendance.reduce((acc, curr) => acc + (curr.overtimeHours || 0), 0);

    return {
      totalRecords,
      presentRecords,
      lateRecords,
      totalLateMins,
      totalWorkHours: totalWorkHours.toFixed(1),
      totalOvertime: totalOvertime.toFixed(1)
    };
  }, [filteredAttendance]);

  // Export to Excel (CSV)
  const handleExport = () => {
    if (reportType === 'attendance') {
      const headers = ['التاريخ', 'الرقم الوظيفي', 'اسم الموظف', 'القسم', 'الفرع', 'وقت الحضور', 'وقت الانصراف', 'الحالة', 'ساعات العمل'];
      const rows = filteredAttendance.map(r => [
        r.date,
        r.employeeCode,
        r.employeeName,
        r.department,
        r.branch,
        r.checkIn || '-',
        r.checkOut || '-',
        r.status === 'present' ? 'حاضر' : r.status === 'late' ? 'متأخر' : r.status === 'leave' ? 'إجازة' : 'غائب',
        r.workHours || 0
      ]);
      exportToCSV(`تقرير_الحضور_${startDate}_إلى_${endDate}`, headers, rows);
    } else if (reportType === 'delays') {
      const headers = ['التاريخ', 'الرقم الوظيفي', 'اسم الموظف', 'القسم', 'وقت الحضور', 'دقائق التأخير', 'الملاحظات'];
      const rows = filteredAttendance.filter(r => r.lateMinutes > 0).map(r => [
        r.date,
        r.employeeCode,
        r.employeeName,
        r.department,
        r.checkIn || '-',
        r.lateMinutes,
        r.notes || ''
      ]);
      exportToCSV(`تقرير_التأخيرات_${startDate}_إلى_${endDate}`, headers, rows);
    } else if (reportType === 'hours') {
      const headers = ['الرقم الوظيفي', 'اسم الموظف', 'القسم', 'ساعات العمل الإجمالية', 'ساعات العمل الإضافية'];
      const rows = filteredAttendance.map(r => [
        r.employeeCode,
        r.employeeName,
        r.department,
        r.workHours || 0,
        r.overtimeHours || 0
      ]);
      exportToCSV(`تقرير_ساعات_العمل_${startDate}_إلى_${endDate}`, headers, rows);
    } else if (reportType === 'leaves') {
      const headers = ['الموظف', 'القسم', 'نوع الإجازة', 'البداية', 'النهاية', 'الأيام', 'الحالة', 'السبب'];
      const rows = filteredLeaves.map(r => [
        r.employeeName,
        r.department,
        r.leaveType,
        r.startDate,
        r.endDate,
        r.daysCount,
        r.status,
        r.reason
      ]);
      exportToCSV(`تقرير_الإجازات_${startDate}_إلى_${endDate}`, headers, rows);
    } else {
      // Individual
      const targetEmp = employees.find(e => e.id === selectedEmpId) || employees[0];
      const headers = ['التاريخ', 'حالة الدوام', 'الحضور', 'الانصراف', 'ساعات العمل', 'التأخير'];
      const rows = filteredAttendance.map(r => [
        r.date,
        r.status,
        r.checkIn || '-',
        r.checkOut || '-',
        r.workHours || 0,
        r.lateMinutes || 0
      ]);
      exportToCSV(`تقرير_الموظف_${targetEmp?.name}_${startDate}`, headers, rows);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
            <FileBarChart className="w-6 h-6 text-indigo-600" />
            <span>مركز التقارير والتحليلات الإدارية</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            استخراج تقارير الحضور، التأخيرات، ساعات العمل، الإجازات، والتقارير الفردية الجاهزة للطباعة والتصدير
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={printCurrentReport}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>طباعة التقرير (PDF)</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-200 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تصدير Excel (CSV)</span>
          </button>
        </div>
      </div>

      {/* Report Types Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        {[
          { id: 'attendance', label: 'تقرير الحضور والانصراف' },
          { id: 'delays', label: 'تقرير الغياب والتأخيرات' },
          { id: 'hours', label: 'تقرير ساعات العمل والإضافي' },
          { id: 'leaves', label: 'تقرير الإجازات والأرصدة' },
          { id: 'individual', label: 'التقرير الفردي الشامل للموظف' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as ReportType)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              reportType === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Parameters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-2">
          معايير التقرير والفترة الزمنية
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Start Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">من تاريخ:</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full font-sans px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">إلى تاريخ:</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full font-sans px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">القسم:</label>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
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

          {/* Branch */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">الفرع:</label>
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

          {/* Specific Employee (Important for Individual Report) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              الموظف: {reportType === 'individual' && <span className="text-rose-500">*</span>}
            </label>
            <select
              value={selectedEmpId}
              onChange={e => setSelectedEmpId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">كافة الموظفين</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center">
          <span className="text-xs text-slate-500 block mb-1">إجمالي الحركات المسجلة</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 font-sans">
            {summaryStats.totalRecords}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center">
          <span className="text-xs text-slate-500 block mb-1">حالات التأخير المرصودة</span>
          <span className="text-xl sm:text-2xl font-black text-amber-600 font-sans">
            {summaryStats.lateRecords}
          </span>
          <span className="text-[10px] text-amber-700 block mt-0.5">
            إجمالي {summaryStats.totalLateMins} دقيقة
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center">
          <span className="text-xs text-slate-500 block mb-1">إجمالي ساعات العمل</span>
          <span className="text-xl sm:text-2xl font-black text-indigo-700 font-sans">
            {summaryStats.totalWorkHours} ساعة
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center">
          <span className="text-xs text-slate-500 block mb-1">ساعات العمل الإضافية</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 font-sans">
            {summaryStats.totalOvertime} ساعة
          </span>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* Printable Official Header */}
        <div className="border-b-2 border-slate-800 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {settings.companyName}
            </h1>
            <p className="text-xs text-slate-500">
              {settings.companyNameEn} • س.ت: {settings.crNumber} • ب.ض: {settings.taxId || '492-315-882'}
            </p>
            <p className="text-xs text-indigo-700 font-bold mt-1">
              {reportType === 'attendance' && 'كشف تقرير الحضور والانصراف المعتمد'}
              {reportType === 'delays' && 'تقرير متابعة التأخيرات والغياب'}
              {reportType === 'hours' && 'تقرير ساعات العمل والدوام الفعلي'}
              {reportType === 'leaves' && 'تقرير بيان الإجازات المستهلكة'}
              {reportType === 'individual' && 'التقرير الفردي الشامل لأداء وحضور الموظف'}
            </p>
          </div>

          <div className="text-left font-sans text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div><strong>تاريخ الاستخراج:</strong> {new Date().toISOString().split('T')[0]}</div>
            <div><strong>الفترة المحددة:</strong> {startDate} إلى {endDate}</div>
            <div><strong>القسم:</strong> {selectedDept === 'ALL' ? 'كافة الأقسام' : selectedDept}</div>
          </div>
        </div>

        {/* Report Table by Active Type */}
        {reportType === 'attendance' && (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 border-y border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="py-2.5 px-3">التاريخ</th>
                  <th className="py-2.5 px-3">الرقم الوظيفي</th>
                  <th className="py-2.5 px-3">الموظف</th>
                  <th className="py-2.5 px-3">القسم</th>
                  <th className="py-2.5 px-3">الحضور</th>
                  <th className="py-2.5 px-3">الانصراف</th>
                  <th className="py-2.5 px-3">ساعات العمل</th>
                  <th className="py-2.5 px-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAttendance.map(r => (
                  <tr key={r.id}>
                    <td className="py-2.5 px-3 font-sans font-medium">{r.date}</td>
                    <td className="py-2.5 px-3 font-mono">{r.employeeCode}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{r.employeeName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.department}</td>
                    <td className="py-2.5 px-3 font-sans">{r.checkIn || '-'}</td>
                    <td className="py-2.5 px-3 font-sans">{r.checkOut || '-'}</td>
                    <td className="py-2.5 px-3 font-sans font-bold">{r.workHours} س</td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-xs">
                        {r.status === 'present' ? 'حاضر' : r.status === 'late' ? `متأخر (${r.lateMinutes} د)` : r.status === 'leave' ? 'إجازة' : 'غائب'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'delays' && (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 border-y border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="py-2.5 px-3">التاريخ</th>
                  <th className="py-2.5 px-3">الرقم الوظيفي</th>
                  <th className="py-2.5 px-3">الموظف</th>
                  <th className="py-2.5 px-3">القسم</th>
                  <th className="py-2.5 px-3">وقت الحضور الفعلي</th>
                  <th className="py-2.5 px-3">مدة التأخير</th>
                  <th className="py-2.5 px-3">المبرر والملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAttendance.filter(r => r.lateMinutes > 0).map(r => (
                  <tr key={r.id}>
                    <td className="py-2.5 px-3 font-sans font-medium">{r.date}</td>
                    <td className="py-2.5 px-3 font-mono">{r.employeeCode}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{r.employeeName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.department}</td>
                    <td className="py-2.5 px-3 font-sans text-rose-700 font-bold">{r.checkIn}</td>
                    <td className="py-2.5 px-3 font-sans font-black text-amber-700">{r.lateMinutes} دقيقة</td>
                    <td className="py-2.5 px-3 text-slate-500">{r.notes || 'بدون عذر مسجل'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'hours' && (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 border-y border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="py-2.5 px-3">الرقم الوظيفي</th>
                  <th className="py-2.5 px-3">الموظف</th>
                  <th className="py-2.5 px-3">القسم</th>
                  <th className="py-2.5 px-3">أيام الحضور</th>
                  <th className="py-2.5 px-3">ساعات العمل الفعلية</th>
                  <th className="py-2.5 px-3">الساعات الإضافية</th>
                  <th className="py-2.5 px-3">معدل الانضباط</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map(emp => {
                  const empRecords = filteredAttendance.filter(r => r.employeeId === emp.id);
                  const totalHrs = empRecords.reduce((acc, curr) => acc + (curr.workHours || 0), 0);
                  const totalOt = empRecords.reduce((acc, curr) => acc + (curr.overtimeHours || 0), 0);
                  return (
                    <tr key={emp.id}>
                      <td className="py-2.5 px-3 font-mono">{emp.code}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{emp.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{emp.department}</td>
                      <td className="py-2.5 px-3 font-sans font-bold">{empRecords.length} أيام</td>
                      <td className="py-2.5 px-3 font-sans font-bold text-indigo-700">{totalHrs.toFixed(1)} س</td>
                      <td className="py-2.5 px-3 font-sans text-emerald-700">{totalOt.toFixed(1)} س</td>
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-800">
                        {empRecords.length > 0 ? '96%' : '0%'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'leaves' && (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 border-y border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="py-2.5 px-3">الموظف</th>
                  <th className="py-2.5 px-3">القسم</th>
                  <th className="py-2.5 px-3">نوع الإجازة</th>
                  <th className="py-2.5 px-3">من تاريخ</th>
                  <th className="py-2.5 px-3">إلى تاريخ</th>
                  <th className="py-2.5 px-3">المدة (أيام)</th>
                  <th className="py-2.5 px-3">الحالة</th>
                  <th className="py-2.5 px-3">سبب الإجازة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeaves.map(r => (
                  <tr key={r.id}>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{r.employeeName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.department}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{r.leaveType}</td>
                    <td className="py-2.5 px-3 font-sans">{r.startDate}</td>
                    <td className="py-2.5 px-3 font-sans">{r.endDate}</td>
                    <td className="py-2.5 px-3 font-sans font-black text-indigo-700">{r.daysCount}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                        r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.status === 'approved' ? 'معتمدة' : 'معلقة'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{r.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'individual' && (
          <div className="space-y-5">
            {(() => {
              const targetEmp = employees.find(e => e.id === selectedEmpId) || employees[0];
              const empRecords = filteredAttendance.filter(r => r.employeeId === targetEmp.id);
              const balance = leaveBalances[targetEmp.id];
              return (
                <div>
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={targetEmp.avatar} alt={targetEmp.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h3 className="font-black text-slate-900 text-sm">{targetEmp.name}</h3>
                        <p className="text-xs text-slate-600">{targetEmp.position} • {targetEmp.department}</p>
                      </div>
                    </div>
                    <div className="text-left text-xs font-sans">
                      <div><strong>الرقم الوظيفي:</strong> {targetEmp.code}</div>
                      <div><strong>رصيد الإجازات السنوي المتبقي:</strong> {balance ? balance.annualTotal - balance.annualUsed : 22} يوم</div>
                    </div>
                  </div>

                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100 border-y border-slate-200 text-slate-700 font-bold">
                      <tr>
                        <th className="py-2.5 px-3">التاريخ</th>
                        <th className="py-2.5 px-3">وقت الحضور</th>
                        <th className="py-2.5 px-3">وقت الانصراف</th>
                        <th className="py-2.5 px-3">ساعات العمل</th>
                        <th className="py-2.5 px-3">دقائق التأخير</th>
                        <th className="py-2.5 px-3">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {empRecords.map(r => (
                        <tr key={r.id}>
                          <td className="py-2.5 px-3 font-sans">{r.date}</td>
                          <td className="py-2.5 px-3 font-sans">{r.checkIn || '-'}</td>
                          <td className="py-2.5 px-3 font-sans">{r.checkOut || '-'}</td>
                          <td className="py-2.5 px-3 font-sans font-bold">{r.workHours} س</td>
                          <td className="py-2.5 px-3 font-sans text-amber-700">{r.lateMinutes || 0}</td>
                          <td className="py-2.5 px-3 font-bold">{r.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        )}

        {/* Printable Official Signatures Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-3 gap-4 text-center text-xs text-slate-600">
          <div>
            <span className="font-bold block mb-8">إعداد مسؤول الموارد البشرية</span>
            <span className="border-t border-slate-400 pt-1 inline-block w-36 text-slate-400">التوقيع / الختم</span>
          </div>
          <div>
            <span className="font-bold block mb-8">اعتماد مدير القسم</span>
            <span className="border-t border-slate-400 pt-1 inline-block w-36 text-slate-400">التوقيع</span>
          </div>
          <div>
            <span className="font-bold block mb-8">اعتماد الإدارة العامة</span>
            <span className="border-t border-slate-400 pt-1 inline-block w-36 text-slate-400">الختم الرسمي</span>
          </div>
        </div>
      </div>
    </div>
  );
};
