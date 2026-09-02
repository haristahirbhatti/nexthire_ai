/**
 * speechUtils.js
 * Browser-side helpers for Web Speech API
 * - speak(text)         → AI speaks a question aloud (Text-to-Speech)
 * - startListening(cb)  → Records candidate answer (Speech-to-Text)
 * - stopListening()     → Stops the mic
 */

let recognition = null;

/**
 * Speak text aloud using the browser's SpeechSynthesis API.
 * @param {string} text - The text to speak
 * @param {object} options - Optional: { rate, pitch, volume, voiceName }
 * @returns {Promise} Resolves when speech is done
 */
export function speak(text, options = {}) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      reject(new Error("SpeechSynthesis not supported in this browser."));
      return;
    }

    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? 0.95;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;
    utterance.lang = options.lang ?? "en-US";

    // Try to pick a natural voice based on language and requested gender
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = (options.lang ?? "en-US").split("-")[0].toLowerCase();
    const langVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));
    const targetVoices = langVoices.length > 0 ? langVoices : voices;

    const femaleIndicators = ["samantha", "zira", "karen", "victoria", "hazel", "zoe", "susan", "female", "girl", "woman"];
    const maleIndicators = ["daniel", "david", "alex", "fred", "male", "boy", "man"];

    let selectedVoice = null;
    const requestedGender = options.gender ?? "female"; // default to female

    if (requestedGender === "female") {
      selectedVoice = targetVoices.find((v) => {
        const name = v.name.toLowerCase();
        return femaleIndicators.some((ind) => name.includes(ind));
      });
    } else {
      selectedVoice = targetVoices.find((v) => {
        const name = v.name.toLowerCase();
        return maleIndicators.some((ind) => name.includes(ind));
      });
    }

    // Fallback: pick any voice from target language, or any voice at all
    if (!selectedVoice) {
      selectedVoice = targetVoices.find(v => v.name.toLowerCase().includes("google")) || targetVoices[0];
    }

    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Stop any ongoing speech immediately.
 */
export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Start listening for speech from the microphone.
 * @param {function} onTranscript - Called with (transcript: string, isFinal: boolean)
 * @param {function} onError - Called with (error: string)
 * @returns {function} stopFn — call to stop listening
 */
export function startListening(onTranscript, onError) {
  if (typeof window === "undefined") return () => {};

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError?.("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
    return () => {};
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;        // Keep listening, don't auto-stop
  recognition.interimResults = true;    // Show partial results live

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
    if (event.error === "no-speech") return; // Ignore silence
    onError?.(`Mic error: ${event.error}`);
  };

  recognition.onend = () => {
    // Auto-restart if not manually stopped (prevents Chrome cutting off)
    if (recognition && recognition._shouldRestart) {
      try { recognition.start(); } catch (_) {}
    }
  };

  recognition._shouldRestart = true;
  recognition.start();

  return () => stopListening();
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
