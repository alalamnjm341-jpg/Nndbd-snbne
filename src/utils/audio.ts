// Web Audio API Sound Synthesizer for rich offline sound effects

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Synthesizes a loud, smart rooster crowing sound ("صوت الديك القوي")
 * Multi-stage pitch modulation: Cock-a-doodle-doo!
 */
export function playRoosterSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Phase 1: Short intro "Cock"
    playTone(ctx, 420, 560, now, 0.25, 'sawtooth', 0.5);

    // Phase 2: Middle "a"
    playTone(ctx, 500, 460, now + 0.25, 0.2, 'sawtooth', 0.4);

    // Phase 3: High "doodle"
    playTone(ctx, 600, 820, now + 0.45, 0.4, 'triangle', 0.7);

    // Phase 4: Long sustained high "DOOOOO!" with vibrato
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now + 0.85);
    osc.frequency.exponentialRampToValueAtTime(1050, now + 1.15);
    osc.frequency.exponentialRampToValueAtTime(700, now + 2.4);

    // Vibrato effect for rooster throat
    lfo.frequency.setValueAtTime(12, now + 0.85);
    lfoGain.gain.setValueAtTime(35, now + 0.85);
    lfo.connect(osc.frequency);
    lfo.start(now + 0.85);
    lfo.stop(now + 2.5);

    gain.gain.setValueAtTime(0.01, now + 0.85);
    gain.gain.linearRampToValueAtTime(0.9, now + 1.0);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + 0.85);
    osc.stop(now + 2.5);

  } catch (e) {
    console.warn('Audio synthesis warning:', e);
  }
}

function playTone(
  ctx: AudioContext,
  startFreq: number,
  endFreq: number,
  startTime: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.5
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, startTime);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), startTime + duration);

  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

/**
 * Tasbeeh click sound effect
 */
export function playTasbeehClick(muted: boolean = false, pitchMultiplier: number = 1) {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    playTone(ctx, 600 * pitchMultiplier, 300 * pitchMultiplier, now, 0.05, 'sine', 0.3);
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Speech synthesis for pronouncing dhikr
 */
export function speakDhikrText(text: string) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
}

/**
 * Compass alignment notification chime
 */
export function playQiblaAlignedSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    playTone(ctx, 523.25, 523.25, now, 0.2, 'sine', 0.4); // C5
    playTone(ctx, 659.25, 659.25, now + 0.15, 0.2, 'sine', 0.4); // E5
    playTone(ctx, 783.99, 783.99, now + 0.3, 0.4, 'sine', 0.5); // G5
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Beep sound for Odometer tick or warning
 */
export function playOdometerTick() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    playTone(ctx, 880, 440, now, 0.06, 'triangle', 0.2);
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Vault unlock success chime
 */
export function playVaultUnlockSound(success: boolean) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    if (success) {
      playTone(ctx, 440, 880, now, 0.15, 'sine', 0.4);
      playTone(ctx, 880, 1320, now + 0.12, 0.25, 'sine', 0.5);
    } else {
      playTone(ctx, 300, 150, now, 0.3, 'sawtooth', 0.4);
    }
  } catch (e) {
    console.warn(e);
  }
}
