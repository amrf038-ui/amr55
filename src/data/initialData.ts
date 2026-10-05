import {
  Employee,
  Shift,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  SystemUser,
  AuditLog,
  CompanySettings,
  AppNotification,
  NotificationPreferences
} from '../types';

export const INITIAL_SHIFTS: Shift[] = [
  {
    id: 'shift-1',
    name: 'الوردية الصباحية المعتادة',
    startTime: '08:30',
    endTime: '16:30',
    gracePeriodMins: 15,
    workDays: [0, 1, 2, 3, 4], // الأحد إلى الخميس
    totalHours: 8,
    color: '#3B82F6'
  },
  {
    id: 'shift-2',
    name: 'وردية الدوام المرن',
    startTime: '09:00',
    endTime: '17:00',
    gracePeriodMins: 30,
    workDays: [0, 1, 2, 3, 4],
    totalHours: 8,
    color: '#10B981'
  },
  {
    id: 'shift-3',
    name: 'الوردية المسائية (الدعم الفني والتشغيل)',
    startTime: '16:00',
    endTime: '00:00',
    gracePeriodMins: 15,
    workDays: [0, 1, 2, 3, 4],
    totalHours: 8,
    color: '#8B5CF6'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    code: 'EMP-1001',
    name: 'م. أحمد مصطفى إبراهيم',
    email: 'ahmed.mostafa@nile-tech.com.eg',
    phone: '01001234567',
    nationalId: '29003150102435',
    insuranceNumber: '18923451',
    department: 'تكنولوجيا المعلومات والتحول الرقمي',
    position: 'مدير البنية الرقمية والتطوير',
    branch: 'المقر الرئيسي - القرية الذكية (الجيزة)',
    hireDate: '2021-03-15',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    shiftId: 'shift-1',
    baseSalary: 45000,
    gender: 'male'
  },
  {
    id: 'emp-2',
    code: 'EMP-1002',
    name: 'أ. سارة محمود الشناوي',
    email: 'sara.elshinawy@nile-tech.com.eg',
    phone: '01229876543',
    nationalId: '29307120104826',
    insuranceNumber: '20456123',
    department: 'الموارد البشرية والشؤون الإدارية',
    position: 'مديرة عمليات الموارد البشرية',
    branch: 'المقر الرئيسي - القرية الذكية (الجيزة)',
    hireDate: '2022-01-10',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    shiftId: 'shift-1',
    baseSalary: 36000,
    gender: 'female'
  },
  {
    id: 'emp-3',
    code: 'EMP-1003',
    name: 'د. محمد السيد حسن',
    email: 'm.elsayed@nile-tech.com.eg',
    phone: '01143219876',
    nationalId: '28805200101937',
    insuranceNumber: '15874239',
    department: 'الإدارة المالية والمراجعة',
    position: 'رئيس قطاع الحسابات والتدقيق',
    branch: 'فرع القاهرة الجديدة - التجمع الخامس',
    hireDate: '2020-07-01',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    shiftId: 'shift-1',
    baseSalary: 38000,
    gender: 'male'
  },
  {
    id: 'emp-4',
    code: 'EMP-1004',
    name: 'أ. نورهان خالد العوضي',
    email: 'nourhan.elawady@nile-tech.com.eg',
    phone: '01067891234',
    nationalId: '29509140203548',
    insuranceNumber: '23984512',
    department: 'التسويق والمبيعات وتطوير الأعمال',
    position: 'أخصائية تسويق رقمي وإعلام',
    branch: 'فرع الإسكندرية - سموحة',
    hireDate: '2023-04-12',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    shiftId: 'shift-2',
    baseSalary: 24000,
    gender: 'female'
  },
  {
    id: 'emp-5',
    code: 'EMP-1005',
    name: 'م. كريم أحمد الشاذلي',
    email: 'karim.elshazly@nile-tech.com.eg',
    phone: '01134567890',
    nationalId: '29411030105671',
    insuranceNumber: '25412987',
    department: 'تكنولوجيا المعلومات والتحول الرقمي',
    position: 'مهندس أمن سيبراني وشبكات',
    branch: 'المقر الرئيسي - القرية الذكية (الجيزة)',
    hireDate: '2022-09-01',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    shiftId: 'shift-1',
    baseSalary: 32000,
    gender: 'male'
  },
  {
    id: 'emp-6',
    code: 'EMP-1006',
    name: 'أ. ريم حسام الدين الجوهري',
    email: 'reem.elgohary@nile-tech.com.eg',
    phone: '01209871234',
    nationalId: '29608150104928',
    insuranceNumber: '28145693',
    department: 'الموارد البشرية والشؤون الإدارية',
    position: 'أخصائية استقطاب المواهب والتوظيف',
    branch: 'فرع القاهرة الجديدة - التجمع الخامس',
    hireDate: '2023-02-15',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    shiftId: 'shift-2',
    baseSalary: 21000,
    gender: 'female'
  },
  {
    id: 'emp-7',
    code: 'EMP-1007',
    name: 'م. يوسف هاني عبد الرحمن',
    email: 'youssef.hani@nile-tech.com.eg',
    phone: '01551239874',
    nationalId: '29108190104523',
    insuranceNumber: '19745823',
    department: 'العمليات اللوجستية وسلاسل الإمداد',
    position: 'مشرف سلاسل الإمداد والمستودعات',
    branch: 'فرع السادس من أكتوبر - المنطقة الصناعية',
    hireDate: '2021-11-20',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    shiftId: 'shift-3',
    baseSalary: 28000,
    gender: 'male'
  },
  {
    id: 'emp-8',
    code: 'EMP-1008',
    name: 'أ. ياسمين طارق الدسوقي',
    email: 'yasmin.eldosouky@nile-tech.com.eg',
    phone: '01062348765',
    nationalId: '29806110204739',
    insuranceNumber: '30456781',
    department: 'خدمة العملاء والدعم الفني',
    position: 'مسؤولة دعم العملاء وتجربة المستخدم',
    branch: 'فرع الإسكندرية - سموحة',
    hireDate: '2023-08-01',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171ed292022?w=150&auto=format&fit=crop&q=80',
    shiftId: 'shift-2',
    baseSalary: 18000,
    gender: 'female'
  },
  {
    id: 'emp-9',
    code: 'EMP-1009',
    name: 'أ. عمرو حسام عبد العظيم',
    email: 'amr.hossam@nile-tech.com.eg',
    phone: '01147654321',
    nationalId: '29612080102834',
    insuranceNumber: '31874590',
    department: 'العمليات اللوجستية وسلاسل الإمداد',
    position: 'منسق شحن وتوزيع',
    branch: 'المقر الرئيسي - القرية الذكية (الجيزة)',
    hireDate: '2024-01-15',
    status: 'inactive',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    shiftId: 'shift-1',
    baseSalary: 14500,
    gender: 'male'
  }
];

