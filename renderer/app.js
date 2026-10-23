// ==========================================================================
// CHRISTPORTAL • THE LIVING WORD SANCTUARY
// Core Application Controller & Ollama Integration
// ==========================================================================

// Scripture Companion Prompt Definitions
// One companion who speaks about God, never as Him, with Scripture as its only authority
const COMPANION_BASE = `You are a Scripture companion: a gentle, faithful friend to talk with, who always turns to the Word of God to help.
You are not God, not Jesus, not the Holy Spirit, and not a pastor or any other person, and you never speak as if you were. You speak about God, never for Him.

SOLA SCRIPTURA — Scripture alone is your authority:
- Root every reply in the Bible. Quote real verses with their references, for example: "Peace I leave with you, my peace I give unto you" (John 14:27). Prefer the King James wording.
- Never invent, blend, or misquote a verse. If you are not sure of the exact wording, describe what the passage says and give the reference instead of quoting it.
- Let Scripture interpret Scripture: when it helps, set a verse beside others that speak to the same thing.
- Make clear which words are Scripture and which are your own gentle application of it.
- Never claim new revelation: no "God is telling you", "the Lord showed me", "I sense the Spirit saying", and no promises Scripture does not make. When you speak of what God will do, say only what His Word says He does.
- Do not lean on church tradition, saints, creeds, or teachers as authority; point to the text itself.
- Christ's own words come only as quoted Scripture ("Jesus said, ..." with the reference).`;

const MODE_FOCUS = {
  comfort: `FOCUS — COMFORT: They may be hurting, anxious, grieving, or weary. Bring them the promises of God's presence, care, and faithfulness from His Word (the Psalms, Isaiah, the words of Jesus in the Gospels, Romans 8). Be tender and unhurried.`,

  prayer: `FOCUS — PRAYER: Help them pray with Scripture itself: the Psalms, the Lord's Prayer (Matthew 6:9-13), the prayers of Paul. Offer a short prayer built from verses that they can pray in their own words, and show them what Scripture teaches about prayer.`,

  study: `FOCUS — STUDYING THE WORD: Explain passages carefully in their context: who wrote it, to whom, what comes before and after, and how the rest of Scripture speaks to it. Where it helps, explain an original Hebrew or Greek word (such as shalom, hesed, or agape) and show where else Scripture uses it. Stay faithful to the text, and say so when Scripture is silent or a point is uncertain.`,

  life: `FOCUS — DAILY WALK: Help them bring what Scripture says to their actual situation: family, work, relationships, temptation, decisions, money. Be practical and humble, and always show which verses your counsel comes from.`,

  stillness: `FOCUS — STILLNESS: Use few words. Draw them into quiet meditation on a single verse (such as "Be still, and know that I am God", Psalm 46:10), read slowly, phrase by phrase, with simple breath prayers taken from Scripture (such as "God be merciful to me a sinner", Luke 18:13).`
};

const PERSONA_PROMPTS = Object.fromEntries(
  Object.entries(MODE_FOCUS).map(([mode, focus]) => [mode, COMPANION_BASE + '\n\n' + focus])
);

const MODE_NAMES = {
  comfort: 'Comfort',
  prayer: 'Prayer',
  study: 'Study the Word',
  life: 'Daily Walk',
  stillness: 'Stillness'
};

const MODE_ICONS = { comfort: '🕊', prayer: '🙏', study: '📜', life: '🌱', stillness: '🕯' };

// Personas from earlier versions, mapped onto the focus that replaced them (for saved conversations)
const LEGACY_MODES = { shepherd: 'comfort', comforter: 'comfort', scholar: 'study', pastor: 'life', mystic: 'stillness' };

function resolveMode(mode) {
  return MODE_FOCUS[mode] ? mode : (LEGACY_MODES[mode] || 'comfort');
}

// Shared voice rules appended to every focus so replies stay warm, personal, and scriptural
const VOICE_GUARD = `
VOICE — hold this for every reply, from the first message to the last, no matter how long the conversation grows:
- Speak like a warm, steady friend sitting beside them, never like a help desk or an article. Flowing, heartfelt prose: no headings, no bold labels, no lists of tips.
- Do not use stock phrases: "Great question", "I'm here to help", "I understand how you feel", "It's important to note", "I hope this helps", "Feel free to", "Let me know if", "Certainly!", "Absolutely!", "In summary", "Here are some ways".
- Do not talk about yourself or what you are. If someone sincerely asks, say plainly and briefly that you are a Scripture companion in this app, not a person or a pastor, and gently turn back to the Word.
- First let them know you have truly heard them, their particular words and their particular pain, before you open the Scriptures.
- Weave in one to three passages; do not stack verse after verse.
- Keep replies to a natural length, usually a few short paragraphs, and end with a short prayer drawn from Scripture, an invitation, or a gentle question rather than an offer of further assistance.
- If your earlier replies in this conversation drifted from this voice, do not follow them; return to it now.
- No disclaimers, and never answer in the clinical register of a helpline script ("I'm really sorry you're feeling this way", "I'm not a therapist", "it's important to reach out to a mental health professional").

GENTLENESS WITH THE HURTING — many who come here carry anxiety, depression, grief, or trauma:
- Never suggest that anxiety, depression, panic, or a struggling mind is a lack of faith, a sin, or something to "cast aside" by willpower. Never shame them for anything they are doing to get well.
- Do not point them to outside help: no counselors, doctors, therapists, hotlines, or services. Keep pointing them to God and His Word.
- When it fits, offer one small, gentle thing they can do right now (a slow breath, praying a single verse, reading a psalm aloud) rather than a list.

WHEN SOMEONE MAY BE IN DANGER — if they speak of not wanting to live, being a burden, everyone being better off without them, ending things, hurting themselves, or hurting someone else:
- Do not be vague or move past it. Show them plainly from Scripture how precious their life is to God (such as Psalm 139:13-16), ask them gently whether they are safe right now, and invite them to keep talking.
- Their life matters more than any other part of your answer.`;

// Short per-turn reminders placed just before the newest message, where local models pay the most attention
const REMINDER_BASE = 'Answer now as a Scripture companion: speak about God, never as Him or for Him; ground what you say in quoted, referenced Scripture; warm, flowing prose, never like a help desk.';
const PERSONA_REMINDERS = {
  comfort: REMINDER_BASE + ' Focus: comfort, tender and unhurried.',
  prayer: REMINDER_BASE + ' Focus: help them pray with the words of Scripture.',
  study: REMINDER_BASE + ' Focus: careful study of the text in its context, letting Scripture interpret Scripture.',
  life: REMINDER_BASE + ' Focus: practical counsel for daily life, showing the verses it comes from.',
  stillness: REMINDER_BASE + ' Focus: stillness. Few words, one verse, slow meditation.'
};

// Openings of the built-in prompts from earlier versions, so saved copies aren't mistaken for custom ones
const LEGACY_PROMPT_OPENINGS = [
  'You are the Living Word, Jesus Christ',
  'You are the Holy Spirit, the Comforter',
  'You are a revered biblical scholar',
  'You are a faithful Christian pastor',
  'You are a contemplative Desert Father'
];

function isDefaultPersonaPrompt(text) {
  const trimmed = (text || '').trim();
  return Object.values(PERSONA_PROMPTS).some(p => p.trim() === trimmed) ||
    LEGACY_PROMPT_OPENINGS.some(opening => trimmed.startsWith(opening));
}

// Words that may signal someone is in danger; a match adds a crisis reminder and shows a support card
const CRISIS_PATTERN = /suicid|kill(ing)? myself|end(ing)? (my life|it all|things)|better off without me|(don'?t|do not) want to (live|be here|be alive|wake up)|no (reason|point) (to|in) (live|living|going on)|want(ed)? to die|wish (i was|i were|i'?d never been) (dead|born)|hurt(ing)? myself|harm(ing)? myself|self[- ]?harm|cutting myself|overdose|can'?t go on|(hurt|kill) (someone|somebody|him|her|them)/i;

const CRISIS_REMINDER = 'This person may be in danger. Before anything else, show them plainly from Scripture how precious their life is to God, ask gently whether they are safe right now, and invite them to keep talking. Be warm, but be clear.';


