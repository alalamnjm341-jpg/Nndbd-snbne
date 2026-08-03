import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Globe, Search, Layers, ZoomIn, ZoomOut, Maximize2, MapPin, Compass } from 'lucide-react';

// Tile Layer Configurations
const MAP_LAYERS = {
  satellite: {
    name: 'أقمار صناعية فائقة الوضوح',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri World Imagery',
  },
  streets: {
    name: 'خريطة الشوارع والمدن',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  dark: {
    name: 'الخريطة الليلية السوداء',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO Dark',
  },
  topo: {
    name: 'تضاريس الجبال والجغرافيا',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap',
  },
};

interface LocationPreset {
  name: string;
  lat: number;
  lng: number;
  zoom: number;
}

const PRESET_LOCATIONS: LocationPreset[] = [
  { name: 'الكرة الأرضية بالكامل', lat: 20, lng: 0, zoom: 2 },
  { name: 'اليمن - العاصمة صنعاء', lat: 15.3694, lng: 44.191, zoom: 13 },
  { name: 'اليمن - محافظة عدن', lat: 12.7855, lng: 45.0187, zoom: 13 },
  { name: 'اليمن - محافظة تعز', lat: 13.5795, lng: 44.0209, zoom: 13 },
  { name: 'اليمن - محافظة إب', lat: 13.9667, lng: 44.1833, zoom: 13 },
  { name: 'السعودية - مكة المكرمة', lat: 21.4225, lng: 39.8262, zoom: 15 },
  { name: 'مصر - القاهرة', lat: 30.0444, lng: 31.2357, zoom: 12 },
  { name: 'الإمارات - دبي', lat: 25.2048, lng: 55.2708, zoom: 13 },
  { name: 'فرنسا - باريس', lat: 48.8566, lng: 2.3522, zoom: 13 },
];

export const EarthMapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeLayerKey, setActiveLayerKey] = useState<keyof typeof MAP_LAYERS>('satellite');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentZoom, setCurrentZoom] = useState<number>(3);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({ lat: 20, lng: 0 });
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [20, 0],
        zoom: 3,
        zoomControl: false,
        maxZoom: 19,
        minZoom: 2,
      });

      const initialLayer = L.tileLayer(MAP_LAYERS[activeLayerKey].url, {
        maxZoom: 19,
        attribution: MAP_LAYERS[activeLayerKey].attribution,
      }).addTo(map);

      currentTileLayerRef.current = initialLayer;
      mapInstanceRef.current = map;

      // Event listeners
      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      map.on('mousemove', (e: L.LeafletMouseEvent) => {
        setCurrentCoords({ lat: +e.latlng.lat.toFixed(4), lng: +e.latlng.lng.toFixed(4) });
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Layer when activeLayerKey changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      if (currentTileLayerRef.current) {
        mapInstanceRef.current.removeLayer(currentTileLayerRef.current);
      }
      const layerConfig = MAP_LAYERS[activeLayerKey];
      const newLayer = L.tileLayer(layerConfig.url, {
        maxZoom: 19,
        attribution: layerConfig.attribution,
      }).addTo(mapInstanceRef.current);
      currentTileLayerRef.current = newLayer;
    }
  }, [activeLayerKey]);

  // Handle Search using Nominatim OpenStreetMap API
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&accept-language=ar`)
      .then((res) => res.json())
      .then((results) => {
        if (results && results.length > 0) {
          const first = results[0];
          const lat = parseFloat(first.lat);
          const lon = parseFloat(first.lon);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([lat, lon], 14, { duration: 2 });
          }
        } else {
          alert('لم يتم العثور على المكان، حاول كتابة الاسم بدقة!');
        }
      })
      .catch(() => alert('تعذر الاتصال بخدمة البحث'))
      .finally(() => setIsSearching(false));
  };

  const handleFlyTo = (loc: LocationPreset) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lng], loc.zoom, { duration: 2.5 });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Map Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-cyan-950/90 via-slate-900 to-blue-950/90 border border-blue-500/30 p-6 overflow-hidden shadow-2xl text-white">
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-right">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>خريطة الكرة الأرضية التفاعلية</span>
            </div>
            <h2 className="text-2xl font-extrabold">التقريب العميق واستكشاف المدن والدول</h2>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن أي دولة، محافظة أو مدينة..."
                className="w-full bg-slate-950/90 border border-blue-500/40 text-white placeholder-slate-400 px-4 py-2.5 rounded-2xl text-xs font-bold pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="bg-blue-500 hover:bg-blue-400 text-slate-950 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md transition"
            >
              {isSearching ? 'جاري...' : 'بحث'}
            </button>
          </form>
        </div>

        {/* Preset Locations Ribbon */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <span className="text-[11px] text-slate-400 font-bold whitespace-nowrap">انتقال سريع:</span>
          {PRESET_LOCATIONS.map((loc) => (
            <button
              key={loc.name}
              onClick={() => handleFlyTo(loc)}
              className="bg-slate-900 hover:bg-slate-800 text-blue-300 border border-slate-700/80 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition active:scale-95"
            >
              {loc.name}
            </button>
          ))}
        </div>

      </div>

      {/* Map Interactive Stage Container */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl h-[550px] bg-slate-950">
        
        {/* Leaflet DOM container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Layer Switcher (Top Right) */}
        <div className="absolute top-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-2 rounded-2xl shadow-xl flex flex-col gap-1.5">
          <div className="text-[10px] text-amber-300 font-bold px-2 py-1 flex items-center gap-1 border-b border-slate-800">
            <Layers className="w-3 h-3 text-amber-400" />
            <span>طبقات الخريطة</span>
          </div>

          {(Object.keys(MAP_LAYERS) as Array<keyof typeof MAP_LAYERS>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveLayerKey(key)}
              className={`text-right px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeLayerKey === key
                  ? 'bg-blue-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {MAP_LAYERS[key].name}
            </button>
          ))}
        </div>

        {/* Floating Zoom Controls (Bottom Right) */}
        <div className="absolute bottom-6 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-10 h-10 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center shadow-lg transition active:scale-95"
            title="تقريب شديد"
          >
            <ZoomIn className="w-5 h-5 text-blue-400" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-10 h-10 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center shadow-lg transition active:scale-95"
            title="تبعيد"
          >
            <ZoomOut className="w-5 h-5 text-blue-400" />
          </button>
        </div>

        {/* Floating Coordinates & Zoom Level Reader (Bottom Left) */}
        <div className="absolute bottom-6 left-4 z-10 bg-slate-950/90 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-2xl shadow-xl text-xs text-slate-300 flex items-center gap-4 font-mono">
          <div className="flex items-center gap-1 text-cyan-300">
            <MapPin className="w-3.5 h-3.5" />
            <span>{currentCoords.lat}°, {currentCoords.lng}°</span>
          </div>
          <div className="border-r border-slate-800 pr-3 text-amber-300 font-bold">
            مستوى التقريب: {currentZoom}x
          </div>
        </div>

      </div>
    </div>
  );
};