// Aligned with Egyptian Labor Law No. 12 of 2003 (21 days baseline annual / 30 for senior, 6 days casual/emergency)
export const INITIAL_LEAVE_BALANCES: Record<string, LeaveBalance> = {
  'emp-1': { employeeId: 'emp-1', annualTotal: 30, annualUsed: 6, sickTotal: 30, sickUsed: 1, emergencyTotal: 6, emergencyUsed: 1 },
  'emp-2': { employeeId: 'emp-2', annualTotal: 30, annualUsed: 8, sickTotal: 30, sickUsed: 2, emergencyTotal: 6, emergencyUsed: 2 },
  'emp-3': { employeeId: 'emp-3', annualTotal: 30, annualUsed: 15, sickTotal: 30, sickUsed: 0, emergencyTotal: 6, emergencyUsed: 1 },
  'emp-4': { employeeId: 'emp-4', annualTotal: 21, annualUsed: 4, sickTotal: 30, sickUsed: 0, emergencyTotal: 6, emergencyUsed: 0 },
  'emp-5': { employeeId: 'emp-5', annualTotal: 21, annualUsed: 7, sickTotal: 30, sickUsed: 3, emergencyTotal: 6, emergencyUsed: 2 },
  'emp-6': { employeeId: 'emp-6', annualTotal: 21, annualUsed: 12, sickTotal: 30, sickUsed: 1, emergencyTotal: 6, emergencyUsed: 1 },
  'emp-7': { employeeId: 'emp-7', annualTotal: 21, annualUsed: 5, sickTotal: 30, sickUsed: 0, emergencyTotal: 6, emergencyUsed: 0 },
  'emp-8': { employeeId: 'emp-8', annualTotal: 21, annualUsed: 2, sickTotal: 30, sickUsed: 0, emergencyTotal: 6, emergencyUsed: 0 },
  'emp-9': { employeeId: 'emp-9', annualTotal: 21, annualUsed: 0, sickTotal: 30, sickUsed: 0, emergencyTotal: 6, emergencyUsed: 0 }
};

