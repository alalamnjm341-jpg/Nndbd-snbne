import React from 'react';
import { Phone, Heart, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-6 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
        
        {/* Developer Info */}
        <div className="space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2 text-amber-300 font-extrabold text-sm sm:text-base">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>تطوير وبرمجة / محمد عبد الرقيب النعماني</span>
          </div>
          <p className="text-xs text-slate-500">
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} - تطبيق الأدوات الذكية الشامل
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href="https://wa.me/967773256139"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-md"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span dir="ltr">+967 773 256 139</span>
          </a>

          <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
            <span>صُنع بحب</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>في اليمن</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
