import React from 'react';
import { Settings, Home, ArrowRight, LogOut, Phone } from 'lucide-react';
import { AppTab } from '../types';

interface HeaderProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenSettings: () => void;
}

const TAB_NAMES: Record<AppTab, string> = {
  home: 'الرئيسية',
  thermometer: 'قياس الحرارة',
  qibla: 'تحديد القبلة',
  odometer: 'عداد المسافات الذكي',
  map: 'خريطة الكرة الأرضية',
  alarm: 'المنبه الذكي (الديك)',
  clock: 'الساعة الذكية',
  tasbeeh: 'المسبحة الذكية',
  vault: 'الخزنة المشفرة',
};

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, onOpenSettings }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-amber-500/20 text-white shadow-lg">
      {/* Top Credit Banner curved styled */}
      <div className="bg-gradient-to-r from-amber-700 via-emerald-800 to-amber-700 text-amber-100 py-1.5 px-4 text-xs font-semibold tracking-wide text-center shadow-inner flex flex-wrap items-center justify-between gap-2 border-b border-amber-400/30">
        <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
          <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shadow-sm">
            المبرمج
          </span>
          <span>تطوير وبرمجة / محمد عبد الرقيب النعماني</span>
        </div>

        <a
          href="tel:967773256139"
          className="flex items-center gap-1.5 bg-slate-950/40 hover:bg-slate-950/70 px-2.5 py-0.5 rounded-full text-emerald-300 hover:text-emerald-200 transition mx-auto sm:mx-0 dir-ltr text-[11px]"
        >
          <Phone className="w-3 h-3 text-emerald-400" />
          <span>+967 773 256 139</span>
        </a>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Navigation buttons: Exit / Back / Home */}
        <div className="flex items-center gap-2">
          {currentTab !== 'home' ? (
            <>
              <button
                onClick={() => onSelectTab('home')}
                className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm active:scale-95"
                title="رجوع للرئيسية"
              >
                <ArrowRight className="w-4 h-4" />
                <span>رجوع</span>
              </button>

              <button
                onClick={() => onSelectTab('home')}
                className="flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm active:scale-95"
                title="خروج من الأداة"
              >
                <LogOut className="w-4 h-4" />
                <span>خروج</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-md">
                ⚡
              </div>
              <span className="font-extrabold text-sm sm:text-base text-amber-200">
                التطبيق الذكي الشامل
              </span>
            </div>
          )}
        </div>

        {/* Current Tab Indicator */}
        {currentTab !== 'home' && (
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700/60 text-emerald-300 font-bold text-sm shadow-inner">
            <span>{TAB_NAMES[currentTab]}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {currentTab !== 'home' && (
            <button
              onClick={() => onSelectTab('home')}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition border border-slate-700"
              title="الرئيسية"
            >
              <Home className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm active:scale-95"
            title="الإعدادات والمعلومات"
          >
            <Settings className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>الإعدادات</span>
          </button>
        </div>
      </div>
    </header>
  );
};
