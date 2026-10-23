// Sacred Scripture Treasury and Interactive Verse Engine
const SCRIPTURE_DATABASE = [
  // Peace & Comfort
  {
    ref: "John 14:27",
    book: "John",
    chapter: 14,
    verse: "27",
    category: "Peace & Comfort",
    text: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.",
    context: "Spoken by Jesus to His disciples during the Last Supper before His departure, imparting supernatural divine peace that transcends earthly circumstances."
  },
  {
    ref: "Philippians 4:6-7",
    book: "Philippians",
    chapter: 4,
    verse: "6-7",
    category: "Peace & Comfort",
    text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.",
    context: "Paul writing from prison to the church at Philippi, prescribing prayer and thanksgiving as the cure for anxiety."
  },
  {
    ref: "Psalm 23:1-4",
    book: "Psalms",
    chapter: 23,
    verse: "1-4",
    category: "Peace & Comfort",
    text: "The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake. Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
    context: "David's eternal psalm of complete trust in the shepherd's sovereign care, provision, and presence in the darkest valleys."
  },
  {
    ref: "Matthew 11:28-30",
    book: "Matthew",
    chapter: 11,
    verse: "28-30",
    category: "Peace & Comfort",
    text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest. Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls. For my yoke is easy, and my burden is light.",
    context: "Jesus invites those burdened by religious legalism and life's crushing weights into intimate spiritual rest and partnership with Him."
  },
  {
    ref: "Isaiah 26:3",
    book: "Isaiah",
    chapter: 26,
    verse: "3",
    category: "Peace & Comfort",
    text: "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.",
    context: "The Hebrew phrase is 'Shalom Shalom' (peace of peace, double peace) reserved for those whose focus is anchored on God."
  },
  {
    ref: "Psalm 91:1-2",
    book: "Psalms",
    chapter: 91,
    verse: "1-2",
    category: "Protection & Refuge",
    text: "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty. I will say of the Lord, He is my refuge and my fortress: my God; in him will I trust.",
    context: "The secret place (Hebrew: cether) signifies intimate communion in God's sheltered presence."
  },

  // Hope & Strength
  {
    ref: "Isaiah 40:29-31",
    book: "Isaiah",
    chapter: 40,
    verse: "29-31",
    category: "Hope & Strength",
    text: "He giveth power to the faint; and to them that have no might he increaseth strength. Even the youths shall faint and be weary, and the young men shall utterly fall: But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
    context: "A prophecy of renewal for exiles; waiting (qavah) implies eager, confident expectation in God's redemption."
  },
  {
    ref: "Joshua 1:9",
    book: "Joshua",
    chapter: 1,
    verse: "9",
    category: "Hope & Strength",
    text: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.",
    context: "God's charge to Joshua upon taking leadership of Israel after Moses' death, assuring him of God's unbroken presence."
  },
  {
    ref: "Romans 8:28",
    book: "Romans",
    chapter: 8,
    verse: "28",
    category: "Hope & Strength",
    text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
    context: "Paul's great declaration that God's providence weaves every suffering and triumph into His eternal good purpose."
  },
  {
    ref: "Romans 8:38-39",
    book: "Romans",
    chapter: 8,
    verse: "38-39",
    category: "Hope & Strength",
    text: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.",
    context: "The climax of Romans 8: an unshakeable hymn of security in the eternal love of Christ."
  },
  {
    ref: "2 Timothy 1:7",
    book: "2 Timothy",
    chapter: 1,
    verse: "7",
    category: "Hope & Strength",
    text: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.",
    context: "Paul encouraging young Timothy in ministry that fear does not originate from God, but Holy Spirit gives power and clarity."
  },

  // Faith & Trust
  {
    ref: "Proverbs 3:5-6",
    book: "Proverbs",
    chapter: 3,
    verse: "5-6",
    category: "Faith & Trust",
    text: "Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
    context: "King Solomon's foundational wisdom for wholehearted reliance on divine guidance over human reasoning."
  },
  {
    ref: "Hebrews 11:1",
    book: "Hebrews",
    chapter: 11,
    verse: "1",
    category: "Faith & Trust",
    text: "Now faith is the substance of things hoped for, the evidence of things not seen.",
    context: "Substance (Greek: hypostasis, title deed or firm foundation) defines faith as spiritual reality rather than blind hope."
  },
  {
    ref: "Mark 11:24",
    book: "Mark",
    chapter: 11,
    verse: "24",
    category: "Faith & Trust",
    text: "Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them.",
    context: "Jesus teaching on the boundless power of prayer unencumbered by doubt."
  },
  {
    ref: "Jeremiah 29:11",
    book: "Jeremiah",
    chapter: 29,
    verse: "11",
    category: "Faith & Trust",
    text: "For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.",
    context: "God's promise sent to Babylonian exiles, reassuring them of His loving, intentional future for them."
  },

  // The Living Word & Salvation
  {
    ref: "John 1:1-5",
    book: "John",
    chapter: 1,
    verse: "1-5",
    category: "The Living Word",
    text: "In the beginning was the Word, and the Word was with God, and the Word was God. The same was in the beginning with God. All things were made by him; and without him was not any thing made that was made. In him was life; and the life was the light of men. And the light shineth in darkness; and the darkness comprehended it not.",
    context: "The cosmic prologue of John's Gospel establishing Jesus as the eternal Logos, Creator, and unquenchable Light."
  },
  {
    ref: "John 3:16",
    book: "John",
    chapter: 3,
    verse: "16",
    category: "The Living Word",
    text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    context: "Spoken by Jesus to Nicodemus at night: the central heart of the Christian gospel."
  },
  {
    ref: "John 14:6",
    book: "John",
    chapter: 14,
    verse: "6",
    category: "The Living Word",
    text: "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.",
    context: "Jesus answering Thomas' question, declaring His singular role as the bridge between humanity and the Father."
  },
  {
    ref: "John 10:10",
    book: "John",
    chapter: 10,
    verse: "10",
    category: "The Living Word",
    text: "The thief cometh not, but for to steal, and to kill, and to destroy: I am come that they might have life, and that they might have it more abundantly.",
    context: "Jesus contrasting His role as the Good Shepherd against the destructive works of the enemy."
  },
  {
    ref: "John 8:12",
    book: "John",
    chapter: 8,
    verse: "12",
    category: "The Living Word",
    text: "Then spake Jesus again unto them, saying, I am the light of the world: he that followeth me shall not walk in darkness, but shall have the light of life.",
    context: "Proclaimed at the Feast of Tabernacles near the giant temple menorahs, revealing Jesus as the true guide of human life."
  },
  {
    ref: "Revelation 3:20",
    book: "Revelation",
    chapter: 3,
    verse: "20",
    category: "The Living Word",
    text: "Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in to him, and will sup with him, and he with me.",
    context: "The risen Christ's gentle invitation to fellowship with anyone who opens their heart to Him."
  },

  // Divine Love & Forgiveness
  {
    ref: "1 Corinthians 13:4-8",
    book: "1 Corinthians",
    chapter: 13,
    verse: "4-8",
    category: "Divine Love",
    text: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil; Rejoiceth not in iniquity, but rejoiceth in the truth; Beareth all things, believeth all things, hopeth all things, endureth all things. Charity never faileth.",
    context: "Paul's hymn of Agape (self-giving divine love) as the greatest of all spiritual gifts."
  },
  {
    ref: "1 John 4:18-19",
    book: "1 John",
    chapter: 4,
    verse: "18-19",
    category: "Divine Love",
    text: "There is no fear in love; but perfect love casteth out fear: because fear hath torment. He that feareth is not made perfect in love. We love him, because he first loved us.",
    context: "The apostle of love emphasizing that God's unconditional love dissolves dread and judgment."
  },
  {
    ref: "1 John 1:9",
    book: "1 John",
    chapter: 1,
    verse: "9",
    category: "Forgiveness & Repentance",
    text: "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.",
    context: "A foundational covenant promise for believers seeking forgiveness and restoration."
  },
  {
    ref: "Psalm 103:11-12",
    book: "Psalms",
    chapter: 103,
    verse: "11-12",
    category: "Forgiveness & Repentance",
    text: "For as the heaven is high above the earth, so great is his mercy toward them that fear him. As far as the east is from the west, so far hath he removed our transgressions from us.",
    context: "David celebrating the infinite expanse of divine mercy and total removal of guilt."
  },

  // Healing & Deliverance
  {
    ref: "Psalm 147:3",
    book: "Psalms",
    chapter: 147,
    verse: "3",
    category: "Healing & Comfort",
    text: "He healeth the broken in heart, and bindeth up their wounds.",
    context: "Celebrating God's tender surgical care over deeply wounded human emotions and broken spirits."
  },
  {
    ref: "Isaiah 53:5",
    book: "Isaiah",
    chapter: 53,
    verse: "5",
    category: "Healing & Comfort",
    text: "But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.",
    context: "The Suffering Servant prophecy depicting Christ taking upon Himself humanity's brokenness, guilt, and infirmities."
  },
  {
    ref: "Psalm 34:18",
    book: "Psalms",
    chapter: 34,
    verse: "18",
    category: "Healing & Comfort",
    text: "The Lord is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.",
    context: "Assurance that God draws exceptionally close during our moments of deepest heartache."
  },
  {
    ref: "Revelation 21:4",
    book: "Revelation",
    chapter: 21,
    verse: "4",
    category: "Healing & Comfort",
    text: "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.",
    context: "The holy vision of the New Jerusalem, where all suffering is forever redeemed and comforted."
  },

  // Prayer & The Lord's Presence
  {
    ref: "Matthew 6:9-13",
    book: "Matthew",
    chapter: 6,
    verse: "9-13",
    category: "Prayer & Devotion",
    text: "Our Father which art in heaven, Hallowed be thy name. Thy kingdom come. Thy will be done in earth, as it is in heaven. Give us this day our daily bread. And forgive us our debts, as we forgive our debtors. And lead us not into temptation, but deliver us from evil: For thine is the kingdom, and the power, and the glory, for ever. Amen.",
    context: "The Lord's Prayer given directly by Jesus Christ as the supreme model of worship, petition, and surrender."
  },
  {
    ref: "Psalm 46:10",
    book: "Psalms",
    chapter: 46,
    verse: "10",
    category: "Prayer & Devotion",
    text: "Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.",
    context: "Stillness (Hebrew: rapah, literally 'let go', 'cease striving') calling us to rest in God's sovereign majesty."
  },
  {
    ref: "Hebrews 4:16",
    book: "Hebrews",
    chapter: 4,
    verse: "16",
    category: "Prayer & Devotion",
    text: "Let us therefore come boldly unto the throne of grace, that we may obtain mercy, and find grace to help in time of need.",
    context: "Because Christ is our sympathetic High Priest, we are invited to approach the throne without fear."
  },
  {
    ref: "Psalm 139:7-10",
    book: "Psalms",
    chapter: 139,
    verse: "7-10",
    category: "Prayer & Devotion",
    text: "Whither shall I go from thy spirit? or whither shall I flee from thy presence? If I ascend up into heaven, thou art there: if I make my bed in hell, behold, thou art there. If I take the wings of the morning, and dwell in the uttermost parts of the sea; Even there shall thy hand lead me, and thy right hand shall hold me.",
    context: "David's contemplation of God's inescapable, protective omnipresence."
  }
];

