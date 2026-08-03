import React, { useState, useEffect } from 'react';
import { Thermometer, RefreshCw, Sun, Flame, Wind, Droplets, Gauge, Search, MapPin } from 'lucide-react';

interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  weatherCode: number;
  updatedAt: string;
}

// Open-Meteo Weather Codes map to Arabic descriptions and icons
const getWeatherInfo = (code: number) => {
  if (code === 0) return { desc: 'مشمس / طقس صافٍ ☀️', icon: '☀️', bg: 'from-amber-500/20 to-rose-500/10' };
  if (code >= 1 && code <= 3) return { desc: 'غائم جزئياً 🌤️', icon: '🌤️', bg: 'from-cyan-500/20 to-slate-800/20' };
  if (code === 45 || code === 48) return { desc: 'ضباب كثيف 🌫️', icon: '🌫️', bg: 'from-slate-600/30 to-slate-900/30' };
  if (code >= 51 && code <= 67) return { desc: 'أمطار ورذاذ 🌧️', icon: '🌧️', bg: 'from-blue-600/30 to-indigo-900/30' };
  if (code >= 71 && code <= 77) return { desc: 'تساقط ثلوج ❄️', icon: '❄️', bg: 'from-sky-400/20 to-blue-900/20' };
  if (code >= 80 && code <= 82) return { desc: 'زخات مطرية غزيرة ⛈️', icon: '⛈️', bg: 'from-indigo-600/30 to-slate-900/40' };
  if (code >= 95) return { desc: 'عواصف رعدية 🌩️', icon: '🌩️', bg: 'from-purple-900/40 to-slate-950/50' };
  return { desc: 'طقس معتدل 🌤️', icon: '🌤️', bg: 'from-amber-500/10 to-emerald-500/10' };
};

const POPULAR_CITIES = [
  { name: 'صنعاء', lat: 15.3694, lon: 44.1910 },
  { name: 'مكة المكرمة', lat: 21.3891, lon: 39.8579 },
  { name: 'الرياض', lat: 24.7136, lon: 46.6753 },
  { name: 'القاهرة', lat: 30.0444, lon: 31.2357 },
  { name: 'دبي', lat: 25.2048, lon: 55.2708 },
  { name: 'عمان', lat: 31.9454, lon: 35.9284 },
  { name: 'بغداد', lat: 33.3152, lon: 44.3661 },
];

