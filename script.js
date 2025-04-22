// Header scroll effect
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Feature Card Switch
let titles = ["Shape-Shifting Mechanics", "Dynamic Maze Challenges", "Puzzling Level Generation"];
let contents = ["Players can morph between different shapes to pass through specific barriers.", "Mind‑bending rooms demand precise shape‑swaps, timed jumps, phase‑walks, and teleport bursts to conquer.", "Some hard, some easy. All the levels here were designed to be easy at first, but challengingly hard at the finale."];

function switchImage() {
    let container = document.querySelector('.image-container');
    let images = Array.from(container.children);
    let title = document.getElementById("title");
    let content = document.getElementById("content");
    
    // Rotate positions in a clockwise manner
    container.insertBefore(images[2], images[0]);
    
    // Update transformations
    images = Array.from(container.children);
    images[0].style.transform = "translate(0, 0)";
    images[0].style.zIndex = "3";
    
    images[1].style.transform = "translate(75px, 75px)";
    images[1].style.zIndex = "2";
    
    images[2].style.transform = "translate(-75px, 75px)";
    images[2].style.zIndex = "1";
    
    // Update title and content
    let firstImageIndex = images[0].src.includes("img/feature1.png") ? 0 :
                          images[0].src.includes("img/feature2.png") ? 1 : 2;
    title.textContent = titles[firstImageIndex];
    content.textContent = contents[firstImageIndex];
}


// Bio tab switching function
function switchBio(button, bioId) {
    // Get parent profile card
    const profileCard = button.closest('.profile-card');
    
    // Remove active class from all tabs in this card
    const tabs = profileCard.querySelectorAll('.bio-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Add active class to clicked tab
    button.classList.add('active');
    
    // Hide all bio contents in this card
    const bios = profileCard.querySelectorAll('.bio-content');
    bios.forEach(bio => bio.classList.remove('active'));
    
    // Show selected bio content
    document.getElementById(bioId).classList.add('active');
}

// FAQ accordion functionality
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        item.classList.toggle('active');
        
        // Close other open items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
    });
});


 



