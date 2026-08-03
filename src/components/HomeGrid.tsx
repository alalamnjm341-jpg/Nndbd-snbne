import React from 'react';
import {
  Thermometer,
  Compass,
  Footprints,
  Globe,
  AlarmClock,
  Clock,
  Sparkles,
  Lock,
  ChevronLeft,
  ArrowRightLeft
} from 'lucide-react';
import { AppTab } from '../types';

interface HomeGridProps {
  onSelectTab: (tab: AppTab) => void;
}

interface ToolCard {
  id: AppTab;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  bgGradient: string;
  badgeColor: string;
  borderColor: string;
  patternSvg: string;
  accentIcon: string;
}

const TOOLS: ToolCard[] = [
  {
    id: 'thermometer',
    title: 'قياس الحرارة',
    subtitle: 'مقياس ذكي للحرارة والطقس ورصد حرارة الجو والجسم',
    icon: Thermometer,
    bgGradient: 'from-amber-950/80 via-rose-950/70 to-slate-900',
    badgeColor: 'bg-rose-500 text-white',
    borderColor: 'border-rose-500/40 hover:border-rose-400',
    patternSvg: 'heat',
    accentIcon: '🌡️',
  },
  {
    id: 'qibla',
    title: 'تحديد القبلة',
    subtitle: 'بوصلة القبلة الدقيقة ومواقيت الصلاة ومسافة الكعبة المشرفة',
    icon: Compass,
    bgGradient: 'from-emerald-950/80 via-teal-950/70 to-slate-900',
    badgeColor: 'bg-emerald-500 text-slate-950',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    patternSvg: 'compass',
    accentIcon: '🕋',
  },
  {
    id: 'odometer',
    title: 'عداد المسافات الذكي',
    subtitle: 'حساب المسافة بدقة بالمتر والكم للمشي والسيارة بدعم GPS',
    icon: Footprints,
    bgGradient: 'from-blue-950/80 via-indigo-950/70 to-slate-900',
    badgeColor: 'bg-cyan-500 text-slate-950',
    borderColor: 'border-cyan-500/40 hover:border-cyan-400',
    patternSvg: 'meter',
    accentIcon: '📏',
  },
  {
    id: 'map',
    title: 'خريطة الأرض فائقة التقريب',
    subtitle: 'خريطة تفاعلية للكرة الأرضية بتقريب دقيق للمدن والدول',
    icon: Globe,
    bgGradient: 'from-cyan-950/80 via-blue-950/70 to-slate-900',
    badgeColor: 'bg-blue-500 text-white',
    borderColor: 'border-blue-500/40 hover:border-blue-400',
    patternSvg: 'globe',
    accentIcon: '🌍',
  },
  {
    id: 'alarm',
    title: 'المنبه الذكي (صوت الديك)',
    subtitle: 'منبه قوي ومتعدد التشاكيل بصوت وصورة الديك الذكي',
    icon: AlarmClock,
    bgGradient: 'from-amber-900/80 via-orange-950/70 to-slate-900',
    badgeColor: 'bg-amber-400 text-slate-950',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    patternSvg: 'rooster',
    accentIcon: '🐓',
  },
  {
    id: 'clock',
    title: 'الساعة الذكية',
    subtitle: 'ساعة رقمية وعقارب بأنماط نيون وإسلامية وكلاسيكية',
    icon: Clock,
    bgGradient: 'from-purple-950/80 via-slate-950 to-slate-900',
    badgeColor: 'bg-purple-500 text-white',
    borderColor: 'border-purple-500/40 hover:border-purple-400',
    patternSvg: 'clock',
    accentIcon: '⏰',
  },
  {
    id: 'tasbeeh',
    title: 'المسبحة الذكية السريعة',
    subtitle: 'مسبحة إلكترونية بنقر سريع ونطق وإهتزاز وأنماط مخصصة',
    icon: Sparkles,
    bgGradient: 'from-teal-950/80 via-emerald-950/70 to-slate-900',
    badgeColor: 'bg-teal-400 text-slate-950',
    borderColor: 'border-teal-500/40 hover:border-teal-400',
    patternSvg: 'beads',
    accentIcon: '📿',
  },
  {
    id: 'vault',
    title: 'الخزنة المشفرة الذكية',
    subtitle: 'خزنة آمنة للصور والفيديوهات بكلمة السر المشفرة',
    icon: Lock,
    bgGradient: 'from-slate-900 via-rose-950/50 to-amber-950/60',
    badgeColor: 'bg-amber-500 text-slate-950',
    borderColor: 'border-amber-400/50 hover:border-amber-300',
    patternSvg: 'vault',
    accentIcon: '🔐',
  },
];

export const HomeGrid: React.FC<HomeGridProps> = ({ onSelectTab }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border border-amber-500/30 p-5 sm:p-7 overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2.5 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3.5 py-1 rounded-full text-xs font-bold shadow-sm">
            <span>✨ 8 أدوات ذكية متكاملة بتصميم مربع متوسط</span>
          </div>
          
          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            مرحباً بك في <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300">التطبيق الذكي الشامل</span>
          </h1>
          
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            اختر أي أداة ذكية أدناه لبدء استخدامها. تم إعادة تصميم البطاقات لتكون متوسطة ومربعة لسهولة التصفح.
          </p>
        </div>
      </div>

      {/* Grid of Tools (Medium Square Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {TOOLS.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => onSelectTab(tool.id)}
              className={`group relative rounded-3xl bg-gradient-to-br ${tool.bgGradient} border ${tool.borderColor} p-4 sm:p-5 flex flex-col items-center text-center justify-between aspect-square cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl overflow-hidden shadow-lg`}
            >
              {/* Background Accent Watermark */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none select-none flex items-center justify-center text-8xl">
                {tool.accentIcon}
              </div>

              {/* Top Badge & Icon */}
              <div className="relative z-10 w-full flex items-center justify-between">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm ${tool.badgeColor}`}>
                  أداة ذكية
                </span>
                <span className="text-xl">{tool.accentIcon}</span>
              </div>

              {/* Center Main Icon */}
              <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform my-auto">
                <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300" />
              </div>

              {/* Title & Subtitle */}
              <div className="relative z-10 space-y-1 w-full">
                <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {tool.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300/90 line-clamp-2 leading-tight">
                  {tool.subtitle}
                </p>
              </div>

              {/* Footer Click Indicator */}
              <div className="relative z-10 w-full pt-2 border-t border-white/10 flex items-center justify-center gap-1 text-[11px] font-bold text-amber-300 group-hover:text-white transition-colors">
                <span>دخول للأداة</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
