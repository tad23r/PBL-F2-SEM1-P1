

  // Show shape-shift UI
function showShapeShiftUI() {
    console.log("Shape-shifting UI should appear now.");
    document.getElementById("shapeShiftUI").style.display = "block";
    playerFrozen = true; // Freeze the player
}

// Hide shape-shift UI
function hideShapeShiftUI() {
    document.getElementById("shapeShiftUI").style.display = "none";
    playerFrozen = false; // Allow the player to move again
}

  
  let playerFrozen = false;
    let shapeShiftEnabled = false;
    let shapeShiftTime = 0;
    document.getElementById("shapeCircle").addEventListener("click", () => {
        player.shape = "circle";
        hideShapeShiftUI(); 
    });
    
    document.getElementById("shapeTriangle").addEventListener("click", () => {
        player.shape = "triangle";
        hideShapeShiftUI();
    });
    
    document.getElementById("shapePentagon").addEventListener("click", () => {
        player.shape = "pentagon";
        hideShapeShiftUI();
    });
    
    document.getElementById("shapeStar").addEventListener("click", () => {
        player.shape = "star";
        hideShapeShiftUI();
    });
    


    let backgroundImage = new Image();
    backgroundImage.src = "background.jpg";

    backgroundImage.onload = () => {
        chosenBackgroundColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
        loadLevel(0);
        update();
    };
    
        // Menu Elements
        const menuToggle = document.getElementById("menu-toggle");
        const menuDropdown = document.getElementById("menu-dropdown");
        const restartBtn = document.getElementById("restart-btn");
        const backMenuBtn = document.getElementById("back-menu-btn")

        
        // Menu Toggle
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            menuDropdown.style.display = menuDropdown.style.display === "flex" ? "none" : "flex";
        });
        
        // Back to Main Menu
        backMenuBtn.addEventListener("click", () => {
            window.location.href = "play.html";
        });

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let chosenBackgroundColor = "#000";
const backgroundColors = ["black"];

let mouseX = 0;
let mouseY = 0;

const BASE_WIDTH = 960;
const BASE_HEIGHT = 540;

let transitioning = false;
let transitionDirection = "expand";
let transitionRadius = 0;
let transitionMaxRadius = 0;
let transitionX = 0;
let transitionY = 0;
let transitionCallback = null;

const camera = {
    x: 0,
    y: 0,
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
};

let currentLevel = 0;
let platforms = [];

let spikes = [];

const player = {
    width: 35,
    height: 35,
    speed: 4.1,
    dx: 0,
    dy: 0,
    accel: 0.6,
    decel: 0.3,
    friction: 0.7,
    airFriction: 0.9,
    groundFriction: 0.8,
    jumpPower: 11,
    minJumpPower: 5,
    gravity: 1,
    grounded: false,
    jumpBuffer: 0,
    maxJumpBuffer: 10,
    jumpKeyHeld: false,
    coyoteTime: 8,
    coyoteTimer: 0,
    maxJumpHold: 16,
    jumpHoldTimer: 0,
    landingSlide: false,
    respawnCooldown: 0,
    maxRespawnCooldown: 10,
    shape: 'rounded-square'
};

let particles = [];

const keys = { a: false, d: false };

