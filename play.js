// ----- Game Physics -----
let player = document.getElementById("player");
const container = document.getElementById("game-container");
let platforms = document.querySelectorAll(".platform");

let posX = 50;
let posY = 40;
let velocityY = 0;
let isJumping = false;
const gravity = 0.5;
const jumpStrength = -10;
const moveSpeed = 5;

let keys = {
  left: false,
  right: false,
  up: false,
};

// Input handling
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") keys.left = true;
  if (e.key === "ArrowRight" || e.key === "d") keys.right = true;
  if ((e.key === "ArrowUp" || e.key === "w" || e.key === " ") && !isJumping) {
    velocityY = jumpStrength;
    isJumping = true;
  }
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
  if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
});

// Get element rect relative to container
function getRect(el) {
  const rect = el.getBoundingClientRect();
  const parent = container.getBoundingClientRect();
  return {
    x: rect.left - parent.left,
    y: rect.top - parent.top,
    width: rect.width,
    height: rect.height
  };
}

// Check collision with a rectangle
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Collision resolution for X-axis
function resolveHorizontalCollisions(newX) {
  const playerRect = {
    x: newX,
    y: posY,
    width: player.offsetWidth,
    height: player.offsetHeight,
  };

  for (let plat of platforms) {
    const platRect = getRect(plat);
    if (isColliding(playerRect, platRect)) {
      if (newX > posX) {
        // moving right
        newX = platRect.x - playerRect.width;
      } else {
        // moving left
        newX = platRect.x + platRect.width;
      }
    }
  }

  return newX;
}

// Collision resolution for Y-axis
function resolveVerticalCollisions(newY) {
  const playerRect = {
    x: posX,
    y: newY,
    width: player.offsetWidth,
    height: player.offsetHeight,
  };

  for (let plat of platforms) {
    const platRect = getRect(plat);
    if (isColliding(playerRect, platRect)) {
      if (velocityY > 0) {
        // falling
        newY = platRect.y - playerRect.height;
        velocityY = 0;
        isJumping = false;
      } else if (velocityY < 0) {
        // jumping upward
        newY = platRect.y + platRect.height;
        velocityY = 0;
      }
    }
  }

  return newY;
}

// ----- Room/Door System -----
let doorCooldown = false;

function checkDoorCollisions() {
  if (doorCooldown) return;
  
  const playerRect = {
    x: posX,
    y: posY,
    width: player.offsetWidth,
    height: player.offsetHeight
  };

  // Check all doors in active room
  const activeRoom = document.querySelector(".room.active");
  const doors = activeRoom.querySelectorAll(".door");
  
  doors.forEach(door => {
    const doorRect = getRect(door);
    
    if (isColliding(playerRect, doorRect)) {
      const targetRoomId = door.getAttribute("data-target");
      switchRoom(targetRoomId);
      doorCooldown = true;
      setTimeout(() => { doorCooldown = false; }, 500);
    }
  });
}

function switchRoom(targetRoomId) {
  const currentRoom = document.querySelector(".room.active");
  const targetRoom = document.getElementById(targetRoomId);
  
  // Switch rooms
  currentRoom.classList.remove("active");
  targetRoom.classList.add("active");
  
  // Update player reference and platforms
  const newPlayer = targetRoom.querySelector(".player");
  player = newPlayer;
  platforms = targetRoom.querySelectorAll(".platform");
  
  // Position player based on which door they came through
  if (targetRoomId === "room2") {
    posX = 100; // Enter from right side
  } else {
    posX = container.offsetWidth - 150; // Enter from left side
  }
  posY = container.offsetHeight - 80;
  
  // Reset velocity when changing rooms
  velocityY = 0;
  isJumping = false;
}

