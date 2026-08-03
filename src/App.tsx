import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SettingsModal } from './components/SettingsModal';
import { HomeGrid } from './components/HomeGrid';
import { ThermometerView } from './components/ThermometerView';
import { QiblaView } from './components/QiblaView';
import { OdometerView } from './components/OdometerView';
import { EarthMapView } from './components/EarthMapView';
import { RoosterAlarmView } from './components/RoosterAlarmView';
import { SmartClockView } from './components/SmartClockView';
import { SmartTasbeehView } from './components/SmartTasbeehView';
import { SmartVaultView } from './components/SmartVaultView';
import { AppTab, AppTheme } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('home');
  const [theme, setTheme] = useState<AppTheme>('emerald');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);

  const getThemeBg = () => {
    switch (theme) {
      case 'emerald':
        return 'bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950';
      case 'dark':
        return 'bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950';
      case 'gold':
        return 'bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950';
      case 'cyber':
        return 'bg-slate-950 text-slate-100 selection:bg-cyan-400 selection:text-slate-950';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans dir-rtl ${getThemeBg()}`}>
      {/* Top Fixed Header with Developer Credits & Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8">
        {currentTab === 'home' && <HomeGrid onSelectTab={setCurrentTab} />}
        {currentTab === 'thermometer' && <ThermometerView />}
        {currentTab === 'qibla' && <QiblaView />}
        {currentTab === 'odometer' && <OdometerView />}
        {currentTab === 'map' && <EarthMapView />}
        {currentTab === 'alarm' && <RoosterAlarmView />}
        {currentTab === 'clock' && <SmartClockView />}
        {currentTab === 'tasbeeh' && <SmartTasbeehView />}
        {currentTab === 'vault' && <SmartVaultView />}
      </main>

      {/* Developer Credit Footer */}
      <Footer />

      {/* Settings & Info Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        vibrationEnabled={vibrationEnabled}
        onToggleVibration={() => setVibrationEnabled(!vibrationEnabled)}
      />
    </div>
  );
}
