const sprite = document.getElementById('sprite');
const candy = document.getElementById('candy');
const scoreDisplay = document.getElementById('score');

let spriteWidth, spriteHeight; // Initialize width and height
let directions = {}; // Initialize directions object

let currentFrame = 0;
let currentDirection = '';
let cursorX = 0;
let cursorY = 0;
let isMoving = false; 
let moveTimeout;
const scaleFactor = 2;

const spriteSpeed = 0.015; // Adjust this value to change the speed
const frameDelay = 5; 
let frameCounter = 0; 
let score = 0; // Initialize score

// Function to initialize sprite parameters
function initializeSprite(sheetUrl, width, height, directionsConfig) {
    sprite.style.backgroundImage = `url('${sheetUrl}')`; // Set the sprite sheet
    spriteWidth = width; // Set the width
    spriteHeight = height; // Set the height
    directions = directionsConfig; // Set the directions
}

// Function to generate a random position for the candy
function spawnCandy() {
    const x = Math.random() * (window.innerWidth - 20); // 20 is the width of the candy
    const y = Math.random() * (window.innerHeight - 20); // 20 is the height of the candy
    candy.style.left = `${x}px`;
    candy.style.top = `${y}px`;
}

// Function to check for collision between sprite and candy
function checkCollision() {
    const spriteRect = sprite.getBoundingClientRect();
    const candyRect = candy.getBoundingClientRect();

    return (
        spriteRect.x < candyRect.x + candyRect.width &&
        spriteRect.x + spriteRect.width > candyRect.x &&
        spriteRect.y < candyRect.y + candyRect.height &&
        spriteRect.y + spriteRect.height > candyRect.y
    );
}

function update() {
    const dx = cursorX - (parseFloat(sprite.style.transform.split('(')[1]) || cursorX) + 8;
    const dy = cursorY - (parseFloat(sprite.style.transform.split(',')[1]) || cursorY) + 8;

    sprite.style.transform = `translate(${(parseFloat(sprite.style.transform.split('(')[1]) || cursorX) + dx * spriteSpeed}px, ${(parseFloat(sprite.style.transform.split(',')[1]) || cursorY) + dy * spriteSpeed}px) scale(${scaleFactor})`; 

    if (isMoving) {
        frameCounter++;
        if (frameCounter >= frameDelay) {
            currentFrame = (currentFrame + 1) % directions[currentDirection].frames; // Loop frames
            updateSprite();
            frameCounter = 0; 
        }
    }

    if (checkCollision()) {
        score++; // Increase score
        scoreDisplay.textContent = `Score: ${score}`; // Update score display
        spawnCandy(); // Spawn candy at a new position

        // Check if score reaches 1
        if (score === 1) {
            animateSprite();
        }
    }

    requestAnimationFrame(update); 
}

function animateSprite() {
    sprite.classList.add('blink'); // Start blinking animation
    setTimeout(() => {
        sprite.classList.remove('blink'); // Stop blinking after 2 seconds
        transitionSprite(); // Transition to the new sprite
    }, 2000);
}

let lastValidDirection = 'down'; // Default direction, adjust as needed

function transitionSprite() {
    // Fade out the sprite
    sprite.style.opacity = 0; 

    setTimeout(() => {
        // Change the sprite sheet to the new one
        initializeSprite('Walk-Anim2.png', 32, 40, {
            down: { frames: 4, start: 0 },
            downRight: { frames: 4, start: 4 },
            right: { frames: 4, start: 8 },
            upRight: { frames: 4, start: 12 },
            up: { frames: 4, start: 16 },
            upLeft: { frames: 4, start: 20 },
            left: { frames: 4, start: 24 },
            downLeft: { frames: 4, start: 28 },
        });

        // Resetting the sprite properties
        currentFrame = 0;
        frameCounter = 0; // Reset frame counter

        // Fade the sprite back in
        sprite.style.opacity = 1; 

        // Ensure movement continues
        isMoving = true; // Ensure movement is active after the transition
        currentDirection = lastValidDirection; // Restore last known direction
    }, 500);
}

function updateSprite() {
    const spriteRow = Math.floor(directions[currentDirection].start / 4);
    const spriteColumn = currentFrame;
    sprite.style.backgroundPosition = `-${spriteColumn * spriteWidth}px -${spriteRow * spriteHeight}px`;
}

function getDirection(spriteX, spriteY, cursorX, cursorY) {
    const deltaX = cursorX - spriteX;
    const deltaY = cursorY - spriteY;

    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    if (angle >= -22.5 && angle < 22.5) return 'right'; 
    if (angle >= 22.5 && angle < 67.5) return 'downRight'; 
    if (angle >= 67.5 && angle < 112.5) return 'down'; 
    if (angle >= 112.5 && angle < 157.5) return 'downLeft'; 
    if (angle >= 157.5 || angle < -157.5) return 'left'; 
    if (angle >= -157.5 && angle < -112.5) return 'upLeft'; 
    if (angle >= -112.5 && angle < -67.5) return 'up'; 
    if (angle >= -67.5 && angle < -22.5) return 'upRight'; 

    return ''; 
}

document.addEventListener('mousemove', (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;

    const spriteTransform = sprite.style.transform;
    const spriteX = (parseFloat(spriteTransform.split('(')[1]) || cursorX) + 16;
    const spriteY = (parseFloat(spriteTransform.split(',')[1]) || cursorY) + 16;

    const direction = getDirection(spriteX, spriteY, cursorX, cursorY);
    if (direction !== currentDirection) {
        currentDirection = direction;
        lastValidDirection = direction; // Update the last valid direction
        currentFrame = 0; 
    }

    isMoving = true; 

    const distance = Math.hypot(cursorX - spriteX, cursorY - spriteY);
    clearTimeout(moveTimeout);
    
    const timeoutDuration = distance < 100 ? 1000 : 2700; 
    moveTimeout = setTimeout(() => {
        isMoving = false; 
    }, timeoutDuration);
});

// Initial spawn of candy and sprite initialization
initializeSprite('Walk-Animalt.png', 32, 32, {
    down: { frames: 4, start: 0 },
    downRight: { frames: 4, start: 4 },
    right: { frames: 4, start: 8 },
    upRight: { frames: 4, start: 12 },
    up: { frames: 4, start: 16 },
    upLeft: { frames: 4, start: 20 },
    left: { frames: 4, start: 24 },
    downLeft: { frames: 4, start: 28 },
});
spawnCandy();
requestAnimationFrame(update);
