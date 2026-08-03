import React, { useState } from 'react';
import { Sparkles, RefreshCcw, Volume2, VolumeX, Smartphone, Settings, Award, Check, RotateCcw } from 'lucide-react';
import { DhikrItem } from '../types';
import { playTasbeehClick, speakDhikrText } from '../utils/audio';

type TasbeehTheme = 'gold' | 'emerald' | 'wood' | 'dark' | 'crystal';

const DEFAULT_DHIKRS: DhikrItem[] = [
  { id: '1', text: 'سُبْحَانَ اللَّهِ', count: 0, target: 33 },
  { id: '2', text: 'الْحَمْدُ لِلَّهِ', count: 0, target: 33 },
  { id: '3', text: 'اللَّهُ أَكْبَرُ', count: 0, target: 33 },
  { id: '4', text: 'لَا إِلَهَ إِلَّا اللَّهُ', count: 0, target: 100 },
  { id: '5', text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', count: 0, target: 100 },
  { id: '6', text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ', count: 0, target: 100 },
];

export const SmartTasbeehView: React.FC = () => {
  const [dhikrs, setDhikrs] = useState<DhikrItem[]>(DEFAULT_DHIKRS);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [theme, setTheme] = useState<TasbeehTheme>('emerald');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(false);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [totalCounter, setTotalCounter] = useState<number>(0);

  const activeDhikr = dhikrs[selectedIndex];

  // High responsiveness rapid tap handler
  const handleTap = () => {
    const updatedCount = activeDhikr.count + 1;
    setDhikrs((prev) =>
      prev.map((d, i) => (i === selectedIndex ? { ...d, count: updatedCount } : d))
    );
    setTotalCounter((prev) => prev + 1);

    // Audio & Vibration Feedback
    if (soundEnabled) {
      playTasbeehClick(false, 1 + (updatedCount % 33) * 0.01);
    }

    if (speechEnabled && updatedCount % 3 === 0) {
      speakDhikrText(activeDhikr.text);
    }

    if (vibrationEnabled && 'vibrate' in navigator) {
      if (updatedCount % activeDhikr.target === 0) {
        navigator.vibrate([100, 50, 100, 50, 100]); // Victory vibrate pattern
      } else {
        navigator.vibrate(30);
      }
    }
  };

  const handleResetCurrent = () => {
    setDhikrs((prev) =>
      prev.map((d, i) => (i === selectedIndex ? { ...d, count: 0 } : d))
    );
  };

  const getThemeBg = () => {
    switch (theme) {
      case 'gold':
        return 'from-amber-950 via-slate-900 to-amber-900 border-amber-400 text-amber-300';
      case 'emerald':
        return 'from-emerald-950 via-teal-950 to-slate-900 border-emerald-400 text-emerald-300';
      case 'wood':
        return 'from-stone-900 via-amber-950 to-stone-950 border-amber-600 text-amber-200';
      case 'dark':
        return 'from-slate-900 via-slate-950 to-slate-900 border-slate-700 text-slate-100';
      case 'crystal':
        return 'from-purple-950 via-cyan-950 to-slate-900 border-cyan-400 text-cyan-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Main Tasbeeh Card */}
      <div className={`relative rounded-3xl bg-gradient-to-br ${getThemeBg()} border p-6 sm:p-8 overflow-hidden shadow-2xl transition-all`}>
        
        {/* Header */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-right">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>المسبحة الذكية السريعة النقر</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">مسبحة الأذكار والاستغفار</h2>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 bg-slate-950/80 hover:bg-slate-900 text-amber-300 border border-amber-500/30 px-4 py-2 rounded-2xl text-xs font-bold transition shadow-md"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>إعدادات المسبحة</span>
          </button>
        </div>

        {/* Custom Settings Drawer */}
        {showSettings && (
          <div className="mt-6 bg-slate-950/90 border border-amber-500/40 p-5 rounded-3xl space-y-4 animate-fadeIn">
            <h3 className="text-sm font-extrabold text-amber-300 border-b border-slate-800 pb-2">
              تخصيص نمط المسبحة والأصوات
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Theme Picker */}
              <div className="space-y-1">
                <label className="text-slate-400 font-bold">تغيير الشكل والتصميم:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'emerald', label: 'زمردي 💎' },
                    { id: 'gold', label: 'ذهبي 👑' },
                    { id: 'wood', label: 'خشب 🪵' },
                    { id: 'crystal', label: 'كريستال 🔮' },
                    { id: 'dark', label: 'رخام 🖤' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id as TasbeehTheme)}
                      className={`p-1.5 rounded-xl border text-[11px] font-bold transition ${
                        theme === t.id ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound & Pronunciation Settings */}
              <div className="space-y-2">
                <label className="text-slate-400 font-bold">الأصوات والاهتزاز:</label>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="w-full flex items-center justify-between bg-slate-900 p-2 rounded-xl text-slate-300 border border-slate-800"
                  >
                    <span>تأثير صوت النقر</span>
                    <span className="font-bold text-amber-300">{soundEnabled ? 'مفعل 🔊' : 'صامت 🔇'}</span>
                  </button>

                  <button
                    onClick={() => setSpeechEnabled(!speechEnabled)}
                    className="w-full flex items-center justify-between bg-slate-900 p-2 rounded-xl text-slate-300 border border-slate-800"
                  >
                    <span>نطق الذكر بالصوت</span>
                    <span className="font-bold text-emerald-300">{speechEnabled ? 'مفعل 🗣️' : 'معطل'}</span>
                  </button>

                  <button
                    onClick={() => setVibrationEnabled(!vibrationEnabled)}
                    className="w-full flex items-center justify-between bg-slate-900 p-2 rounded-xl text-slate-300 border border-slate-800"
                  >
                    <span>إسكات الاهتزاز عند الضغط</span>
                    <span className="font-bold text-cyan-300">{vibrationEnabled ? 'اهتزاز مفعل 📳' : 'اهتزاز مكتوم 🔕'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Dhikr Selector Ribbon */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {dhikrs.map((d, index) => (
            <button
              key={d.id}
              onClick={() => setSelectedIndex(index)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition border ${
                selectedIndex === index
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-105'
                  : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              {d.text} ({d.count})
            </button>
          ))}
        </div>

        {/* Main Rapid Tap Counter Stage */}
        <div className="mt-8 flex flex-col items-center justify-center space-y-6">
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white">{activeDhikr.text}</h3>
            <div className="text-xs text-amber-300 font-bold">
              الهدف المطلوب: {activeDhikr.target} | المكتمل: {activeDhikr.count}
            </div>
          </div>

          {/* Huge Rapid Tap Button (سلسلة سريعة الضغط) */}
          <button
            onClick={handleTap}
            className="group relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-tr from-amber-500 via-emerald-500 to-amber-300 p-2 shadow-2xl transition-transform active:scale-95 cursor-pointer focus:outline-none"
          >
            <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-center p-4 border-4 border-amber-400/40 relative overflow-hidden group-hover:border-amber-300 transition-colors">
              
              {/* Ripple Effect */}
              <div className="absolute inset-0 bg-amber-500/10 opacity-0 group-active:opacity-100 transition-opacity rounded-full pointer-events-none" />

              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                اضغط هنا للتسبيح السريع
              </span>

              <div className="text-6xl sm:text-7xl font-black font-mono text-amber-300 py-1 tracking-tight">
                {activeDhikr.count}
              </div>

              <span className="text-xs text-emerald-400 font-bold">
                {activeDhikr.count >= activeDhikr.target ? '🎉 اكتمل العدد المحدد!' : 'انقر بسرعة للتعداد'}
              </span>

            </div>
          </button>

          {/* Action Row */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleResetCurrent}
              className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800 px-5 py-2.5 rounded-2xl text-xs font-bold transition active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة تصفير الذكر الحالي</span>
            </button>

            <div className="bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs text-amber-300 font-bold font-mono">
              إجمالي كل التسبيحات: {totalCounter.toLocaleString()}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
