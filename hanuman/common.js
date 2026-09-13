/* ============================================
   HANUMAN SECTION — COMMON JS
   With Jai Shri Ram Voice on Click
============================================ */

/* ============================================
   JAI SHRI RAM — AUDIO ON CLICK
============================================ */
(function() {
  'use strict';
  
  const SOUND_KEY = 'site-sound';
  const AUDIO_FILE_PATH = 'assets/audio/jai-shri-ram.mp3';
  const SPEAK_TEXT = 'जय श्री राम';
  const SPOKE_DELAY = 700;
  
  let lastSpokenTime = 0;
  let audioCache = null;
  let useAudioFile = false;
  let hindiVoice = null;
  
  // Try to load audio file (optional)
  function initAudioFile() {
    try {
      audioCache = new Audio(AUDIO_FILE_PATH);
      audioCache.preload = 'auto';
      audioCache.volume = 0.7;
      audioCache.addEventListener('canplaythrough', () => {
        useAudioFile = true;
      }, { once: true });
      audioCache.addEventListener('error', () => {
        useAudioFile = false;
      }, { once: true });
    } catch(e) {
      useAudioFile = false;
    }
  }
  
  // Load Hindi voice
  function loadVoices() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      hindiVoice = voices.find(v => v.lang === 'hi-IN')
        || voices.find(v => v.lang.startsWith('hi'))
        || voices.find(v => v.lang === 'en-IN')
        || null;
    }
  }
  
  // Speak using TTS
  function speakTTS(text) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 0.7;
      if (hindiVoice) utterance.voice = hindiVoice;
      window.speechSynthesis.speak(utterance);
    } catch(e) {}
  }
  
  // Main speak function
  function speakJaiShriRam(text) {
    if (localStorage.getItem(SOUND_KEY) === 'off') return;
    
    const now = Date.now();
    if (now - lastSpokenTime < SPOKE_DELAY) return;
    lastSpokenTime = now;
    
    const t = text || SPEAK_TEXT;
    
    // Try audio file first
    if (useAudioFile && audioCache) {
      try {
        audioCache.currentTime = 0;
        const p = audioCache.play();
        if (p) p.catch(() => speakTTS(t));
        return;
      } catch(e) {}
    }
    
    // Fallback to TTS
    speakTTS(t);
  }
  
  // Attach to all interactive clicks
  function handleClick(e) {
    const target = e.target.closest(
      'a, button, .hub-card, .cat-chip, .qa-btn, .nav-link, ' +
      '.card, [onclick], .floating-hanuman, .back-top'
    );
    
    // Skip toggle buttons themselves
    if (target && (
      target.id === 'soundToggle' ||
      target.id === 'darkToggle' ||
      target.id === 'menuBtn' ||
      target.classList.contains('modal-close')
    )) return;
    
    if (target) {
      const customVoice = target.dataset.voice || document.body.dataset.voice;
      speakJaiShriRam(customVoice);
    }
  }
  
  // Initialize
  if ('speechSynthesis' in window) {
    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }
  
  initAudioFile();
  document.addEventListener('click', handleClick, true);
  
  // Expose functions globally
  window.toggleSiteSound = function() {
    const current = localStorage.getItem(SOUND_KEY);
    const newState = current === 'off' ? 'on' : 'off';
    localStorage.setItem(SOUND_KEY, newState);
    return newState;
  };
  
  window.isSoundOff = function() {
    return localStorage.getItem(SOUND_KEY) === 'off';
  };
})();


/* ===== SOUND TOGGLE (Header Button) ===== */
function toggleSoundIcon() {
  const newState = window.toggleSiteSound();
  const icon = document.getElementById('soundIcon');
  if (icon) {
    icon.className = newState === 'off' 
      ? 'fa-solid fa-volume-xmark' 
      : 'fa-solid fa-volume-high';
  }
  showToast(newState === 'off' ? '🔇 आवाज़ बंद' : '🔊 आवाज़ चालू');
}

// Initialize sound icon
document.addEventListener('DOMContentLoaded', () => {
  const icon = document.getElementById('soundIcon');
  if (icon && localStorage.getItem('site-sound') === 'off') {
    icon.className = 'fa-solid fa-volume-xmark';
  }
});


