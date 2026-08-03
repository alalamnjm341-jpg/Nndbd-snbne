import React, { useState, useEffect } from 'react';
import { AlarmClock, Plus, Bell, Volume2, Trash2, Check, Clock, Sparkles, X, RotateCcw } from 'lucide-react';
import { AlarmItem } from '../types';
import { playRoosterSound } from '../utils/audio';

export const RoosterAlarmView: React.FC = () => {
  const [alarms, setAlarms] = useState<AlarmItem[]>([
    {
      id: '1',
      time: '05:30',
      title: 'صلاة الفجر - منبه الديك القوي 🐓',
      soundType: 'rooster',
      enabled: true,
      repeatDays: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      id: '2',
      time: '07:00',
      title: 'الاستيقاظ للعمل والنشاط ⏰',
      soundType: 'rooster',
      enabled: true,
      repeatDays: [0, 1, 2, 3, 4],
    },
  ]);

  const [newTime, setNewTime] = useState<string>('06:00');
  const [newTitle, setNewTitle] = useState<string>('منبه الديك الذكي');
  const [newSound, setNewSound] = useState<AlarmItem['soundType']>('rooster');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [ringingAlarm, setRingingAlarm] = useState<AlarmItem | null>(null);

  // Check alarm loop every 5 seconds
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentHHMM = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      alarms.forEach((alarm) => {
        if (alarm.enabled && alarm.time === currentHHMM && !ringingAlarm) {
          triggerAlarmRing(alarm);
        }
      });
    }, 5000);

    return () => clearInterval(checkInterval);
  }, [alarms, ringingAlarm]);

  const triggerAlarmRing = (alarm: AlarmItem) => {
    setRingingAlarm(alarm);
    playRoosterSound();
  };

  const handleTestSound = (soundType: AlarmItem['soundType']) => {
    if (soundType === 'rooster') {
      playRoosterSound();
    } else {
      playRoosterSound(); // synthesizes loud rooster tone
    }
  };

  const handleAddAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    const item: AlarmItem = {
      id: Date.now().toString(),
      time: newTime,
      title: newTitle || 'منبه جديد',
      soundType: newSound,
      enabled: true,
      repeatDays: [0, 1, 2, 3, 4, 5, 6],
    };
    setAlarms((prev) => [...prev, item]);
    setShowAddForm(false);
  };

  const toggleAlarm = (id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const deleteAlarm = (id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Background Rooster Alarm Themed Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-amber-950/90 via-slate-900 to-orange-950/90 border border-amber-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl text-white">
        
        {/* Rooster Artwork Watermark */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-full text-xs font-bold">
              <AlarmClock className="w-4 h-4 text-amber-400" />
              <span>المنبه الذكي المتعدد (منبه الديك القوي)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              منبه الديك الذكي والتنبيهات
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              ضبط المنبه بصوت صورة وصوت الديك القوي للتنبيه المستمر
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-2xl font-extrabold text-sm shadow-lg transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة منبه جديد</span>
          </button>
        </div>

        {/* Featured Rooster Sound Tester Banner */}
        <div className="mt-6 bg-slate-950/80 border border-amber-500/40 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-4xl shadow-md animate-bounce">
              🐓
            </div>
            <div>
              <h3 className="text-base font-extrabold text-amber-300">نغمة "صوت الديك القوي" الذكي</h3>
              <p className="text-xs text-slate-400">نغمة ديك ذكي متعددة الطبقات لإيقاظك في موعدك بدقة</p>
            </div>
          </div>

          <button
            onClick={() => handleTestSound('rooster')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 px-4 py-2.5 rounded-2xl text-xs font-bold transition shadow-md active:scale-95"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>تجربة صوت الديك الان 🐓</span>
          </button>
        </div>

        {/* Add Alarm Form Modal / Inline */}
        {showAddForm && (
          <form onSubmit={handleAddAlarm} className="mt-6 bg-slate-900 border border-amber-500/40 p-6 rounded-3xl space-y-4 animate-fadeIn">
            <h3 className="text-base font-extrabold text-amber-200 border-b border-slate-800 pb-2">ضبط منبه جديد</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">وقت المنبه (ساعة:دقيقة)</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-amber-300 px-4 py-2.5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">اسم أو عنوان المنبه</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: منبه الفجر"
                  className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">نوع نغمة المنبه</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'rooster', label: 'صوت الديك القوي 🐓' },
                  { id: 'classic', label: 'كلاسيكي 🔔' },
                  { id: 'gentle', label: 'نغمة هادئة 🎵' },
                  { id: 'takbeer', label: 'تكبيرات 🕌' },
                ].map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setNewSound(s.id as AlarmItem['soundType'])}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                      newSound === s.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-extrabold shadow-md"
              >
                حفظ المنبه
              </button>
            </div>
          </form>
        )}

        {/* Alarms List */}
        <div className="mt-6 space-y-3">
          <div className="text-xs text-slate-400 font-bold">قائمة التنبيهات المضبوطة:</div>

          {alarms.map((alarm) => (
            <div
              key={alarm.id}
              className={`flex items-center justify-between p-4 rounded-2xl border transition ${
                alarm.enabled
                  ? 'bg-slate-900/90 border-amber-500/40 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                  {alarm.time}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-100">{alarm.title}</h4>
                  <p className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                    <span>النغمة: {alarm.soundType === 'rooster' ? 'صوت الديك القوي 🐓' : 'نغمة ذكية 🔔'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => triggerAlarmRing(alarm)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold transition"
                  title="اختبار التنبيه الآن"
                >
                  <Bell className="w-4 h-4" />
                </button>

                <button
                  onClick={() => toggleAlarm(alarm.id)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    alarm.enabled ? 'bg-amber-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      alarm.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>

                <button
                  onClick={() => deleteAlarm(alarm.id)}
                  className="p-2 text-rose-400 hover:text-rose-300 bg-slate-800 hover:bg-rose-950 rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Ringing Alarm Modal Screen overlay with Rooster Visual */}
      {ringingAlarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-gradient-to-b from-amber-950 via-slate-900 to-rose-950 border-2 border-amber-400 rounded-3xl p-8 max-w-md w-full text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
            
            <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-6xl shadow-2xl animate-bounce border-4 border-amber-200">
              🐓
            </div>

            <div className="space-y-2">
              <span className="bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-extrabold uppercase animate-pulse">
                تنبيه الديك الذكي شغال الان!
              </span>
              <h2 className="text-4xl font-black text-amber-300 font-mono">{ringingAlarm.time}</h2>
              <h3 className="text-lg font-bold text-white">{ringingAlarm.title}</h3>
              <p className="text-xs text-amber-200/80">صوت الديك القوي ينبهك للاستيقاظ بحيوية</p>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={() => setRingingAlarm(null)}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 rounded-2xl font-black text-sm shadow-xl transition active:scale-95"
              >
                إيقاف المنبه 🔕
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
