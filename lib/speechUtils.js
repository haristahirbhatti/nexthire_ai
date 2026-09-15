/**
 * speechUtils.js
 * Browser-side helpers for Web Speech API
 * - speak(text, options)  → AI speaks a question aloud (Text-to-Speech)
 * - startListening(cb)    → Records candidate answer (Speech-to-Text)
 * - stopListening()       → Stops the mic
 * - stopSpeaking()        → Cancels any active speech
 */

let recognition = null;

/**
 * Asynchronously loads available speech synthesis voices.
 * Handles browsers (Chrome/Safari) where getVoices() returns [] on initial page load.
 */
export function getVoicesAsync() {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve([]);
      return;
    }

    const immediate = window.speechSynthesis.getVoices();
    if (immediate && immediate.length > 0) {
      resolve(immediate);
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      try {
        window.speechSynthesis.removeEventListener("voiceschanged", finish);
      } catch (_) {}
      resolve(window.speechSynthesis.getVoices() || []);
    };

    window.speechSynthesis.addEventListener("voiceschanged", finish);
    setTimeout(finish, 350);
  });
}

/**
 * Prepares text for speech synthesis according to the target language.
 * E.g., for Arabic, replaces Latin acronyms like "CV" with "السيرة الذاتية"
 * so the TTS engine speaks in fluent Arabic rather than pronouncing English letters.
 */
function sanitizeSpeechText(text, lang) {
  if (!text) return "";
  let clean = String(text).trim();
  const lowerLang = (lang || "").toLowerCase();

  if (lowerLang.startsWith("ar")) {
    clean = clean
      .replace(/\bCV\b/gi, "السيرة الذاتية")
      .replace(/\bSTAR\b/gi, "ستار")
      .replace(/\bAI\b/gi, "الذكاء الاصطناعي");
  } else if (lowerLang.startsWith("fr")) {
    clean = clean.replace(/\bCV\b/gi, "curriculum vitae");
  } else if (lowerLang.startsWith("es")) {
    clean = clean.replace(/\bCV\b/gi, "currículum");
  } else if (lowerLang.startsWith("de")) {
    clean = clean.replace(/\bCV\b/gi, "Lebenslauf");
  }

  return clean;
}

/**
 * Speak text aloud using the browser's SpeechSynthesis API with full language accuracy.
 * @param {string} text - The text to speak
 * @param {object} options - Optional: { rate, pitch, volume, lang, gender, languageName }
 * @returns {Promise} Resolves when speech completes or fails safely
 */