/* ===== DARK MODE ===== */
const DARK_KEY = 'hanuman-dark';
const darkToggle = document.getElementById('darkToggle');
if (localStorage.getItem(DARK_KEY) === 'true') {
  document.body.classList.add('dark');
  if (darkToggle) darkToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}
if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    darkToggle.innerHTML = isDark
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem(DARK_KEY, isDark);
  });
}


/* ===== PROGRESS BAR ===== */
const progressBar = document.getElementById('progressBar');
if (progressBar) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const s = h > 0 ? (window.scrollY / h) * 100 : 0;
        progressBar.style.width = s + '%';
        ticking = false;
      });
      ticking = true;
    }
  }, {passive:true});
}


/* ===== JAI RAM COUNTER ===== */
const JAI_KEY = 'jaiRamCount';
let jaiRamCount = parseInt(localStorage.getItem(JAI_KEY) || '0', 10);
const jaiEl = document.getElementById('jaiRamCount');
if (jaiEl) jaiEl.textContent = jaiRamCount + ' बार';

function chantJaiRam() {
  jaiRamCount++;
  localStorage.setItem(JAI_KEY, jaiRamCount);
  if (jaiEl) jaiEl.textContent = jaiRamCount + ' बार';
  if (navigator.vibrate) navigator.vibrate(20);
  if (jaiRamCount % 108 === 0) {
    showToast('🎉 बधाई! ' + jaiRamCount + ' बार जय श्री राम 🙏');
  }
}


/* ===== TOAST ===== */
let toastTimeout;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => t.classList.remove('show'), 2200);
}


/* ===== MODAL ===== */
function openSankatModal() {
  document.getElementById('sankatModal')?.classList.add('show');
  if (navigator.vibrate) navigator.vibrate(50);
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('show');
}
document.getElementById('sankatModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'sankatModal') closeModal('sankatModal');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal('sankatModal');
});


/* ===== ACCORDION ===== */
function toggleAccordion(el) {
  el.parentElement.classList.toggle('open');
}


/* ===== COPY MANTRA ===== */
function copyMantra(text) {
  const done = () => showToast('मंत्र कॉपी हो गया 🙏');
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}
function fallbackCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); done(); } catch(e) {}
  document.body.removeChild(ta);
}


/* ===== VERSE HIGHLIGHT ===== */
function highlightVerse(el) {
  el.classList.toggle('highlight');
  if (navigator.vibrate) navigator.vibrate(15);
}


/* ===== SHARE ===== */
function sharePage() {
  const shareData = {
    title: document.title,
    text: 'हनुमान जी — संपूर्ण ज्ञान',
    url: window.location.href
  };
  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    copyMantra(window.location.href);
    showToast('लिंक कॉपी हो गया 📋');
  }
}


/* ===== SCROLL TOP ===== */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ===== DAILY QUOTE ===== */
const QUOTES = [
  'जय हनुमान ज्ञान गुन सागर ।<br>जय कपीस तिहुँ लोक उजागर ॥',
  'राम दूत अतुलित बल धामा ।<br>अंजनि-पुत्र पवनसुत नामा ॥',
  'महाबीर बिक्रम बजरंगी ।<br>कुमति निवार सुमति के संगी ॥',
  'संकर सुवन केसरीनंदन ।<br>तेज प्रताप महा जग बंदन ॥',
  'बिद्यावान गुनी अति चातुर ।<br>राम काज करिबे को आतुर ॥',
  'सब सुख लहै तुम्हारी सरना ।<br>तुम रक्षक काहू को डर ना ॥',
  'नासै रोग हरै सब पीरा ।<br>जपत निरंतर हनुमत बीरा ॥',
  'संकट तें हनुमान छुड़ावै ।<br>मन क्रम बचन ध्यान जो लावै ॥',
  'दुर्गम काज जगत के जेते ।<br>सुगम अनुग्रह तुम्हरे तेते ॥',
  'अष्ट सिद्धि नौ निधि के दाता ।<br>अस बर दीन जानकी माता ॥'
];
const quoteEl = document.getElementById('dailyQuote');
if (quoteEl) {
  const dayIndex = new Date().getDate() % QUOTES.length;
  quoteEl.innerHTML = QUOTES[dayIndex];
}


/* ===== SMOOTH SCROLL FOR CAT-CHIPS ===== */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
});
