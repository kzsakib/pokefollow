const sprite = document.getElementById('sprite');
const candy = document.getElementById('candy');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton'); 
const scoreSound = new Audio('coin.mp3');
let spriteWidth, spriteHeight; 
let directions = {}; 

let currentFrame = 0;
let currentDirection = '';
let cursorX = 0;
let cursorY = 0;
let isMoving = false; 
let moveTimeout;
const scaleFactor = 2;

const spriteSpeed = 0.015;
const frameDelay = 5; 
let frameCounter = 0; 
let score = 0; 


function initializeSprite(sheetUrl, width, height, directionsConfig) {
    sprite.style.backgroundImage = `url('${sheetUrl}')`; 
    spriteWidth = width; 
    spriteHeight = height; 
    directions = directionsConfig; 
}


function spawnCandy() {
    const x = Math.random() * (window.innerWidth - 20); 
    const y = Math.random() * (window.innerHeight - 20); 
    candy.style.left = `${x}px`;
    candy.style.top = `${y}px`;
}

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


function startGame() {
    sprite.style.display = 'block'; 
    candy.style.display = 'block'; 
    scoreDisplay.style.display = 'block'; 
    startButton.style.display = 'none';
    spawnCandy(); 
    requestAnimationFrame(update); 
}

function update() {
    const dx = cursorX - (parseFloat(sprite.style.transform.split('(')[1]) || cursorX) + 8;
    const dy = cursorY - (parseFloat(sprite.style.transform.split(',')[1]) || cursorY) + 8;

    sprite.style.transform = `translate(${(parseFloat(sprite.style.transform.split('(')[1]) || cursorX) + dx * spriteSpeed}px, ${(parseFloat(sprite.style.transform.split(',')[1]) || cursorY) + dy * spriteSpeed}px) scale(${scaleFactor})`; 

    if (isMoving) {
        frameCounter++;
        if (frameCounter >= frameDelay) {
            currentFrame = (currentFrame + 1) % directions[currentDirection].frames; 
            updateSprite();
            frameCounter = 0; 
        }
    }

    if (checkCollision()) {
        score++; // Increase score
        scoreDisplay.textContent = `Score: ${score}`; // Update score display
        scoreSound.currentTime = 0; // Reset sound to start
        scoreSound.play();

        spawnCandy(); // Spawn candy at a new position

       
        if (score === 16) {
            animateSprite();
        }

       
        if (score === 36) {
            animateSpriteToNext(); // Call the new function for transition
        }
    }

    requestAnimationFrame(update); 
}

function animateSprite() {
    sprite.classList.add('blink'); // Start blinking animation
    setTimeout(() => {
        sprite.classList.remove('blink'); 
        transitionSprite('Walk-Anim2.png', { 
            down: { frames: 4, start: 0 },
            downRight: { frames: 4, start: 4 },
            right: { frames: 4, start: 8 },
            upRight: { frames: 4, start: 12 },
            up: { frames: 4, start: 16 },
            upLeft: { frames: 4, start: 20 },
            left: { frames: 4, start: 24 },
            downLeft: { frames: 4, start: 28 },
        });
    }, 2000);
}

function animateSpriteToNext() {
    sprite.classList.add('blink'); // Start blinking animation
    setTimeout(() => {
        sprite.classList.remove('blink'); 
        transitionSprite('Walk-Anim3.png', { 
            down: { frames: 4, start: 0 },
            downRight: { frames: 4, start: 4 },
            right: { frames: 4, start: 8 },
            upRight: { frames: 4, start: 12 },
            up: { frames: 4, start: 16 },
            upLeft: { frames: 4, start: 20 },
            left: { frames: 4, start: 24 },
            downLeft: { frames: 4, start: 28 },
        });
    }, 2000);
}

function transitionSprite(spriteUrl, directionsConfig) {
    
    sprite.style.opacity = 0; 

    setTimeout(() => {
    
        initializeSprite(spriteUrl, 32, 40, directionsConfig);

   
        currentFrame = 0;
        frameCounter = 0; 

     
        sprite.style.opacity = 1; 

    
        isMoving = true; 
        currentDirection = lastValidDirection; 
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
        lastValidDirection = direction; 
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


startButton.addEventListener('click', startGame);


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


sprite.style.display = 'none';
candy.style.display = 'none';
scoreDisplay.style.display = 'none';
