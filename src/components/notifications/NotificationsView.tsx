import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationType, AppNotification } from '../../types';
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  CalendarDays,
  ClockAlert,
  UserX,
  ShieldCheck,
  Megaphone,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Settings,
  Volume2,
  VolumeX,
  AlertTriangle,
  Send,
  Sparkles,
  X
} from 'lucide-react';

interface NotificationsViewProps {
  onNavigate: (tab: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onNavigate }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    addNotification,
    notificationPreferences,
    updateNotificationPreferences,
    approveLeaveRequest,
    rejectLeaveRequest,
    currentUser,
    settings
  } = useApp();

  const [activeTypeFilter, setActiveTypeFilter] = useState<'ALL' | NotificationType>('ALL');
  const [readFilter, setReadFilter] = useState<'ALL' | 'unread' | 'read'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Broadcast Announcement Modal
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Notification Preferences Panel
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchType = activeTypeFilter === 'ALL' || n.type === activeTypeFilter;
      const matchRead =
        readFilter === 'ALL' ||
        (readFilter === 'unread' && !n.isRead) ||
        (readFilter === 'read' && n.isRead);
      const matchSearch =
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (n.employeeName && n.employeeName.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchType && matchRead && matchSearch;
    });
  }, [notifications, activeTypeFilter, readFilter, searchTerm]);

  // Counts
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const leaveAlertsCount = notifications.filter(n => n.type === 'leave_request').length;
  const lateAlertsCount = notifications.filter(n => n.type === 'late_arrival' || n.type === 'absence').length;

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.title.trim() || !broadcastForm.message.trim()) return;

    addNotification({
      title: broadcastForm.title,
      message: broadcastForm.message,
      type: 'announcement',
      priority: broadcastForm.priority,
      employeeName: currentUser.name
    });

    setIsBroadcastModalOpen(false);
    setBroadcastForm({ title: '', message: '', priority: 'medium' });
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'leave_request':
        return <CalendarDays className="w-5 h-5 text-purple-600" />;
      case 'late_arrival':
        return <ClockAlert className="w-5 h-5 text-amber-600" />;
      case 'absence':
        return <UserX className="w-5 h-5 text-rose-600" />;
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-blue-600" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getNotificationBadgeClass = (type: NotificationType) => {
    switch (type) {
      case 'leave_request':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'late_arrival':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'absence':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'announcement':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
  };

  const getNotificationLabel = (type: NotificationType) => {
    switch (type) {
      case 'leave_request':
        return 'طلب إجازة';
      case 'late_arrival':
        return 'تأخير حضور';
      case 'absence':
        return 'غياب موظف';
      case 'announcement':
        return 'تعميم إداري';
      default:
        return 'تنبيه نظام';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-indigo-600" />
            <span>مركز التنبيهات والإشعارات الإدارية</span>
            {unreadCount > 0 && (
              <span className="text-xs bg-rose-500 text-white font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                {unreadCount} جديد
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            متابعة فورية لطلبات الإجازات الجديدة، حالات التأخير، وتنبيهات الغياب مع إمكانية اتخاذ إجراء مباشر
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsPreferencesOpen(!isPreferencesOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>تفضيلات التنبيهات</span>
          </button>

          {currentUser.role !== 'employee' && (
            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Megaphone className="w-4 h-4" />
              <span>إرسال تعميم / تنبيه</span>
            </button>
          )}

          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-bold border border-indigo-200 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>تحديد الكل كمقروء</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Overview Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-xs text-slate-500 font-semibold block mb-1">إجمالي الإشعارات</span>
          <span className="text-2xl font-black text-slate-900 font-sans">{notifications.length}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-xs text-slate-500 font-semibold block mb-1">غير المقروءة</span>
          <span className="text-2xl font-black text-rose-600 font-sans">{unreadCount}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-xs text-slate-500 font-semibold block mb-1">طلبات الإجازات</span>
          <span className="text-2xl font-black text-purple-600 font-sans">{leaveAlertsCount}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-xs text-slate-500 font-semibold block mb-1">تنبيهات التأخير والغياب</span>
          <span className="text-2xl font-black text-amber-600 font-sans">{lateAlertsCount}</span>
        </div>
      </div>

      {/* Preferences Panel Accordion */}
      {isPreferencesOpen && (
        <div className="bg-indigo-50/60 rounded-3xl border border-indigo-100 p-5 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-sm text-indigo-950">إعدادات وتفضيلات التنبيهات</h3>
            </div>
            <button
              onClick={() => setIsPreferencesOpen(false)}
              className="p-1 rounded-lg text-indigo-400 hover:text-indigo-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-indigo-100 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={notificationPreferences.notifyOnLeaveRequest}
                onChange={e =>
                  updateNotificationPreferences({ notifyOnLeaveRequest: e.target.checked })
                }
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="font-bold text-slate-800">تنبيه فوري عند تقديم أي طلب إجازة</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-indigo-100 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={notificationPreferences.notifyOnLateArrival}
                onChange={e =>
                  updateNotificationPreferences({ notifyOnLateArrival: e.target.checked })
                }
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="font-bold text-slate-800">تنبيه عند تسجيل حضور متأخر</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-indigo-100 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={notificationPreferences.notifyOnAbsence}
                onChange={e =>
                  updateNotificationPreferences({ notifyOnAbsence: e.target.checked })
                }
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="font-bold text-slate-800">تنبيه بحالات الغياب وتجاوز السماح</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-indigo-100 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={notificationPreferences.soundEnabled}
                onChange={e =>
                  updateNotificationPreferences({ soundEnabled: e.target.checked })
                }
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="font-bold text-slate-800">تشغيل نغمة تنبيه صوتية</span>
            </label>

            <div className="p-3 rounded-xl bg-white border border-indigo-100 flex items-center justify-between col-span-1 sm:col-span-2">
              <span className="font-bold text-slate-800">حد احتساب التأخير لإرسال تنبيه:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={notificationPreferences.lateThresholdMins}
                  onChange={e =>
                    updateNotificationPreferences({ lateThresholdMins: Number(e.target.value) })
                  }
                  className="w-16 font-sans px-2 py-1 rounded-lg border border-slate-200 text-center font-bold"
                />
                <span className="text-slate-500">دقيقة</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="البحث في نص الإشعار، الموظف، أو العنوان..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={activeTypeFilter}
              onChange={e => setActiveTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">كافة أنواع التنبيهات</option>
              <option value="leave_request">طلبات الإجازات الجديدة</option>
              <option value="late_arrival">تنبيهات التأخير</option>
              <option value="absence">تنبيهات الغياب</option>
              <option value="announcement">تعميمات إدارية</option>
              <option value="system">تنبيهات النظام</option>
            </select>
          </div>

          {/* Read / Unread Filter */}
          <div>
            <select
              value={readFilter}
              onChange={e => setReadFilter(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">الكل (المقروء وغير المقروء)</option>
              <option value="unread">غير المقروء فقط</option>
              <option value="read">المقروء فقط</option>
            </select>
          </div>
        </div>

        {/* Clear all action */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>يتم عرض {filteredNotifications.length} تنبيه</span>
            <button
              onClick={clearAllNotifications}
              className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح كافة الإشعارات</span>
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-base">لا توجد إشعارات حالياً</h3>
            <p className="text-xs text-slate-400 mt-1">
              ستصلك التنبيهات فور تسجيل أي موظف لتأخير أو تقديم طلب إجازة جديد.
            </p>
          </div>
        ) : (
          filteredNotifications.map(notif => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                notif.isRead
                  ? 'bg-white border-slate-200 shadow-2xs opacity-90'
                  : 'bg-indigo-50/40 border-indigo-200 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 flex-1">
                  {/* Icon */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-2xs mt-0.5 shrink-0">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getNotificationBadgeClass(
                          notif.type
                        )}`}
                      >
                        {getNotificationLabel(notif.type)}
                      </span>

                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      )}

                      <span className="text-[11px] text-slate-400 font-sans">{notif.timestamp}</span>

                      {notif.priority === 'high' && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                          أولوية عالية
                        </span>
                      )}
                    </div>

                    <h4 className="font-black text-slate-900 text-sm">{notif.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>

                    {/* Direct Quick Action Buttons */}
                    <div className="mt-3.5 flex flex-wrap items-center gap-2">
                      {notif.type === 'leave_request' && (
                        <>
                          <button
                            onClick={() => {
                              onNavigate('leaves');
                              markNotificationAsRead(notif.id);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors cursor-pointer"
                          >
                            <span>مراجعة طلب الإجازة</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>

                          {notif.referenceId && (
                            <button
                              onClick={() => {
                                approveLeaveRequest(notif.referenceId!);
                                markNotificationAsRead(notif.id);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>موافقة فورية</span>
                            </button>
                          )}
                        </>
                      )}

                      {notif.type === 'late_arrival' && (
                        <button
                          onClick={() => {
                            onNavigate('attendance');
                            markNotificationAsRead(notif.id);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer"
                        >
                          <span>عرض كشف الحضور والتأخير</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {notif.type === 'absence' && (
                        <button
                          onClick={() => {
                            onNavigate('attendance');
                            markNotificationAsRead(notif.id);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer"
                        >
                          <span>متابعة الغياب</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {!notif.isRead ? (
                        <button
                          onClick={() => markNotificationAsRead(notif.id)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          تحديد كمقروء
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="حذف الإشعار"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Broadcast Announcement Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">إرسال تعميم أو تنبيه إداري</h3>
              </div>
              <button
                onClick={() => setIsBroadcastModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  عنوان التعميم / التنبيه <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تنبيه هام بخصوص مواعيد العمل في رمضان"
                  value={broadcastForm.title}
                  onChange={e => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  مستوى الأولوية
                </label>
                <select
                  value={broadcastForm.priority}
                  onChange={e => setBroadcastForm({ ...broadcastForm, priority: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="low">عادي / منخفض</option>
                  <option value="medium">متوسط</option>
                  <option value="high">هام وعاجل (أولوية قصوى)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  نص التنبيه أو التعميم <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="اكتب التفاصيل هنا..."
                  value={broadcastForm.message}
                  onChange={e => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-300 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال التعميم الآن</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