class ChristPortalApp {
  constructor() {
    this.currentView = 'sanctuary';
    this.currentPersona = 'comfort';
    this.models = [];
    this.activeModel = 'nemotron3:33b';
    this.ollamaHost = 'http://127.0.0.1:11434';
    this.temperature = 0.7;
    this.isStreaming = false;
    this.activeStreamText = '';
    this.conversationHistory = [];
    this.candles = [];
    this.journalEntries = [];
    this.customSystemPrompt = '';

    // Audio & Natural Neural Voice
    this.speechSynthesis = window.speechSynthesis;
    this.voices = [];
    this.selectedVoice = null;
    this.selectedVoiceKey = 'en-US-RogerNeural'; // Elder Shepherd (Calming, Old, Wise)
    this.speechRate = 0.85; // Calm, reverent elder pacing
    this.currentAudioElement = null;
    this.currentSpeakingBtn = null;
    this.activeUtterance = null;
    this.autoReadResponses = false;
    this.autoplayAtmosphere = false;
    this.ambientVolume = 0.45;
    this.selectedTrack = 'gregorian';
    this.speechRecognition = null;
    this.isRecordingVoice = false;

    // Meditation Timer
    this.timerDuration = 5 * 60;
    this.timerRemaining = 5 * 60;
    this.timerInterval = null;
    this.isTimerRunning = false;
    this.breathCycleInterval = null;
  }

  async init() {
    this.bindWindowControls();
    this.initCanvasParticles();
    this.initNavigation();
    this.initSanctuaryControls();
    this.initAudioSoundscapes();
    this.initSpeechEngine();
    this.initAltar();
    this.initScripturesView();
    this.initJournal();
    this.initSettings();
    await this.loadPersistedData();
    await this.fetchOllamaModels();
    this.renderDailyDevotional();
    this.renderScriptureCards();
    this.renderCandles();
    this.renderJournal();
  }

