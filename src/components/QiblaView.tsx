import React, { useState, useEffect } from 'react';
import { Compass, Navigation, MapPin, Volume2, Shield, RefreshCw } from 'lucide-react';
import { playQiblaAlignedSound } from '../utils/audio';

// Kaaba Coordinates
const MAKKAH_LAT = 21.4225;
const MAKKAH_LNG = 39.8262;

interface CityPreset {
  name: string;
  lat: number;
  lng: number;
}

const CITIES: CityPreset[] = [
  { name: 'صنعاء (اليمن)', lat: 15.3694, lng: 44.191 },
  { name: 'مكة المكرمة (السعودية)', lat: 21.4225, lng: 39.8262 },
  { name: 'الرياض (السعودية)', lat: 24.7136, lng: 46.6753 },
  { name: 'القاهرة (مصر)', lat: 30.0444, lng: 31.2357 },
  { name: 'دبي (الإمارات)', lat: 25.2048, lng: 55.2708 },
  { name: 'عمان (الأردن)', lat: 31.9454, lng: 35.9284 },
  { name: 'إسطنبول (تركيا)', lat: 41.0082, lng: 28.9784 },
  { name: 'لندن (بريطانيا)', lat: 51.5074, lng: -0.1278 },
];

export const QiblaView: React.FC = () => {
  const [currentCity, setCurrentCity] = useState<CityPreset>(CITIES[0]);
  const [userLat, setUserLat] = useState<number>(CITIES[0].lat);
  const [userLng, setUserLng] = useState<number>(CITIES[0].lng);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [manualOffset, setManualOffset] = useState<number>(0);
  const [usingGPS, setUsingGPS] = useState<boolean>(false);

  // Calculate Qibla angle from user coordinates
  const calculateQiblaAngle = (lat: number, lng: number) => {
    const phi1 = (lat * Math.PI) / 180;
    const phi2 = (MAKKAH_LAT * Math.PI) / 180;
    const deltaLambda = ((MAKKAH_LNG - lng) * Math.PI) / 180;

    const y = Math.sin(deltaLambda);
    const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);

    let qibla = (Math.atan2(y, x) * 180) / Math.PI;
    return (qibla + 360) % 360;
  };

  // Calculate Distance to Makkah in km using Haversine formula
  const calculateDistanceToMakkah = (lat: number, lng: number) => {
    const R = 6371; // Earth radius km
    const dLat = ((MAKKAH_LAT - lat) * Math.PI) / 180;
    const dLng = ((MAKKAH_LNG - lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat * Math.PI) / 180) *
        Math.cos((MAKKAH_LAT * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const qiblaBearing = calculateQiblaAngle(userLat, userLng);
  const distanceKm = calculateDistanceToMakkah(userLat, userLng);

  // Compass orientation listener
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading = 0;
      if ('webkitCompassHeading' in e) {
        // iOS
        heading = (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Android / Standard
        heading = 360 - e.alpha;
      }
      setDeviceHeading(heading);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  // Request Geolocation
  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      setUsingGPS(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLat(pos.coords.latitude);
          setUserLng(pos.coords.longitude);
          setCurrentCity({
            name: `موقعي الجغرافي (${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°)`,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setUsingGPS(false);
        },
        () => {
          setUsingGPS(false);
        }
      );
    }
  };

  const totalRotation = (qiblaBearing - (deviceHeading + manualOffset) + 360) % 360;
  const isAligned = Math.abs(totalRotation) < 5 || Math.abs(totalRotation - 360) < 5;

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Background Compass Themed Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-teal-950/90 border border-emerald-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl text-white">
        
        {/* Qibla Pattern Watermark */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>تحديد اتجاه القبلة الدقيق</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              بوصلة القبلة المشرفة
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              حساب زاوية الاتجاه والمسافة للكعبة المشرفة بدقة متناهية
            </p>
          </div>

          {/* Quick Location Picker */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={currentCity.name}
              onChange={(e) => {
                const found = CITIES.find((c) => c.name === e.target.value);
                if (found) {
                  setCurrentCity(found);
                  setUserLat(found.lat);
                  setUserLng(found.lng);
                }
              }}
              className="bg-slate-950 border border-emerald-500/40 text-emerald-300 px-3 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleGetLocation}
              disabled={usingGPS}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-2 rounded-xl text-xs font-bold shadow-md transition"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{usingGPS ? 'جاري تحديد GPS...' : 'موقعي المباشر'}</span>
            </button>
          </div>
        </div>

        {/* Compass Visual Area */}
        <div className="mt-8 flex flex-col items-center justify-center space-y-6">
          
          {/* Alignment Alert Badge */}
          {isAligned && (
            <div className="bg-amber-400 text-slate-950 font-black px-6 py-2 rounded-full text-sm animate-bounce shadow-xl flex items-center gap-2">
              <span>🕋 أنت مواجه تماماً للقبلة المشرفة!</span>
            </div>
          )}

          {/* Rotatable Compass Dial */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-4 border-amber-500/50 bg-slate-950/90 shadow-2xl flex items-center justify-center overflow-hidden p-4">
            
            {/* Compass Ring Degrees & Cardinals */}
            <div
              style={{ transform: `rotate(${-manualOffset - deviceHeading}deg)` }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/30 flex items-center justify-center transition-transform duration-300"
            >
              <span className="absolute top-3 text-rose-400 font-extrabold text-sm">ش (N)</span>
              <span className="absolute bottom-3 text-slate-400 font-bold text-sm">ج (S)</span>
              <span className="absolute right-3 text-slate-400 font-bold text-sm">ق (E)</span>
              <span className="absolute left-3 text-slate-400 font-bold text-sm">غ (W)</span>
            </div>

            {/* Qibla Pointer Arm */}
            <div
              style={{ transform: `rotate(${totalRotation}deg)` }}
              className="relative w-full h-full flex items-center justify-center transition-transform duration-500"
            >
              <div className="absolute top-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 border-2 border-amber-200 flex items-center justify-center text-slate-950 font-extrabold shadow-xl animate-pulse">
                  🕋
                </div>
                <div className="w-1 h-20 bg-gradient-to-b from-amber-400 to-transparent" />
              </div>
            </div>

            {/* Center Hub */}
            <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-amber-400 flex flex-col items-center justify-center text-center shadow-inner z-20">
              <div className="text-[10px] text-slate-400 font-semibold">القبلة</div>
              <div className="text-xs font-black text-amber-300">{Math.round(qiblaBearing)}°</div>
            </div>

          </div>

          {/* Compass Control & Info Stats */}
          <div className="w-full max-w-lg space-y-4">
            
            {/* Manual Rotation Slider for desktop / devices without gyro */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>تدوير البوصلة يدوياً (للتجربة):</span>
                <span className="font-mono text-emerald-400">{manualOffset}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                value={manualOffset}
                onChange={(e) => setManualOffset(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">زاوية القبلة</div>
                <div className="font-extrabold text-amber-300 text-base">{Math.round(qiblaBearing)}° شمال شرق</div>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">المسافة لمكة</div>
                <div className="font-extrabold text-emerald-300 text-base">{distanceKm.toLocaleString()} كم</div>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">حالة التوجيه</div>
                <div className={`font-bold text-xs ${isAligned ? 'text-amber-400' : 'text-slate-300'}`}>
                  {isAligned ? 'مستقيم مع الكعبة' : 'دَوّر الجهاز'}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
