import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { exportToCSV } from '../../utils/exportUtils';
import { History, Search, Download, ShieldCheck, Clock, User, FileText } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log =>
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.userRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ['التاريخ والوقت', 'المستخدم', 'الدور / الصلاحية', 'نوع العملية', 'تفاصيل العملية'];
    const rows = filteredLogs.map(l => [
      l.timestamp,
      l.userName,
      l.userRole,
      l.action,
      l.details
    ]);
    exportToCSV(`سجل_العمليات_والتدقيق_${new Date().toISOString().split('T')[0]}`, headers, rows);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
            <History className="w-6 h-6 text-indigo-600" />
            <span>سجل العمليات والتدقيق الأمني (Audit Trail)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            توثيق رقمي فوري لكافة التعديلات والعمليات الحساسة التي يجريها المستخدمون في النظام
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>تصدير السجل (Excel)</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="البحث في تفاصيل العمليات، اسم المستخدم، أو نوع الإجراء..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-4">التاريخ والوقت</th>
                <th className="py-3 px-4">المستخدم المُنَفِّذ</th>
                <th className="py-3 px-4">الدور / الصلاحية</th>
                <th className="py-3 px-4">نوع الإجراء</th>
                <th className="py-3 px-4">تفاصيل العملية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-sans text-slate-500 text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {log.userName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-700">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