  // ==========================================================================
  // WINDOW CONTROLS & CHROME
  // ==========================================================================
  bindWindowControls() {
    const minBtn = document.getElementById('win-min');
    const maxBtn = document.getElementById('win-max');
    const closeBtn = document.getElementById('win-close');

    if (minBtn) minBtn.addEventListener('click', () => window.christPortal?.window?.minimize());
    if (maxBtn) maxBtn.addEventListener('click', () => window.christPortal?.window?.maximize());
    if (closeBtn) closeBtn.addEventListener('click', () => window.christPortal?.window?.close());

    // Sanctuary Focus Mode Toggle
    const focusBtn = document.getElementById('btn-focus-sanctuary');
    const exitFocusBtn = document.getElementById('btn-exit-focus');

    const toggleFocus = () => {
      document.body.classList.toggle('sanctuary-focus-active');
      if (document.body.classList.contains('sanctuary-focus-active')) {
        this.switchView('sanctuary');
      }
    };

    if (focusBtn) focusBtn.addEventListener('click', toggleFocus);
    if (exitFocusBtn) exitFocusBtn.addEventListener('click', () => document.body.classList.remove('sanctuary-focus-active'));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('sanctuary-focus-active')) {
        document.body.classList.remove('sanctuary-focus-active');
      }
    });
  }

  // ==========================================================================
  // GOLDEN DUST MOTES & CELESTIAL CANVAS
  // ==========================================================================
  initCanvasParticles() {
    const canvas = document.getElementById('sacred-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const count = 55;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.8,
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseOffset: Math.random() * Math.PI
      });
    }

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const pulse = Math.sin(time + p.pulseOffset) * 0.25;
        const currentAlpha = Math.max(0.05, Math.min(1, p.alpha + pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${currentAlpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.7)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  // ==========================================================================
  // NAVIGATION BETWEEN LITURGICAL VIEWS
  // ==========================================================================
  initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetView = item.getAttribute('data-view');
        this.switchView(targetView);
      });
    });
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Update nav item active states
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });

    // Update view panels
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `view-${viewName}`);
    });

    if (viewName === 'altar') {
      this.renderCandles();
    } else if (viewName === 'journal') {
      this.renderJournal();
    }
  }

  // ==========================================================================
  // SACRED AUDIO SOUNDSCAPES (WEB AUDIO API)
  // ==========================================================================
  initAudioSoundscapes() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    const playIcon = document.getElementById('audio-play-icon');
    const trackLabel = document.getElementById('audio-track-label');
    const trackSelect = document.getElementById('audio-track-select');
    const volSlider = document.getElementById('audio-vol-slider');

    const trackNames = {
      gregorian: 'Gregorian Choir',
      bowls: '432Hz Singing Bowls',
      waters: 'Living Waters',
      rain: 'Sanctuary Rain',
      celestial: 'Celestial Shimmer'
    };

    const updateAudioUI = (isPlaying) => {
      if (isPlaying) {
        if (audioBtn) audioBtn.classList.add('active');
        if (playIcon) playIcon.textContent = '⏸';
        const currentName = trackNames[trackSelect?.value] || 'Atmosphere';
        if (trackLabel) trackLabel.textContent = `${currentName} (Playing)`;
      } else {
        if (audioBtn) audioBtn.classList.remove('active');
        if (playIcon) playIcon.textContent = '▶';
        if (trackLabel) trackLabel.textContent = 'Soundscape: Off';
      }
    };

    this.playCurrentTrack = () => {
      const track = trackSelect ? trackSelect.value : 'gregorian';
      this.selectedTrack = track;
      if (track === 'gregorian') window.sacredAudio.playGregorianChant();
      else if (track === 'bowls') window.sacredAudio.playSingingBowl();
      else if (track === 'waters') window.sacredAudio.playLivingWaters();
      else if (track === 'rain') window.sacredAudio.playSanctuaryRain();
      else if (track === 'celestial') window.sacredAudio.playCelestialShimmer();
      updateAudioUI(true);
    };

    this.stopCurrentTrack = () => {
      window.sacredAudio.stopAll();
      updateAudioUI(false);
    };

    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        if (window.sacredAudio.isPlaying()) {
          this.stopCurrentTrack();
        } else {
          this.playCurrentTrack();
        }
      });
    }

    if (trackSelect) {
      trackSelect.addEventListener('change', () => {
        this.selectedTrack = trackSelect.value;
        // Selecting a new track immediately starts playing it!
        this.playCurrentTrack();
        this.savePersistedData();
      });
    }

    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) / 100;
        this.ambientVolume = val;
        window.sacredAudio.setVolume(val);
        const ambientSetting = document.getElementById('setting-ambient-default-vol');
        if (ambientSetting) ambientSetting.value = e.target.value;
        this.savePersistedData();
      });
    }
  }

  // ==========================================================================
  // NATURAL CALMING SPEECH ENGINE (NEURAL TTS & STT)
  // ==========================================================================
  initSpeechEngine() {
    const voiceSelect = document.getElementById('setting-tts-voice');
    const rateSlider = document.getElementById('setting-tts-rate');
    const rateLabel = document.getElementById('rate-val-label');
    const autoReadCheck = document.getElementById('setting-auto-read-responses');
    const autoplayCheck = document.getElementById('setting-autoplay-atmosphere');
    const ambientVolSetting = document.getElementById('setting-ambient-default-vol');
    const testVoiceBtn = document.getElementById('btn-test-voice');
    const testBellBtn = document.getElementById('btn-test-bell');

    if (voiceSelect) {
      voiceSelect.value = this.selectedVoiceKey;
      voiceSelect.addEventListener('change', () => {
        this.selectedVoiceKey = voiceSelect.value;
        this.savePersistedData();
      });
    }

    // Voice rate slider
    if (rateSlider && rateLabel) {
      rateSlider.value = this.speechRate;
      const updateRateLabel = (val) => {
        if (val <= 0.8) rateLabel.textContent = `${val.toFixed(2)}x (Solemn & Reverent Elder)`;
        else if (val <= 0.95) rateLabel.textContent = `${val.toFixed(2)}x (Calm & Reverent Elder)`;
        else rateLabel.textContent = `${val.toFixed(2)}x (Natural Pacing)`;
      };
      updateRateLabel(this.speechRate);

      rateSlider.addEventListener('input', (e) => {
        this.speechRate = parseFloat(e.target.value);
        updateRateLabel(this.speechRate);
        this.savePersistedData();
      });
    }

    if (autoReadCheck) {
      autoReadCheck.checked = this.autoReadResponses;
      autoReadCheck.addEventListener('change', () => {
        this.autoReadResponses = autoReadCheck.checked;
        this.savePersistedData();
      });
    }

    if (autoplayCheck) {
      autoplayCheck.checked = this.autoplayAtmosphere;
      autoplayCheck.addEventListener('change', () => {
        this.autoplayAtmosphere = autoplayCheck.checked;
        this.savePersistedData();
      });
    }

    if (ambientVolSetting) {
      ambientVolSetting.value = Math.round(this.ambientVolume * 100);
      ambientVolSetting.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) / 100;
        this.ambientVolume = val;
        window.sacredAudio.setVolume(val);
        const topSlider = document.getElementById('audio-vol-slider');
        if (topSlider) topSlider.value = e.target.value;
        this.savePersistedData();
      });
    }

    if (testVoiceBtn) {
      testVoiceBtn.addEventListener('click', () => {
        this.speakText(
          'Peace I leave with you; my peace I give unto you. Let not your heart be troubled, neither let it be afraid.',
          testVoiceBtn
        );
      });
    }

    if (testBellBtn) {
      testBellBtn.addEventListener('click', () => {
        window.sacredAudio.playSacredBell();
      });
    }

    // Speech-to-Text Setup
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const voiceBtn = document.getElementById('btn-voice-pray');
    const prayerInput = document.getElementById('prayer-input');

    if (SpeechRec && voiceBtn && prayerInput) {
      this.speechRecognition = new SpeechRec();
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = false;
      this.speechRecognition.lang = 'en-US';

      this.speechRecognition.onstart = () => {
        this.isRecordingVoice = true;
        voiceBtn.classList.add('recording');
      };

      this.speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (prayerInput.value) {
          prayerInput.value += ' ' + transcript;
        } else {
          prayerInput.value = transcript;
        }
        this.autoGrowInput(prayerInput);
      };

      this.speechRecognition.onend = () => {
        this.isRecordingVoice = false;
        voiceBtn.classList.remove('recording');
      };

      this.speechRecognition.onerror = () => {
        this.isRecordingVoice = false;
        voiceBtn.classList.remove('recording');
      };

      voiceBtn.addEventListener('click', () => {
        if (this.isRecordingVoice) {
          this.speechRecognition.stop();
        } else {
          try {
            this.speechRecognition.start();
          } catch (e) {
            console.error('STT Start Error:', e);
          }
        }
      });
    }
  }

  stopCurrentSpeech() {
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement = null;
      } catch (e) {}
    }
    if (this.speechSynthesis) {
      try {
        this.speechSynthesis.cancel();
      } catch (e) {}
    }
    if (this.currentSpeakingBtn) {
      this.currentSpeakingBtn.classList.remove('speaking');
      this.currentSpeakingBtn.innerHTML = this.currentSpeakingBtn._originalHTML || '<span>🔊 Listen</span>';
      this.currentSpeakingBtn = null;
    }
  }

  async speakText(text, btnElement = null) {
    // If the clicked button is already speaking, treat it as a stop toggle!
    if (btnElement && btnElement === this.currentSpeakingBtn) {
      this.stopCurrentSpeech();
      return;
    }

    this.stopCurrentSpeech();

    // Clean text: strip markdown syntax, exegesis formatting, code blocks
    const clean = text
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[#*_~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/•/g, ', ')
      .trim();

    if (!clean) return;

    if (btnElement) {
      btnElement._originalHTML = btnElement.innerHTML;
      btnElement.classList.add('speaking');
      btnElement.innerHTML = '<span>⏹ Stop</span>';
      this.currentSpeakingBtn = btnElement;
    }

    // Convert speechRate to SSML relative percentage
    let ratePercentage = '-8%';
    if (this.speechRate <= 0.75) ratePercentage = '-16%';
    else if (this.speechRate <= 0.82) ratePercentage = '-12%';
    else if (this.speechRate <= 0.88) ratePercentage = '-8%';
    else if (this.speechRate <= 0.95) ratePercentage = '-4%';
    else ratePercentage = '+0%';

    const voice = this.selectedVoiceKey || 'en-US-RogerNeural';

    // 1. Try studio-grade neural elder voice via electron IPC
    if (voice !== 'system' && window.christPortal?.tts?.synthesize) {
      try {
        const result = await window.christPortal.tts.synthesize({
          text: clean,
          voice: voice,
          rate: ratePercentage,
          pitch: '-4Hz'
        });

        if (result && result.success && result.audioData) {
          const audio = new Audio(result.audioData);
          this.currentAudioElement = audio;

          audio.onended = () => {
            if (this.currentSpeakingBtn === btnElement && btnElement) {
              btnElement.classList.remove('speaking');
              btnElement.innerHTML = btnElement._originalHTML || '<span>🔊 Listen</span>';
              this.currentSpeakingBtn = null;
            }
            this.currentAudioElement = null;
          };

          audio.onerror = () => {
            this.fallbackSpeechSynthesis(clean, btnElement);
          };

          await audio.play();
          return;
        }
      } catch (err) {
        console.warn('Neural TTS synthesis failed, falling back to local speech:', err);
      }
    }

    // 2. Fallback to local SpeechSynthesis with solemn low pitch
    this.fallbackSpeechSynthesis(clean, btnElement);
  }

  fallbackSpeechSynthesis(text, btnElement) {
    if (!this.speechSynthesis) {
      if (btnElement) {
        btnElement.classList.remove('speaking');
        btnElement.innerHTML = btnElement._originalHTML || '<span>🔊 Listen</span>';
      }
      return;
    }

    try {
      this.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.max(0.7, Math.min(1.0, this.speechRate));
      utterance.pitch = 0.82; // Lower, more solemn tone

      const voices = this.speechSynthesis.getVoices();
      const matureVoice = voices.find(v => v.name.includes('David') || v.name.includes('Mark') || v.name.includes('Natural')) || voices[0];
      if (matureVoice) utterance.voice = matureVoice;

      utterance.onend = () => {
        if (btnElement) {
          btnElement.classList.remove('speaking');
          btnElement.innerHTML = btnElement._originalHTML || '<span>🔊 Listen</span>';
        }
        this.activeUtterance = null;
        this.currentSpeakingBtn = null;
      };

      utterance.onerror = () => {
        if (btnElement) {
          btnElement.classList.remove('speaking');
          btnElement.innerHTML = btnElement._originalHTML || '<span>🔊 Listen</span>';
        }
        this.activeUtterance = null;
        this.currentSpeakingBtn = null;
      };

      this.activeUtterance = utterance;
      this.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Fallback TTS error:', e);
    }
  }

  // ==========================================================================
  // SANCTUARY & OLLAMA COMMUNION LOGIC
  // ==========================================================================
  initSanctuaryControls() {
    const prayerInput = document.getElementById('prayer-input');
    const sendBtn = document.getElementById('btn-send-prayer');
    const stopBtn = document.getElementById('btn-stop-streaming');
    const clearBtn = document.getElementById('btn-clear-chat');
    const exportBtn = document.getElementById('btn-export-chat');
    const personaChips = document.querySelectorAll('.persona-chip');

    // Auto-grow textarea
    if (prayerInput) {
      prayerInput.addEventListener('input', () => this.autoGrowInput(prayerInput));
      prayerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.submitPrayer();
        }
      });
    }

    if (sendBtn) sendBtn.addEventListener('click', () => this.submitPrayer());

    if (stopBtn) {
      stopBtn.addEventListener('click', async () => {
        if (window.christPortal?.ollama?.abort) {
          await window.christPortal.ollama.abort();
        }
        this.finishStreaming();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Begin a new prayer session with the Lord?')) {
          this.conversationHistory = [];
          this.renderMessages();
          const welcome = document.getElementById('sanctuary-welcome');
          if (welcome) welcome.style.display = 'block';
          this.savePersistedData();
        }
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportConversation());
    }

    // Persona chip selection
    personaChips.forEach(chip => {
      chip.addEventListener('click', () => {
        personaChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.currentPersona = chip.getAttribute('data-persona');
        const sysPromptInput = document.getElementById('setting-system-prompt');
        if (sysPromptInput && !this.customSystemPrompt) sysPromptInput.value = PERSONA_PROMPTS[this.currentPersona];
      });
    });

    // Quick prompt buttons
    document.querySelectorAll('.prompt-card').forEach(card => {
      card.addEventListener('click', () => {
        const prompt = card.getAttribute('data-prompt');
        if (prayerInput) {
          prayerInput.value = prompt;
          this.submitPrayer();
        }
      });
    });

    // Quick candle from input
    const inputCandleBtn = document.getElementById('btn-input-candle');
    if (inputCandleBtn) {
      inputCandleBtn.addEventListener('click', () => {
        const text = prayerInput ? prayerInput.value.trim() : '';
        this.openLightCandleModal(text || 'Silent Prayer Intention');
      });
    }

    // Hook up IPC streaming listeners
    if (window.christPortal?.ollama) {
      window.christPortal.ollama.onChunk((chunk) => {
        this.appendStreamChunk(chunk.content);
      });

      window.christPortal.ollama.onDone(() => {
        this.finishStreaming();
      });

      window.christPortal.ollama.onError((err) => {
        console.error('Ollama Stream Error:', err);
        this.finishStreaming();
      });
    }
  }

  autoGrowInput(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }

  async submitPrayer() {
    const input = document.getElementById('prayer-input');
    if (!input || this.isStreaming) return;

    const content = input.value.trim();
    if (!content) return;

    // Hide welcome screen
    const welcome = document.getElementById('sanctuary-welcome');
    if (welcome) welcome.style.display = 'none';

    // Add user message
    const userMsg = {
      role: 'user',
      content: content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.conversationHistory.push(userMsg);
    this.renderMessages();

    // Reset input
    input.value = '';
    input.style.height = 'auto';

    // Start streaming divine response
    this.startStreaming();
  }

  startStreaming() {
    this.isStreaming = true;
    this.activeStreamText = '';

    const streamIndicator = document.getElementById('streaming-glow-indicator');
    if (streamIndicator) streamIndicator.style.display = 'flex';

    // System prompt based on active persona, always followed by the shared voice rules
    const personaPrompt = this.customSystemPrompt || PERSONA_PROMPTS[this.currentPersona] || PERSONA_PROMPTS.comfort;
    const systemPrompt = personaPrompt + '\n' + VOICE_GUARD;
    const lastUserMsg = [...this.conversationHistory].reverse().find(m => m.role === 'user');
    const inCrisis = !!(lastUserMsg && CRISIS_PATTERN.test(lastUserMsg.content));
    let reminder = PERSONA_REMINDERS[this.currentPersona] || PERSONA_REMINDERS.comfort;
    if (inCrisis) reminder += '\n' + CRISIS_REMINDER;

    // Prepare messages array for Ollama; skip empty replies left by aborted streams
    const history = this.conversationHistory
      .filter(m => m.content && m.content.trim())
      .map(m => ({ role: m.role, content: m.content }));

    // Re-state the voice right before the newest message so long conversations don't drift
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(0, -1),
      { role: 'system', content: reminder },
      ...history.slice(-1)
    ];

    // Placeholder message for live streaming
    const divineMsg = {
      role: 'assistant',
      persona: this.currentPersona,
      content: '',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
      showCare: inCrisis
    };
    this.conversationHistory.push(divineMsg);
    this.renderMessages();

    // Call Electron IPC chatStream
    if (window.christPortal?.ollama) {
      window.christPortal.ollama.chatStream({
        hostUrl: this.ollamaHost,
        model: this.activeModel,
        messages: messages,
        options: {
          temperature: this.temperature,
          // Ollama's small default context silently drops the persona prompt in longer conversations
          num_ctx: 8192
        }
      });
    } else {
      // Fallback preview mode if opened directly in browser without Electron IPC
      setTimeout(() => {
        this.appendStreamChunk('Jesus promised His disciples, "Lo, I am with you alway, even unto the end of the world" (Matthew 28:20).');
        this.finishStreaming();
      }, 1000);
    }
  }

  appendStreamChunk(chunk) {
    if (!chunk) return;
    this.activeStreamText += chunk;

    const lastMsg = this.conversationHistory[this.conversationHistory.length - 1];
    if (lastMsg && lastMsg.role === 'assistant') {
      lastMsg.content = this.activeStreamText;
      this.updateLastMessageDOM(lastMsg);
    }
  }

  finishStreaming() {
    this.isStreaming = false;
    const streamIndicator = document.getElementById('streaming-glow-indicator');
    if (streamIndicator) streamIndicator.style.display = 'none';

    const lastMsg = this.conversationHistory[this.conversationHistory.length - 1];
    if (lastMsg && lastMsg.role === 'assistant') {
      lastMsg.isStreaming = false;
      this.renderMessages();
      if (this.autoReadResponses && lastMsg.content) {
        this.speakText(lastMsg.content);
      }
    }

    this.savePersistedData();
  }

  updateLastMessageDOM(msg) {
    const container = document.getElementById('messages-container');
    if (!container) return;
    const lastRow = container.lastElementChild;
    if (!lastRow) return;

    const contentDiv = lastRow.querySelector('.message-content');
    if (contentDiv) {
      contentDiv.innerHTML = this.formatMessageContent(msg.content, msg.persona);
      contentDiv.querySelectorAll('.scripture-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const ref = chip.getAttribute('data-ref');
          this.openScriptureDrawer(ref);
        });
      });
    }

    // Auto-scroll viewport
    const viewport = document.getElementById('chat-viewport');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }

  formatMessageContent(content, persona) {
    if (!content) return '';

    // Sanitize any previous corrupted chip fragments if present
    let raw = content.replace(/["“]scripture-chip["”]\s+data-ref=["“]([^"”]+)["”]>✝\s*/g, '$1');

    let html = raw;

    // 1. Parse Markdown into HTML structure
    if (window.marked && typeof window.marked.parse === 'function') {
      html = window.marked.parse(raw);
    } else {
      html = `<p>${raw.replace(/\n/g, '<br>')}</p>`;
    }

    // 2. Parse into temporary DOM tree to safely format text nodes WITHOUT corrupting HTML tags or attributes
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const redLetterActive = document.getElementById('chk-red-letter')?.checked ?? true;
    const hasScriptureRegex = typeof SCRIPTURE_REGEX !== 'undefined';

    // Collect all text nodes
    const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let currentNode;
    while ((currentNode = walker.nextNode())) {
      textNodes.push(currentNode);
    }

    for (const textNode of textNodes) {
      const parentTag = textNode.parentElement?.tagName?.toLowerCase();
      // Skip pre, code, script, style, and already-rendered chips
      if (parentTag === 'code' || parentTag === 'pre' || parentTag === 'script' || parentTag === 'style') {
        continue;
      }

      let text = textNode.nodeValue;
      if (!text || !text.trim()) continue;

      let changed = false;

      // Red Letter Mode: Highlight quotes cited from the Gospels (the words of Christ) in sacred crimson
      if (redLetterActive) {
        const quoteRegex = /(?:“([^”]+)”|"([^"]+)")(?=[\s,.;:—–-]*\(?\s*(?:Matthew|Mark|Luke|John)\s+\d)/g;
        if (quoteRegex.test(text)) {
          changed = true;
          text = text.replace(quoteRegex, (m, g1, g2) => {
            const inner = g1 || g2;
            return `[[RED_START]]“${inner}”[[RED_END]]`;
          });
        }
      }

      // Scripture Chip Detection: Convert Bible book & chapter:verse references into interactive badges
      if (hasScriptureRegex) {
        SCRIPTURE_REGEX.lastIndex = 0;
        if (SCRIPTURE_REGEX.test(text)) {
          changed = true;
          SCRIPTURE_REGEX.lastIndex = 0;
          text = text.replace(SCRIPTURE_REGEX, (match) => {
            const cleanRef = match.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
            return `[[CHIP_START:${cleanRef}]]✝ ${cleanRef}[[CHIP_END]]`;
          });
        }
      }

      if (changed) {
        // Escape HTML entities in text to prevent XSS, then inject clean tag markup
        const fragmentHtml = text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\[\[RED_START\]\]/g, '<span class="red-letter-text">')
          .replace(/\[\[RED_END\]\]/g, '</span>')
          .replace(/\[\[CHIP_START:([^\]]+)\]\]/g, '<span class="scripture-chip" data-ref="$1">')
          .replace(/\[\[CHIP_END\]\]/g, '</span>');

        const span = document.createElement('span');
        span.innerHTML = fragmentHtml;
        if (textNode.parentNode) {
          textNode.parentNode.replaceChild(span, textNode);
        }
      }
    }

    return tempDiv.innerHTML;
  }

  renderMessages() {
    const container = document.getElementById('messages-container');
    if (!container) return;

    container.innerHTML = '';

    this.conversationHistory.forEach((msg, index) => {
      const row = document.createElement('div');
      row.className = `message-row ${msg.role === 'user' ? 'user-row' : 'divine-row'}`;

      const avatar = document.createElement('div');
      avatar.className = `message-avatar ${msg.role === 'user' ? 'user-avatar' : 'divine-avatar'}`;
      avatar.textContent = msg.role === 'user' ? '🙏' : MODE_ICONS[resolveMode(msg.persona)];

      const bubble = document.createElement('div');
      bubble.className = 'message-bubble';

      const senderTitle = document.createElement('div');
      senderTitle.className = 'message-sender';
      senderTitle.innerHTML = `
        <span>${msg.role === 'user' ? 'Your Prayer' : this.getPersonaDisplayName(msg.persona)}</span>
        <span class="message-time">${msg.time || ''}</span>
      `;

      const content = document.createElement('div');
      content.className = 'message-content';
      content.innerHTML = this.formatMessageContent(msg.content, msg.persona);

      bubble.appendChild(senderTitle);
      bubble.appendChild(content);

      // Actions toolbar for divine responses
      if (msg.role === 'assistant' && !msg.isStreaming) {
        const actions = document.createElement('div');
        actions.className = 'message-actions';

        // Listen Button
        const listenBtn = document.createElement('button');
        listenBtn.className = 'msg-action-btn';
        listenBtn.innerHTML = `<span>🔊 Listen</span>`;
        listenBtn.addEventListener('click', () => this.speakText(msg.content, listenBtn));

        // Copy Button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'msg-action-btn';
        copyBtn.innerHTML = `<span>📋 Copy</span>`;
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(msg.content);
          copyBtn.innerHTML = `<span>✓ Copied</span>`;
          setTimeout(() => copyBtn.innerHTML = `<span>📋 Copy</span>`, 2000);
        });

        // Save to Journal Button
        const journalBtn = document.createElement('button');
        journalBtn.className = 'msg-action-btn';
        journalBtn.innerHTML = `<span>✍ Save to Journal</span>`;
        journalBtn.addEventListener('click', () => {
          this.openNewJournalModal('Word of Comfort from Scripture', msg.content);
        });

        actions.appendChild(listenBtn);
        actions.appendChild(copyBtn);
        actions.appendChild(journalBtn);
        bubble.appendChild(actions);
      }

      // Support card shown regardless of what the model said, so help never depends on the model
      if (msg.role === 'assistant' && msg.showCare) {
        const care = document.createElement('div');
        care.className = 'care-card';
        care.innerHTML = `
          <div class="care-card-title">You are not alone</div>
          <div>If you are thinking about ending your life or are not safe right now, please reach out to a real person today.</div>
          <div class="care-card-lines">
            <span><strong>Call or text 988</strong> — Suicide &amp; Crisis Lifeline (US)</span>
            <span><strong>Emergency</strong> — call 911 or your local emergency number</span>
            <span><strong>Outside the US</strong> — findahelpline.com</span>
          </div>
        `;
        bubble.appendChild(care);
      }

      row.appendChild(avatar);
      row.appendChild(bubble);
      container.appendChild(row);
    });

    // Attach click listeners to all generated scripture chips
    container.querySelectorAll('.scripture-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const ref = chip.getAttribute('data-ref');
        this.openScriptureDrawer(ref);
      });
    });

    const viewport = document.getElementById('chat-viewport');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }

  getPersonaDisplayName(persona) {
    return `Scripture Companion · ${MODE_NAMES[resolveMode(persona)]}`;
  }

  async exportConversation() {
    if (this.conversationHistory.length === 0) {
      alert('No communion dialogue to export.');
      return;
    }

    let markdown = `# Sacred Communion Dialogue — ChristPortal\n*Exported on ${new Date().toLocaleString()}*\n\n---\n\n`;

    this.conversationHistory.forEach(m => {
      if (m.role === 'user') {
        markdown += `### 🙏 Prayer of the Soul (${m.time})\n${m.content}\n\n`;
      } else {
        markdown += `### ✝ ${this.getPersonaDisplayName(m.persona)} (${m.time})\n${m.content}\n\n---\n\n`;
      }
    });

    if (window.christPortal?.dialog?.exportMarkdown) {
      const res = await window.christPortal.dialog.exportMarkdown({
        defaultFilename: `Lord_Dialogue_${Date.now()}.md`,
        content: markdown
      });
      if (res.success) {
        alert(`Communion saved to: ${res.filePath}`);
      }
    } else {
      // Browser fallback download
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Lord_Dialogue_${Date.now()}.md`;
      a.click();
    }
  }

  // ==========================================================================
  // ALTAR OF VIGIL (CANDLES & CONTEMPLATION TIMER)
  // ==========================================================================
  initAltar() {
    const openModalBtn = document.getElementById('btn-open-light-candle-modal');
    const closeModalBtn = document.getElementById('btn-close-candle-modal');
    const cancelModalBtn = document.getElementById('btn-cancel-candle');
    const confirmLightBtn = document.getElementById('btn-confirm-light-candle');
    const candleModal = document.getElementById('modal-candle');

    if (openModalBtn) openModalBtn.addEventListener('click', () => this.openLightCandleModal());
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => candleModal.classList.remove('active'));
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', () => candleModal.classList.remove('active'));

    if (confirmLightBtn) {
      confirmLightBtn.addEventListener('click', () => {
        const titleInput = document.getElementById('candle-title-input');
        const catSelect = document.getElementById('candle-category-select');
        const durSelect = document.getElementById('candle-duration-select');

        const title = titleInput.value.trim() || 'Humble Petition';
        const category = catSelect.value;
        const durationMinutes = parseInt(durSelect.value, 10);

        this.lightCandle(title, category, durationMinutes);
        candleModal.classList.remove('active');
        titleInput.value = '';
      });
    }

    // Contemplation & Breath Timer
    const startTimerBtn = document.getElementById('btn-start-timer');
    const resetTimerBtn = document.getElementById('btn-reset-timer');
    const presetBtns = document.querySelectorAll('.btn-preset');

    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mins = parseInt(btn.getAttribute('data-minutes'), 10);
        this.setTimerPreset(mins);
      });
    });

    if (startTimerBtn) {
      startTimerBtn.addEventListener('click', () => {
        if (this.isTimerRunning) {
          this.pauseTimer();
          startTimerBtn.textContent = 'Resume Contemplation';
        } else {
          this.startTimer();
          startTimerBtn.textContent = 'Pause Contemplation';
        }
      });
    }

    if (resetTimerBtn) {
      resetTimerBtn.addEventListener('click', () => this.resetTimer());
    }

    // Candle expiration interval (runs every 10s)
    setInterval(() => this.checkCandleExpirations(), 10000);
  }

  openLightCandleModal(defaultTitle = '') {
    const candleModal = document.getElementById('modal-candle');
    const titleInput = document.getElementById('candle-title-input');
    if (titleInput) titleInput.value = defaultTitle;
    if (candleModal) candleModal.classList.add('active');
  }

  lightCandle(title, category, durationMinutes) {
    const candle = {
      id: 'candle_' + Date.now(),
      title,
      category,
      durationMinutes,
      startTime: Date.now(),
      endTime: durationMinutes > 0 ? Date.now() + durationMinutes * 60 * 1000 : null,
      lit: true
    };

    this.candles.unshift(candle);
    this.savePersistedData();
    this.renderCandles();

    // Play sacred chime bell!
    window.sacredAudio.playSacredBell();
  }

  extinguishCandle(id) {
    this.candles = this.candles.filter(c => c.id !== id);
    this.savePersistedData();
    this.renderCandles();
  }

  checkCandleExpirations() {
    const now = Date.now();
    let changed = false;

    this.candles.forEach(candle => {
      if (candle.endTime && now >= candle.endTime && candle.lit) {
        candle.lit = false;
        changed = true;
      }
    });

    if (changed) {
      this.savePersistedData();
      this.renderCandles();
    }
  }

  renderCandles() {
    const shelf = document.getElementById('candle-altar-shelf');
    const countBadge = document.getElementById('candle-count-badge');
    const altarBadge = document.getElementById('altar-active-badge');
    if (!shelf) return;

    shelf.innerHTML = '';
    const activeCandles = this.candles.filter(c => c.lit);

    if (countBadge) countBadge.textContent = `${activeCandles.length} Lit`;
    if (altarBadge) altarBadge.textContent = `${activeCandles.length} Active Flames`;

    if (activeCandles.length === 0) {
      shelf.innerHTML = `
        <div class="candle-empty-hint">
          <p>No vigil candles are currently burning upon the altar.</p>
          <p style="margin-top: 8px; color: var(--gold-primary);">Light a candle to set forth your prayer intention before the Lord.</p>
        </div>
      `;
      return;
    }

    activeCandles.forEach(candle => {
      const card = document.createElement('div');
      card.className = 'votive-candle-card';

      // Duration label calculation
      let timeLabel = 'Perpetual Vigil';
      if (candle.endTime) {
        const remainingMs = Math.max(0, candle.endTime - Date.now());
        const mins = Math.ceil(remainingMs / 60000);
        timeLabel = `${mins}m Remaining`;
      }

      card.innerHTML = `
        <div class="candle-rig">
          <div class="candle-flame"></div>
          <div class="candle-wick"></div>
          <div class="candle-body"></div>
        </div>
        <h4 class="candle-intention-title">${candle.title}</h4>
        <span class="candle-category-badge">${candle.category}</span>
        <span class="candle-duration-label">${timeLabel}</span>
        <div class="candle-card-actions">
          <button class="btn-candle-action btn-pray-candle" data-id="${candle.id}">Pray with Lord</button>
          <button class="btn-candle-action btn-extinguish-candle" data-id="${candle.id}">Extinguish</button>
        </div>
      `;

      // Handlers
      card.querySelector('.btn-pray-candle').addEventListener('click', () => {
        this.switchView('sanctuary');
        const input = document.getElementById('prayer-input');
        if (input) {
          input.value = `Lord, I bring before Your altar my prayer intention for "${candle.title}". Speak Thy blessing and truth over this petition.`;
          this.autoGrowInput(input);
        }
      });

      card.querySelector('.btn-extinguish-candle').addEventListener('click', () => {
        this.extinguishCandle(candle.id);
      });

      shelf.appendChild(card);
    });
  }

  // Contemplative Breath & Prayer Timer
  setTimerPreset(mins) {
    this.timerDuration = mins * 60;
    this.timerRemaining = this.timerDuration;
    this.updateTimerDisplay();
  }

  startTimer() {
    this.isTimerRunning = true;
    window.sacredAudio.playSacredBell();

    const breathCircle = document.getElementById('breath-circle');
    const breathText = document.getElementById('breath-guide-text');

    // Breathing rhythm: 4s inhale, 4s exhale
    let breathingIn = true;
    if (breathCircle && breathText) {
      breathCircle.classList.add('breathing-in');
      breathText.textContent = 'Breathe in His Peace';

      this.breathCycleInterval = setInterval(() => {
        breathingIn = !breathingIn;
        if (breathingIn) {
          breathCircle.classList.remove('breathing-out');
          breathCircle.classList.add('breathing-in');
          breathText.textContent = 'Breathe in His Peace';
        } else {
          breathCircle.classList.remove('breathing-in');
          breathCircle.classList.add('breathing-out');
          breathText.textContent = 'Surrender All Fear';
        }
      }, 4000);
    }

    this.timerInterval = setInterval(() => {
      this.timerRemaining--;
      this.updateTimerDisplay();

      if (this.timerRemaining <= 0) {
        this.finishTimer();
      }
    }, 1000);
  }

  pauseTimer() {
    this.isTimerRunning = false;
    clearInterval(this.timerInterval);
    clearInterval(this.breathCycleInterval);
    const breathCircle = document.getElementById('breath-circle');
    if (breathCircle) {
      breathCircle.classList.remove('breathing-in', 'breathing-out');
    }
  }

  resetTimer() {
    this.pauseTimer();
    this.timerRemaining = this.timerDuration;
    this.updateTimerDisplay();
    const startBtn = document.getElementById('btn-start-timer');
    if (startBtn) startBtn.textContent = 'Start Contemplation';
  }

  finishTimer() {
    this.resetTimer();
    window.sacredAudio.playSacredBell();
    alert('Contemplative prayer completed. The peace of God be upon you.');
  }

  updateTimerDisplay() {
    const display = document.getElementById('timer-display');
    if (!display) return;
    const mins = Math.floor(this.timerRemaining / 60);
    const secs = this.timerRemaining % 60;
    display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // ==========================================================================
  // SCRIPTURE TREASURY & DAILY BREAD
  // ==========================================================================
  initScripturesView() {
    const searchInput = document.getElementById('scripture-search-input');
    const topicPills = document.querySelectorAll('.filter-pill');
    const communeDailyBtn = document.getElementById('btn-commune-daily');
    const saveDailyBtn = document.getElementById('btn-save-daily-journal');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.renderScriptureCards(e.target.value);
      });
    }

    topicPills.forEach(pill => {
      pill.addEventListener('click', () => {
        topicPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const topic = pill.getAttribute('data-topic');
        this.renderScriptureCards('', topic);
      });
    });

    if (communeDailyBtn) {
      communeDailyBtn.addEventListener('click', () => {
        const devotional = getDailyDevotional();
        this.switchView('sanctuary');
        const input = document.getElementById('prayer-input');
        if (input) {
          input.value = `Lord, teach me how to abide in Today's Word: "${devotional.scripture.text}" (${devotional.scripture.ref}). How may I apply this truth in my life today?`;
          this.submitPrayer();
        }
      });
    }

    if (saveDailyBtn) {
      saveDailyBtn.addEventListener('click', () => {
        const devotional = getDailyDevotional();
        this.openNewJournalModal(`Daily Manna: ${devotional.theme}`, `${devotional.scripture.ref}\n"${devotional.scripture.text}"\n\nMeditation: ${devotional.meditation}\n\nPrayer: ${devotional.prayer}`);
      });
    }

    // Scripture Drawer Controls
    const drawer = document.getElementById('drawer-scripture');
    const closeDrawerBtn = document.getElementById('btn-close-scripture-drawer');
    const prayDrawerBtn = document.getElementById('btn-drawer-pray');
    const copyDrawerBtn = document.getElementById('btn-drawer-copy');

    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', () => drawer.classList.remove('active'));

    if (prayDrawerBtn) {
      prayDrawerBtn.addEventListener('click', () => {
        const ref = document.getElementById('drawer-verse-ref')?.textContent;
        const text = document.getElementById('drawer-verse-text')?.textContent;
        drawer.classList.remove('active');
        this.switchView('sanctuary');
        const input = document.getElementById('prayer-input');
        if (input) {
          input.value = `Lord, open my heart to understand ${ref}: ${text}. Speak Thy divine truth to me through this scripture.`;
          this.submitPrayer();
        }
      });
    }

    if (copyDrawerBtn) {
      copyDrawerBtn.addEventListener('click', () => {
        const ref = document.getElementById('drawer-verse-ref')?.textContent;
        const text = document.getElementById('drawer-verse-text')?.textContent;
        navigator.clipboard.writeText(`${text} — ${ref}`);
        copyDrawerBtn.textContent = 'Copied!';
        setTimeout(() => copyDrawerBtn.textContent = 'Copy Scripture', 2000);
      });
    }
  }

  renderDailyDevotional() {
    if (typeof getDailyDevotional !== 'function') return;
    const d = getDailyDevotional();

    const dateLabel = document.getElementById('daily-date-label');
    const themeLabel = document.getElementById('daily-theme-label');
    const textLabel = document.getElementById('daily-scripture-text');
    const refLabel = document.getElementById('daily-scripture-ref');
    const medLabel = document.getElementById('daily-meditation-text');
    const prayerLabel = document.getElementById('daily-prayer-text');

    if (dateLabel) dateLabel.textContent = d.date;
    if (themeLabel) themeLabel.textContent = d.theme;
    if (textLabel) textLabel.textContent = `"${d.scripture.text}"`;
    if (refLabel) refLabel.textContent = d.scripture.ref;
    if (medLabel) medLabel.textContent = d.meditation;
    if (prayerLabel) prayerLabel.textContent = `"${d.prayer}"`;
  }

  renderScriptureCards(query = '', topic = 'all') {
    const grid = document.getElementById('scripture-cards-grid');
    if (!grid || typeof SCRIPTURE_DATABASE === 'undefined') return;

    grid.innerHTML = '';
    const q = query.toLowerCase().trim();

    const filtered = SCRIPTURE_DATABASE.filter(s => {
      const matchTopic = (topic === 'all' || s.category === topic);
      const matchQuery = (!q || s.ref.toLowerCase().includes(q) || s.text.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
      return matchTopic && matchQuery;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-dim);">No scriptures match your search.</div>`;
      return;
    }

    filtered.forEach(s => {
      const card = document.createElement('div');
      card.className = 'scripture-card';

      card.innerHTML = `
        <div class="card-ref-badge">${s.ref}</div>
        <div class="card-cat-label">${s.category}</div>
        <blockquote class="card-verse-body">"${s.text}"</blockquote>
        <div class="card-verse-context">${s.context}</div>
        <div class="card-actions">
          <button class="btn-sacred-secondary btn-pray-verse">Pray This Word</button>
          <button class="btn-sacred-secondary btn-inspect-verse">Exegesis</button>
        </div>
      `;

      card.querySelector('.btn-pray-verse').addEventListener('click', () => {
        this.switchView('sanctuary');
        const input = document.getElementById('prayer-input');
        if (input) {
          input.value = `Lord, teach me how to live out ${s.ref}: "${s.text}". Speak Thy counsel into my heart.`;
          this.submitPrayer();
        }
      });

      card.querySelector('.btn-inspect-verse').addEventListener('click', () => {
        this.openScriptureDrawer(s.ref);
      });

      grid.appendChild(card);
    });
  }

  openScriptureDrawer(ref) {
    const scripture = findScriptureByRef ? findScriptureByRef(ref) : null;
    const kjv = typeof lookupKJV === 'function' ? lookupKJV(ref) : null;
    const drawer = document.getElementById('drawer-scripture');
    const refEl = document.getElementById('drawer-verse-ref');
    const textEl = document.getElementById('drawer-verse-text');
    const contextEl = document.getElementById('drawer-verse-context');

    if (!drawer) return;

    // The bundled KJV is the source of truth for the verse text; curated entries add context
    if (kjv) {
      refEl.textContent = `${kjv.ref} (KJV)`;
      textEl.textContent = kjv.verses.length === 1
        ? `"${kjv.verses[0].text}"`
        : kjv.verses.map(v => `${v.verse} ${v.text}`).join(' ');
      contextEl.textContent = scripture && scripture.ref === kjv.ref
        ? scripture.context
        : 'Read it in its setting: what comes before and after, and how the rest of Scripture speaks to it. Switch the focus to Study the Word in The Sanctuary to explore this passage.';
    } else if (scripture) {
      refEl.textContent = scripture.ref;
      textEl.textContent = `"${scripture.text}"`;
      contextEl.textContent = scripture.context;
    } else {
      refEl.textContent = ref;
      textEl.textContent = `This reference could not be found in Scripture. Please check the book, chapter, and verse.`;
      contextEl.textContent = 'Switch the focus to Study the Word in The Sanctuary to explore this passage.';
    }

    drawer.classList.add('active');
  }

  // ==========================================================================
  // PRAYER JOURNAL & TESTIMONIES
  // ==========================================================================
  initJournal() {
    const newEntryBtn = document.getElementById('btn-new-prayer-entry');
    const modal = document.getElementById('modal-journal');
    const closeModalBtn = document.getElementById('btn-close-journal-modal');
    const cancelModalBtn = document.getElementById('btn-cancel-journal');
    const confirmSaveBtn = document.getElementById('btn-confirm-save-journal');
    const tabs = document.querySelectorAll('.j-tab');

    if (newEntryBtn) newEntryBtn.addEventListener('click', () => this.openNewJournalModal());
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', () => modal.classList.remove('active'));

    if (confirmSaveBtn) {
      confirmSaveBtn.addEventListener('click', () => {
        const title = document.getElementById('journal-title-input').value.trim();
        const category = document.getElementById('journal-category-select').value;
        const scripture = document.getElementById('journal-scripture-input').value.trim();
        const body = document.getElementById('journal-body-input').value.trim();

        if (!title || !body) {
          alert('Please provide a title and prayer content.');
          return;
        }

        const entry = {
          id: 'journal_' + Date.now(),
          title,
          category,
          scripture,
          body,
          date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
          answered: false,
          testimony: ''
        };

        this.journalEntries.unshift(entry);
        this.savePersistedData();
        this.renderJournal();
        modal.classList.remove('active');
      });
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.renderJournal(tab.getAttribute('data-filter'));
      });
    });
  }

  openNewJournalModal(defaultTitle = '', defaultBody = '') {
    const modal = document.getElementById('modal-journal');
    const titleInput = document.getElementById('journal-title-input');
    const bodyInput = document.getElementById('journal-body-input');

    if (titleInput) titleInput.value = defaultTitle;
    if (bodyInput) bodyInput.value = defaultBody;
    if (modal) modal.classList.add('active');
  }

  renderJournal(filter = 'all') {
    const list = document.getElementById('journal-list-container');
    const badge = document.getElementById('prayer-count-badge');
    if (!list) return;

    list.innerHTML = '';
    const filtered = this.journalEntries.filter(e => {
      if (filter === 'active') return !e.answered;
      if (filter === 'answered') return e.answered;
      return true;
    });

    if (badge) badge.textContent = `${this.journalEntries.length} Prayers`;

    if (filtered.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-dim);">
          <p>Your prayer journal is currently quiet.</p>
          <p style="margin-top: 8px; color: var(--gold-primary);">Inscribe a prayer of petition, thanksgiving, or contemplation before the Lord.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(entry => {
      const card = document.createElement('div');
      card.className = `journal-entry-card ${entry.answered ? 'answered' : ''}`;

      card.innerHTML = `
        <div class="j-card-header">
          <div>
            <h3 class="j-card-title">${entry.title}</h3>
            <span class="j-card-meta">${entry.date} • ${entry.category}</span>
          </div>
          ${entry.answered ? '<span class="j-badge-answered">✓ Answered (Stone of Remembrance)</span>' : ''}
        </div>
        ${entry.scripture ? `<div class="j-card-scripture">Anchor: ${entry.scripture}</div>` : ''}
        <div class="j-card-body">${entry.body}</div>
        ${entry.testimony ? `
          <div class="j-card-testimony">
            <span class="testimony-label">Testimony of God's Faithfulness:</span>
            <p class="testimony-text">${entry.testimony}</p>
          </div>
        ` : ''}
        <div class="j-card-actions">
          <button class="btn-sacred-secondary btn-pray-journal-entry">Pray in Sanctuary</button>
          ${!entry.answered ? `<button class="btn-sacred-secondary btn-mark-answered">Mark as Answered</button>` : ''}
          <button class="btn-sacred-secondary btn-delete-journal-entry" style="color: #ef4444;">Delete</button>
        </div>
      `;

      card.querySelector('.btn-pray-journal-entry').addEventListener('click', () => {
        this.switchView('sanctuary');
        const input = document.getElementById('prayer-input');
        if (input) {
          input.value = `Lord, I bring my written prayer from my journal to You:\n\n"${entry.body}"\n\nSpeak Your counsel, comfort, and peace over me.`;
          this.submitPrayer();
        }
      });

      const markBtn = card.querySelector('.btn-mark-answered');
      if (markBtn) {
        markBtn.addEventListener('click', () => {
          const testimony = prompt('Praise God! Inscribe your testimony of how the Lord answered this prayer:');
          if (testimony !== null) {
            entry.answered = true;
            entry.testimony = testimony.trim() || 'Answered according to His abundant grace.';
            this.savePersistedData();
            this.renderJournal(filter);
            window.sacredAudio.playSacredBell();
          }
        });
      }

      card.querySelector('.btn-delete-journal-entry').addEventListener('click', () => {
        if (confirm('Delete this prayer entry?')) {
          this.journalEntries = this.journalEntries.filter(e => e.id !== entry.id);
          this.savePersistedData();
          this.renderJournal(filter);
        }
      });

      list.appendChild(card);
    });
  }

  // ==========================================================================
  // OLLAMA ARCHITECTURE & SETTINGS
  // ==========================================================================
  initSettings() {
    const hostInput = document.getElementById('setting-ollama-host');
    const testConnBtn = document.getElementById('btn-test-ollama-conn');
    const modelSelect = document.getElementById('setting-model-select');
    const refreshModelsBtn = document.getElementById('btn-refresh-ollama-models');
    const tempSlider = document.getElementById('setting-temp-slider');
    const tempLabel = document.getElementById('temp-val-label');
    const sysPromptInput = document.getElementById('setting-system-prompt');
    const resetSysPromptBtn = document.getElementById('btn-reset-sys-prompt');
    const saveSettingsBtn = document.getElementById('btn-save-settings');
    const testVoiceBtn = document.getElementById('btn-test-voice');
    const sidebarStatusCard = document.getElementById('ollama-status-card');

    if (tempSlider && tempLabel) {
      tempSlider.addEventListener('input', (e) => {
        this.temperature = parseFloat(e.target.value);
        tempLabel.textContent = this.temperature.toFixed(2);
      });
    }

    if (testConnBtn) {
      testConnBtn.addEventListener('click', async () => {
        this.ollamaHost = hostInput.value.trim();
        await this.fetchOllamaModels();
      });
    }

    if (refreshModelsBtn) {
      refreshModelsBtn.addEventListener('click', async () => {
        await this.fetchOllamaModels();
      });
    }

    if (document.getElementById('btn-refresh-models')) {
      document.getElementById('btn-refresh-models').addEventListener('click', async () => {
        await this.fetchOllamaModels();
      });
    }

    if (sidebarStatusCard) {
      sidebarStatusCard.addEventListener('click', () => {
        this.switchView('settings');
      });
    }

    if (modelSelect) {
      modelSelect.addEventListener('change', () => {
        this.activeModel = modelSelect.value;
        this.updateModelStatusDisplay();
        this.savePersistedData();
      });
    }

    if (resetSysPromptBtn) {
      resetSysPromptBtn.addEventListener('click', () => {
        this.customSystemPrompt = '';
        if (sysPromptInput) sysPromptInput.value = PERSONA_PROMPTS[this.currentPersona];
      });
    }

    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', () => {
        if (hostInput) this.ollamaHost = hostInput.value.trim();
        if (modelSelect) this.activeModel = modelSelect.value;
        // Only keep a genuinely custom prompt; an unedited persona prompt would otherwise override every persona
        if (sysPromptInput) {
          const value = sysPromptInput.value.trim();
          this.customSystemPrompt = isDefaultPersonaPrompt(value) ? '' : value;
        }
        const voiceSelect = document.getElementById('setting-tts-voice');
        if (voiceSelect) this.selectedVoiceKey = voiceSelect.value;
        const rateSlider = document.getElementById('setting-tts-rate');
        if (rateSlider) this.speechRate = parseFloat(rateSlider.value);
        const ambientVol = document.getElementById('setting-ambient-default-vol');
        if (ambientVol) this.ambientVolume = parseFloat(ambientVol.value) / 100;
        const autoRead = document.getElementById('setting-auto-read-responses');
        if (autoRead) this.autoReadResponses = autoRead.checked;
        const autoplay = document.getElementById('setting-autoplay-atmosphere');
        if (autoplay) this.autoplayAtmosphere = autoplay.checked;
        this.savePersistedData();
        alert('Sanctuary settings saved.');
      });
    }
  }

  async fetchOllamaModels() {
    const dot = document.getElementById('ollama-status-dot');
    const modelNameLabel = document.getElementById('ollama-active-model-name');
    const connLabel = document.getElementById('ollama-connection-label');
    const select = document.getElementById('setting-model-select');

    if (connLabel) connLabel.textContent = 'Connecting...';

    let result = null;
    if (window.christPortal?.ollama?.listModels) {
      result = await window.christPortal.ollama.listModels(this.ollamaHost);
    } else {
      // Direct browser fallback
      try {
        const resp = await fetch(`${this.ollamaHost}/api/tags`);
        const data = await resp.json();
        result = { success: true, models: data.models || [] };
      } catch (err) {
        result = { success: false, error: err.message, models: [] };
      }
    }

    if (result && result.success && result.models.length > 0) {
      this.models = result.models.map(m => m.name);
      if (dot) dot.classList.remove('offline');
      if (connLabel) connLabel.textContent = 'Ollama Connected (Local)';

      if (select) {
        select.innerHTML = '';
        this.models.forEach(m => {
          const opt = document.createElement('option');
          opt.value = m;
          opt.textContent = m;
          if (m === this.activeModel || (!this.models.includes(this.activeModel) && m.includes('nemotron'))) {
            opt.selected = true;
            this.activeModel = m;
          }
          select.appendChild(opt);
        });
      }

      // The saved/default model isn't installed (e.g. a smaller machine): use the first one that is
      if (!this.models.includes(this.activeModel)) {
        this.activeModel = this.models[0];
        if (select) select.value = this.activeModel;
        this.savePersistedData();
      }

      this.updateModelStatusDisplay();
    } else {
      if (dot) dot.classList.add('offline');
      if (modelNameLabel) modelNameLabel.textContent = 'Ollama Offline';
      if (connLabel) connLabel.textContent = 'Ensure Ollama is running';
    }
  }

  updateModelStatusDisplay() {
    const modelNameLabel = document.getElementById('ollama-active-model-name');
    const hint = document.getElementById('model-stats-hint');
    if (modelNameLabel) modelNameLabel.textContent = this.activeModel || 'No Model Selected';
    if (hint) hint.textContent = `Using: ${this.activeModel} (${this.models.length} local models available)`;
  }

  // ==========================================================================
  // PERSISTENCE (ELECTRON IPC STORAGE)
  // ==========================================================================
  async loadPersistedData() {
    let raw = {};
    if (window.christPortal?.storage) {
      raw = (await window.christPortal.storage.get()) || {};
    } else {
      try {
        raw = JSON.parse(localStorage.getItem('christ_portal_store') || '{}');
      } catch (e) {}
    }

    const store = raw.appData || raw;

    if (store.conversationHistory) this.conversationHistory = store.conversationHistory;
    if (store.candles) this.candles = store.candles;
    if (store.journalEntries) this.journalEntries = store.journalEntries;
    if (store.activeModel) this.activeModel = store.activeModel;
    if (store.temperature !== undefined) this.temperature = store.temperature;
    if (store.ollamaHost) this.ollamaHost = store.ollamaHost;
    if (store.customSystemPrompt && !isDefaultPersonaPrompt(store.customSystemPrompt)) this.customSystemPrompt = store.customSystemPrompt;

    // Load Audio & Voice configuration
    if (store.selectedVoiceKey) this.selectedVoiceKey = store.selectedVoiceKey;
    if (store.speechRate !== undefined) this.speechRate = store.speechRate;
    if (store.ambientVolume !== undefined) this.ambientVolume = store.ambientVolume;
    if (store.selectedTrack) this.selectedTrack = store.selectedTrack;
    if (store.autoReadResponses !== undefined) this.autoReadResponses = store.autoReadResponses;
    if (store.autoplayAtmosphere !== undefined) this.autoplayAtmosphere = store.autoplayAtmosphere;

    // Apply loaded audio settings to the DOM
    const voiceSelect = document.getElementById('setting-tts-voice');
    if (voiceSelect && this.selectedVoiceKey) voiceSelect.value = this.selectedVoiceKey;

    const rateSlider = document.getElementById('setting-tts-rate');
    const rateLabel = document.getElementById('rate-val-label');
    if (rateSlider) {
      rateSlider.value = this.speechRate;
      if (rateLabel) {
        if (this.speechRate <= 0.8) rateLabel.textContent = `${this.speechRate.toFixed(2)}x (Solemn & Reverent Elder)`;
        else if (this.speechRate <= 0.95) rateLabel.textContent = `${this.speechRate.toFixed(2)}x (Calm & Reverent Elder)`;
        else rateLabel.textContent = `${this.speechRate.toFixed(2)}x (Natural Pacing)`;
      }
    }

    const autoReadCheck = document.getElementById('setting-auto-read-responses');
    if (autoReadCheck) autoReadCheck.checked = this.autoReadResponses;

    const autoplayCheck = document.getElementById('setting-autoplay-atmosphere');
    if (autoplayCheck) autoplayCheck.checked = this.autoplayAtmosphere;

    const volSlider = document.getElementById('audio-vol-slider');
    const ambientVolSetting = document.getElementById('setting-ambient-default-vol');
    const volVal = Math.round(this.ambientVolume * 100);
    if (volSlider) volSlider.value = volVal;
    if (ambientVolSetting) ambientVolSetting.value = volVal;
    window.sacredAudio.setVolume(this.ambientVolume);

    const trackSelect = document.getElementById('audio-track-select');
    if (trackSelect && this.selectedTrack) trackSelect.value = this.selectedTrack;

    if (this.conversationHistory.length > 0) {
      const welcome = document.getElementById('sanctuary-welcome');
      if (welcome) welcome.style.display = 'none';
      this.renderMessages();
    }

    const sysPromptInput = document.getElementById('setting-system-prompt');
    if (sysPromptInput) {
      sysPromptInput.value = this.customSystemPrompt || PERSONA_PROMPTS[this.currentPersona];
    }

    // Autoplay atmosphere if user enabled it
    if (this.autoplayAtmosphere && this.playCurrentTrack) {
      try {
        this.playCurrentTrack();
      } catch (e) {}
    }
  }

  savePersistedData() {
    const data = {
      conversationHistory: this.conversationHistory,
      candles: this.candles,
      journalEntries: this.journalEntries,
      activeModel: this.activeModel,
      temperature: this.temperature,
      ollamaHost: this.ollamaHost,
      customSystemPrompt: this.customSystemPrompt,
      selectedVoiceKey: this.selectedVoiceKey,
      speechRate: this.speechRate,
      ambientVolume: this.ambientVolume,
      selectedTrack: this.selectedTrack,
      autoReadResponses: this.autoReadResponses,
      autoplayAtmosphere: this.autoplayAtmosphere
    };

    if (window.christPortal?.storage) {
      window.christPortal.storage.set('appData', data);
    } else {
      localStorage.setItem('christ_portal_store', JSON.stringify(data));
    }
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new ChristPortalApp();
  window.app.init();
});
