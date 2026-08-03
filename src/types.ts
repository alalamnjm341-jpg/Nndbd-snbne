export type AppTab =
  | 'home'
  | 'thermometer'
  | 'qibla'
  | 'odometer'
  | 'map'
  | 'alarm'
  | 'clock'
  | 'tasbeeh'
  | 'vault';

export type AppTheme = 'emerald' | 'dark' | 'gold' | 'cyber';

export interface AlarmItem {
  id: string;
  time: string; // HH:mm format
  title: string;
  soundType: 'rooster' | 'classic' | 'gentle' | 'takbeer';
  enabled: boolean;
  repeatDays: number[]; // 0 for Sun, 1 for Mon...
  snoozeCount?: number;
}

export interface DhikrItem {
  id: string;
  text: string;
  count: number;
  target: number;
}

export interface VaultItem {
  id: string;
  name: string;
  type: 'image' | 'video';
  dataUrl: string; // Base64 or Blob URL
  size: number;
  addedAt: number;
}

export interface OdometerLog {
  id: string;
  date: string;
  distanceMeters: number;
  durationSeconds: number;
  mode: 'walking' | 'driving' | 'cycling';
}
