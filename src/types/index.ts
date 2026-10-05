export type UserRole = 'admin' | 'hr' | 'manager' | 'employee';

export interface Employee {
  id: string;
  code: string; // e.g. EMP-101
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  department: string;
  position: string;
  branch: string;
  hireDate: string;
  status: 'active' | 'inactive';
  avatar: string;
  shiftId: string;
  baseSalary?: number;
  gender: 'male' | 'female';
  insuranceNumber?: string; // الرقم التأميني بالهيئة القومية للتأمين الاجتماعي
}

export interface Shift {
  id: string;
  name: string;
  startTime: string; // "08:00"
  endTime: string;   // "16:00"
  gracePeriodMins: number; // e.g. 15
  workDays: number[]; // 0 = Sun, 1 = Mon, ..., 4 = Thu
  totalHours: number; // 8
  color: string;
}

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'leave' | 'early_leave';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  branch: string;
  date: string; // YYYY-MM-DD
  checkIn: string | null;  // "08:12"
  checkOut: string | null; // "16:05"
  status: AttendanceStatus;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  workHours: number;
  overtimeHours: number;
  method: 'kiosk' | 'self' | 'biometric' | 'manual';
  notes?: string;
}

export type LeaveType = 'annual' | 'sick' | 'emergency' | 'maternity' | 'unpaid';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface LeaveBalance {
  employeeId: string;
  annualTotal: number;
  annualUsed: number;
  sickTotal: number;
  sickUsed: number;
  emergencyTotal: number;
  emergencyUsed: number;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  employeeId?: string;
  avatar: string;
  lastLogin?: string;
  status: 'active' | 'inactive';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
}

export interface CompanySettings {
  companyName: string;
  companyNameEn: string;
  crNumber: string; // رقم السجل التجاري
  taxId: string;    // رقم التسجيل الضريبي (البطاقة الضريبية)
  insuranceEntityNumber: string; // الرقم التأميني للمنشأة
  email: string;
  phone: string;
  address: string;
  currency: string;
  branches: string[];
  departments: string[];
  defaultShiftId: string;
  biometricIp: string;
  biometricPort: number;
  biometricStatus: 'connected' | 'disconnected';
  autoGracePeriodMins: number;
}

export type NotificationType = 'leave_request' | 'late_arrival' | 'absence' | 'overtime' | 'system' | 'announcement';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  linkTab?: string;
  referenceId?: string;
  employeeName?: string;
  employeeAvatar?: string;
  data?: Record<string, any>;
}

export interface NotificationPreferences {
  notifyOnLeaveRequest: boolean;
  notifyOnLateArrival: boolean;
  notifyOnAbsence: boolean;
  notifyOnEarlyLeave: boolean;
  soundEnabled: boolean;
  lateThresholdMins: number;
}