// ----- Main Game Loop -----
function gameLoop() {

  // Apply input
  let dx = 0;
  if (keys.left) dx -= moveSpeed;
  if (keys.right) dx += moveSpeed;

  // Apply gravity
  velocityY += gravity;

  // Move X first
  let newX = posX + dx;
  newX = resolveHorizontalCollisions(newX);

  // Move Y next
  let newY = posY + velocityY;
  newY = resolveVerticalCollisions(newY);

  // Bounds
  newX = Math.max(0, Math.min(newX, container.offsetWidth - player.offsetWidth));
  newY = Math.min(newY, container.offsetHeight - player.offsetHeight);

  // Apply position
  posX = newX;
  posY = newY;
  player.style.left = `${posX}px`;
  player.style.top = `${posY}px`;

  // Check for door collisions
  checkDoorCollisions();

  requestAnimationFrame(gameLoop);
}

// Initialize game
gameLoop();

// ----- Menu System -----
const menuToggle = document.getElementById("menu-toggle");
const menuDropdown = document.getElementById("menu-dropdown");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  menuDropdown.style.display = menuDropdown.style.display === "flex" ? "none" : "flex";
});

document.getElementById("restart-btn").addEventListener("click", () => {
  location.reload();
});

document.getElementById("back-menu-btn").addEventListener("click", () => {
  window.location.href = "play.html";
});

document.getElementById("volume-btn").addEventListener("click", () => {
  alert("Volume settings would open here");
});

// ----- Game Homepage -----
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#6C5CE7" },
        shape: { type: ["circle", "triangle", "polygon"], polygon: { nb_sides: 6 } },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#6C5CE7", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 3, direction: "none", random: true, straight: false, out_mode: "out" }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" }
        }
      }
    });
  }

  // Music initialization
  const bgMusic = document.getElementById('bg-music');
  const volumeControl = document.getElementById('volume-control');
  
  if (bgMusic && volumeControl) {
    bgMusic.volume = 0.7;
    document.body.addEventListener('click', function initAudio() {
      bgMusic.play().catch(e => console.log("Autoplay prevented:", e));
      document.body.removeEventListener('click', initAudio);
    }, { once: true });
    
    volumeControl.addEventListener('input', function() {
      bgMusic.volume = this.value;
    });
  }
});

// Music variables
let bgMusic;
let isMusicPlaying = false;

// Initialize music when page loads
function initMusic() {
  bgMusic = document.getElementById('bg-music');
  const volumeControl = document.getElementById('volume-control');
  
  // Set initial volume
  bgMusic.volume = 0.7;
  
  // Volume control
  if (volumeControl) {
    volumeControl.addEventListener('input', function() {
      bgMusic.volume = this.value;
    });
  }
  
  // Enable audio on first user interaction
  document.body.addEventListener('click', function enableMusic() {
    if (!isMusicPlaying) {
      bgMusic.play().then(() => {
        isMusicPlaying = true;
      }).catch(e => {
        console.log("Audio playback prevented:", e);
      });
    }
    document.body.removeEventListener('click', enableMusic);
  }, { once: true });
}

// Call this in your DOMContentLoaded or game initialization
initMusic();

// Add these functions to control music from anywhere:
function playMusic() {
  if (bgMusic) {
    bgMusic.play();
    isMusicPlaying = true;
  }
}

function pauseMusic() {
  if (bgMusic) {
    bgMusic.pause();
    isMusicPlaying = false;
  }
}

function setVolume(volume) {
  if (bgMusic) {
    bgMusic.volume = volume;
  }
}

document.getElementById("volume-btn").addEventListener("click", function() {
  if (isMusicPlaying) {
    pauseMusic();
    this.textContent = "🔇 Unmute";
  } else {
    playMusic();
    this.textContent = "🔊 Volume";
  }
});

// ----- Navigation Functions -----
function startGame() {
  window.location.href = "level.html";
}

function openSettings() {
  document.getElementById('settings-modal').style.display = 'block';
}

function closeSettings() {
  document.getElementById('settings-modal').style.display = 'none';
}

function goBackWebsite() {
  window.location.href = "index.html";
}

function startLevel(level) {
  if (!event.target.classList.contains('locked')) {
    window.location.href = `level${level}.html`;
  } else {
    alert("Level is Coming Soon!");
  }
}

function goBack() {
  window.location.href = "play.html";
}