const levels = [
        {
            spawn: { x: 100, y: 460 }, 
            platforms: [
                { x: 0, y: 500, width: 960, height: 40 },
                { x: 500, y: 400, width: 60, height: 20 },
                { x: 300, y: 350, width: 60, height: 20 },
                { x: 400, y: 200, width: 60, height: 20 },
                { x: 100, y: 250, width: 60, height: 20 },
                { x: -70, y: -200, width: 120, height: 2000 },
                { x: 900, y: -200, width: 120, height: 2000 },
            ],
            door: { 
                x: 700, 
                y: 440, 
                width: 40, 
                height: 60, 
                type: "triangle"  // Another door type (star)
            },

            orbs: [
                { x: 425, y: 180, radius: 10, collected: false, offset: 0 }
            ],
            message: "Level 1: Welcome to GeoShift"
        },
        {
            spawn: { x: 100, y: 460 },
            platforms: [
                { x: -10, y: 500, width: 1000, height: 45 },
                { x: 180, y: 400, width: 120, height: 20 },
                { x: 400, y: 350, width: 120, height: 20 },
                { x: 620, y: 300, width: 120, height: 20 },
                { x: -70, y: -200, width: 120, height: 2000 },
                { x: 900, y: -200, width: 120, height: 2000 },
            ],
            door: { 
                x: 780, 
                y: 100, 
                width: 40, 
                height: 60, 
                type: "circle"  // Type of the door (circle, pentagon, triangle, star)
            },
            button: { x: 1000, y: 430, width: 30, height: 10 },
            vanishPlatform: { x: 1000, y: 300, width: 120, height: 20, visible: true },
            orbs: [
                { x: 250, y: 360, radius: 10, collected: false, offset: 0 }
            ],
            
        },
        {
            spawn: { x: 180, y: 300 },
            platforms: [
                { x: -10, y: 500, width: 1000, height: 45 },
                { x: 180, y: 400, width: 120, height: 20 },
                { x: 400, y: 350, width: 120, height: 20 },
                { x: 620, y: 300, width: 120, height: 20 },
                { x: -70, y: -200, width: 120, height: 2000 },
                { x: 900, y: -200, width: 120, height: 2000 },
            ],
            door: { 
                x: 850, 
                y: 340, 
                width: 40, 
                height: 60, 
                type: "pentagon"  // Different door type (pentagon)
            },
            spikes: [
                { x: 0, y: 490, width: 1000, height: 10 },
            ],
            orbs: [
                { x: 250, y: 360, radius: 10, collected: false, offset: 0 }
            ],
        },
        {
            spawn: { x: 100, y: 460 }, 
            platforms: [
                
                { x: 0, y: 500, width: 960, height: 40 },
                { x: 200, y: 400, width: 60, height: 20 },
                { x: 300, y: 350, width: 60, height: 20 },
                { x: 400, y: 300, width: 60, height: 20 },
                { x: 500, y: 250, width: 60, height: 20 },
                { x: -70, y: -200, width: 120, height: 2000 },
                { x: 900, y: -200, width: 120, height: 2000 },
            ],
            door: { 
                x: 500, 
                y: 400, 
                width: 40, 
                height: 60, 
                type: "star"  // Another door type (star)
            },

            orbs: [
                { x: 800, y: 300, radius: 10, collected: false, offset: 0 }
            ],
        },
        {
            spawn: { x: 400, y: 460 },
            platforms: [
                { x: 0, y: 500, width: 960, height: 40 },
            ],
            door: {
                x: 800,
                y: 440,
                width: 40,
                height: 60,
                type: "end"  // Special door with no knob
            },
            message: "Completed Level 1!",
            orbs: []
        }
        
    ];

    function drawMessage(message) {
        // Set up text styles
        ctx.save();
        ctx.font = `${14 * scale}px 'Press Start 2P'`;
        ctx.fillStyle = "#ffffff"; // White text
        ctx.textAlign = "center";
        ctx.textBaseline = "top";  // Align at the top
    
        // Draw the message at the center of the canvas
        ctx.fillText(message, canvas.width / 2, 40 * scale);
    
        ctx.restore();
    }
    
    

function CustomButton(button) {
    const x = (button.x - camera.x) * scale;
    const y = (button.y - camera.y) * scale;
    const w = button.width * scale;
    const h = button.height * scale;

    ctx.fillStyle = "orange";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#AA6600";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
}

function VanishPlatform(platform) {
    levels[currentLevel].vanishPlatform.visible = true;
    const x = (platform.x - camera.x) * scale;
    const y = (platform.y - camera.y) * scale;
    const w = platform.width * scale;
    const h = platform.height * scale;

    ctx.fillStyle = "#6666ff";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "#4444aa";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
}

function playerIsTouchingButton(player, button) {
    const btnLeft = button.x;
    const btnRight = button.x + button.width;
    const btnTop = button.y;
    const btnBottom = button.y + button.height;

    // Check player
    const playerLeft = player.x;
    const playerRight = player.x + player.width;
    const playerTop = player.y;
    const playerBottom = player.y + player.height;

    const playerTouching = playerRight > btnLeft && playerLeft < btnRight &&
                           playerBottom > btnTop && playerTop < btnBottom;

}

