const pads = document.querySelectorAll(".pad");

// Los nombres deben coincidir con los archivos dentro de la carpeta sounds.
const sounds = {
  kick: new Audio("sounds/kick.wav"),
  clap: new Audio("sounds/clap.wav"),
  hihat: new Audio("sounds/hihat.wav"),
  boom: new Audio("sounds/boom.wav"),
  openhat: new Audio("sounds/openhat.wav"),
  ride: new Audio("sounds/ride.wav")
};

function playSound(soundName) {
  const sound = sounds[soundName];

  if (!sound) {
    return;
  }

  // Reinicia el sonido para que se pueda tocar varias veces seguidas.
  sound.currentTime = 0;
  sound.play();
}

function playPad(pad) {
  const soundName = pad.dataset.sound;

  playSound(soundName);
  pad.classList.add("active");

  setTimeout(() => {
    pad.classList.remove("active");
  }, 150);
}

// Reproduce el sonido al hacer clic en un botón.
pads.forEach((pad) => {
  pad.addEventListener("click", () => {
    playPad(pad);
  });
});

// También reproduce el sonido al presionar la tecla correspondiente.
document.addEventListener("keydown", (event) => {
  if (event.repeat) {
    return;
  }

  const key = event.key.toLowerCase();
  const pad = document.querySelector(`[data-key="${key}"]`);

  if (pad) {
    playPad(pad);
  }
});