export const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    employeeId: 'emp-1',
    employeeName: 'م. أحمد مصطفى إبراهيم',
    employeeCode: 'EMP-1001',
    department: 'تكنولوجيا المعلومات والتحول الرقمي',
    branch: 'المقر الرئيسي - القرية الذكية (الجيزة)',
    date: getTodayDateString(),
    checkIn: '08:22',
    checkOut: null,
    status: 'present',
    lateMinutes: 0,
    earlyLeaveMinutes: 0,
    workHours: 0,
    overtimeHours: 0,
    method: 'biometric',
    notes: 'حضور مبكر وملتزم بوردية القرية الذكية'
  },
  {
    id: 'att-2',
    employeeId: 'emp-2',
    employeeName: 'أ. سارة محمود الشناوي',
    employeeCode: 'EMP-1002',
    department: 'الموارد البشرية والشؤون الإدارية',
    branch: 'المقر الرئيسي - القرية الذكية (الجيزة)',
    date: getTodayDateString(),
    checkIn: '08:29',
    checkOut: null,
    status: 'present',
    lateMinutes: 0,
    earlyLeaveMinutes: 0,
    workHours: 0,
    overtimeHours: 0,
    method: 'kiosk'
  },
  {
    id: 'att-3',
    employeeId: 'emp-3',
    employeeName: 'د. محمد السيد حسن',
    employeeCode: 'EMP-1003',
    department: 'الإدارة المالية والمراجعة',
    branch: 'فرع القاهرة الجديدة - التجمع الخامس',
    date: getTodayDateString(),
    checkIn: '09:12',
    checkOut: null,
    status: 'late',
    lateMinutes: 42,
    earlyLeaveMinutes: 0,
    workHours: 0,
    overtimeHours: 0,
    method: 'self',
    notes: 'تأخير بسبب كثافة مرورية على الطريق الدائري محور المشير'
  },
  {
    id: 'att-4',
    employeeId: 'emp-4',
    employeeName: 'أ. نورهان خالد العوضي',
    employeeCode: 'EMP-1004',
    department: 'التسويق والمبيعات وتطوير الأعمال',
    branch: 'فرع الإسكندرية - سموحة',
    date: getTodayDateString(),
    checkIn: '09:05',
    checkOut: null,
    status: 'present',
    lateMinutes: 0,
    earlyLeaveMinutes: 0,
    workHours: 0,
    overtimeHours: 0,
    method: 'biometric'
  },
  {
    id: 'att-5',
    employeeId: 'emp-5',
    employeeName: 'م. كريم أحمد الشاذلي',
    employeeCode: 'EMP-1005',
    department: 'تكنولوجيا المعلومات والتحول الرقمي',
    branch: 'المقر الرئيسي - القرية الذكية (الجيزة)',
    date: getTodayDateString(),
    checkIn: null,
    checkOut: null,
    status: 'absent',
    lateMinutes: 0,
    earlyLeaveMinutes: 0,
    workHours: 0,
    overtimeHours: 0,
    method: 'manual',
    notes: 'لم يسجل حضور حتى الآن'
  },
  {
    id: 'att-6',
    employeeId: 'emp-6',
    employeeName: 'أ. ريم حسام الدين الجوهري',
    employeeCode: 'EMP-1006',
    department: 'الموارد البشرية والشؤون الإدارية',
    branch: 'فرع القاهرة الجديدة - التجمع الخامس',
    date: getTodayDateString(),
    checkIn: null,
    checkOut: null,
    status: 'leave',
    lateMinutes: 0,
    earlyLeaveMinutes: 0,
    workHours: 0,
    overtimeHours: 0,
    method: 'manual',
    notes: 'إجازة اعتيادية معتمدة وفق القانون'
  },
  {
    id: 'att-7',
    employeeId: 'emp-7',
    employeeName: 'م. يوسف هاني عبد الرحمن',
    employeeCode: 'EMP-1007',
    department: 'العمليات اللوجستية وسلاسل الإمداد',
    branch: 'فرع السادس من أكتوبر - المنطقة الصناعية',
    date: getTodayDateString(),
    checkIn: '15:52',
    checkOut: null,
    status: 'present',
    lateMinutes: 0,
    earlyLeaveMinutes: 0,
    workHours: 0,
    overtimeHours: 0,
    method: 'biometric'
  },
  {
    id: 'att-8',
    employeeId: 'emp-8',
    employeeName: 'أ. ياسمين طارق الدسوقي',
    employeeCode: 'EMP-1008',
    department: 'خدمة العملاء والدعم الفني',
    branch: 'فرع الإسكندرية - سموحة',
    date: getTodayDateString(),
    checkIn: '09:18',
    checkOut: null,
    status: 'present',
    lateMinutes: 0,
    earlyLeaveMinutes: 0,
    workHours: 0,
    overtimeHours: 0,
    method: 'kiosk'
  }
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'emp-6',
    employeeName: 'أ. ريم حسام الدين الجوهري',
    employeeCode: 'EMP-1006',
    department: 'الموارد البشرية والشؤون الإدارية',
    leaveType: 'annual',
    startDate: getTodayDateString(),
    endDate: '2026-10-09',
    daysCount: 5,
    reason: 'إجازة اعتيادية سنوية للسفر مع الأسرة',
    status: 'approved',
    appliedAt: '2026-10-01',
    reviewedBy: 'أ. سارة الشناوي',
    reviewNotes: 'تمت الموافقة وتكليف الزميل بالمهام'
  },
  {
    id: 'leave-2',
    employeeId: 'emp-4',
    employeeName: 'أ. نورهان خالد العوضي',
    employeeCode: 'EMP-1004',
    department: 'التسويق والمبيعات وتطوير الأعمال',
    leaveType: 'emergency',
    startDate: '2026-10-12',
    endDate: '2026-10-13',
    daysCount: 2,
    reason: 'إجازة عارضة لظرف عائلي طارئ وفق المادة 51 من قانون العمل',
    status: 'pending',
    appliedAt: '2026-10-04'
  },
  {
    id: 'leave-3',
    employeeId: 'emp-1',
    employeeName: 'م. أحمد مصطفى إبراهيم',
    employeeCode: 'EMP-1001',
    department: 'تكنولوجيا المعلومات والتحول الرقمي',
    leaveType: 'sick',
    startDate: '2026-09-20',
    endDate: '2026-09-21',
    daysCount: 2,
    reason: 'وعكة صحية وإجراء فحوصات مع تقرير الهيئة العامة للتأمين الصحي',
    status: 'approved',
    appliedAt: '2026-09-19',
    reviewedBy: 'أ. سارة الشناوي',
    reviewNotes: 'تم إرفاق تقرير التأمين الصحي المعتمد'
  },
  {
    id: 'leave-4',
    employeeId: 'emp-3',
    employeeName: 'د. محمد السيد حسن',
    employeeCode: 'EMP-1003',
    department: 'الإدارة المالية والمراجعة',
    leaveType: 'annual',
    startDate: '2026-11-01',
    endDate: '2026-11-05',
    daysCount: 5,
    reason: 'إجازة اعتيادية بعد إتمام الإقفال المالي الربع سنوي ومراجعة الضرائب',
    status: 'pending',
    appliedAt: '2026-10-03'
  }
];

