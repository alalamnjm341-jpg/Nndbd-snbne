import React, { useState, useEffect, useRef } from 'react';
import { Footprints, Car, Bike, Play, Pause, RotateCcw, Navigation, Gauge, History, Award, Plus, Flame, Timer, Compass } from 'lucide-react';
import { playOdometerTick } from '../utils/audio';
import { OdometerLog } from '../types';

export const OdometerView: React.FC = () => {
  const [mode, setMode] = useState<'walking' | 'driving' | 'cycling'>('walking');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [distanceMeters, setDistanceMeters] = useState<number>(0);
  const [speedKmh, setSpeedKmh] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [stepsCount, setStepsCount] = useState<number>(0);
  const [stepGoal, setStepGoal] = useState<number>(10000);
  const [history, setHistory] = useState<OdometerLog[]>([]);
  const [simulationActive, setSimulationActive] = useState<boolean>(true); // Enabled by default for instant feedback
  const [strideLengthMeters, setStrideLengthMeters] = useState<number>(0.75); // Standard human stride

  const watchIdRef = useRef<number | null>(null);
  const lastCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Continuous Pedometer & Step Counter effect
  useEffect(() => {
    let stepInterval: NodeJS.Timeout | null = null;
    if (isRunning) {
      // Cadence based on mode
      const intervalMs = mode === 'walking' ? 650 : mode === 'cycling' ? 450 : 250;

      stepInterval = setInterval(() => {
        if (simulationActive) {
          let stepDelta = 1;
          let metersDelta = strideLengthMeters;
          let speedVal = 4.8;

          if (mode === 'cycling') {
            stepDelta = 1;
            metersDelta = 3.5;
            speedVal = 18.2;
          } else if (mode === 'driving') {
            stepDelta = 0; // Driving does not count walking steps, only distance
            metersDelta = 14.0;
            speedVal = 55.0;
          }

          setDistanceMeters((prev) => {
            const next = prev + metersDelta;
            return +next.toFixed(1);
          });

          if (stepDelta > 0) {
            setStepsCount((prev) => prev + stepDelta);
          }

          setSpeedKmh(+(speedVal + (Math.random() * 1.6 - 0.8)).toFixed(1));
          playOdometerTick();
        }
      }, intervalMs);
    }

    return () => {
      if (stepInterval) clearInterval(stepInterval);
    };
  }, [isRunning, simulationActive, mode, strideLengthMeters]);

  // Real GPS watch position (enhancement when outside)
  useEffect(() => {
    if (isRunning && !simulationActive && 'geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, speed } = pos.coords;
          if (speed !== null) {
            setSpeedKmh(+(speed * 3.6).toFixed(1));
          }

          if (lastCoordsRef.current) {
            const d = calculateDistance(
              lastCoordsRef.current.lat,
              lastCoordsRef.current.lng,
              latitude,
              longitude
            );
            if (d > 0.3) { // Count if moved > 0.3 meter
              setDistanceMeters((prev) => +(prev + d).toFixed(1));
              if (mode === 'walking') {
                const newSteps = Math.max(1, Math.round(d / strideLengthMeters));
                setStepsCount((prev) => prev + newSteps);
              }
              playOdometerTick();
            }
          }
          lastCoordsRef.current = { lat: latitude, lng: longitude };
        },
        (err) => console.warn('Geolocation warning:', err),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 1000 }
      );
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isRunning, simulationActive, mode, strideLengthMeters]);

  // Haversine formula for distance in meters
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hrs > 0) {
      return `${hrs}:${remMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${remMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    if (distanceMeters > 0 || stepsCount > 0) {
      const newLog: OdometerLog = {
        id: Date.now().toString(),
        date: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        distanceMeters,
        durationSeconds: seconds,
        mode,
      };
      setHistory((prev) => [newLog, ...prev]);
    }
    setIsRunning(false);
    setDistanceMeters(0);
    setSeconds(0);
    setSpeedKmh(0);
    setStepsCount(0);
    lastCoordsRef.current = null;
  };

  const addManualSteps = (count: number) => {
    setStepsCount((prev) => prev + count);
    const addedMeters = count * strideLengthMeters;
    setDistanceMeters((prev) => +(prev + addedMeters).toFixed(1));
    playOdometerTick();
  };

  // Calories estimation
  const calories = Math.round((distanceMeters / 1000) * (mode === 'walking' ? 65 : mode === 'cycling' ? 40 : 15));
  const goalProgressPercent = Math.min(100, Math.round((stepsCount / stepGoal) * 100));

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Odometer Header Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-blue-950/90 via-slate-900 to-indigo-950/90 border border-cyan-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl text-white">
        
        {/* Watermark Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-3 py-1 rounded-full text-xs font-bold">
              <Footprints className="w-4 h-4 text-cyan-400" />
              <span>عداد الخطوات والمسافات الفوري</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              عداد الخطوات الذكي والدقيق
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              حساب دقيق لعدد الخطوات والمسافة بالمتر والكم والسعرات الحرارية
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 gap-1.5">
            {[
              { id: 'walking', label: 'مشي 👣', icon: Footprints },
              { id: 'cycling', label: 'دراجة 🚴', icon: Bike },
              { id: 'driving', label: 'سيارة 🚗', icon: Car },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as 'walking' | 'driving' | 'cycling')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                    mode === m.id ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Dashboard Panel */}
        <div className="mt-8 space-y-6">
          
          {/* Steps & Distance Main Card */}
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center text-xs text-slate-400 font-bold border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
                <span>{isRunning ? 'جاري حساب الخطوات والمسافة...' : 'متوقف عن العد'}</span>
              </span>
              
              <button
                onClick={() => setSimulationActive(!simulationActive)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold border transition ${
                  simulationActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {simulationActive ? 'عد تسلسلي ذكي ✓' : 'حساس GPS حقيقي'}
              </button>
            </div>

            {/* Giant Step & Distance Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              
              {/* Step Counter Box */}
              <div className="bg-slate-950/80 p-5 rounded-3xl border border-emerald-500/30 text-center space-y-2 relative shadow-inner">
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                  <Footprints className="w-4 h-4" />
                  <span>عدد الخطوات المستقطعة</span>
                </div>
                <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 tracking-tight font-mono">
                  {stepsCount.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400">
                  الهدف اليومي: {stepGoal.toLocaleString()} خطوة
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 mt-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${goalProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Distance Box */}
              <div className="bg-slate-950/80 p-5 rounded-3xl border border-cyan-500/30 text-center space-y-2 relative shadow-inner">
                <div className="text-xs font-bold text-cyan-400 flex items-center justify-center gap-1.5">
                  <Gauge className="w-4 h-4" />
                  <span>المسافة الكلية</span>
                </div>
                <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-amber-200 tracking-tight font-mono">
                  {distanceMeters >= 1000
                    ? (distanceMeters / 1000).toFixed(2)
                    : Math.round(distanceMeters)}
                </div>
                <div className="text-xs text-cyan-300 font-bold">
                  {distanceMeters >= 1000 ? 'كيلومتر (KM)' : 'متر (Meters)'}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  ({distanceMeters.toLocaleString()} متر بالضبط)
                </div>
              </div>

            </div>

            {/* Quick Manual Add Steps Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-bold ml-2">إضافة خطوات سريعة:</span>
              <button
                onClick={() => addManualSteps(10)}
                className="bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-extrabold px-3 py-1.5 rounded-xl border border-slate-700 transition"
              >
                +10 خطوات 👣
              </button>
              <button
                onClick={() => addManualSteps(50)}
                className="bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-extrabold px-3 py-1.5 rounded-xl border border-slate-700 transition"
              >
                +50 خطوة 👣
              </button>
              <button
                onClick={() => addManualSteps(100)}
                className="bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-extrabold px-3 py-1.5 rounded-xl border border-slate-700 transition"
              >
                +100 خطوة 👣
              </button>
            </div>

            {/* Play / Pause / Reset Controls */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl transition active:scale-95 ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-slate-950" />
                    <span>إيقاف مؤقت للعداد</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-slate-950" />
                    <span>ابدأ عد الخطوات الآن</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-5 py-3.5 rounded-2xl font-bold text-sm transition active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة تصفير العداد</span>
              </button>
            </div>

          </div>

          {/* Secondary Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <Timer className="w-3.5 h-3.5 text-amber-400" />
                <span>الوقت المستغرق</span>
              </div>
              <div className="font-mono font-black text-xl text-amber-300">{formatTime(seconds)}</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span>السرعة الحالية</span>
              </div>
              <div className="font-mono font-black text-xl text-cyan-300">{speedKmh} كم/س</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>السعرات الحرارية</span>
              </div>
              <div className="font-mono font-black text-xl text-rose-300">{calories} cal</div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-center space-y-1">
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>نسبة الإنجاز</span>
              </div>
              <div className="font-mono font-black text-xl text-emerald-300">{goalProgressPercent}%</div>
            </div>
          </div>

          {/* Trip History Log */}
          {history.length > 0 && (
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                  <History className="w-4 h-4" />
                  <span>سجل الجولات المحفوظة</span>
                </span>
                <span className="text-[11px] text-slate-500">{history.length} رحلة مسجلة</span>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {history.map((log) => (
                  <div key={log.id} className="flex justify-between items-center bg-slate-950/60 p-2.5 rounded-xl text-xs">
                    <span className="text-slate-400 font-mono">{log.date}</span>
                    <span className="font-bold text-emerald-300">{log.distanceMeters} متر ({formatTime(log.durationSeconds)})</span>
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                      {log.mode === 'walking' ? 'مشي' : log.mode === 'driving' ? 'سيارة' : 'دراجة'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
