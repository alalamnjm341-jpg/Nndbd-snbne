import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, Image, Video, Plus, Trash2, Eye, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { VaultItem } from '../types';
import { playVaultUnlockSound } from '../utils/audio';

const STORAGE_KEY_PIN = 'app_smart_vault_pin';
const STORAGE_KEY_ITEMS = 'app_smart_vault_items';

export const SmartVaultView: React.FC = () => {
  const [pin, setPin] = useState<string>('');
  const [savedPin, setSavedPin] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [items, setItems] = useState<VaultItem[]>([]);

  // Preview Lightbox
  const [previewItem, setPreviewItem] = useState<VaultItem | null>(null);

  // Setup PIN state
  const [setupPin, setSetupPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');

  // Load saved Vault state
  useEffect(() => {
    const storedPin = localStorage.getItem(STORAGE_KEY_PIN);
    const storedItems = localStorage.getItem(STORAGE_KEY_ITEMS);

    if (storedPin) setSavedPin(storedPin);

    if (storedItems) {
      try {
        setItems(JSON.parse(storedItems));
      } catch (e) {
        console.warn('Failed parsing vault items:', e);
      }
    }
  }, []);

  // Save items
  const saveVaultItems = (newItems: VaultItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(newItems));
    } catch (e) {
      alert('مساحة التخزين ممتلئة، اختر ملفات بحجم أصغر!');
    }
  };

  // Initial Setup PIN Form
  const handleSetupVault = (e: React.FormEvent) => {
    e.preventDefault();
    if (setupPin.length < 4) {
      alert('كلمة السر يجب أن تتكون من 4 أرقام على الأقل!');
      return;
    }
    if (setupPin !== confirmPin) {
      alert('كلمتا السر غير متطابقتين!');
      return;
    }

    localStorage.setItem(STORAGE_KEY_PIN, setupPin);
    setSavedPin(setupPin);
    setIsUnlocked(true);
    playVaultUnlockSound(true);
  };

  // Unlock with PIN
  const handleUnlockWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === savedPin) {
      setIsUnlocked(true);
      playVaultUnlockSound(true);
      setPin('');
    } else {
      playVaultUnlockSound(false);
      alert('كلمة السر غير صحيحة!');
    }
  };

  // Handle Upload Media
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const isVideo = file.type.startsWith('video');
      const isImage = file.type.startsWith('image');

      if (!isImage && !isVideo) {
        alert('يُسمح فقط برفع الصور والفيديوهات!');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          const newItem: VaultItem = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
            name: file.name,
            type: isVideo ? 'video' : 'image',
            dataUrl,
            size: file.size,
            addedAt: Date.now(),
          };
          saveVaultItems([newItem, ...items]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Delete media item
  const handleDeleteItem = (id: string) => {
    if (confirm('هل أنت تأكد من حذف هذا الملف من الخزنة المشفرة؟')) {
      const updated = items.filter((item) => item.id !== id);
      saveVaultItems(updated);
      if (previewItem?.id === id) setPreviewItem(null);
    }
  };

  const handleLockVault = () => {
    setIsUnlocked(false);
    setPreviewItem(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Background Vault Themed Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950/60 to-amber-950/70 border border-amber-500/40 p-6 sm:p-8 overflow-hidden shadow-2xl text-white">
        
        {/* Security Lock Pattern Watermark */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-right">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-full text-xs font-bold">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>الخزنة المشفرة للصور والفيديوهات</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">الخزنة الذكية الحصينة</h2>
            <p className="text-xs text-slate-300">
              تشفير تام وحماية مطلقة بكلمة السر السرية الخاصة بك
            </p>
          </div>

          {isUnlocked && (
            <button
              onClick={handleLockVault}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-400 text-white px-5 py-2.5 rounded-2xl font-extrabold text-xs shadow-lg transition active:scale-95"
            >
              <Lock className="w-4 h-4" />
              <span>إغلاق وقفل الخزنة فوراً</span>
            </button>
          )}
        </div>

        {/* SCREEN 1: First Time Setup Form */}
        {!savedPin && (
          <form onSubmit={handleSetupVault} className="mt-8 bg-slate-950/90 border border-amber-500/40 p-6 sm:p-8 rounded-3xl space-y-6 max-w-lg mx-auto shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 text-3xl mx-auto">
                🔐
              </div>
              <h3 className="text-xl font-extrabold text-amber-200">إنشاء كلمة السر للخزنة</h3>
              <p className="text-xs text-slate-400">يرجى تعيين كلمة سر (PIN) خاصة بالخزنة لأول مرة</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">كلمة السر (رمز PIN):</label>
                <input
                  type="password"
                  value={setupPin}
                  onChange={(e) => setSetupPin(e.target.value)}
                  placeholder="أدخل 4 أرقام على الأقل"
                  required
                  className="w-full bg-slate-900 border border-slate-700 text-amber-300 px-4 py-3 rounded-2xl text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">تأكيد كلمة السر:</label>
                <input
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="أعد كتابة الرقم السري"
                  required
                  className="w-full bg-slate-900 border border-slate-700 text-amber-300 px-4 py-3 rounded-2xl text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 rounded-2xl font-black text-sm shadow-xl transition active:scale-95"
            >
              حفظ وإنشاء الخزنة المشفرة
            </button>
          </form>
        )}

        {/* SCREEN 2: Vault Locked Screen (Enter PIN) */}
        {savedPin && !isUnlocked && (
          <div className="mt-8 bg-slate-950/90 border border-amber-500/40 p-6 sm:p-8 rounded-3xl space-y-6 max-w-md mx-auto shadow-2xl text-center">
            <div className="space-y-2">
              <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center text-amber-300 text-4xl mx-auto shadow-xl">
                🔒
              </div>
              <h3 className="text-xl font-extrabold text-amber-200">الخزنة مغلقة بأمان</h3>
              <p className="text-xs text-slate-400">أدخل كلمة السر الخاصة بك لفتح الخزنة</p>
            </div>

            {/* PIN Entry Form */}
            <form onSubmit={handleUnlockWithPin} className="space-y-4 pt-4 border-t border-slate-800">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">كلمة السر (رمز PIN):</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="****"
                  maxLength={10}
                  required
                  autoFocus
                  className="w-full bg-slate-900 border border-slate-700 text-amber-300 px-4 py-3 rounded-2xl text-center font-mono text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3 rounded-2xl font-extrabold text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>فتح الخزنة المشفرة</span>
              </button>
            </form>

          </div>
        )}

        {/* SCREEN 3: Unlocked Gallery & Storage */}
        {savedPin && isUnlocked && (
          <div className="mt-8 space-y-6">
            
            {/* Upload Control Bar */}
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                  📂
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-amber-200">الصور والفيديوهات المحفوظة</h4>
                  <p className="text-[11px] text-slate-400">إجمالي العناصر المخزنة: {items.length} ملفات</p>
                </div>
              </div>

              <label className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-2xl font-extrabold text-xs cursor-pointer shadow-md transition active:scale-95">
                <Plus className="w-4 h-4" />
                <span>إضافة صور أو فيديوهات جديدة</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Empty State */}
            {items.length === 0 && (
              <div className="text-center py-16 bg-slate-950/40 rounded-3xl border border-slate-800 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl mx-auto text-slate-500">
                  📁
                </div>
                <h4 className="font-extrabold text-slate-300 text-sm">الخزنة فارغة حالياً</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  قم برفع الصور أو الفيديوهات الخاصة بك لخزنها وحمايتها بكلمة السر.
                </p>
              </div>
            )}

            {/* Media Items Grid */}
            {items.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-square shadow-md hover:border-amber-400 transition"
                  >
                    {item.type === 'image' ? (
                      <img
                        src={item.dataUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <video
                        src={item.dataUrl}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Media Badge */}
                    <div className="absolute top-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-300 border border-slate-800">
                      {item.type === 'image' ? 'صورة 🖼️' : 'فيديو 🎬'}
                    </div>

                    {/* Overlay Action Controls */}
                    <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <button
                        onClick={() => setPreviewItem(item)}
                        className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition"
                        title="معاينة الملف"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition"
                        title="حذف الملف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* Lightbox Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4 animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-amber-300 truncate">{previewItem.name}</span>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center max-h-[70vh] overflow-hidden rounded-2xl bg-black">
              {previewItem.type === 'image' ? (
                <img src={previewItem.dataUrl} alt={previewItem.name} className="max-h-[65vh] object-contain" />
              ) : (
                <video src={previewItem.dataUrl} controls autoPlay className="max-h-[65vh] w-full" />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
