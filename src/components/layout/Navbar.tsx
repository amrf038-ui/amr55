import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, NotificationType } from '../../types';
import {
  Clock,
  Fingerprint,
  Bell,
  User,
  Shield,
  Briefcase,
  Users,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Building2,
  CalendarCheck,
  CalendarDays,
  ClockAlert,
  UserX,
  CheckCheck,
  ArrowUpRight,
  Megaphone,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  onOpenQuickPunch: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenQuickPunch,
  onToggleSidebar,
  isSidebarOpen,
  onNavigate
}) => {
  const {
    currentUser,
    switchRole,
    settings,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'ALL' | 'leave_request' | 'late_arrival'>('ALL');

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
      setCurrentDate(
        now.toLocaleDateString('ar-EG', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const roles: { role: UserRole; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      role: 'admin',
      title: 'مدير النظام (System Admin)',
      desc: 'صلاحيات كاملة على كل النظام والإعدادات والمستخدمين',
      icon: <Shield className="w-4 h-4 text-rose-600" />
    },
    {
      role: 'hr',
      title: 'مسؤول الموارد البشرية (HR)',
      desc: 'إدارة الموظفين والورديات واعتماد الإجازات والتقارير',
      icon: <Briefcase className="w-4 h-4 text-indigo-600" />
    },
    {
      role: 'manager',
      title: 'مدير القسم (Department Head)',
      desc: 'متابعة حضور موظفي القسم واعتماد إجازاتهم',
      icon: <Users className="w-4 h-4 text-emerald-600" />
    },
    {
      role: 'employee',
      title: 'الموظف (Employee Self-Service)',
      desc: 'تسجيل الحضور/الانصراف وطلب الإجازات ومراجعة الرصيد',
      icon: <User className="w-4 h-4 text-amber-600" />
    }
  ];

  const filteredNotifs = notifications.filter(n => {
    if (notifFilter === 'ALL') return true;
    return n.type === notifFilter;
  });

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case 'leave_request':
        return <CalendarDays className="w-4 h-4 text-purple-600" />;
      case 'late_arrival':
        return <ClockAlert className="w-4 h-4 text-amber-600" />;
      case 'absence':
        return <UserX className="w-4 h-4 text-rose-600" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="تبديل القائمة"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  دَوَام
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  PRO HR
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block truncate max-w-[200px]">
                {settings.companyName}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live clock and date */}
        <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-slate-700">
          <Clock className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span className="text-sm font-semibold tracking-wide text-slate-800">{currentTime}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="text-xs text-slate-500">{currentDate}</span>
        </div>

        {/* Right actions: Quick punch, Notifications, Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Punch Button */}
          <button
            onClick={onOpenQuickPunch}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium text-xs sm:text-sm shadow-sm shadow-emerald-200 active:scale-95 transition-all cursor-pointer"
          >
            <Fingerprint className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            <span>تسجيل البصمة</span>
          </button>

          {/* Interactive Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotifDropdownOpen(!isNotifDropdownOpen);
                setIsRoleDropdownOpen(false);
              }}
              className={`relative p-2 rounded-xl transition-all cursor-pointer ${
                isNotifDropdownOpen
                  ? 'bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title="مركز الإشعارات والتنبيهات"
            >
              <Bell className={`w-5 h-5 ${unreadNotificationsCount > 0 ? 'text-indigo-600 animate-swing' : ''}`} />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-bounce">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {isNotifDropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header */}
                <div className="flex items-center justify-between pb-2.5 px-1 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900">التنبيهات والإشعارات</h4>
                    {unreadNotificationsCount > 0 && (
                      <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full font-bold">
                        {unreadNotificationsCount} جديد
                      </span>
                    )}
                  </div>

                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>قراءة الكل</span>
                    </button>
                  )}
                </div>

                {/* Filter chips */}
                <div className="flex items-center gap-1.5 px-1 pb-2">
                  <button
                    onClick={() => setNotifFilter('ALL')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                      notifFilter === 'ALL'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    الكل
                  </button>
                  <button
                    onClick={() => setNotifFilter('leave_request')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                      notifFilter === 'leave_request'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    الإجازات
                  </button>
                  <button
                    onClick={() => setNotifFilter('late_arrival')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                      notifFilter === 'late_arrival'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    التأخيرات
                  </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
                  {filteredNotifs.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      لا توجد تنبيهات مطابقة حالياً
                    </div>
                  ) : (
                    filteredNotifs.slice(0, 6).map(notif => (
                      <div
                        key={notif.id}
                        className={`p-2.5 rounded-2xl border transition-all text-xs flex items-start justify-between gap-2.5 ${
                          notif.isRead
                            ? 'bg-slate-50/60 border-slate-100'
                            : 'bg-indigo-50/70 border-indigo-150 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 flex-1 overflow-hidden">
                          <div className="p-1.5 rounded-xl bg-white border border-slate-100 shadow-2xs shrink-0 mt-0.5">
                            {getNotifIcon(notif.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-bold text-slate-900 truncate">
                                {notif.title}
                              </span>
                              <span className="text-[10px] text-slate-400 font-sans shrink-0 mr-1">
                                {notif.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>

                            {/* Action Link */}
                            <div className="mt-2 flex items-center gap-2">
                              {notif.linkTab && (
                                <button
                                  onClick={() => {
                                    markNotificationAsRead(notif.id);
                                    onNavigate(notif.linkTab!);
                                    setIsNotifDropdownOpen(false);
                                  }}
                                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                                >
                                  <span>اتخاذ إجراء</span>
                                  <ArrowUpRight className="w-3 h-3" />
                                </button>
                              )}
                              {!notif.isRead && (
                                <button
                                  onClick={() => markNotificationAsRead(notif.id)}
                                  className="text-[10px] text-slate-400 hover:text-slate-600"
                                >
                                  تحديد كمقروء
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="حذف"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer link to full notification center */}
                <div className="mt-2.5 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      onNavigate('notifications');
                      setIsNotifDropdownOpen(false);
                    }}
                    className="w-full py-2 text-center rounded-xl bg-slate-50 hover:bg-indigo-50 text-indigo-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>مركز التنبيهات والإشعارات الكامل</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher & User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setIsRoleDropdownOpen(!isRoleDropdownOpen);
                setIsNotifDropdownOpen(false);
              }}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover ring-2 ring-indigo-500/20"
              />
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-medium text-indigo-600 flex items-center gap-1">
                  <span>
                    {currentUser.role === 'admin'
                      ? 'مدير النظام'
                      : currentUser.role === 'hr'
                      ? 'مسؤول HR'
                      : currentUser.role === 'manager'
                      ? 'مدير قسم'
                      : 'موظف'}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 mb-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    تبديل الصلاحية والتجربة (RBAC)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    يمكنك التبديل بين الأدوار المختلفة لاختبار تجربة الاستخدام والصلاحيات.
                  </div>
                </div>

                <div className="space-y-1">
                  {roles.map(item => (
                    <button
                      key={item.role}
                      onClick={() => {
                        switchRole(item.role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-right p-2.5 rounded-xl flex items-start gap-2.5 transition-colors cursor-pointer ${
                        currentUser.role === item.role
                          ? 'bg-indigo-50/80 border border-indigo-200'
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-white shadow-2xs border border-slate-100 mt-0.5">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                          <span>{item.title}</span>
                          {currentUser.role === item.role && (
                            <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded-full">
                              الحالي
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {item.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setIsRoleDropdownOpen(false);
                    }}
                    className="w-full text-right px-3 py-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>إعدادات النظام والمؤسسة</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
