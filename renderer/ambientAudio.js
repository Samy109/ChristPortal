// Sacred Ambient Soundscape Synthesizer via Web Audio API
// 100% offline, studio-grade atmospheric generative audio without external files

class SacredAudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.activeTrack = null;
    this.activeNodes = [];
    this.intervalId = null;
    this.volume = 0.5;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Studio-grade Dynamics Compressor to keep atmospheric sound rich, warm, and distortion-free
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      const t = Math.max(this.ctx.currentTime, 0.01);
      this.masterGain.gain.setTargetAtTime(this.volume, t, 0.08);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const t = Math.max(this.ctx.currentTime, 0.01);
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, t, 0.08);
    }
    return this.isMuted;
  }

  stopAll() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
    this.activeTrack = null;
  }

  isPlaying() {
    return this.activeTrack !== null && this.activeNodes.length > 0;
  }

  getActiveTrack() {
    return this.activeTrack;
  }

  // Helper for safe audio timestamp
  _getNow() {
    this.init();
    return Math.max(this.ctx ? this.ctx.currentTime : 0, 0.02) + 0.02;
  }

  // 1. Gregorian Cathedral Choir Drone
  playGregorianChant() {
    this.init();
    this.stopAll();
    this.activeTrack = 'gregorian';

    const t0 = this._getNow();
    const baseFreq = 108; // Deep resonant D2 fundamental
    const intervals = [1, 1.5, 2, 2.5, 3]; // Root, 5th, Octave, 10th, 12th harmonic resonance

    // Sub-bass warm foundation
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(54, t0); // 54Hz deep cathedral sub
    subGain.gain.setValueAtTime(0.001, t0);
    subGain.gain.linearRampToValueAtTime(0.28, t0 + 2.5);
    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(t0);
    this.activeNodes.push(subOsc, subGain);

    intervals.forEach((mult, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(baseFreq * mult, t0);

      // Low frequency choir swell modulation
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.08 + index * 0.025, t0);
      lfoGain.gain.setValueAtTime(baseFreq * 0.018, t0);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(t0);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500 + index * 120, t0);
      filter.Q.setValueAtTime(2.2, t0);

      gain.gain.setValueAtTime(0.001, t0);
      const targetGain = 0.32 / Math.sqrt(index + 1);
      gain.gain.linearRampToValueAtTime(targetGain, t0 + 2.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t0);
      this.activeNodes.push(osc, lfo, lfoGain, gain, filter);
    });
  }

  // 2. Sacred 432Hz Singing Bowl & Harmonic Chimes
  playSingingBowl() {
    this.init();
    this.stopAll();
    this.activeTrack = 'bowls';

    const t0 = this._getNow();

    // Base fundamental drone at 216Hz & 432Hz
    const droneOsc = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(216, t0);
    droneGain.gain.setValueAtTime(0.001, t0);
    droneGain.gain.linearRampToValueAtTime(0.28, t0 + 3);
    droneOsc.connect(droneGain);
    droneGain.connect(this.masterGain);
    droneOsc.start(t0);
    this.activeNodes.push(droneOsc, droneGain);

    const harmOsc = this.ctx.createOscillator();
    const harmGain = this.ctx.createGain();
    harmOsc.type = 'sine';
    harmOsc.frequency.setValueAtTime(432, t0);
    harmGain.gain.setValueAtTime(0.001, t0);
    harmGain.gain.linearRampToValueAtTime(0.18, t0 + 3.5);
    harmOsc.connect(harmGain);
    harmGain.connect(this.masterGain);
    harmOsc.start(t0);
    this.activeNodes.push(harmOsc, harmGain);

    // Periodic gentle bowl strikes (432Hz, 540Hz, 648Hz, 864Hz)
    const strike = () => {
      if (!this.ctx || this.activeTrack !== 'bowls') return;
      const freqs = [432, 540, 648, 864];
      const freq = freqs[Math.floor(Math.random() * freqs.length)];
      const now = this._getNow();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 7.5);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 8);
    };

    strike();
    this.intervalId = setInterval(strike, 8000);
  }

  // 3. Living Waters (Stream of Life)
  playLivingWaters() {
    this.init();
    this.stopAll();
    this.activeTrack = 'waters';

    const t0 = this._getNow();
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.18;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(560, t0);
    filter.Q.setValueAtTime(1.1, t0);

    // Subtle water bubble resonance
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.45, t0);
    lfoGain.gain.setValueAtTime(160, t0);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(t0);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t0);
    gain.gain.linearRampToValueAtTime(0.42, t0 + 2.5);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    whiteNoise.start(t0);

    this.activeNodes.push(whiteNoise, filter, lfo, lfoGain, gain);
  }

  // 4. Sanctuary Rain on Stained Glass
  playSanctuaryRain() {
    this.init();
    this.stopAll();
    this.activeTrack = 'rain';

    const t0 = this._getNow();
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.28;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, t0);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t0);
    gain.gain.linearRampToValueAtTime(0.38, t0 + 2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(t0);

    this.activeNodes.push(noise, filter, gain);
  }

  // 5. Celestial Shimmer Pad
  playCelestialShimmer() {
    this.init();
    this.stopAll();
    this.activeTrack = 'celestial';

    const t0 = this._getNow();
    const chords = [220, 277.18, 329.63, 440, 554.37]; // A major 7th ethereal heavenly chord
    chords.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t0);

      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12 + idx * 0.04, t0);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(freq * 0.015, t0);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(t0);

      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.linearRampToValueAtTime(0.22, t0 + 2.5);

      if (panner) {
        panner.pan.setValueAtTime((idx - 2) * 0.35, t0);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(this.masterGain);
        this.activeNodes.push(panner);
      } else {
        osc.connect(gain);
        gain.connect(this.masterGain);
      }

      osc.start(t0);
      this.activeNodes.push(osc, gain, lfo, lfoGain);
    });
  }

  // Sacred Chime / Temple Bell (One-shot for prayer completion or candle lighting)
  playSacredBell() {
    this.init();
    const t0 = this._getNow();
    const chimeFreqs = [528, 1056, 1584]; // 528Hz Solfeggio "Miracle / Transformation" frequency
    chimeFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t0);

      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.linearRampToValueAtTime(0.38 / (idx + 1), t0 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 4.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t0);
      osc.stop(t0 + 5);
      this.activeNodes.push(osc, gain);
    });
  }
}

// Global audio singleton
window.sacredAudio = new SacredAudioSynthesizer();
