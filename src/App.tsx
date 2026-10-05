import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { EmployeesList } from './components/employees/EmployeesList';
import { AttendanceView } from './components/attendance/AttendanceView';
import { LeavesView } from './components/leaves/LeavesView';
import { ShiftsView } from './components/shifts/ShiftsView';
import { ReportsView } from './components/reports/ReportsView';
import { UsersAndPermissionsView } from './components/users/UsersAndPermissionsView';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { SettingsView } from './components/settings/SettingsView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { QuickPunchModal } from './components/attendance/QuickPunchModal';
import { LoginView } from './components/auth/LoginView';

const MainApp: React.FC = () => {
  const { currentUser } = useApp();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickPunchOpen, setIsQuickPunchOpen] = useState(false);
  const [quickPunchEmployeeId, setQuickPunchEmployeeId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const handleOpenQuickPunch = (employeeId?: string) => {
    setQuickPunchEmployeeId(employeeId || null);
    setIsQuickPunchOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-indigo-600 selection:text-white" dir="rtl">
      {/* Top Navbar */}
      <Navbar
        onOpenQuickPunch={() => handleOpenQuickPunch()}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        onNavigate={tab => setCurrentTab(tab)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={tab => setCurrentTab(tab)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {currentTab === 'dashboard' && (
            <DashboardOverview
              onNavigate={tab => setCurrentTab(tab)}
              onOpenQuickPunch={() => handleOpenQuickPunch()}
            />
          )}

          {currentTab === 'notifications' && (
            <NotificationsView onNavigate={tab => setCurrentTab(tab)} />
          )}

          {currentTab === 'employees' && (
            <EmployeesList
              onOpenQuickPunchFor={empId => handleOpenQuickPunch(empId)}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceView
              onOpenQuickPunch={() => handleOpenQuickPunch()}
            />
          )}

          {currentTab === 'leaves' && <LeavesView />}

          {currentTab === 'shifts' && <ShiftsView />}

          {currentTab === 'reports' && <ReportsView />}

          {currentTab === 'users' && <UsersAndPermissionsView />}

          {currentTab === 'audit' && <AuditLogsView />}

          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Quick Punch Kiosk Modal */}
      <QuickPunchModal
        isOpen={isQuickPunchOpen}
        onClose={() => {
          setIsQuickPunchOpen(false);
          setQuickPunchEmployeeId(null);
        }}
        preselectedEmployeeId={quickPunchEmployeeId}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