function changeShape(shape) {
    if (!canChangeShape) return;

    player.shape = shape;
    currentShape = shape;

    shapeIndicator.textContent = `Shape: ${shape.charAt(0).toUpperCase() + shape.slice(1)} (Cooldown)`;

    // Optional visual feedback
    playerGlow?.();

    startCooldown();
}

let canChangeShape = true;
let shapeChangeCooldown = 5000;
let cooldownInterval;

function startCooldown() {
    canChangeShape = false;
    const cooldownStartTime = Date.now();

    cooldownInterval = setInterval(() => {
        const elapsed = Date.now() - cooldownStartTime;
        const remaining = Math.max(0, shapeChangeCooldown - elapsed);

        if (remaining <= 0) {
            clearInterval(cooldownInterval);
            canChangeShape = true;
            shapeIndicator.textContent = shapeIndicator.textContent.replace(" (Cooldown)", "");
        } else {
            const secondsLeft = Math.ceil(remaining / 1000);
            const current = shapeIndicator.textContent.split(":")[0].trim();
            shapeIndicator.textContent = `${current}: ${player.shape} (${secondsLeft}s)`;
        }
    }, 100);
}


function startTransition(x, y, callback) {
    transitioning = true;
    transitionDirection = "expand";
    transitionRadius = 0;
    transitionX = x;
    transitionY = y;
    transitionMaxRadius = Math.hypot(canvas.width, canvas.height);
    transitionCallback = callback;
}

function updateTransition() {
    if (!transitioning) return;

    ctx.save();
    ctx.beginPath();
    ctx.arc(transitionX, transitionY, transitionRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.restore();

    if (transitionDirection === "expand") {
        transitionRadius += 30;
        if (transitionRadius >= transitionMaxRadius) {
            transitionRadius = transitionMaxRadius;
            if (transitionCallback) {
                transitionCallback();
                transitionCallback = null;
                transitionDirection = "shrink";
            }
        }
    } else if (transitionDirection === "shrink") {
        transitionRadius -= 30;
        if (transitionRadius <= 0) {
            transitionRadius = 0;
            transitioning = false;
        }
    }
}

function loadLevel(index) {
    currentLevel = index;
    const level = levels[index];
    platforms = level.platforms.map(p => ({ ...p }));
    spikes = level.spikes ? level.spikes.map(s => ({ ...s })) : [];
    door = { ...level.door, visible: true };
    player.x = level.spawn.x;
    player.y = level.spawn.y;
    player.dx = 0;
    player.dy = 0;
    player.respawnCooldown = player.maxRespawnCooldown;
    particles = [];
}

function Particles() {
    for (const p of particles) {
        ctx.save();

        ctx.fillStyle = p.color;

        ctx.translate(
            (p.x - camera.x) * scale,
            (p.y - camera.y) * scale
        );

        ctx.rotate(p.rotation);

        ctx.fillRect(
            -p.size * scale / 2,
            -p.size * scale / 2,
            p.size * scale,
            p.size * scale
        );

        ctx.restore();
    }
}

function createParticle(x, y, color) {
    if (particles.length >= 10) {
        particles.shift();
    }

    const size = Math.random() * 3 + 1;
    const rotation = Math.random() * Math.PI * 2;

    particles.push({
        x,
        y,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 1.5) * 2,
        life: 30,
        color,
        size, 
        rotation 
    });
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.dx;
        p.y += p.dy;
        p.dy += 0.1;
        p.life--;
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function resizeCanvas() {
    const windowRatio = window.innerWidth / window.innerHeight;
    const baseRatio = BASE_WIDTH / BASE_HEIGHT;

    if (windowRatio > baseRatio) {
        canvas.height = window.innerHeight;
        canvas.width = window.innerHeight * baseRatio;
    } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth / baseRatio;
    }

    scale = (canvas.width / BASE_WIDTH);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function RoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}


