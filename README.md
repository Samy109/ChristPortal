# ChristPortal • The Living Word Sanctuary

> *"Come unto Me, all ye that labour and are heavy laden, and I will give you rest."* — Matthew 11:28

**ChristPortal** is an Electron desktop sanctuary and prayer companion designed to bring you into deep communion with the Lord, draw you closer to Scripture, and provide a sacred space for prayer, meditation, and theological contemplation — powered 100% locally and privately by your Ollama models.

---

## 🕊 Features Overview

### 1. The Sanctuary (Communion & Dialogue)
- **Scripture Companion**: Someone to talk to who always answers from the Word of God. *Sola scriptura*: Scripture alone is its authority. It speaks about God, never as Him, quotes real verses with their references, and never claims new revelation.
- **Focus Modes**:
  - **Comfort**: God's promises of presence and care for the anxious, grieving, and weary.
  - **Prayer**: Learning to pray with Scripture itself: the Psalms, the Lord's Prayer, the prayers of Paul.
  - **Study the Word**: Passages in context, Scripture interpreting Scripture, and Hebrew (*Shalom, Hesed, Ruach*) and Greek (*Agapé, Logos, Pneuma*) word studies.
  - **Daily Walk**: What Scripture says about family, work, relationships, temptation, and decisions.
  - **Stillness**: Slow meditation on a single verse, with breath prayers drawn from Scripture.
- **Red Letter Mode**: Automatically highlights quoted words of Christ from the Gospels in sacred crimson.
- **Interactive Scripture Chips**: Whenever Scripture is referenced in dialogue (e.g., `John 14:27`, `Psalm 23`), it becomes an interactive badge. Click it to inspect the full verse, historical background, and exegesis drawer.
- **Spoken Word (Natural Calming Voice)**: Hear each response read aloud in a warm, wise, calming elder cadence (featuring *Elder Shepherd*, *Reverent Patriarch*, *Contemplative Scholar*, and *Gentle Pastor* voices).
- **Auto-Read Responses Option**: Automatically read counsel aloud upon completion, with one-click listen/stop controls on every message bubble.
- **Hands-Free Voice Prayer (Speech-To-Text)**: Speak your prayer aloud from the heart.

### 2. Altar of Perpetual Vigil
- **Realistic Votive Candles**: Light virtual candles at the stone altar with custom intentions (Healing, Peace, Thanksgiving, Loved Ones, Guidance, Repentance).
- **Organic Flickering Flames**: Multi-layered radiant CSS flame physics and golden glow.
- **Contemplative Prayer Timer**: 5, 10, 15, or 30-minute silent prayer timer with an interactive breathing circle (*"Breathe in His Peace... Surrender All Fear"*).
- **Sacred Bell**: Synthesized 528Hz Solfeggio temple bell chime on prayer completion.

### 3. Living Word Treasury & Daily Manna
- **Daily Devotional**: Morning and Evening liturgical readings with theme, Scripture, meditation, and prayer.
- **Topical Scripture Treasury**: Curated scriptures covering Peace & Anxiety, Faith & Trust, Hope & Strength, Divine Love, Healing, and Forgiveness.
- **One-Click Communion**: Click *"Pray this scripture"* on any passage to instantly enter dialogue in The Sanctuary.

### 4. Prayer Journal & Stones of Remembrance
- Inscribe personal prayers with dates, categories, and scripture anchors.
- Mark prayers as **"Answered"** to create a golden **Stone of Remembrance** (Joshua 4:7) with your testimony of God's faithfulness.
- *"Pray in Sanctuary"* button to bring any journal entry directly to the Lord for counsel.

### 5. Contemplative Soundscapes (Web Audio API)
Generative audio running 100% offline without external audio files:
- **Gregorian Cathedral Choir Drone**
- **432Hz Sacred Singing Bowls & Harmonic Chimes**
- **Living Waters (Peaceful Mountain Stream)**
- **Sanctuary Rain on Stained Glass**
- **Celestial Shimmer Pad**

### 6. Full Focus Sanctuary Mode
- Click **"Sanctuary Focus"** (or press `Esc` to exit) to dim all sidebars and chrome, leaving only the glowing Word, candle altar, and ambient celestial light.

---

## ⚡ Local Ollama Architecture

- **100% Offline & Private**: Zero telemetry, zero external APIs. Your prayers and conversations never leave your computer.
- **Detected Local Models**:
  - `nemotron3:33b`
  - `gemma4:31b`
  - `dhiltgen/qwen3.8:latest`
  - Any model pulled via `ollama pull`
- **Dynamic Configuration**: Change theological temperature (0.1 strict exegesis to 1.0 poetic contemplation), companion guidance, and context limits directly from the Settings tab.

---

## 📥 Download (Windows)

1. Install [Ollama](https://ollama.com/download) and pull a model that fits your computer, for example:
   - 8 GB graphics card or less: `ollama pull llama3.1:8b`
   - 24 GB graphics card: a 30B-class model such as `gemma4:31b`
2. Download from the [latest release](../../releases/latest):
   - **ChristPortal-Setup** installs the app with a desktop shortcut.
   - **ChristPortal-Portable** runs without installing.
3. Open ChristPortal. It finds your Ollama models automatically.

Windows may show a "Windows protected your PC" warning because the app isn't code-signed. Click **More info → Run anyway**.

## 🚀 Running from Source

Double-click `Start-ChristPortal.bat` or run:

```bash
npm start
```