export const INITIAL_USERS: SystemUser[] = [
  {
    id: 'usr-1',
    name: 'م. طارق عبد المنعم الصاوي (مدير النظام)',
    email: 'admin@nile-tech.com.eg',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    lastLogin: 'منذ 5 دقائق',
    status: 'active'
  },
  {
    id: 'usr-2',
    name: 'أ. سارة محمود الشناوي (مدير الموارد البشرية)',
    email: 'sara.elshinawy@nile-tech.com.eg',
    role: 'hr',
    department: 'الموارد البشرية والشؤون الإدارية',
    employeeId: 'emp-2',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    lastLogin: 'منذ 20 دقيقة',
    status: 'active'
  },
  {
    id: 'usr-3',
    name: 'م. أحمد مصطفى إبراهيم (مدير تكنولوجيا المعلومات)',
    email: 'ahmed.mostafa@nile-tech.com.eg',
    role: 'manager',
    department: 'تكنولوجيا المعلومات والتحول الرقمي',
    employeeId: 'emp-1',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    lastLogin: 'منذ ساعة',
    status: 'active'
  },
  {
    id: 'usr-4',
    name: 'أ. نورهان خالد العوضي (موظفة تسويق)',
    email: 'nourhan.elawady@nile-tech.com.eg',
    role: 'employee',
    department: 'التسويق والمبيعات وتطوير الأعمال',
    employeeId: 'emp-4',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    lastLogin: 'اليوم 09:05',
    status: 'active'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-05 08:29:14',
    userName: 'سارة الشناوي',
    userRole: 'مدير الموارد البشرية',
    action: 'تسجيل حضور',
    details: 'تم تسجيل حضور الموظف رقم EMP-1002 عبر جهاز بصمة بوابة القرية الذكية'
  },
  {
    id: 'log-2',
    timestamp: '2026-10-04 15:30:10',
    userName: 'طارق الصاوي',
    userRole: 'مدير النظام',
    action: 'تعديل وردية',
    details: 'تعديل فترة السماح للوردية المرنة إلى 30 دقيقة طبقاً للائحة المنشأة'
  },
  {
    id: 'log-3',
    timestamp: '2026-10-03 11:20:45',
    userName: 'سارة الشناوي',
    userRole: 'مدير الموارد البشرية',
    action: 'اعتماد إجازة',
    details: 'الموافقة على طلب إجازة اعتيادية للموظفة ريم الجوهري لمدة 5 أيام'
  },
  {
    id: 'log-4',
    timestamp: '2026-10-01 09:00:18',
    userName: 'طارق الصاوي',
    userRole: 'مدير النظام',
    action: 'إضافة موظف',
    details: 'تسجيل بيانات موظف جديد بفرع الإسكندرية (سموحة) بالرقم القومي'
  }
];

