import React from 'react';
import { IoLogOutOutline, IoShieldCheckmark, IoPersonCircleOutline } from 'react-icons/io5';

export default function Layout({ user, onLogout, children, activeTab, setActiveTab, tabs }) {
  const getRoleBadge = (role) => {
    switch (role) {
      case 'CFO':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'RM':
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'APE':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      default:
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0 bg-gray-950/80 border-b md:border-b-0 md:border-r border-gray-850 p-6 flex flex-col justify-between backdrop-blur-md">
        <div className="space-y-8">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600/15 text-blue-400 rounded-xl border border-blue-500/10">
              <IoShieldCheckmark className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-md tracking-wider leading-none">RAZORPAY</h2>
              <span className="text-[9px] text-gray-500 tracking-widest font-mono">REIMBURSE v1</span>
            </div>
          </div>

          {/* User profile */}
          <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-850/50 space-y-3">
            <div className="flex items-center gap-3">
              <IoPersonCircleOutline className="h-9 w-9 text-gray-400 shrink-0" />
              <div className="overflow-hidden">
                <h4 className="font-bold text-sm text-white truncate">{user?.name}</h4>
                <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-850/30 flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Role</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${getRoleBadge(user?.role)}`}>
                {user?.role}
              </span>
            </div>
          </div>

          {/* Tabs Navigation */}
          <nav className="space-y-1.5">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-2">Navigation</p>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-650 text-white shadow-lg shadow-blue-550/10'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="pt-6 border-t border-gray-850/50 mt-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-150 cursor-pointer"
          >
            <IoLogOutOutline className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>

    </div>
  );
}
