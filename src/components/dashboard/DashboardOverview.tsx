import React from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../data/initialData';
import {
  Users,
  UserCheck,
  UserX,
  ClockAlert,
  CalendarHeart,
  TrendingUp,
  Fingerprint,
  PlusCircle,
  FileSpreadsheet,
  ArrowUpRight,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Building,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onOpenQuickPunch: () => void;
  onOpenAddEmployee?: () => void;
}

export const DashboardOverview: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenQuickPunch,
  onOpenAddEmployee
}) => {
  const { employees, attendance, leaveRequests, currentUser, shifts } = useApp();

  const today = getTodayDateString();
  const todayAttendance = attendance.filter(a => a.date === today);

  const activeEmployees = employees.filter(e => e.status === 'active');
  const totalCount = activeEmployees.length;

  const presentCount = todayAttendance.filter(a => a.status === 'present').length;
  const lateCount = todayAttendance.filter(a => a.status === 'late').length;
  const leaveCount = todayAttendance.filter(a => a.status === 'leave').length;
  const absentCount = todayAttendance.filter(a => a.status === 'absent').length;

  // Unaccounted employees are either absent or not recorded yet
  const accountedIds = new Set(todayAttendance.map(a => a.employeeId));
  const notCheckedIn = activeEmployees.filter(e => !accountedIds.has(e.id)).length;
  const actualAbsent = absentCount + notCheckedIn;

  const attendedTotal = presentCount + lateCount;
  const attendanceRate = totalCount > 0 ? Math.round((attendedTotal / totalCount) * 100) : 0;

  // Calculate total work hours logged today
  const totalHoursLogged = todayAttendance.reduce((acc, curr) => acc + (curr.workHours || 0), 0);

  // Departments statistics
  const deptCounts: Record<string, number> = {};
  activeEmployees.forEach(e => {
    deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
  });

  // Recent activity punches
  const recentPunches = [...todayAttendance]
    .filter(a => a.checkIn !== null)
    .sort((a, b) => (b.checkIn || '').localeCompare(a.checkIn || ''))
    .slice(0, 6);

  // Pending leaves
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl pointer-events-none translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-indigo-200 font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>نظام متابعة الدوام وإدارة شؤون الموظفين</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              مرحباً بك، {currentUser.name} 👋
            </h1>
            <p className="mt-1.5 text-indigo-100/90 text-sm max-w-xl leading-relaxed">
              إليك نظرة عامة شاملة وفورية على إحصائيات حضور وانصراف الموظفين، نسب الالتزام، وطلبات الإجازات ليومنا هذا.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenQuickPunch}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer"
            >
              <Fingerprint className="w-5 h-5" />
              <span>تسجيل بصمة الآن</span>
            </button>

            {currentUser.role !== 'employee' && (
              <button
                onClick={() => onNavigate('attendance')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              >
                <span>سجل الحضور اليومي</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-5">
        {/* Total Employees */}
        <div
          onClick={() => onNavigate('employees')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">إجمالي الموظفين</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {totalCount}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-emerald-600">نشط</span>
            <span>في كافة الفروع</span>
          </div>
        </div>

        {/* Present Today */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">حاضرون في الموعد</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
            {presentCount}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 font-semibold">
            <span>انضباط كامل بالموعد</span>
          </div>
        </div>

        {/* Late Today */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">المتأخرون اليوم</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ClockAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 tracking-tight">
            {lateCount}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-amber-600 font-medium">
            <span>تجاوزوا فترة السماح</span>
          </div>
        </div>

        {/* Absent Today */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">الغياب اليوم</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserX className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700 tracking-tight">
            {actualAbsent}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-rose-600 font-medium">
            <span>لم يسجلوا حضور</span>
          </div>
        </div>

        {/* On Leave Today */}
        <div
          onClick={() => onNavigate('leaves')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-purple-300 transition-all cursor-pointer group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">في إجازة رسمية</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarHeart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-700 tracking-tight">
            {leaveCount}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-purple-600 font-medium">
            <span>إجازات معتمدة</span>
          </div>
        </div>
      </div>

      {/* Analytics Section: Attendance Gauge & Weekly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Rate Card */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">معدل الحضور اليومي</h3>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full border border-indigo-100">
                اليوم
              </span>
            </div>

            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center relative">
                <div className="w-36 h-36 rounded-full bg-slate-50 flex items-center justify-center border-8 border-slate-100">
                  <div className="text-center">
                    <span className="text-4xl font-extrabold text-indigo-700 font-sans">
                      {attendanceRate}%
                    </span>
                    <span className="block text-[11px] font-bold text-slate-400 mt-0.5">
                      نسبة الالتزام
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>حاضرون في الموعد ({presentCount})</span>
                </span>
                <span className="font-bold text-slate-800">
                  {totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}%
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>حاضرون بتأخير ({lateCount})</span>
                </span>
                <span className="font-bold text-slate-800">
                  {totalCount > 0 ? Math.round((lateCount / totalCount) * 100) : 0}%
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span>غياب / غير مسجلين ({actualAbsent})</span>
                </span>
                <span className="font-bold text-slate-800">
                  {totalCount > 0 ? Math.round((actualAbsent / totalCount) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>ساعات العمل المنجزة:</span>
            <span className="font-bold text-indigo-700 font-sans text-sm">
              {totalHoursLogged} ساعة
            </span>
          </div>
        </div>

        {/* Weekly Attendance Trend Simulation */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">معدل الحضور خلال أسبوع العمل</h3>
                <p className="text-xs text-slate-500 mt-0.5">مقارنة الحضور والانصراف للأيام الخمسة الماضية</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded bg-indigo-600"></span> حضور
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded bg-amber-400"></span> تأخير
                </span>
              </div>
            </div>

            {/* Weekly Bars */}
            <div className="h-44 pt-4 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-100">
              {[
                { day: 'الأحد', presentPct: 92, latePct: 8 },
                { day: 'الإثنين', presentPct: 85, latePct: 15 },
                { day: 'الثلاثاء', presentPct: 95, latePct: 5 },
                { day: 'الأربعاء', presentPct: 88, latePct: 12 },
                { day: 'الخميس (اليوم)', presentPct: attendanceRate, latePct: totalCount > 0 ? Math.round((lateCount / totalCount) * 100) : 0 }
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[11px] font-bold text-slate-700 font-sans">
                    {bar.presentPct}%
                  </span>
                  <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-32 relative">
                    <div
                      style={{ height: `${bar.latePct}%` }}
                      className="w-full bg-amber-400"
                      title={`تأخير: ${bar.latePct}%`}
                    />
                    <div
                      style={{ height: `${bar.presentPct}%` }}
                      className="w-full bg-indigo-600 rounded-t-sm"
                      title={`حضور: ${bar.presentPct}%`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 truncate">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>معدل الالتزام العام بالأوقات مرتفع بنسبة 4.2% عن الأسبوع الماضي</span>
            </span>
            <button
              onClick={() => onNavigate('reports')}
              className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
            >
              عرض التقرير التفصيلي ←
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Punch Logs & Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Attendance Stream */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Fingerprint className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">سجل البصمات المباشر اليوم</h3>
                <p className="text-xs text-slate-500">آخر حركات تسجيل الحضور والانصراف فور حدوثها</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('attendance')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              عرض الكل ({todayAttendance.length})
            </button>
          </div>

          {recentPunches.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              لم يتم تسجيل أي بصمات اليوم حتى الآن
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                    <th className="py-2.5 px-3">الموظف</th>
                    <th className="py-2.5 px-3">القسم</th>
                    <th className="py-2.5 px-3">وقت الحضور</th>
                    <th className="py-2.5 px-3">الحالة</th>
                    <th className="py-2.5 px-3">طريقة التسجيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentPunches.map(record => (
                    <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{record.employeeName}</div>
                        <div className="text-[10px] text-slate-400 font-sans">{record.employeeCode}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{record.department}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-sans font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                          {record.checkIn}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {record.status === 'present' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            حاضر
                          </span>
                        )}
                        {record.status === 'late' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            متأخر ({record.lateMinutes} د)
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {record.method === 'biometric' && 'جهاز البصمة'}
                        {record.method === 'kiosk' && 'شاشة الكشك'}
                        {record.method === 'self' && 'الخدمة الذاتية'}
                        {record.method === 'manual' && 'يدوي (إداري)'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pending Leave Requests & Action */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <CalendarHeart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">طلبات الإجازات</h3>
                  <p className="text-xs text-slate-500">الطلبات التي بانتظار الاعتماد</p>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                {pendingLeaves.length} معلقة
              </span>
            </div>

            <div className="space-y-3">
              {pendingLeaves.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  لا توجد طلبات إجازة معلقة حالياً
                </div>
              ) : (
                pendingLeaves.slice(0, 3).map(req => (
                  <div
                    key={req.id}
                    onClick={() => onNavigate('leaves')}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">
                        {req.employeeName}
                      </span>
                      <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                        {req.daysCount} أيام
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>إجازة {req.leaveType === 'annual' ? 'سنوية' : 'طارئة'}</span>
                      <span className="font-sans text-[10px] text-slate-400">{req.startDate}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('leaves')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer text-center"
            >
              إدارة كافة طلبات الإجازات ←
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