export const INITIAL_COMPANY_SETTINGS: CompanySettings = {
  companyName: 'شركة النيل للحلول الرقمية وتكنولوجيا المعلومات (ش.م.م)',
  companyNameEn: 'Nile Digital Solutions & Tech S.A.E.',
  crNumber: '148920 - مكتب سجل تجاري القاهرة الاستثماري',
  taxId: '492-315-882 (مركز كبار الممولين)',
  insuranceEntityNumber: '10894522 (تأمينات وسط القاهرة)',
  email: 'hr@nile-tech.com.eg',
  phone: '+20 2 3539 8000',
  address: 'مبنى B14، القرية الذكية، طريق القاهرة - الإسكندرية الصحراوي، محافظة الجيزة، جمهورية مصر العربية',
  currency: 'EGP',
  branches: [
    'المقر الرئيسي - القرية الذكية (الجيزة)',
    'فرع القاهرة الجديدة - التجمع الخامس',
    'فرع الإسكندرية - سموحة',
    'فرع السادس من أكتوبر - المنطقة الصناعية'
  ],
  departments: [
    'تكنولوجيا المعلومات والتحول الرقمي',
    'الموارد البشرية والشؤون الإدارية',
    'الإدارة المالية والمراجعة',
    'التسويق والمبيعات وتطوير الأعمال',
    'العمليات اللوجستية وسلاسل الإمداد',
    'خدمة العملاء والدعم الفني'
  ],
  defaultShiftId: 'shift-1',
  biometricIp: '192.168.1.188',
  biometricPort: 4370,
  biometricStatus: 'connected',
  autoGracePeriodMins: 15
};