export const ThermometerView: React.FC = () => {
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [mode, setMode] = useState<'ambient' | 'body'>('ambient');
  
  // Weather state from real API
  const [searchCity, setSearchCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [weather, setWeather] = useState<WeatherData>({
    city: 'صنعاء',
    country: 'اليمن',
    temp: 24.5,
    feelsLike: 25.2,
    humidity: 48,
    pressure: 1014,
    windSpeed: 12,
    weatherCode: 0,
    updatedAt: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
  });

  // Body Temp state
  const [bodyTempC, setBodyTempC] = useState<number>(36.8);

  // Fetch Weather from Open-Meteo API by coordinates
  const fetchWeatherByCoords = async (lat: number, lon: number, cityName?: string, countryName?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,wind_speed_10m,weather_code`;
      const res = await fetch(weatherUrl);
      if (!res.ok) throw new Error('فشل جلب بيانات الطقس المباشرة');
      
      const data = await res.json();
      const current = data.current;

      if (!current) throw new Error('بيانات الطقس غير متاحة حالياً');

      // Reverse geocoding for city name if not provided
      let finalCity = cityName || 'موقعك الحالي';
      let finalCountry = countryName || '';

      if (!cityName) {
        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ar`);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            finalCity = geoData.address?.city || geoData.address?.town || geoData.address?.state || 'موقعك الحالي';
            finalCountry = geoData.address?.country || '';
          }
        } catch {
          // Keep default fallback
        }
      }

      setWeather({
        city: finalCity,
        country: finalCountry,
        temp: Math.round(current.temperature_2m * 10) / 10,
        feelsLike: Math.round(current.apparent_temperature * 10) / 10,
        humidity: Math.round(current.relative_humidity_2m),
        pressure: Math.round(current.surface_pressure),
        windSpeed: Math.round(current.wind_speed_10m),
        weatherCode: current.weather_code,
        updatedAt: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء الاتصال بخدمة الطقس');
    } finally {
      setLoading(false);
    }
  };

  // Search City by Name via Open-Meteo Geocoding
  const handleSearchCity = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchCity.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchCity)}&count=1&language=ar&format=json`;
      const res = await fetch(geoUrl);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        throw new Error('لم يتم العثور على المدينة المحددة. تأكد من الاسم.');
      }

      const place = data.results[0];
      await fetchWeatherByCoords(place.latitude, place.longitude, place.name, place.country);
      setSearchCity('');
    } catch (err: any) {
      setErrorMsg(err.message || 'خطأ في البحث عن المدينة');
      setLoading(false);
    }
  };

  // GPS Geolocation Handler
  const handleGPSLocation = () => {
    if (!('geolocation' in navigator)) {
      setErrorMsg('جهازك لا يدعم خاصية التحديد الجغرافي');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setErrorMsg('تعذر تحديد موقعك المباشر. تم تحميل طقس مدينة صنعاء كافتيراضي.');
        // Fallback to Sanaa default
        fetchWeatherByCoords(15.3694, 44.1910, 'صنعاء', 'اليمن');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Initial load: Fetch real weather for Sanaa / GPS
  useEffect(() => {
    handleGPSLocation();
  }, []);

  const currentDisplayTemp = mode === 'ambient' ? weather.temp : bodyTempC;
  const tempVal = unit === 'C' ? currentDisplayTemp : +(currentDisplayTemp * 1.8 + 32).toFixed(1);

  // Status message for ambient / body temperature
  const getTempStatus = (valC: number) => {
    if (mode === 'body') {
      if (valC < 36.0) return { label: 'حرارة منخفضة جداً (انخفاض حرارة)', color: 'text-blue-400 bg-blue-950/80 border-blue-500' };
      if (valC <= 37.3) return { label: 'حرارة الجسم طبيعية ومثالية (36.5-37.3°C)', color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500' };
      if (valC <= 38.0) return { label: 'ارتفاع خفيف في الحرارة', color: 'text-amber-400 bg-amber-950/80 border-amber-500' };
      return { label: 'حمى عالية! تنبيه صحي', color: 'text-rose-400 bg-rose-950/80 border-rose-500' };
    } else {
      if (valC < 15) return { label: 'جو بارد جداً ❄️', color: 'text-blue-400 bg-blue-950/80 border-blue-500' };
      if (valC < 26) return { label: 'طقس معتدل ومريح 🌤️', color: 'text-emerald-400 bg-emerald-950/80 border-emerald-500' };
      if (valC < 35) return { label: 'طقس حار ☀️', color: 'text-amber-400 bg-amber-950/80 border-amber-500' };
      return { label: 'طقس شديد الحرارة! 🌡️', color: 'text-rose-400 bg-rose-950/80 border-rose-500' };
    }
  };

  const status = getTempStatus(currentDisplayTemp);
  const weatherDetails = getWeatherInfo(weather.weatherCode);

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Container */}
      <div className="relative rounded-3xl bg-gradient-to-br from-rose-950/90 via-slate-900 to-amber-950/90 border border-rose-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl text-white">
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-500/40 text-rose-300 px-3.5 py-1 rounded-full text-xs font-bold">
              <Thermometer className="w-4 h-4 text-rose-400" />
              <span>مقياس الحرارة والطقس المباشر</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              الطقس والحرارة المباشرة الحقيقية
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              بيانات حية ومباشرة من الأقمار الصناعية للطقس والحرارة ورطوبة الجو
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 gap-2">
            <button
              onClick={() => setMode('ambient')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                mode === 'ambient' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              طقس الجو ☀️
            </button>
            <button
              onClick={() => setMode('body')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                mode === 'body' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              حرارة الجسم 🩺
            </button>
          </div>
        </div>

        {/* Ambient Mode City Search Bar */}
        {mode === 'ambient' && (
          <div className="mt-6 space-y-3 relative z-10">
            <form onSubmit={handleSearchCity} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="ابحث عن أي مدينة (مثال: صنعاء، مكة، الرياض، دبي)..."
                  className="w-full bg-slate-950/90 border border-slate-700 text-white pr-10 pl-4 py-2.5 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-2xl font-extrabold text-xs shadow-md transition active:scale-95 flex items-center gap-1.5 shrink-0"
              >
                <span>بحث</span>
              </button>

              <button
                type="button"
                onClick={handleGPSLocation}
                disabled={loading}
                className="bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition active:scale-95 flex items-center gap-1 shrink-0"
                title="جلب موقعي الجغرافي المباشر"
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">موقعي</span>
              </button>
            </form>

            {/* Quick Cities Shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-bold ml-1">مدن سريعة:</span>
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => fetchWeatherByCoords(c.lat, c.lon, c.name)}
                  className="bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-slate-800 px-2.5 py-1 rounded-xl text-[11px] transition"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-rose-200 text-xs text-center font-bold">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Main Display Area */}
        <div className="mt-8 space-y-6">
          
          {/* Temperature Numeric Gauge */}
          <div className="space-y-6">
            
            <div className={`bg-slate-900/90 border border-rose-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-4 relative overflow-hidden shadow-xl bg-gradient-to-br ${weatherDetails.bg}`}>
              
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <span className="text-xs text-amber-300 font-extrabold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>{mode === 'ambient' ? `${weather.city} ${weather.country ? `(${weather.country})` : ''}` : 'مقياس حرارة الجسم'}</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
                    className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1 rounded-xl text-xs font-bold border border-slate-700"
                  >
                    °{unit === 'C' ? 'F' : 'C'}
                  </button>

                  {mode === 'ambient' && (
                    <button
                      onClick={() => handleGPSLocation()}
                      disabled={loading}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition border border-slate-700"
                      title="تحديث بيانات الطقس الحية"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
                    </button>
                  )}
                </div>
              </div>

              {/* Weather Icon & Big Number */}
              <div className="py-2 space-y-1">
                {mode === 'ambient' && (
                  <div className="text-sm font-bold text-slate-200">
                    {weatherDetails.desc}
                  </div>
                )}

                <div className="text-6xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-amber-100 font-mono">
                  {tempVal}
                  <span className="text-3xl text-rose-400 font-normal">°{unit}</span>
                </div>

                {mode === 'ambient' && (
                  <div className="text-[11px] text-slate-400">
                    آخر تحديث حي: {weather.updatedAt}
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className={`inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold border ${status.color}`}>
                {status.label}
              </div>

              {/* Body Temp Adjustment Slider */}
              {mode === 'body' && (
                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>تعديل درجة حرارة الجسم:</span>
                    <span className="font-mono text-amber-300">{bodyTempC}°C</span>
                  </div>
                  <input
                    type="range"
                    min={35}
                    max={42}
                    step={0.1}
                    value={bodyTempC}
                    onChange={(e) => setBodyTempC(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              )}

            </div>

            {/* Weather Metrics Grid */}
            {mode === 'ambient' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-center space-y-1">
                  <Droplets className="w-5 h-5 text-cyan-400 mx-auto" />
                  <div className="text-[11px] text-slate-400">الرطوبة</div>
                  <div className="font-bold text-sm text-cyan-300">{weather.humidity}%</div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-center space-y-1">
                  <Flame className="w-5 h-5 text-amber-400 mx-auto" />
                  <div className="text-[11px] text-slate-400">الشعور الحقيقي</div>
                  <div className="font-bold text-sm text-amber-300">{weather.feelsLike}°C</div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-center space-y-1">
                  <Wind className="w-5 h-5 text-emerald-400 mx-auto" />
                  <div className="text-[11px] text-slate-400">سرعة الرياح</div>
                  <div className="font-bold text-sm text-emerald-300">{weather.windSpeed} كم/س</div>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-center space-y-1">
                  <Gauge className="w-5 h-5 text-rose-400 mx-auto" />
                  <div className="text-[11px] text-slate-400">الضغط الجوي</div>
                  <div className="font-bold text-sm text-rose-300">{weather.pressure} hPa</div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

