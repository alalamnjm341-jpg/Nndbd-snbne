import React from 'react';
import { X, User, Phone, Palette, Volume2, Smartphone, Shield, RotateCcw } from 'lucide-react';
import { AppTheme } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  vibrationEnabled: boolean;
  onToggleVibration: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  soundEnabled,
  onToggleSound,
  vibrationEnabled,
  onToggleVibration,
}) => {
  if (!isOpen) return null;

  const handleResetData = () => {
    if (confirm('هل أنت تأكد من إعادة ضبط كل البيانات والذخائر في التطبيق؟')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 text-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-900/40 via-slate-800 to-emerald-900/40 p-5 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold">
              ⚙️
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-amber-200">إعدادات التطبيق والمطور</h2>
              <p className="text-xs text-slate-400">تخصيص المظهر وقراءة معلومات المنشئ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Section: Developer Info */}
          <div className="bg-slate-800/80 border border-amber-500/30 rounded-2xl p-4 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-2 text-amber-300 font-bold border-b border-slate-700/60 pb-2">
              <User className="w-5 h-5 text-amber-400" />
              <span>معلومات المطور والبرمجة</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-slate-700/40 text-slate-300">
                <span className="text-slate-400">اسم المطور والمنشئ:</span>
                <span className="font-extrabold text-amber-200">محمد عبد الرقيب النعماني</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-700/40 text-slate-300">
                <span className="text-slate-400">رقم التواصل المباشر / واتساب:</span>
                <a
                  href="https://wa.me/967773256139"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-400 hover:underline flex items-center gap-1 dir-ltr"
                >
                  <Phone className="w-3.5 h-3.5 inline" />
                  +967 773 256 139
                </a>
              </div>
              <div className="flex justify-between items-center py-1 text-slate-300">
                <span className="text-slate-400">إصدار التطبيق:</span>
                <span className="bg-slate-900 px-2.5 py-0.5 rounded-full text-xs font-mono text-emerald-400 border border-slate-700">
                  v2.5 Smart Ultimate Pro
                </span>
              </div>
            </div>
          </div>

          {/* Section: Themes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <Palette className="w-4 h-4 text-emerald-400" />
              <span>تغيير سمة ومظهر التطبيق</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'emerald', label: 'الزمردي الإسلامي', color: 'from-emerald-800 to-slate-900 border-emerald-500' },
                { id: 'dark', label: 'الليلي الفاخر', color: 'from-slate-800 to-slate-950 border-slate-600' },
                { id: 'gold', label: 'الذهبي الملكي', color: 'from-amber-800 to-slate-900 border-amber-500' },
                { id: 'cyber', label: 'النيون المتطور', color: 'from-cyan-900 to-purple-950 border-cyan-400' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onThemeChange(item.id as AppTheme)}
                  className={`p-3 rounded-xl border-2 bg-gradient-to-br ${item.color} text-right flex items-center justify-between transition-all ${
                    theme === item.id ? 'ring-2 ring-amber-400 scale-[1.02] shadow-lg' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm text-white">{item.label}</span>
                  {theme === item.id && <span className="text-amber-400 font-bold">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Sound & Vibration */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>تأثيرات الصوت والاهتزاز</span>
            </div>

            <div className="space-y-2 bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">الأصوات والمؤثرات الصوتية</span>
                </div>
                <button
                  onClick={onToggleSound}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">الاهتزاز عند الضغط والتنبيه</span>
                </div>
                <button
                  onClick={onToggleVibration}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    vibrationEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      vibrationEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Section: System Control */}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={handleResetData}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط البيانات والمصنع</span>
            </button>

            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <Shield className="w-3 h-3 text-emerald-500" />
              <span>تشفير محلي آمن 100%</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-2 rounded-xl font-bold text-sm shadow-md transition active:scale-95"
          >
            إغلاق الإعدادات
          </button>
        </div>

      </div>
    </div>
  );
};
