let audioContext;

function play(sound) {
  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    alert("Tu navegador no admite Web Audio API.");
    return;
  }

  audioContext ??= new AudioContextClass();

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  if (sound === "kick") {
    oscillator.frequency.setValueAtTime(150, now);
    oscillator.frequency.exponentialRampToValueAtTime(45, now + 0.18);
    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    oscillator.start(now);
    oscillator.stop(now + 0.23);
    return;
  }

  if (["snare", "clap", "hat", "ride"].includes(sound)) {
    const duration = sound === "ride" ? 0.25 : 0.12;
    const length = audioContext.sampleRate * duration;
    const buffer = audioContext.createBuffer(
      1,
      length,
      audioContext.sampleRate
    );
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();
    const noiseGain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    noise.buffer = buffer;
    filter.type = "highpass";
    filter.frequency.value = sound === "hat" ? 6500 : 1000;

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);

    noiseGain.gain.setValueAtTime(sound === "ride" ? 0.25 : 0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    noise.start();
    return;
  }

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(sound === "tom" ? 180 : 240, now);
  oscillator.frequency.exponentialRampToValueAtTime(70, now + 0.2);
  gain.gain.setValueAtTime(0.6, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
  oscillator.start(now);
  oscillator.stop(now + 0.25);
}

function hit(pad) {
  play(pad.dataset.sound);
  pad.classList.add("active");

  setTimeout(() => {
    pad.classList.remove("active");
  }, 100);
}

document.querySelectorAll(".pad").forEach((pad) => {
  pad.addEventListener("click", () => hit(pad));
});

document.addEventListener("keydown", (event) => {
  if (event.repeat) return;

  const key = event.key.toLowerCase();
  const pad = document.querySelector(`[data-key="${key}"]`);

  if (pad) hit(pad);
});