// Helper: Scripture reference regex detector (e.g., "John 3:16", "Psalm 23:1-4", "1 Cor 13:4")
const SCRIPTURE_REGEX = /\b(?:(?:1|2|3)\s+)?(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|(?:1|2)\s+Samuel|(?:1|2)\s+Kings|(?:1|2)\s+Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song of Solomon|Song of Songs|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|(?:1|2)\s+Corinthians?|(?:1|2)\s+Cor|Galatians|Ephesians|Philippians|Colossians|(?:1|2)\s+Thessalonians|(?:1|2)\s+Timothy|(?:1|2)\s+Tim|Titus|Philemon|Hebrews|James|(?:1|2)\s+Peter|(?:1|2|3)\s+John|Jude|Revelation)\s+\d+(?::\d+(?:[-‐‑–—]\d+)?)?/gi;

// Short or alternate book names, mapped to the names used in the bundled KJV
const KJV_BOOK_ALIASES = { 'psalm': 'psalms', 'song of songs': 'song of solomon', 'cor': 'corinthians', 'corinthian': 'corinthians', 'tim': 'timothy' };

// Looks up any reference ("John 14:27", "Psalm 139:13-16", "Psalm 23") in the bundled KJV
function lookupKJV(ref) {
  if (typeof KJV_BOOKS === 'undefined') return null;
  const m = ref.trim().match(/^((?:[123]\s+)?[A-Za-z]+(?:\s+of\s+[A-Za-z]+)?)\s+(\d+)(?::(\d+)(?:\s*[-‐‑–—]\s*(\d+))?)?$/);
  if (!m) return null;

  const [prefixNum, ...nameParts] = /^[123]\s/.test(m[1]) ? m[1].split(/\s+/) : [null, ...m[1].split(/\s+/)];
  let name = nameParts.join(' ').toLowerCase();
  name = KJV_BOOK_ALIASES[name] || name;
  const fullName = prefixNum ? `${prefixNum} ${name}` : name;
  const book = KJV_BOOKS.find(b => b.name.toLowerCase() === fullName);
  if (!book) return null;

  const chapterNum = parseInt(m[2], 10);
  const chapter = book.chapters[chapterNum - 1];
  if (!chapter) return null;

  const first = m[3] ? parseInt(m[3], 10) : 1;
  const last = m[3] ? Math.min(m[4] ? parseInt(m[4], 10) : first, chapter.length) : chapter.length;
  if (first < 1 || first > chapter.length || last < first) return null;

  const verses = [];
  for (let v = first; v <= last; v++) verses.push({ verse: v, text: chapter[v - 1] });

  const bookName = book.name;
  const canonicalRef = m[3]
    ? `${bookName} ${chapterNum}:${first}${last > first ? '-' + last : ''}`
    : `${bookName} ${chapterNum}`;
  return { ref: canonicalRef, verses };
}