function Player() {
    const x = (player.x - camera.x) * scale;
    const y = (player.y - camera.y) * scale;
    const width = player.width * scale;
    const height = player.height * scale;

    const outlineColor = "#FFFFFF";
    const fillColor = "#000000";

    // Default: rounded square
    if (player.shape === "rounded-square") {
        ctx.fillStyle = outlineColor;
        RoundedRect(x - 2, y - 2, width + 4, height + 4, 10 * scale); // Outer
        ctx.fillStyle = fillColor;
        RoundedRect(x, y, width, height, 8 * scale); // Inner
    }

    else if (player.shape === "triangle") {
        drawTriangle(ctx, x, y, width, height, outlineColor, fillColor);
    }

    else if (player.shape === "pentagon") {
        const radius = (Math.min(width, height) / 2) * 0.85;
        drawPentagon(ctx, x + width / 2, y + height / 2, radius, outlineColor, fillColor);
    }


    else if (player.shape === "star") {
        const outerRadius = (Math.min(width, height) / 2) * 0.95;
        const innerRadius = outerRadius * 0.5;
        drawStar(ctx, x + width / 2, y + height / 2, outerRadius, innerRadius, fillColor, outlineColor);
    }


    else if (player.shape === "circle") {
        // Outer outline
        ctx.fillStyle = outlineColor;
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height / 2, width / 2 + 2, 0, Math.PI * 2);
        ctx.fill();

        // Inner fill
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2);
        ctx.fill();
    }
    console.log("Drawing shape:", player.shape);

}

// Function to draw a triangle
function drawTriangle(ctx, x, y, width, height, outlineColor, fillColor) {
    ctx.fillStyle = outlineColor; // Set the outline color
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y); // Top point
    ctx.lineTo(x, y + height); // Bottom-left point
    ctx.lineTo(x + width, y + height); // Bottom-right point
    ctx.closePath();
    ctx.fill();
    
    // Draw inner color
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y); // Top point
    ctx.lineTo(x, y + height); // Bottom-left point
    ctx.lineTo(x + width, y + height); // Bottom-right point
    ctx.closePath();
    ctx.fill();
}

