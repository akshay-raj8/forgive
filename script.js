// --- STATE & STAGE CONFIGURATION ---
let currentStage = 0;

const stages = [
  {
    heading: "Onn vazhakk maatuo?? 🥺",
    subheading: "Enik miss cheyandd.... 😭",
    gif: "https://media.tenor.com/m/t51Z8Z4D9H4AAAAC/quby-chan-crying.gif"
  },
  {
    heading: "Sweett.. Devika alee?? 💖",
    subheading: "Ethre divasayi vazhakk 🥺",
    gif: "https://media.tenor.com/m/Dgn4rQ7l2LgAAAAC/quby-chan-crying.gif"
  },
  {
    heading: "Enim deshyam maarilee 💔",
    subheading: "Enik nalle hurt aavandd... 😢",
    gif: "https://media.tenor.com/m/u8Mv_C_t0LIAAAAC/quby-mad.gif"
  },
  {
    heading: "Vazhakkk maarinn paraa.. 😏",
    subheading: "Demand cheyane alaa...",
    gif: "https://media.tenor.com/m/07J9bF5Z_0AAAAAC/quby-sticker.gif"
  }
];

const successContent = {
  heading: "Yeyeye! 🎉",
  subheading: "Enik ariyaaa sweett Devikaa aanen.. 💖",
  gif: "https://media.tenor.com/m/gOvaTCoK554AAAAC/quby-cute.gif"
};

// --- DOM ELEMENTS ---
const mainCard = document.getElementById("main-card");
const gifDisplay = document.getElementById("gif-display");
const headingText = document.getElementById("heading-text");
const subheadingText = document.getElementById("subheading-text");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");

// --- STAGE RENDER LOGIC ---
function renderStage(stageIndex) {
  const content = stages[stageIndex];
  
  // Update texts and image
  headingText.textContent = content.heading;
  subheadingText.textContent = content.subheading;
  gifDisplay.src = content.gif;
  
  // If we reach stage 4 (index 3), prepare the runaway button logic
  if (stageIndex === 3) {
    setupRunawayButton();
  }
  
  triggerCardAnimation();
}

function triggerCardAnimation() {
  mainCard.classList.remove("pop");
  void mainCard.offsetWidth; // Trigger reflow to restart CSS animation
  mainCard.classList.add("pop");
}

// --- BUTTON INTERACTION LOGIC ---

function handleNoClick() {
  if (currentStage < stages.length - 1) {
    currentStage++;
    renderStage(currentStage);
  }
}

function handleYesClick() {
  // Switch card style to success
  mainCard.classList.add("success");
  
  // Remove runaway behavior if present
  noBtn.classList.remove("runaway");
  noBtn.style.position = "";
  noBtn.style.left = "";
  noBtn.style.top = "";
  
  // Set success content
  headingText.textContent = successContent.heading;
  subheadingText.textContent = successContent.subheading;
  gifDisplay.src = successContent.gif;
  
  triggerCardAnimation();
  
  // Start the celebration!
  startConfetti();
}

// --- TELEPORTING "NO" BUTTON (STAGE 4 JOKE) ---

function setupRunawayButton() {
  noBtn.classList.add("runaway");
  
  // Initial positioning to prevent jumpiness
  const rect = noBtn.getBoundingClientRect();
  noBtn.style.left = `${rect.left}px`;
  noBtn.style.top = `${rect.top}px`;
}

function teleportNoButton() {
  if (!noBtn.classList.contains("runaway")) return;
  
  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;
  
  // Leave a safe margin from the screen borders
  const margin = 24;
  const maxX = window.innerWidth - buttonWidth - margin;
  const maxY = window.innerHeight - buttonHeight - margin;
  
  // Calculate a random point on the screen
  const randomX = Math.max(margin, Math.floor(Math.random() * maxX));
  const randomY = Math.max(margin, Math.floor(Math.random() * maxY));
  
  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;
}

// Listeners for teleporting the No button
noBtn.addEventListener("mouseover", () => {
  if (currentStage === 3) {
    teleportNoButton();
  }
});

noBtn.addEventListener("touchstart", (e) => {
  if (currentStage === 3) {
    e.preventDefault(); // Stop click events on mobile
    teleportNoButton();
  }
});

// Regular click/tap triggers stage progression
noBtn.addEventListener("click", () => {
  if (currentStage < 3) {
    handleNoClick();
  }
});

yesBtn.addEventListener("click", handleYesClick);

// --- CUSTOM CONFETTI SYSTEM ---

function startConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const colors = ["#ff4a75", "#ff7b9a", "#ffd166", "#06d6a0", "#118ab2", "#ff85a2", "#f72585"];
  const confettiCount = 140;
  const particles = [];
  
  class ConfettiParticle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height - canvas.height; // start above screen
      this.size = Math.random() * 8 + 6;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedY = Math.random() * 3 + 2.5;
      this.speedX = Math.random() * 2 - 1;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 4 - 2;
    }
    
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
      
      // Recycle particle when it goes off the bottom of the screen
      if (this.y > canvas.height) {
        this.y = -20;
        this.x = Math.random() * canvas.width;
      }
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }
  }
  
  for (let i = 0; i < confettiCount; i++) {
    particles.push(new ConfettiParticle());
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// --- BACKGROUND MUSIC CONTROL ---
const audio = document.getElementById("bg-music");
const musicButton = document.querySelector(".music-toggle");
const musicPointer = document.querySelector(".music-pointer");

if (audio && musicButton) {
  musicButton.addEventListener("click", async () => {
    // Hide the helper pointer arrow on click
    if (musicPointer) {
      musicPointer.classList.add("hidden");
    }
    
    if (audio.paused) {
      try {
        await audio.play();
        musicButton.classList.add("is-playing");
        musicButton.setAttribute("aria-pressed", "true");
        musicButton.textContent = "Pause";
      } catch (err) {
        musicButton.textContent = "Tap again";
        console.error("Audio playback error:", err);
      }
    } else {
      audio.pause();
      musicButton.classList.remove("is-playing");
      musicButton.setAttribute("aria-pressed", "false");
      musicButton.textContent = "Play music";
    }
  });
}

// Initial card pop entry
triggerCardAnimation();