/*
START GAME 
// START GAME 
// START GAME 
const orb = document.getElementById("orb");
let shapeChangedOnce = false; // New flag to restrict to 1 shape change


let shapeUnlocked = false;  // Flag to check if shape change is unlocked
let gamePaused = false;  // Flag to stop game after orb collision
let currentRoom = "room1";


// Room Configuration
const rooms = {
    room1: {
        background: 'black',
        doorPosition: 'right',
        orbPosition: { left: '80%', top: '50px' },
        characterStart: 50
    },
    room2: {
        background: '#1a1a2e',
        doorPosition: 'left',
        orbPosition: { left: '20%', top: '50px' },
        characterStart: window.innerWidth - 120
    }
};

// Initialize the room
function initRoom(roomId) {
    const room = rooms[roomId];
    currentRoom = roomId;
    
    // Set background
    container.style.backgroundColor = room.background;
    
    // Position door
    door.style[room.doorPosition] = '50px';
    door.style[room.doorPosition === 'right' ? 'left' : 'right'] = 'auto';
    door.setAttribute('data-room', roomId === 'room1' ? 'room2' : 'room1');
    
    
    // Reset character position
    positionX = room.characterStart;
    positionY = 0;
    character.style.left = positionX + 'px';
    character.style.bottom = positionY + 'px';
    
    // Reset game state
    shapeUnlocked = false;
    gamePaused = false;
    shapeChangedOnce = false;
}

// Collision detection
function isColliding(rect1, rect2) {
    return !(rect1.right < rect2.left ||
             rect1.left > rect2.right ||
             rect1.bottom < rect2.top ||
             rect1.top > rect2.bottom);
}

function checkDoorCollision() {
    const characterRect = character.getBoundingClientRect();
    const doorRect = door.getBoundingClientRect();
    
    if (isColliding(characterRect, doorRect)) {
        const targetRoom = door.getAttribute('data-room');
        enterRoom(targetRoom);
    }
}


function checkDoorCollision() {
    const characterRect = character.getBoundingClientRect();
    const doorRect = door.getBoundingClientRect();
    
    if (isColliding(characterRect, doorRect)) {
        const targetRoom = door.getAttribute('data-room');
        enterRoom(targetRoom);
    }
}

function enterRoom(roomId) {
    initRoom(roomId);
    gamePaused = false;
}


function updatePosition() {
    if (gamePaused) return; // Pause game after orb collision

    // Apply gravity
    if (positionY > 0 || isJumping) {
        velocityY -= gravity;
        positionY += velocityY;

        if (positionY <= 0) {
            positionY = 0;
            velocityY = 0;
            isJumping = false;
        }
    }

    

    // Keep character in bounds
    positionX = Math.max(0, Math.min(container.offsetWidth - 70, positionX));

    // Apply position
    character.style.left = positionX + "px";
    character.style.bottom = positionY + "px";

    // Check collision with orb
    const characterRect = character.getBoundingClientRect();
    const orbRect = orb.getBoundingClientRect();

    if (!shapeUnlocked && isColliding(characterRect, orbRect)) {
        console.log("Orb touched!");
        gamePaused = true;  // Stop game after touching the orb
        shapeUnlocked = true;  // Unlock shape change
    }

    checkDoorCollision();

    requestAnimationFrame(updatePosition);
}

document.addEventListener("keydown", (e) => {
    if (gamePaused && shapeUnlocked) {
        if (e.key === "1") changeShape(1);
        if (e.key === "2") changeShape(2);
        if (e.key === "3") changeShape(3);
    }

    if (e.code === "KeyA") keys.a = true;
    if (e.code === "KeyD") keys.d = true;

    if (e.code === "KeyW" && !isJumping) {
        velocityY = jumpStrength;
        isJumping = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.code === "KeyA") keys.a = false;
    if (e.code === "KeyD") keys.d = false;
});


// Click handler for door
door.addEventListener('click', function() {
    enterRoom(this.getAttribute('data-room'));
});

let currentShape = 1; // 1: square, 2: circle, 3: triangle
function changeShape(shapeNumber) {
    if (shapeChangedOnce) return; // Prevent further shape changes

    const character = document.getElementById("character");
    currentShape = shapeNumber;
    shapeChangedOnce = true; // Set the flag after first change

    // Reset styles
    character.style.borderRadius = "0";
    character.style.clipPath = "none";
    character.style.width = "70px";
    character.style.height = "70px";
    character.style.border = "none";
    character.style.backgroundColor = "red";

    switch (shapeNumber) {
        case 1: // Square
            character.style.backgroundColor = "red";
            break;
        case 2: // Circle
            character.style.borderRadius = "50%";
            character.style.backgroundColor = "blue";
            break;
        case 3: // Triangle
            character.style.backgroundColor = "yellow";
            character.style.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
            break;
    }

    // Hide orb after shape change
    orb.style.display = "none";
}


// Initial user interaction requirement
document.addEventListener('click', initFirstInteraction, { once: true });

function initFirstInteraction() {
    // Initialize game after first user interaction
    initRoom('room1');
    updatePosition();
}


const item = document.getElementById("item");
const hint = document.getElementById("interact-hint");

function checkProximity() {
    const itemRect = item.getBoundingClientRect();
    const characterRect = character.getBoundingClientRect();

    const dx = characterRect.left + characterRect.width / 2 - (itemRect.left + itemRect.width / 2);
    const dy = characterRect.top + characterRect.height / 2 - (itemRect.top + itemRect.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 100) { 
        hint.style.display = "block";
    } else {
        hint.style.display = "none";
    }
}

// Call function in main game loop or after movement events
setInterval(checkProximity, 100);
*/