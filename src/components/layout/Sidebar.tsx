import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  CalendarRange,
  FileBarChart,
  ShieldCheck,
  History,
  Settings,
  Sparkles,
  ChevronLeft,
  Briefcase,
  Bell
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose
}) => {
  const { currentUser, leaveRequests, attendance, unreadNotificationsCount } = useApp();

  const pendingLeavesCount = leaveRequests.filter(l => l.status === 'pending').length;
  const lateTodayCount = attendance.filter(a => a.status === 'late').length;

  const role = currentUser.role;

  // Filter menu items by role
  const menuItems = [
    {
      id: 'dashboard',
      label: 'لوحة التحكم',
      icon: LayoutDashboard,
      roles: ['admin', 'hr', 'manager', 'employee']
    },
    {
      id: 'notifications',
      label: 'التنبيهات والإشعارات',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount} جديد` : undefined,
      badgeColor: 'bg-rose-500 text-white font-black',
      roles: ['admin', 'hr', 'manager', 'employee']
    },
    {
      id: 'employees',
      label: role === 'employee' ? 'دليل الزملاء' : 'إدارة الموظفين',
      icon: Users,
      roles: ['admin', 'hr', 'manager', 'employee']
    },
    {
      id: 'attendance',
      label: role === 'employee' ? 'سجل حضوري وانصرافي' : 'الحضور والانصراف',
      icon: Clock,
      badge: lateTodayCount > 0 && role !== 'employee' ? `${lateTodayCount} متأخر` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
      roles: ['admin', 'hr', 'manager', 'employee']
    },
    {
      id: 'leaves',
      label: role === 'employee' ? 'طلبات إجازاتي والرصيد' : 'طلبات الإجازات',
      icon: CalendarDays,
      badge: pendingLeavesCount > 0 && role !== 'employee' ? `${pendingLeavesCount} معلق` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800',
      roles: ['admin', 'hr', 'manager', 'employee']
    },
    {
      id: 'shifts',
      label: role === 'employee' ? 'جدول ورديتي ومواعيدي' : 'الورديات ومواعيد العمل',
      icon: CalendarRange,
      roles: ['admin', 'hr', 'manager', 'employee']
    },
    {
      id: 'reports',
      label: 'التقارير والتحليلات',
      icon: FileBarChart,
      roles: ['admin', 'hr', 'manager']
    },
    {
      id: 'users',
      label: 'المستخدمون والصلاحيات',
      icon: ShieldCheck,
      roles: ['admin']
    },
    {
      id: 'audit',
      label: 'سجل العمليات والتدقيق',
      icon: History,
      roles: ['admin', 'hr']
    },
    {
      id: 'settings',
      label: 'إعدادات المؤسسة',
      icon: Settings,
      roles: ['admin']
    }
  ];

  const allowedItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-40 w-64 bg-white border-l border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand header on mobile sidebar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              د
            </div>
            <span className="font-bold text-slate-800">نظام دوام الذكي</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Quick Badge */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-blue-50/40 to-slate-50 border border-indigo-100/70">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
            />
            <div className="overflow-hidden">
              <div className="font-bold text-xs text-slate-900 truncate">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {currentUser.email}
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-semibold text-emerald-700">
                  {currentUser.role === 'admin'
                    ? 'مدير النظام'
                    : currentUser.role === 'hr'
                    ? 'إدارة الموارد البشرية'
                    : currentUser.role === 'manager'
                    ? 'مدير القسم'
                    : 'بوابة الموظف'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            القائمة الرئيسية
          </div>

          {allowedItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Banner: Biometric & System Status */}
        <div className="p-3 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>جهاز البصمة الرئيسي</span>
              </span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                متصل
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              مزامنة فورية للحركات وسجلات الحضور
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
