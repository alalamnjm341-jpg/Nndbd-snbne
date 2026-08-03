import React, { useState, useEffect } from 'react';
import { Clock, Globe2, Timer as TimerIcon, Play, Pause, RotateCcw, Palette } from 'lucide-react';

type ClockStyle = 'neon' | 'gold' | 'islamic' | 'flip';

export const SmartClockView: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [style, setStyle] = useState<ClockStyle>('gold');
  const [activeTab, setActiveTab] = useState<'clock' | 'stopwatch' | 'timer'>('clock');

  // Stopwatch state
  const [swRunning, setSwRunning] = useState<boolean>(false);
  const [swTime, setSwTime] = useState<number>(0);

  // Timer state
  const [timerDuration, setTimerDuration] = useState<number>(300); // 5 min
  const [timerRemaining, setTimerRemaining] = useState<number>(300);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Live Clock Tick
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Stopwatch Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (swRunning) {
      interval = setInterval(() => setSwTime((prev) => prev + 10), 10);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [swRunning]);

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timerRemaining > 0) {
      interval = setInterval(() => setTimerRemaining((prev) => prev - 1), 1000);
    } else if (timerRemaining === 0 && timerRunning) {
      setTimerRunning(false);
      alert('⏰ انتهى الوقت التنازلي!');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerRemaining]);

  // Analog Clock Math
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secDeg = (seconds / 60) * 360;
  const minDeg = ((minutes + seconds / 60) / 60) * 360;
  const hourDeg = (((hours % 12) + minutes / 60) / 12) * 360;

  const getStyleClasses = () => {
    switch (style) {
      case 'neon':
        return 'from-cyan-950 via-purple-950 to-slate-900 border-cyan-400 text-cyan-300';
      case 'gold':
        return 'from-amber-950 via-slate-900 to-amber-900 border-amber-400 text-amber-300';
      case 'islamic':
        return 'from-emerald-950 via-teal-950 to-slate-900 border-emerald-400 text-emerald-300';
      case 'flip':
        return 'from-slate-900 via-slate-950 to-slate-900 border-slate-700 text-white';
    }
  };

  const formatStopwatch = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const millis = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Background Clock Header Card */}
      <div className={`relative rounded-3xl bg-gradient-to-br ${getStyleClasses()} border p-6 sm:p-8 overflow-hidden shadow-2xl transition-all`}>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-right">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-full text-xs font-bold">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>الساعة الذكية متعددة الأنماط</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              ساعة التوقيت والأنماط المخصصة
            </h2>
          </div>

          {/* Clock Sub-Tab Navigation */}
          <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 gap-2">
            {[
              { id: 'clock', label: 'الساعة والوقت' },
              { id: 'stopwatch', label: 'ساعة إيقاف' },
              { id: 'timer', label: 'مؤقت تنازلي' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'clock' | 'stopwatch' | 'timer')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Style Preset Selector (Only in Clock View) */}
        {activeTab === 'clock' && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 border-t border-white/10 pt-4">
            <span className="text-xs text-slate-300 font-bold flex items-center gap-1">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>نمط الساعة:</span>
            </span>
            {[
              { id: 'gold', label: 'الملكي الذهبي 👑' },
              { id: 'neon', label: 'النيون ⚡' },
              { id: 'islamic', label: 'الإسلامي 🕌' },
              { id: 'flip', label: 'الرقمي البسيط 🔢' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id as ClockStyle)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  style === s.id
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* TAB 1: Main Clock Display */}
        {activeTab === 'clock' && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Analog Clock Dial */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-amber-400/40 bg-slate-950 shadow-2xl flex items-center justify-center p-2">
                
                {/* Dial Ticks */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    style={{ transform: `rotate(${i * 30}deg)` }}
                    className="absolute inset-2 flex justify-center text-xs font-bold text-slate-500 pointer-events-none"
                  >
                    <span className="mt-1" style={{ transform: `rotate(-${i * 30}deg)` }}>
                      {i === 0 ? 12 : i}
                    </span>
                  </div>
                ))}

                {/* Hour Hand */}
                <div
                  style={{ transform: `rotate(${hourDeg}deg)` }}
                  className="absolute w-2 h-16 bg-amber-400 rounded-full top-16 origin-bottom shadow-lg transition-transform duration-300"
                />

                {/* Minute Hand */}
                <div
                  style={{ transform: `rotate(${minDeg}deg)` }}
                  className="absolute w-1.5 h-24 bg-emerald-400 rounded-full top-8 origin-bottom shadow-lg transition-transform duration-300"
                />

                {/* Second Hand */}
                <div
                  style={{ transform: `rotate(${secDeg}deg)` }}
                  className="absolute w-0.5 h-28 bg-rose-500 rounded-full top-6 origin-bottom shadow-lg transition-transform duration-75"
                />

                {/* Center Point */}
                <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-slate-900 z-10 shadow-md" />
              </div>
            </div>

            {/* Digital Clock & Date */}
            <div className="space-y-6 text-center md:text-right">
              <div className="bg-slate-950/80 p-6 rounded-3xl border border-white/10 space-y-2 shadow-xl">
                <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-amber-300">
                  {time.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>

                <div className="text-sm font-bold text-slate-300 border-t border-slate-800 pt-3">
                  {time.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              {/* World Cities Clock Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                  <div className="text-slate-400">مكة المكرمة 🕋</div>
                  <div className="font-mono font-bold text-amber-300 mt-1">
                    {new Date().toLocaleTimeString('ar-SA', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                  <div className="text-slate-400">صنعاء 🇾🇪</div>
                  <div className="font-mono font-bold text-emerald-300 mt-1">
                    {new Date().toLocaleTimeString('ar-SA', { timeZone: 'Asia/Aden', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: Stopwatch */}
        {activeTab === 'stopwatch' && (
          <div className="mt-8 text-center space-y-6 max-w-md mx-auto py-6">
            <div className="text-6xl sm:text-7xl font-black font-mono text-amber-300 bg-slate-950/90 p-8 rounded-3xl border border-amber-500/30 shadow-2xl">
              {formatStopwatch(swTime)}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setSwRunning(!swRunning)}
                className={`px-8 py-3 rounded-2xl font-extrabold text-sm shadow-xl transition active:scale-95 ${
                  swRunning ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
                }`}
              >
                {swRunning ? 'إيقاف مؤقت' : 'تشغيل الساعة'}
              </button>

              <button
                onClick={() => {
                  setSwRunning(false);
                  setSwTime(0);
                }}
                className="px-6 py-3 bg-slate-800 text-slate-300 rounded-2xl font-bold text-sm"
              >
                تصفير
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Countdown Timer */}
        {activeTab === 'timer' && (
          <div className="mt-8 text-center space-y-6 max-w-md mx-auto py-6">
            <div className="text-6xl sm:text-7xl font-black font-mono text-cyan-300 bg-slate-950/90 p-8 rounded-3xl border border-cyan-500/30 shadow-2xl">
              {formatTimer(timerRemaining)}
            </div>

            <div className="flex justify-center gap-2">
              {[60, 300, 600, 900].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    setTimerDuration(sec);
                    setTimerRemaining(sec);
                    setTimerRunning(false);
                  }}
                  className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white"
                >
                  {sec / 60} دقائق
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`px-8 py-3 rounded-2xl font-extrabold text-sm shadow-xl transition active:scale-95 ${
                  timerRunning ? 'bg-amber-500 text-slate-950' : 'bg-cyan-500 text-slate-950'
                }`}
              >
                {timerRunning ? 'إيقاف المؤقت' : 'ابدأ التنازلي'}
              </button>

              <button
                onClick={() => {
                  setTimerRunning(false);
                  setTimerRemaining(timerDuration);
                }}
                className="px-6 py-3 bg-slate-800 text-slate-300 rounded-2xl font-bold text-sm"
              >
                إعادة ضبط
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
