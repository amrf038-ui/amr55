import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  CalendarCheck,
  Shield,
  Briefcase,
  Users,
  User,
  Lock,
  Mail,
  ArrowLeft,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { users, setCurrentUser, settings, addAuditLog } = useApp();

  const [email, setEmail] = useState('admin@nile-tech.com.eg');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      addAuditLog('تسجيل دخول', `قام المستخدم ${found.name} بتسجيل الدخول للنظام`);
      onLoginSuccess();
    } else {
      // Allow demo login
      const defaultUser = users[0];
      setCurrentUser(defaultUser);
      onLoginSuccess();
    }
  };

  const handleQuickLoginAs = (role: UserRole) => {
    const found = users.find(u => u.role === role) || users[0];
    setCurrentUser(found);
    addAuditLog('تسجيل دخول سريع', `تسجيل الدخول التجريبي بحساب: ${found.name}`);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glowing blurs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-indigo-500/25">
            <CalendarCheck className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            نظام دَوَام الذكي
          </h1>
          <p className="text-xs text-indigo-200 mt-1 font-medium">
            منظومة إدارة الموظفين، الحضور والانصراف، والإجازات
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10">
          <h2 className="text-lg font-bold text-slate-900 mb-1">تسجيل الدخول للنظام</h2>
          <p className="text-xs text-slate-500 mb-6">أدخل بيانات الاعتماد للمتابعة إلى لوحة التحكم</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full font-sans pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="admin@dawam.sa"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full font-sans pr-10 pl-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-300 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>دخول النظام</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Personas */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>تسجيل دخول سريع للتجربة بحسب الصلاحية:</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLoginAs('admin')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer text-right"
              >
                <Shield className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="truncate">مدير النظام</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLoginAs('hr')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer text-right"
              >
                <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="truncate">مسؤول HR</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLoginAs('manager')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer text-right"
              >
                <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">مدير قسم IT</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLoginAs('employee')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200 hover:border-amber-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer text-right"
              >
                <User className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">بوابة الموظف</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security watermark footer */}
        <div className="mt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>نظام سحابي مشفر وآمن متوافق مع قانون العمل المصري رقم 12 لسنة 2003</span>
        </div>
      </div>
    </div>
  );
};
