import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shift, Employee } from '../../types';
import {
  CalendarRange,
  Clock,
  Plus,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  AlertCircle,
  Timer,
  Calendar,
  X,
  Save
} from 'lucide-react';

export const ShiftsView: React.FC = () => {
  const { shifts, addShift, updateShift, deleteShift, employees, updateEmployee, currentUser } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  // Assignment Modal
  const [assigningShift, setAssigningShift] = useState<Shift | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    startTime: '08:00',
    endTime: '16:00',
    gracePeriodMins: 15,
    workDays: [0, 1, 2, 3, 4],
    totalHours: 8,
    color: '#3B82F6'
  });

  const canManage = currentUser.role === 'admin' || currentUser.role === 'hr';

  const daysLabels = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const handleOpenAdd = () => {
    setEditingShift(null);
    setFormData({
      name: '',
      startTime: '08:00',
      endTime: '16:00',
      gracePeriodMins: 15,
      workDays: [0, 1, 2, 3, 4],
      totalHours: 8,
      color: '#3B82F6'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (shift: Shift) => {
    setEditingShift(shift);
    setFormData({
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      gracePeriodMins: shift.gracePeriodMins,
      workDays: shift.workDays,
      totalHours: shift.totalHours,
      color: shift.color
    });
    setIsModalOpen(true);
  };

  const handleSaveShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // Calculate total hours
    const [inH, inM] = formData.startTime.split(':').map(Number);
    const [outH, outM] = formData.endTime.split(':').map(Number);
    let diff = outH * 60 + outM - (inH * 60 + inM);
    if (diff < 0) diff += 1440;
    const totalHours = Number((diff / 60).toFixed(1));

    if (editingShift) {
      updateShift(editingShift.id, { ...formData, totalHours });
    } else {
      addShift({ ...formData, totalHours });
    }

    setIsModalOpen(false);
  };

  const toggleDay = (dayIdx: number) => {
    setFormData(prev => ({
      ...prev,
      workDays: prev.workDays.includes(dayIdx)
        ? prev.workDays.filter(d => d !== dayIdx)
        : [...prev.workDays, dayIdx].sort()
    }));
  };

  const handleAssignEmployee = (empId: string, shiftId: string) => {
    updateEmployee(empId, { shiftId });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
            <CalendarRange className="w-6 h-6 text-indigo-600" />
            <span>الورديات ومواعيد العمل</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            تعريف ورديات العمل، تحديد فترات السماح للتأخير، وتوزيع الموظفين على المواعيد
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-300 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة وردية جديدة</span>
          </button>
        )}
      </div>

      {/* Shifts Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {shifts.map(shift => {
          const assignedEmps = employees.filter(e => e.shiftId === shift.id && e.status === 'active');
          return (
            <div
              key={shift.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Shift Top */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: shift.color || '#4f46e5' }}
                    />
                    <h3 className="font-bold text-slate-900 text-base">{shift.name}</h3>
                  </div>

                  {canManage && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(shift)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {shifts.length > 1 && (
                        <button
                          onClick={() => deleteShift(shift.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Timing Badge */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4 text-center">
                  <span className="text-xs text-slate-500 block mb-1">ساعات الدوام</span>
                  <div className="text-2xl font-black font-sans text-slate-900 tracking-wide">
                    {shift.startTime} - {shift.endTime}
                  </div>
                  <div className="mt-1 text-xs text-indigo-600 font-bold">
                    إجمالي {shift.totalHours} ساعات عمل يومياً
                  </div>
                </div>

                {/* Key Shift Details */}
                <div className="space-y-2 text-xs text-slate-600 mb-4">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Timer className="w-3.5 h-3.5 text-amber-500" />
                      <span>فترة السماح بالتأخير:</span>
                    </span>
                    <span className="font-bold text-emerald-700">{shift.gracePeriodMins} دقيقة</span>
                  </div>

                  <div className="py-1 border-b border-slate-100">
                    <span className="text-slate-500 block mb-1.5">أيام العمل الأسبوعية:</span>
                    <div className="flex flex-wrap gap-1">
                      {daysLabels.map((day, idx) => (
                        <span
                          key={idx}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                            shift.workDays.includes(idx)
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-slate-100 text-slate-400 opacity-60'
                          }`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      <span>الموظفون المعينون:</span>
                    </span>
                    <span className="font-bold text-slate-800 font-sans">
                      {assignedEmps.length} موظف
                    </span>
                  </div>
                </div>
              </div>

              {/* Assign button */}
              {canManage && (
                <button
                  onClick={() => setAssigningShift(shift)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  إدارة الموظفين المعينين ({assignedEmps.length})
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Shift Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">
                {editingShift ? 'تعديل بيانات الوردية' : 'إضافة وردية عمل جديدة'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShift} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اسم الوردية <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الوردية الصباحية / وردية الدوام المرن"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    وقت البداية
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full font-sans px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    وقت النهاية
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full font-sans px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    فترة السماح للتأخير (بالدقائق)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={120}
                    value={formData.gracePeriodMins}
                    onChange={e => setFormData({ ...formData, gracePeriodMins: Number(e.target.value) })}
                    className="w-full font-sans px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    لون التمييز للوردية
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={e => setFormData({ ...formData, color: e.target.value })}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200"
                    />
                    <span className="text-xs font-mono text-slate-600">{formData.color}</span>
                  </div>
                </div>
              </div>

              {/* Work days toggles */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  أيام العمل المعتمدة للوردية
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysLabels.map((day, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleDay(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        formData.workDays.includes(idx)
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-300 transition-colors"
                >
                  {editingShift ? 'حفظ التعديلات' : 'إنشاء الوردية'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Employees Modal */}
      {assigningShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  تعيين الموظفين على وردية: {assigningShift.name}
                </h3>
                <p className="text-xs text-slate-500">
                  حدد الموظفين المراد إلحاقهم بهذه الوردية مباشرة
                </p>
              </div>
              <button
                onClick={() => setAssigningShift(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {employees.map(emp => {
                const isAssigned = emp.shiftId === assigningShift.id;
                return (
                  <div
                    key={emp.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                      isAssigned ? 'bg-indigo-50/70 border-indigo-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-9 h-9 rounded-xl object-cover"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{emp.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {emp.code} • {emp.department}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAssignEmployee(emp.id, isAssigned ? shifts[0].id : assigningShift.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        isAssigned
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:border-indigo-400'
                      }`}
                    >
                      {isAssigned ? 'معين حالياً ✓' : 'تعيين على الوردية'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setAssigningShift(null)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
