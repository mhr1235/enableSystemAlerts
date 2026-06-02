let images = [];
let sounds = [];

const splash = document.getElementById("splash");
const screenshot = document.getElementById("screenshot");
const alertToggle = document.getElementById("alertToggle");

let currentImage = null;
let timer = null;
let audioUnlocked = false;
let currentSound = null;
let experienceStarted = false;

async function loadManifest() {
  try {
    const response = await fetch("manifest.json");
    const data = await response.json();

    images = data.images || [];
    sounds = data.sounds || [];

    // Do not switch images here.
    // The first image should only appear after the splash screen starts.
  } catch (err) {
    console.error("Failed to load manifest:", err);
  }
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDelay() {
  return Math.floor(Math.random() * 7000) + 3000;
  // 3–10 seconds
}


/*     function playRandomSound() {
      if (!audioUnlocked) return;

      const sound = new Audio(randomItem(sounds));
      sound.volume = 0.8;
      sound.play().catch(err => {
        console.log("Audio blocked:", err);
      });
    } */


/* function playRandomSound() {
  if (!audioUnlocked || sounds.length === 0) return;

  if (currentSound) {
    currentSound.pause();
    currentSound.currentTime = 0;
  }

  currentSound = new Audio(randomItem(sounds));
  currentSound.volume = 0.8;

  currentSound.play().catch(err => {
    console.log("Audio blocked:", err);
  });

  setTimeout(() => {
    if (currentSound) {
      currentSound.pause();
      currentSound.currentTime = 0;
    }
  }, 5000);
} */

function startExperience() {

  if (!experienceStarted) {
    experienceStarted = true;
    splash.classList.add("hidden");
    unlockAudio();

    // First screenshot appears only after splash is dismissed.
    switchImage();

    return;
  }

  // Later clicks/touches manually switch screenshot and sound.
  switchImage();
}

function playRandomSound() {
  if (!audioUnlocked || sounds.length === 0) return;

  // Stop whatever sound is currently playing
  if (currentSound) {
    currentSound.pause();
    currentSound.currentTime = 0;
  }

  // Start a new random sound
  currentSound = new Audio(randomItem(sounds));
  currentSound.volume = 0.8;

  currentSound.play().catch(err => {
    console.log("Audio blocked:", err);
  });
}


function switchImage() {
  if (images.length === 0) return;

  let nextImage = randomItem(images);

  while (images.length > 1 && nextImage === currentImage) {
    nextImage = randomItem(images);
  }

  currentImage = nextImage;
  screenshot.src = nextImage;

  playRandomSound();
  scheduleNextSwitch();
}

function scheduleNextSwitch() {
  clearTimeout(timer);
  timer = setTimeout(switchImage, randomDelay());
}

function unlockAudio() {
  audioUnlocked = true;
}

/* document.body.addEventListener("click", () => {
  unlockAudio();
  switchImage();
});

document.body.addEventListener("touchstart", () => {
  unlockAudio();
  switchImage();
}); */

document.body.addEventListener("click", () => {
  if (experienceStarted) {
    switchImage();
  }
});

document.body.addEventListener("touchstart", () => {
  if (experienceStarted) {
    switchImage();
  }
});

loadManifest();

/*
 * Toggle works with mouse, touch, and stylus.
 * Prevents the body handler from firing first.
 */
function activateToggle(event) {
  event.preventDefault();
  event.stopPropagation();

  alertToggle.classList.add("enabled");

  setTimeout(() => {
    startExperience();
  }, 500);
}

alertToggle.addEventListener("pointerdown", activateToggle);
/*
 * Auto-start after 6 seconds.
 * Images will start automatically.
 * Audio still requires user interaction on most mobile browsers.
 */
setTimeout(() => {
  if (!experienceStarted) {
    startExperience();
  }
}, 12000);