export const INITIAL_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  notifyOnLeaveRequest: true,
  notifyOnLateArrival: true,
  notifyOnAbsence: true,
  notifyOnEarlyLeave: true,
  soundEnabled: true,
  lateThresholdMins: 15
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'طلب إجازة عارضة جديد بانتظار الاعتماد',
    message: 'قدمت الموظفة نورهان خالد العوضي (فرع سموحة - الإسكندرية) طلباً لإجازة عارضة لمدة يومين تبدأ بتاريخ 2026-10-12 وفق قانون العمل المصري.',
    type: 'leave_request',
    timestamp: 'منذ 15 دقيقة',
    isRead: false,
    priority: 'high',
    linkTab: 'leaves',
    referenceId: 'leave-2',
    employeeName: 'أ. نورهان خالد العوضي',
    employeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'notif-2',
    title: 'تنبيه تأخير عن الوردية المقررة',
    message: 'سجل د. محمد السيد حسن (فرع التجمع الخامس) حضوراً الساعة 09:12 بتأخير قدره 42 دقيقة عن موعد الوردية الصباحية.',
    type: 'late_arrival',
    timestamp: 'اليوم 09:13',
    isRead: false,
    priority: 'medium',
    linkTab: 'attendance',
    employeeName: 'د. محمد السيد حسن',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'notif-3',
    title: 'تنبيه غياب موظف بدون إذن مسبق',
    message: 'الموظف م. كريم أحمد الشاذلي (القرية الذكية) لم يسجل حضوراً حتى الآن وتجاوزت فترة السماح بساعتين.',
    type: 'absence',
    timestamp: 'اليوم 10:30',
    isRead: false,
    priority: 'high',
    linkTab: 'attendance',
    employeeName: 'م. كريم أحمد الشاذلي',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'notif-4',
    title: 'طلب إجازة اعتيادية سنوية',
    message: 'قدم د. محمد السيد حسن طلب إجازة سنوية لمدة 5 أيام تبدأ بتاريخ 2026-11-01 بانتظار موافقة إدارة الموارد البشرية.',
    type: 'leave_request',
    timestamp: 'أمس 14:20',
    isRead: true,
    priority: 'medium',
    linkTab: 'leaves',
    referenceId: 'leave-4',
    employeeName: 'د. محمد السيد حسن',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'notif-5',
    title: 'مزامنة ناجحة مع جهاز بصمة القرية الذكية',
    message: 'تم تحديث سجلات الحضور لبوابة مبنى B14 بالقرية الذكية ومزامنة 124 حركة بنجاح.',
    type: 'system',
    timestamp: 'أمس 07:30',
    isRead: true,
    priority: 'low',
    linkTab: 'settings'
  }
];
