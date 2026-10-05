import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Employee,
  Shift,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  SystemUser,
  AuditLog,
  CompanySettings,
  UserRole,
  AppNotification,
  NotificationPreferences
} from '../types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_SHIFTS,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_LEAVE_BALANCES,
  INITIAL_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_COMPANY_SETTINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_NOTIFICATION_PREFERENCES,
  getTodayDateString
} from '../data/initialData';
import confetti from 'canvas-confetti';

interface AppContextType {
  employees: Employee[];
  shifts: Shift[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  leaveBalances: Record<string, LeaveBalance>;
  users: SystemUser[];
  auditLogs: AuditLog[];
  settings: CompanySettings;
  currentUser: SystemUser;
  setCurrentUser: (user: SystemUser) => void;
  switchRole: (role: UserRole) => void;
  
  // Employee methods
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  // Shift methods
  addShift: (shift: Omit<Shift, 'id'>) => void;
  updateShift: (id: string, shift: Partial<Shift>) => void;
  deleteShift: (id: string) => void;
  
  // Attendance methods
  punchIn: (employeeId: string, method?: 'kiosk' | 'self' | 'biometric' | 'manual', customTime?: string) => { success: boolean; message: string; record?: AttendanceRecord };
  punchOut: (employeeId: string, customTime?: string) => { success: boolean; message: string; record?: AttendanceRecord };
  updateAttendanceRecord: (recordId: string, updates: Partial<AttendanceRecord>) => void;
  deleteAttendanceRecord: (recordId: string) => void;
  manualAddAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  
  // Leave methods
  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'>) => void;
  approveLeaveRequest: (reqId: string, notes?: string) => void;
  rejectLeaveRequest: (reqId: string, notes?: string) => void;
  
  // Notification methods
  notifications: AppNotification[];
  notificationPreferences: NotificationPreferences;
  unreadNotificationsCount: number;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;

  // Settings methods
  updateSettings: (newSettings: Partial<CompanySettings>) => void;
  
  // User & RBAC methods
  addUser: (user: Omit<SystemUser, 'id'>) => void;
  updateUser: (id: string, user: Partial<SystemUser>) => void;
  deleteUser: (id: string) => void;
  
  // Helper
  addAuditLog: (action: string, details: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('dawam_eg_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [shifts, setShifts] = useState<Shift[]>(() => {
    const saved = localStorage.getItem('dawam_eg_shifts');
    return saved ? JSON.parse(saved) : INITIAL_SHIFTS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('dawam_eg_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('dawam_eg_leave_requests');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [leaveBalances, setLeaveBalances] = useState<Record<string, LeaveBalance>>(() => {
    const saved = localStorage.getItem('dawam_eg_leave_balances');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_BALANCES;
  });

  const [users, setUsers] = useState<SystemUser[]>(() => {
    const saved = localStorage.getItem('dawam_eg_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('dawam_eg_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [settings, setSettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('dawam_eg_settings');
    return saved ? JSON.parse(saved) : INITIAL_COMPANY_SETTINGS;
  });

  const [currentUser, setCurrentUser] = useState<SystemUser>(() => {
    const saved = localStorage.getItem('dawam_eg_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('dawam_eg_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(() => {
    const saved = localStorage.getItem('dawam_eg_notification_prefs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATION_PREFERENCES;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('dawam_eg_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('dawam_eg_shifts', JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem('dawam_eg_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('dawam_eg_leave_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('dawam_eg_leave_balances', JSON.stringify(leaveBalances));
  }, [leaveBalances]);

  useEffect(() => {
    localStorage.setItem('dawam_eg_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('dawam_eg_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('dawam_eg_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('dawam_eg_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('dawam_eg_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('dawam_eg_notification_prefs', JSON.stringify(notificationPreferences));
  }, [notificationPreferences]);

  const addNotification = (notifData: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const now = new Date();
    const timeStr = `اليوم ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newNotif: AppNotification = {
      ...notifData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: timeStr,
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateNotificationPreferences = (prefs: Partial<NotificationPreferences>) => {
    setNotificationPreferences(prev => ({ ...prev, ...prefs }));
    addAuditLog('تحديث تفضيلات الإشعارات', 'تم تعديل إعدادات التنبيهات');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const addAuditLog = (action: string, details: string) => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: timeStr,
      userName: currentUser.name,
      userRole: currentUser.role === 'admin' ? 'مدير النظام' : currentUser.role === 'hr' ? 'مسؤول الموارد البشرية' : currentUser.role === 'manager' ? 'مدير قسم' : 'موظف',
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  const switchRole = (role: UserRole) => {
    const found = users.find(u => u.role === role) || {
      id: `usr-${role}`,
      name: role === 'admin' ? 'مدير النظام' : role === 'hr' ? 'مسؤول الموارد البشرية' : role === 'manager' ? 'مدير قسم' : 'موظف',
      email: `${role}@dawam.sa`,
      role,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      status: 'active'
    };
    setCurrentUser(found);
    addAuditLog('تبديل الجلسة', `تم التبديل إلى دور (${found.name})`);
  };

  // Employees
  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newId = `emp-${Date.now()}`;
    const newEmp: Employee = { ...empData, id: newId };
    setEmployees(prev => [newEmp, ...prev]);
    
    // Init leave balance
    setLeaveBalances(prev => ({
      ...prev,
      [newId]: {
        employeeId: newId,
        annualTotal: 30,
        annualUsed: 0,
        sickTotal: 15,
        sickUsed: 0,
        emergencyTotal: 5,
        emergencyUsed: 0
      }
    }));

    addAuditLog('إضافة موظف', `تمت إضافة الموظف الجديد ${empData.name} برقم ${empData.code}`);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
    const emp = employees.find(e => e.id === id);
    addAuditLog('تعديل موظف', `تم تحديث بيانات الموظف ${emp?.name || id}`);
  };

  const deleteEmployee = (id: string) => {
    const emp = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    addAuditLog('حذف موظف', `تم حذف الموظف ${emp?.name || id}`);
  };

  // Shifts
  const addShift = (shiftData: Omit<Shift, 'id'>) => {
    const newShift: Shift = { ...shiftData, id: `shift-${Date.now()}` };
    setShifts(prev => [...prev, newShift]);
    addAuditLog('إضافة وردية', `تم إنشاء وردية جديدة: ${shiftData.name}`);
  };

  const updateShift = (id: string, updates: Partial<Shift>) => {
    setShifts(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    addAuditLog('تعديل وردية', `تم تعديل بيانات الوردية`);
  };

  const deleteShift = (id: string) => {
    setShifts(prev => prev.filter(s => s.id !== id));
    addAuditLog('حذف وردية', `تم حذف الوردية`);
  };

  // Attendance Punch
  const punchIn = (
    employeeId: string,
    method: 'kiosk' | 'self' | 'biometric' | 'manual' = 'self',
    customTime?: string
  ) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return { success: false, message: 'الموظف غير موجود بالنظام' };
    if (emp.status === 'inactive') return { success: false, message: 'الموظف غير نشط حالياً' };

    const today = getTodayDateString();
    const existing = attendance.find(a => a.employeeId === employeeId && a.date === today);

    if (existing && existing.checkIn) {
      return {
        success: false,
        message: `تم تسجيل الحضور مسبقاً اليوم للموظف (${emp.name}) الساعة ${existing.checkIn}`
      };
    }

    const now = new Date();
    const timeStr = customTime || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Calculate late arrival based on shift
    const shift = shifts.find(s => s.id === emp.shiftId) || shifts[0];
    const [shiftHour, shiftMin] = (shift?.startTime || '08:00').split(':').map(Number);
    const [punchHour, punchMin] = timeStr.split(':').map(Number);

    const shiftTotalMinutes = shiftHour * 60 + shiftMin + (shift?.gracePeriodMins || 15);
    const punchTotalMinutes = punchHour * 60 + punchMin;

    let lateMinutes = 0;
    let status: AttendanceRecord['status'] = 'present';

    if (punchTotalMinutes > shiftTotalMinutes) {
      lateMinutes = punchTotalMinutes - (shiftHour * 60 + shiftMin);
      status = 'late';
    }

    const newRecord: AttendanceRecord = existing
      ? {
          ...existing,
          checkIn: timeStr,
          status,
          lateMinutes,
          method
        }
      : {
          id: `att-${Date.now()}`,
          employeeId: emp.id,
          employeeName: emp.name,
          employeeCode: emp.code,
          department: emp.department,
          branch: emp.branch,
          date: today,
          checkIn: timeStr,
          checkOut: null,
          status,
          lateMinutes,
          earlyLeaveMinutes: 0,
          workHours: 0,
          overtimeHours: 0,
          method
        };

    setAttendance(prev => {
      if (existing) {
        return prev.map(a => (a.id === existing.id ? newRecord : a));
      }
      return [newRecord, ...prev];
    });

    if (status === 'late' && notificationPreferences.notifyOnLateArrival && lateMinutes >= notificationPreferences.lateThresholdMins) {
      addNotification({
        title: `تنبيه تأخير: ${emp.name}`,
        message: `سجل الموظف ${emp.name} (${emp.department}) حضوراً الساعة ${timeStr} بتأخير قدره ${lateMinutes} دقيقة عن الوردية.`,
        type: 'late_arrival',
        priority: 'medium',
        linkTab: 'attendance',
        employeeName: emp.name,
        employeeAvatar: emp.avatar
      });
    }

    addAuditLog('تسجيل حضور', `تم تسجيل حضور الموظف ${emp.name} في تمام ${timeStr}`);
    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    } catch {}

    return {
      success: true,
      message: status === 'late'
        ? `تم تسجيل الحضور متأخراً (${lateMinutes} دقيقة) الساعة ${timeStr}`
        : `تم تسجيل الحضور في الموعد الساعة ${timeStr}`,
      record: newRecord
    };
  };

  const punchOut = (employeeId: string, customTime?: string) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return { success: false, message: 'الموظف غير موجود' };

    const today = getTodayDateString();
    const existing = attendance.find(a => a.employeeId === employeeId && a.date === today);

    if (!existing || !existing.checkIn) {
      return { success: false, message: 'يجب تسجيل الحضور أولاً قبل تسجيل الانصراف' };
    }

    if (existing.checkOut) {
      return {
        success: false,
        message: `تم تسجيل الانصراف مسبقاً اليوم للموظف (${emp.name}) الساعة ${existing.checkOut}`
      };
    }

    const now = new Date();
    const timeStr = customTime || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Calculate work hours
    const [inH, inM] = existing.checkIn.split(':').map(Number);
    const [outH, outM] = timeStr.split(':').map(Number);

    let diffMinutes = (outH * 60 + outM) - (inH * 60 + inM);
    if (diffMinutes < 0) diffMinutes += 24 * 60; // overnight shift

    const workHours = Number((diffMinutes / 60).toFixed(2));

    // Shift compare
    const shift = shifts.find(s => s.id === emp.shiftId) || shifts[0];
    const [shiftOutH, shiftOutM] = (shift?.endTime || '16:00').split(':').map(Number);
    const shiftEndMinutes = shiftOutH * 60 + shiftOutM;
    const punchEndMinutes = outH * 60 + outM;

    let earlyLeaveMinutes = 0;
    let overtimeHours = 0;

    if (punchEndMinutes < shiftEndMinutes) {
      earlyLeaveMinutes = shiftEndMinutes - punchEndMinutes;
    } else if (workHours > (shift?.totalHours || 8)) {
      overtimeHours = Number((workHours - (shift?.totalHours || 8)).toFixed(2));
    }

    const updatedRecord: AttendanceRecord = {
      ...existing,
      checkOut: timeStr,
      workHours,
      earlyLeaveMinutes,
      overtimeHours,
      status: earlyLeaveMinutes > 30 && existing.status !== 'late' ? 'early_leave' : existing.status
    };

    setAttendance(prev => prev.map(a => (a.id === existing.id ? updatedRecord : a)));
    addAuditLog('تسجيل انصراف', `تم تسجيل انصراف الموظف ${emp.name} في ${timeStr} بإجمالي ${workHours} ساعة`);

    return {
      success: true,
      message: `تم تسجيل الانصراف بنجاح الساعة ${timeStr} (إجمالي الساعات: ${workHours})`,
      record: updatedRecord
    };
  };

  const updateAttendanceRecord = (recordId: string, updates: Partial<AttendanceRecord>) => {
    setAttendance(prev => prev.map(a => (a.id === recordId ? { ...a, ...updates } : a)));
    addAuditLog('تعديل سجل حضور', `تم تعديل السجل يدويًا`);
  };

  const deleteAttendanceRecord = (recordId: string) => {
    setAttendance(prev => prev.filter(a => a.id !== recordId));
    addAuditLog('حذف سجل حضور', `تم حذف سجل الحضور`);
  };

  const manualAddAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = { ...record, id: `att-${Date.now()}` };
    setAttendance(prev => [newRecord, ...prev]);
    addAuditLog('إضافة سجل حضور يدوي', `إضافة سجل حضور للموظف ${record.employeeName}`);
  };

  // Leaves
  const submitLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'>) => {
    const today = getTodayDateString();
    const newRequest: LeaveRequest = {
      ...req,
      id: `leave-${Date.now()}`,
      appliedAt: today,
      status: 'pending'
    };
    setLeaveRequests(prev => [newRequest, ...prev]);

    if (notificationPreferences.notifyOnLeaveRequest) {
      addNotification({
        title: `طلب إجازة جديد: ${req.employeeName}`,
        message: `قدم ${req.employeeName} (${req.department}) طلباً لإجازة ${
          req.leaveType === 'annual'
            ? 'اعتيادية سنوية'
            : req.leaveType === 'sick'
            ? 'مرضية'
            : req.leaveType === 'emergency'
            ? 'اضطرارية طارئة'
            : 'أخرى'
        } لمدة ${req.daysCount} أيام بانتظار الاعتماد.`,
        type: 'leave_request',
        priority: 'high',
        linkTab: 'leaves',
        referenceId: newRequest.id,
        employeeName: req.employeeName,
        employeeAvatar: employees.find(e => e.id === req.employeeId)?.avatar
      });
    }

    addAuditLog('طلب إجازة', `قدم الموظف ${req.employeeName} طلب إجازة لمدة ${req.daysCount} يوم`);
    try {
      confetti({ particleCount: 20 });
    } catch {}
  };

  const approveLeaveRequest = (reqId: string, notes?: string) => {
    const request = leaveRequests.find(r => r.id === reqId);
    if (!request) return;

    setLeaveRequests(prev =>
      prev.map(r =>
        r.id === reqId
          ? {
              ...r,
              status: 'approved',
              reviewedBy: currentUser.name,
              reviewNotes: notes || 'تمت الموافقة من قِبل الإدارة'
            }
          : r
      )
    );

    // Deduct from balance
    setLeaveBalances(prev => {
      const current = prev[request.employeeId] || {
        employeeId: request.employeeId,
        annualTotal: 30,
        annualUsed: 0,
        sickTotal: 15,
        sickUsed: 0,
        emergencyTotal: 5,
        emergencyUsed: 0
      };

      if (request.leaveType === 'annual') {
        return {
          ...prev,
          [request.employeeId]: {
            ...current,
            annualUsed: current.annualUsed + request.daysCount
          }
        };
      } else if (request.leaveType === 'sick') {
        return {
          ...prev,
          [request.employeeId]: {
            ...current,
            sickUsed: current.sickUsed + request.daysCount
          }
        };
      } else if (request.leaveType === 'emergency') {
        return {
          ...prev,
          [request.employeeId]: {
            ...current,
            emergencyUsed: current.emergencyUsed + request.daysCount
          }
        };
      }
      return prev;
    });

    addAuditLog('اعتماد إجازة', `تمت الموافقة على طلب إجازة ${request.employeeName} (${request.daysCount} يوم)`);
    try {
      confetti({ particleCount: 50, spread: 80 });
    } catch {}
  };

  const rejectLeaveRequest = (reqId: string, notes?: string) => {
    const request = leaveRequests.find(r => r.id === reqId);
    if (!request) return;

    setLeaveRequests(prev =>
      prev.map(r =>
        r.id === reqId
          ? {
              ...r,
              status: 'rejected',
              reviewedBy: currentUser.name,
              reviewNotes: notes || 'تم الرفض لمتطلبات ضغط العمل'
            }
          : r
      )
    );

    addAuditLog('رفض إجازة', `تم رفض طلب إجازة ${request.employeeName}`);
  };

  // Settings
  const updateSettings = (newSettings: Partial<CompanySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addAuditLog('تعديل الإعدادات', 'تم تحديث إعدادات المؤسسة');
  };

  // User RBAC
  const addUser = (userData: Omit<SystemUser, 'id'>) => {
    const newUser: SystemUser = { ...userData, id: `usr-${Date.now()}` };
    setUsers(prev => [...prev, newUser]);
    addAuditLog('إضافة مستخدم', `تم إنشاء حساب مستخدم جديد: ${userData.name}`);
  };

  const updateUser = (id: string, updates: Partial<SystemUser>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
    addAuditLog('تعديل مستخدم', `تم تعديل بيانات المستخدم`);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    addAuditLog('حذف مستخدم', `تم حذف حساب المستخدم`);
  };

  const resetAllData = () => {
    setEmployees(INITIAL_EMPLOYEES);
    setShifts(INITIAL_SHIFTS);
    setAttendance(INITIAL_ATTENDANCE);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setLeaveBalances(INITIAL_LEAVE_BALANCES);
    setUsers(INITIAL_USERS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSettings(INITIAL_COMPANY_SETTINGS);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.clear();
    addAuditLog('إعادة ضبط النظام', 'تمت استعادة البيانات الافتراضية للنظام');
  };

  return (
    <AppContext.Provider
      value={{
        employees,
        shifts,
        attendance,
        leaveRequests,
        leaveBalances,
        users,
        auditLogs,
        settings,
        currentUser,
        setCurrentUser,
        switchRole,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addShift,
        updateShift,
        deleteShift,
        punchIn,
        punchOut,
        updateAttendanceRecord,
        deleteAttendanceRecord,
        manualAddAttendance,
        submitLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
        updateSettings,
        addUser,
        updateUser,
        deleteUser,
        addAuditLog,
        resetAllData,
        notifications,
        notificationPreferences,
        unreadNotificationsCount,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        updateNotificationPreferences
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