export async function speak(text, options = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return Promise.resolve();
  }

  // Cancel any ongoing speech first to prevent overlaps
  window.speechSynthesis.cancel();

  const langCode = (options.lang || "en-US").replace("_", "-");
  const langPrefix = langCode.split("-")[0].toLowerCase();
  const isArabic = langPrefix === "ar" || (options.languageName || "").toLowerCase().includes("arab");

  const sanitizedText = sanitizeSpeechText(text, langCode);
  if (!sanitizedText) return Promise.resolve();

  const utterance = new SpeechSynthesisUtterance(sanitizedText);
  utterance.rate = options.rate ?? 0.95;
  utterance.pitch = options.pitch ?? 1.0;
  utterance.volume = options.volume ?? 1.0;
  utterance.lang = langCode;

  // Retrieve voices asynchronously
  const voices = await getVoicesAsync();

  // Filter voices that genuinely belong to the requested language
  const langVoices = voices.filter((v) => {
    const vLang = (v.lang || "").toLowerCase().replace("_", "-");
    const vName = (v.name || "").toLowerCase();
    if (vLang.startsWith(langPrefix)) return true;
    if (isArabic && (vName.includes("arabic") || vName.includes("عربي") || vName.includes("ar-") || vLang.includes("ar"))) {
      return true;
    }
    return false;
  });

  const requestedGender = (options.gender || "female").toLowerCase();
  let selectedVoice = null;

  if (langVoices.length > 0) {
    // Exact dialect match first (e.g. ar-SA vs ar-EG)
    const exactDialect = langVoices.filter(
      (v) => (v.lang || "").toLowerCase().replace("_", "-") === langCode.toLowerCase()
    );
    const pool = exactDialect.length > 0 ? exactDialect : langVoices;

    const femaleMarkers = [
      "female", "girl", "woman", "samantha", "zira", "karen", "victoria", "hazel", "zoe", "susan",
      "laila", "mariam", "salma", "hala", "zeina", "zariyah", "sana", "fatima", "nour", "ayesha", "amira"
    ];
    const maleMarkers = [
      "male", "boy", "man", "daniel", "david", "alex", "fred",
      "maged", "tarik", "tariq", "naayf", "shakir", "hamed", "omar", "ali", "ahmed"
    ];

    if (requestedGender === "female") {
      selectedVoice =
        pool.find((v) => femaleMarkers.some((m) => v.name.toLowerCase().includes(m))) ||
        pool.find((v) => !maleMarkers.some((m) => v.name.toLowerCase().includes(m))) ||
        pool[0];
    } else {
      selectedVoice =
        pool.find((v) => maleMarkers.some((m) => v.name.toLowerCase().includes(m))) ||
        pool.find((v) => !femaleMarkers.some((m) => v.name.toLowerCase().includes(m))) ||
        pool[0];
    }
  }

  // CRITICAL: Only assign utterance.voice if a voice matching the target language was found!
  // If NO voice for this language is installed in the browser, DO NOT force an English voice
  // (like Samantha or Alex) onto an Arabic or foreign language utterance.
  // When utterance.voice is left unset, the browser's internal engine uses utterance.lang
  // to synthesize the language natively instead of mangling it with an English accent.
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  return new Promise((resolve) => {
    let completed = false;
    const finish = () => {
      if (!completed) {
        completed = true;
        resolve();
      }
    };

    utterance.onend = finish;
    utterance.onerror = (e) => {
      console.warn("[SpeechSynthesis] utterance error:", e);
      finish();
    };

    // Safety timeout in case browser TTS hangs
    const wordCount = sanitizedText.split(/\s+/).length;
    const timeoutMs = Math.max(10000, wordCount * 1200);
    setTimeout(finish, timeoutMs);

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("[SpeechSynthesis] speak() call failed:", err);
      finish();
    }
  });
}

/**
 * Stop any ongoing speech immediately.
 */
export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }
}

/**
 * Start listening for speech from the microphone.
 * @param {function} onTranscript - Called with (transcript: string, isFinal: boolean)
 * @param {function} onError - Called with (error: string)
 * @param {object} options - Optional: { lang: string } — BCP 47 language tag (default: "en-US")
 * @returns {function} stopFn — call to stop listening
 */
export function startListening(onTranscript, onError, options = {}) {
  if (typeof window === "undefined") return () => {};

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError?.("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
    return () => {};
  }

  try {
    recognition = new SpeechRecognition();
    recognition.lang = options.lang || "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        onTranscript(finalTranscript, true);
      } else if (interimTranscript) {
        onTranscript(interimTranscript, false);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") return;
      onError?.(`Mic error: ${event.error}`);
    };

    recognition.onend = () => {
      if (recognition && recognition._shouldRestart) {
        try { recognition.start(); } catch (_) {}
      }
    };

    recognition._shouldRestart = true;
    recognition.start();

    return () => stopListening();
  } catch (e) {
    onError?.(`Could not start speech recognition: ${e.message}`);
    return () => {};
  }
}

/**
 * Stop the microphone / speech recognition.
 */
export function stopListening() {
  if (recognition) {
    recognition._shouldRestart = false;
    try { recognition.stop(); } catch (_) {}
    recognition = null;
  }
}

/**
 * Check if the browser supports all speech APIs needed.
 * @returns {{ tts: boolean, stt: boolean }}
 */
export function checkSpeechSupport() {
  if (typeof window === "undefined") return { tts: false, stt: false };
  const tts = "speechSynthesis" in window;
  const stt = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  return { tts, stt };
}