function findScriptureByRef(ref) {
  const clean = ref.trim().toLowerCase().replace(/\s+/g, ' ');
  return SCRIPTURE_DATABASE.find(s => s.ref.toLowerCase().includes(clean) || clean.includes(s.ref.toLowerCase()));
}

function getDailyDevotional(date = new Date()) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const index = Math.abs(dayOfYear) % SCRIPTURE_DATABASE.length;
  const scripture = SCRIPTURE_DATABASE[index];

  const reflections = [
    {
      theme: "Abiding in the Sacred Presence",
      meditation: "Today, let your soul cease its frantic striving. Before you speak a word of worry, breathe in the quiet assurance that the Lord surrounds you like the mountains surround Jerusalem. You are held in everlasting arms.",
      prayer: "Lord Jesus, anchor my thoughts in Thy peace today. May my words carry Your grace and my heart reflect Your rest. Amen."
    },
    {
      theme: "The Shield of Unshakable Faith",
      meditation: "Faith does not ignore the storm; it looks through the waves to behold the Master walking upon the water. Whatever challenge stands before you today is smaller than the King who lives within you.",
      prayer: "Heavenly Father, strengthen my faith where it wavers. Teach me to walk by Your promises rather than sight. Amen."
    },
    {
      theme: "The River of Living Waters",
      meditation: "Let the fountain of Christ's love cleanse away every trace of bitterness, disappointment, and exhaustion. Out of your belly shall flow rivers of living water as you surrender this day into His hands.",
      prayer: "Holy Spirit, breathe over my spirit. Flow through me with healing, truth, and gentleness to everyone I meet. Amen."
    },
    {
      theme: "The High Tower of Grace",
      meditation: "The name of the Lord is a strong tower; the righteous runneth into it, and is safe. No condemnation awaits those who are in Christ Jesus. Walk in liberty, son/daughter of the Most High.",
      prayer: "Lord, I take refuge in Your righteousness. Cleanse me, renew my heart, and fill me with joyful obedience. Amen."
    }
  ];

  const reflection = reflections[dayOfYear % reflections.length];

  return {
    date: date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    scripture,
    theme: reflection.theme,
    meditation: reflection.meditation,
    prayer: reflection.prayer
  };
}

if (typeof module !== 'undefined') {
  module.exports = {
    SCRIPTURE_DATABASE,
    SCRIPTURE_REGEX,
    lookupKJV,
    findScriptureByRef,
    getDailyDevotional
  };
}
