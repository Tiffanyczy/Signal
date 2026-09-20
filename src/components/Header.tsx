import React, { useState } from 'react';
import { AppScreen } from '../types';

interface HeaderProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  selectedHotspotCode?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  selectedHotspotCode,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const notifications = [
    {
      id: 1,
      title: 'New Hotspot Detected',
      desc: 'Miami Lakes Center breached critical threshold (+65.1% variance).',
      time: '12m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Re-evaluation Checkpoint Reached',
      desc: 'Statewide Dialysis Network 30-day post-intervention review is ready.',
      time: '1h ago',
      unread: true,
    },
    {
      id: 3,
      title: 'EHR ADT Feed Synchronized',
      desc: 'Latest admission feeds processed for Florida and Midwest markets.',
      time: '2h ago',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Bar: Brand, Search, User Profile */}
      <div className="px-5 lg:px-8 py-2.5 flex items-center justify-between gap-4 border-b border-slate-100">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onNavigate('executive-dashboard')}
        >
          <div className="w-9 h-9 rounded-lg bg-[#5C9A1B] flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="material-symbols-outlined text-white text-[22px]">ecg_heart</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-headline text-base text-slate-900 font-bold leading-tight">
                Signal
              </span>
              <span className="bg-emerald-50 text-[#1E4B27] border border-emerald-200 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                Member AI Platform 3.0
              </span>
            </div>
            <span className="font-mono text-[10px] text-slate-600 font-bold tracking-wider uppercase mt-0.5">
              Humana Inpatient Admission
            </span>
          </div>
        </div>

        {/* Header Actions & Profile */}
        <div className="flex items-center gap-4">
          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (notificationCount > 0) setNotificationCount(0);
              }}
              className="relative p-2 text-slate-600 hover:text-slate-900 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-600 border-2 border-white"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase font-mono">
                      Clinical Alerts & Notifications
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#5C9A1B] font-bold">
                    3 Live Feeds
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 hover:bg-slate-50 transition-colors ${
                        n.unread ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-slate-900">{n.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-2 px-4 border-t border-slate-100 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-mono text-[#5C9A1B] hover:underline font-bold"
                  >
                    Close Notification Center
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-sm text-slate-900 font-bold leading-tight">Tiffany Cheng</span>
              <span className="text-[10px] font-mono text-slate-500 font-semibold">
                Clinical Analytics Lead
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-[#5C9A1B]/40 shadow-sm">
              TC
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Main Screen Navigation Tabs */}
      <div className="px-5 lg:px-8 bg-white overflow-x-auto flex items-center justify-between">
        <nav className="flex items-center gap-1 sm:gap-2 py-1.5 min-w-max">
          <button
            onClick={() => onNavigate('executive-dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold text-xs tracking-wide transition-all ${
              currentScreen === 'executive-dashboard'
                ? 'bg-[#5C9A1B] text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">insights</span>
            <span>Executive Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('closed-loop-tracker')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold text-xs tracking-wide transition-all ${
              currentScreen === 'closed-loop-tracker'
                ? 'bg-[#5C9A1B] text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">published_with_changes</span>
            <span>Closed-Loop Tracker</span>
          </button>

          {/* Contextual Screen Tabs when deep diving */}
          {currentScreen === 'hotspot-detail' && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 ml-1">
              <span className="text-slate-400 font-mono text-xs">/</span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-[#1E4B27] border border-emerald-200 font-mono text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                Inspection: {selectedHotspotCode || 'HP-FL-33014'}
              </span>
            </div>
          )}

          {currentScreen === 'intervention-decisioning' && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 ml-1">
              <span className="text-slate-400 font-mono text-xs">/</span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-[#1E4B27] border border-emerald-200 font-mono text-xs font-bold">
                <span className="material-symbols-outlined text-[16px] text-[#5C9A1B]">policy</span>
                Intervention Governance: {selectedHotspotCode || 'HP-FL-33014'}
              </span>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
