import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../data/initialData';
import {
  X,
  Fingerprint,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Building,
  User,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface QuickPunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedEmployeeId?: string | null;
}

export const QuickPunchModal: React.FC<QuickPunchModalProps> = ({
  isOpen,
  onClose,
  preselectedEmployeeId
}) => {
  const { employees, attendance, punchIn, punchOut, currentUser, shifts } = useApp();

  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  useEffect(() => {
    if (preselectedEmployeeId) {
      setSelectedEmpId(preselectedEmployeeId);
    } else if (currentUser.employeeId) {
      setSelectedEmpId(currentUser.employeeId);
    } else if (employees.length > 0) {
      setSelectedEmpId(employees[0].id);
    }
  }, [preselectedEmployeeId, currentUser, employees, isOpen]);

  if (!isOpen) return null;

  const selectedEmployee = employees.find(e => e.id === selectedEmpId);
  const today = getTodayDateString();
  const todayRecord = attendance.find(a => a.employeeId === selectedEmpId && a.date === today);
  const employeeShift = shifts.find(s => s.id === selectedEmployee?.shiftId);

  const handlePunch = (type: 'in' | 'out') => {
    if (!selectedEmpId) {
      setResultMessage({ type: 'error', text: 'يرجى اختيار الموظف أولاً' });
      return;
    }

    setIsScanning(true);
    setResultMessage(null);

    // Simulate instant biometric scan
    setTimeout(() => {
      setIsScanning(false);
      let res;
      if (type === 'in') {
        res = punchIn(selectedEmpId, 'kiosk');
      } else {
        res = punchOut(selectedEmpId);
      }

      setResultMessage({
        type: res.success ? 'success' : 'error',
        text: res.message
      });
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Fingerprint className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl">كشك تسجيل الحضور والانصراف</h3>
              <p className="text-xs text-indigo-200">نظام التحضير الذكي ومطابقة البصمة والوردية</p>
            </div>
          </div>

          {/* Big Live Clock */}
          <div className="mt-5 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <div className="text-3xl sm:text-4xl font-black font-sans tracking-wider text-emerald-300">
              {currentTime}
            </div>
            <div className="text-xs text-indigo-100 font-medium mt-1">
              {currentDate}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Employee Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              اختر الموظف لتسجيل الحركة:
            </label>
            <select
              value={selectedEmpId}
              onChange={e => {
                setSelectedEmpId(e.target.value);
                setResultMessage(null);
              }}
              className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 text-sm bg-white font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {employees
                .filter(e => e.status === 'active')
                .map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.code}) - {emp.department}
                  </option>
                ))}
            </select>
          </div>

          {/* Selected Employee Preview Box */}
          {selectedEmployee && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-3.5">
              <img
                src={selectedEmployee.avatar}
                alt={selectedEmployee.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-xs"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900 text-sm">{selectedEmployee.name}</h4>
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {selectedEmployee.code}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {selectedEmployee.position} • {selectedEmployee.department}
                </div>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-500" />
                    <span>وردية: {employeeShift?.startTime || '08:00'} - {employeeShift?.endTime || '16:00'}</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Today's Status Preview */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">حالة التسجيل اليوم:</span>
              <span className="font-bold text-slate-800">
                {todayRecord?.checkIn ? (
                  <span className="text-emerald-700 font-sans">
                    تم الحضور الساعة {todayRecord.checkIn}
                    {todayRecord.checkOut ? ` والانصراف ${todayRecord.checkOut}` : ' (لم ينصرف بعد)'}
                  </span>
                ) : (
                  <span className="text-slate-500">لم يتم تسجيل حضور اليوم بعد</span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{selectedEmployee?.branch || 'المقر الرئيسي'}</span>
            </div>
          </div>

          {/* Result Alert */}
          {resultMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200 ${
                resultMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {resultMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{resultMessage.text}</span>
            </div>
          )}

          {/* Punch In / Out Action Buttons */}
          <div className="grid grid-cols-2 gap-3.5 pt-2">
            <button
              onClick={() => handlePunch('in')}
              disabled={isScanning || (todayRecord && Boolean(todayRecord.checkIn))}
              className={`py-3.5 px-4 rounded-2xl font-black text-sm flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                todayRecord && todayRecord.checkIn
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25 active:scale-95'
              }`}
            >
              <Fingerprint className="w-6 h-6" />
              <span>تسجيل حضور (دخول)</span>
              {todayRecord?.checkIn && (
                <span className="text-[10px] font-sans font-normal opacity-80">
                  سُجّل: {todayRecord.checkIn}
                </span>
              )}
            </button>

            <button
              onClick={() => handlePunch('out')}
              disabled={isScanning || !todayRecord?.checkIn || Boolean(todayRecord?.checkOut)}
              className={`py-3.5 px-4 rounded-2xl font-black text-sm flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                !todayRecord?.checkIn || todayRecord?.checkOut
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-gradient-to-b from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white shadow-lg shadow-indigo-500/25 active:scale-95'
              }`}
            >
              <Clock className="w-6 h-6" />
              <span>تسجيل انصراف (خروج)</span>
              {todayRecord?.checkOut ? (
                <span className="text-[10px] font-sans font-normal opacity-80">
                  سُجّل: {todayRecord.checkOut}
                </span>
              ) : !todayRecord?.checkIn ? (
                <span className="text-[10px] font-normal opacity-80">يتطلب تسجيل الحضور أولاً</span>
              ) : null}
            </button>
          </div>

          {/* Footer note */}
          <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            يتم التحقق التلقائي من الوردية، فترة السماح، وحساب التأخير بالساعة والدقيقة بدقة
          </div>
        </div>
      </div>
    </div>
  );
};