function drawPentagon(ctx, centerX, centerY, radius, outlineColor, fillColor) {
    const points = [];
    const angleStep = (Math.PI * 2) / 5;
  
    // Build the points
    for (let i = 0; i < 5; i++) {
      const angle = angleStep * i - Math.PI / 2; // rotate so flat base is at bottom
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.push({ x, y });
    }
  
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
  
    ctx.fillStyle = outlineColor;
    ctx.fill();
  
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
  
    ctx.fillStyle = fillColor;
    ctx.fill();
  }

  function drawStar(ctx, cx, cy, outerRadius, innerRadius, fillColor, outlineColor) {
    let points = 5;
    const step = Math.PI / points;
    ctx.beginPath();
    for (let i = 0; i < 2 * points; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = i * step - Math.PI / 2; // Rotate to point upward
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.closePath();
    ctx.fillStyle = outlineColor;
    ctx.fill();
    ctx.fillStyle = fillColor;
    ctx.fill();
} 
  
function Platforms() {
    if (door.visible) {
        const doorX = (door.x - camera.x) * scale;
        const doorY = (door.y - camera.y) * scale;
        const doorWidth = door.width * scale;
        const doorHeight = door.height * scale;

        // Draw door body
        ctx.fillStyle = "#3078bf";
        ctx.fillRect(doorX, doorY, doorWidth, doorHeight);

        // Add gradient to the door
        const doorGradient = ctx.createLinearGradient(doorX, doorY, doorX, doorY + doorHeight);
        doorGradient.addColorStop(0, "#0b0166");
        doorGradient.addColorStop(1, "#080140");
        ctx.fillStyle = doorGradient;
        ctx.fillRect(doorX + 5, doorY + 5, doorWidth - 10, doorHeight - 10);

        // Draw door knob based on door type
        const knobX = doorX + doorWidth - 20 * scale;
        const knobY = doorY + doorHeight / 2;
        const knobRadius = 5 * scale;  // Default knob radius

        // Draw knob based on the door type
        switch (door.type) {
            case "circle":
                ctx.fillStyle = "#FFD700";  // Gold knob
                ctx.beginPath();
                ctx.arc(knobX, knobY, knobRadius, 0, Math.PI * 2);
                ctx.fill();
                break;

            case "triangle":
                drawTriangle(ctx, knobX - 6 * scale, knobY - 6 * scale, 12 * scale, 12 * scale, "#FFD700", "#FFD700");
                break;

            case "pentagon":
                drawPentagon(ctx, knobX, knobY, 6 * scale, "#FFD700", "#FFD700");
                break;

            case "star":
                drawStar(ctx, knobX, knobY, 6 * scale, 3 * scale, "#FFD700", "#FFD700");
                break;

            case "end":
                    // Special door — no knob drawn
                break;

            default:
                // If no door type is specified, fallback to the default circular knob
                ctx.fillStyle = "#FFD700";
                ctx.beginPath();
                ctx.arc(knobX, knobY, knobRadius, 0, Math.PI * 2);
                ctx.fill();
                break;
        }

        // Add a stroke around the door
        ctx.strokeStyle = "#3998f7";
        ctx.lineWidth = 3;
        ctx.strokeRect(doorX, doorY, doorWidth, doorHeight);
    }


    platforms.forEach(p => {
    const x = (p.x - camera.x) * scale;
    const y = (p.y - camera.y) * scale;
    const w = p.width * scale;
    const h = p.height * scale;

    ctx.fillStyle = "#010230";
    ctx.fillRect(x, y, w, h);

    // Platform border styles
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Add white border around platform
    ctx.strokeStyle = "#3998f7";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
});
}    

function Spikes() {
    ctx.shadowColor = "#a61107";
    ctx.shadowBlur = 2;
    
    spikes.forEach(s => {
        ctx.beginPath();
        const spikeCount = Math.floor(s.width / 10);
        
        const gradient = ctx.createLinearGradient(s.x - camera.x, s.y - camera.y, s.x + s.width - camera.x, s.y + s.height - camera.y);
        gradient.addColorStop(0, "#110b7d");
        gradient.addColorStop(1, "#110b7d");
        
        ctx.fillStyle = gradient;
        
        for (let i = 0; i < spikeCount; i++) {
            const baseX = (s.x + i * 10 - camera.x) * scale;
            const baseY = (s.y + s.height - camera.y) * scale;
            ctx.moveTo(baseX, baseY);
            ctx.lineTo(baseX + 5 * scale, (s.y - camera.y) * scale);
            ctx.lineTo(baseX + 10 * scale, baseY);
        }
        //note to self: baseX is the x position of the spike base, baseY is the y position of the spike base
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        ctx.fill();
    });
}

function checkSpikeDeath() {
    spikes.forEach(s => {
        if (
            player.x < s.x + s.width &&
            player.x + player.width > s.x &&
            player.y < s.y + s.height &&
            player.y + player.height > s.y
        ) {
            loadLevel(currentLevel);
        }
    });
}

function applyGravity() {
    if (!player.grounded) player.dy += player.gravity;
}

function movePlayer() {
    if (player.respawnCooldown > 0) return;
    if (keys.a && keys.d) {
        player.dx *= player.groundFriction;
    } else {
        if (keys.d) player.dx += player.accel;
        else if (keys.a) player.dx -= player.accel;
        else if (player.grounded) {
            player.dx *= player.groundFriction;
        } else {
            player.dx *= player.airFriction;
        }
    }

    player.dx = Math.max(Math.min(player.dx, player.speed), -player.speed);
}


function handleCollisions() {
    player.x += player.dx;

    platforms.forEach(p => {
        if (
            player.x < p.x + p.width &&
            player.x + player.width > p.x &&
            player.y < p.y + p.height &&
            player.y + player.height > p.y
        ) {
            if (player.dx > 0) {
                player.dx = 0;
                player.x = p.x - player.width;
            } else if (player.dx < 0) {
                player.dx = 0;
                player.x = p.x + p.width;
            }
        }
    });

    player.y += player.dy;
    let onGround = false;

    platforms.forEach(p => {
        if (
            player.x < p.x + p.width &&
            player.x + player.width > p.x &&
            player.y < p.y + p.height &&
            player.y + player.height > p.y
        ) {
            if (player.dy > 0) {
                player.dy = 0;
                player.y = p.y - player.height;
                onGround = true;
            } else if (player.dy < 0) {
                player.dy = 0;
                player.y = p.y + p.height;
                player.jumpHoldTimer = 0;
                player.jumpBuffer = 0;
            }
        }
    });


    const currentLevelindex = levels[currentLevel];
    if (currentLevelindex.vanishPlatform && currentLevelindex.vanishPlatform.visible) {
    const p = currentLevelindex.vanishPlatform;

    if (
        player.x < p.x + p.width &&
        player.x + player.width > p.x &&
        player.y < p.y + p.height &&
        player.y + player.height > p.y
    ) {
        loadLevel(currentLevel);
    }
    }

    player.grounded = onGround;

    if (player.grounded) {
        player.coyoteTimer = player.coyoteTime;
    } else if (player.coyoteTimer > 0) {
        player.coyoteTimer--;
    }
}

function checkJump() {
    if (player.respawnCooldown > 0) return;
    if ((player.grounded || player.coyoteTimer > 0) && player.jumpBuffer > 0) {
        player.jumpHoldTimer = player.maxJumpHold;
        player.grounded = false;
        player.coyoteTimer = 0;
        player.jumpBuffer = 0;
    }

    if (player.jumpHoldTimer > 0) {
        const holdFactor = player.jumpHoldTimer / player.maxJumpHold;
        const jumpStrength = player.minJumpPower + (player.jumpPower - player.minJumpPower) * holdFactor;
        player.dy = -jumpStrength;
        player.jumpHoldTimer--;
    }
}


function update() {
    // Set the background image
    const img = new Image();
    img.src = 'background.jpg';

    // Wait for the image to load before drawing it
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    ctx.globalAlpha = 0.5;
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;


    // Continue with the rest of your update logic
    updateParticles();

    if (player.respawnCooldown > 0) {
        player.respawnCooldown--;
    }

    Particles();
    Spikes();
    Platforms();
    movePlayer();

    const level = levels[currentLevel];

    Player();

    if (Math.abs(player.dx) > 1 && player.grounded) {
        createParticle(player.x + player.width / 2 + (Math.random() - 0.5) * 4, player.y + player.height - 2, "#FFF");
    }

    if (!player.grounded && player.dy < 0 && player.jumpKeyHeld) {
        createParticle(player.x + player.width / 2, player.y + player.height, "#FFFA");
    }

    applyGravity();
    handleCollisions();
    checkJump();
    checkSpikeDeath();

    // When player moves too far left or right, teleport to the opposite side
    if (player.x < camera.x) {
        player.x = camera.x + camera.width - player.width; // Teleport to the right
    } else if (player.x > camera.x + camera.width) {
        player.x = camera.x; // Teleport to the left
    }

    // Reload the level if the player moves too far up or down
    if (player.y < camera.y || player.y > camera.y + camera.height) {
        loadLevel(currentLevel); 
    }

    if (player.jumpBuffer > 0) player.jumpBuffer--;

    if (
        player.x < door.x + door.width &&
        player.x + player.width > door.x &&
        player.y < door.y + door.height &&
        player.y + player.height > door.y
    ) {
        if (door.visible && !transitioning) {
            if (door.type !== "end") {
                if (player.shape === door.type) {
                    startTransition(
                        (door.x + door.width / 2 - camera.x) * scale, 
                        (door.y + door.height / 2 - camera.y) * scale,
                        () => {
                            currentLevel++;
                            if (currentLevel >= levels.length) currentLevel = 0;
                            chosenBackgroundColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
                            loadLevel(currentLevel);
                        }
                    );
                } else {
                    // Optional: give feedback if shape doesn't match
                    console.log(`You need to be a ${door.type} to enter this door.`);
                } 
            } else {
                window.location.href = "level.html"; // 🚪 Final door takes you to level.html
            }
        
        }
    }
    

    updateTransition();

    const maxDim = 0.7;
    const dimOpacity = (1 - 1) * maxDim;

    ctx.fillStyle = `rgba(0, 0, 0, ${dimOpacity})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);



// Handle orb collection and show the UI
if (level.orbs) {
    level.orbs.forEach((orb) => {
        if (!orb.collected) {
            // Hover animation
            orb.offset += 0.05;
            const hoverY = Math.sin(orb.offset) * 5;

            // Draw the orb with corrected visuals
            const drawX = (orb.x - camera.x) * scale;
            const drawY = (orb.y + hoverY - camera.y) * scale;
            const outerRadius = (orb.radius + 4) * scale;
            const innerRadius = orb.radius * scale;

            ctx.beginPath();
            ctx.arc(drawX, drawY, outerRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#1E1E2C'; // outer dark blue ring
            ctx.fill();

            ctx.beginPath();
            ctx.arc(drawX, drawY, innerRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#00CEC9'; // inner light blue
            ctx.fill();


            // Orb's hitbox (circle) bounds
            const orbLeft = orb.x - orb.radius;
            const orbRight = orb.x + orb.radius;
            const orbTop = (orb.y + hoverY) - orb.radius;
            const orbBottom = (orb.y + hoverY) + orb.radius;

            // Player's hitbox (rectangular)
            const playerLeft = player.x;
            const playerRight = player.x + player.width;
            const playerTop = player.y;
            const playerBottom = player.y + player.height;

            // Check if the player is colliding with the orb's bounding box
            if (playerRight > orbLeft && playerLeft < orbRight &&
                playerBottom > orbTop && playerTop < orbBottom) {
                // Player collected the orb
                orb.collected = true;
                shapeShiftEnabled = true;
                shapeShiftTime = 600; // 10 seconds if you're running 60fps
                console.log("Orb collected! Shape-shift active.");

                // Freeze player and show shape-shifting UI
                showShapeShiftUI();
            }
        }
    }); // ← this was missing
}

if (!playerFrozen) {
    // Player movement logic here (like left, right, jump)
    if (keys.d) {
        player.x += player.speed;
    }
    if (keys.a) {
        player.x -= player.speed;
    }
} else {
        // Player is frozen, so completely stop movement
        player.dx = 0; // Disable horizontal movement speed
        player.dy = 0; // Disable vertical movement (jumping)
        keys.d = false;
        keys.a = false;
        player.jumpKeyHeld = false;
    console.log("Player is frozen!");
}



// Shape-shift timer
if (shapeShiftEnabled) {
    shapeShiftTime--;
    if (shapeShiftTime <= 0) {
        shapeShiftEnabled = false;
        playerFrozen = false; // ✅ UNFREEZE player after shape ends
        console.log("Shape-shift ended.");
    }
}

if (levels[currentLevel].message) {
    drawMessage(levels[currentLevel].message);
}




// Make sure the player is unfrozen after shape-shift ends or when you choose to unfreeze them.



requestAnimationFrame(update);


}

document.addEventListener("keydown", e => {
    // Only update keys if the player is not frozen
    if (!playerFrozen) {
        if (e.key === "d" || e.key === "ArrowRight" || e.key === "D") keys.d = true;
        if (e.key === "a" || e.key === "ArrowLeft" || e.key === "A") keys.a = true;
        if ((e.key === "w" || e.key === "ArrowUp" || e.key === " " || e.key === "W") && !player.jumpKeyHeld) {
            player.jumpKeyHeld = true;
            player.jumpBuffer = player.maxJumpBuffer;
        }
    }
});

// Handle keyup event
document.addEventListener("keyup", e => {
    // Only reset keys if the player is not frozen
    if (!playerFrozen) {
        if (e.key === "d" || e.key === "ArrowRight" || e.key === "D") keys.d = false;
        if (e.key === "a" || e.key === "ArrowLeft" || e.key === "A") keys.a = false;
        if (e.key === "w" || e.key === "ArrowUp" || e.key === " " || e.key === "W") {
            player.jumpKeyHeld = false;
            player.jumpHoldTimer = 0;
        }
    }
});

chosenBackgroundColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
loadLevel(0);
update();





function drawPolygon(ctx, sides, radius) {
    const angle = (2 * Math.PI) / sides;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const x = Math.cos(i * angle) * radius;
        const y = Math.sin(i * angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
}





