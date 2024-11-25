//Game states
const GAME_PLAYING = 'playing';
const GAME_OVER = 'game over';
const GAME_WON = 'game won';
const FINAL_CHALLENGE = 'final challenge';

//Images
let dinoImage;
let bossImage;

function preload() {
    // Replace these with actual image paths 
    dinoImage = loadImage('assets/images/angle5.png');
    bossImage = loadImage('assets/images/Boss.png');
}

// Current game state
let gameState = GAME_PLAYING;

// For typed.js
let typed;
let gameOverInitialized = false;
let gameWonInitialized = false;

//Final challenge delay variables
let finalChallengeDelay = 100; // 3 seconds * 60 frames
let finalChallengeTimer = 0;

// Background motion lines
let backgroundLines = [];

// Final challenge state
let finalChallengeInitiated = false;
let finalObstacle = null;

let dino = {
    x: 150,
    y: 0,
    size: 50,
    ySpeed: 0,
    speed: 6,        // <-- Speed parameter for dino movement
    isOnGround: true
};

let boss = {
    x: 50,
    y: 0,
    size: 50,
    speed: 3,        // <-- Speed parameter for boss movement
    active: false
};

let game = {
    gravity: 0.6,    // <-- Gravity parameter affects jump physics
    obstacles: [],
    delayTime: 3 * 60,
    speedMultiplier: 1,  // <-- Global speed multiplier
    speedIncreaseInterval: 300  // <-- How often speed increases
};

// Store initial values for proper reset
const INITIAL_STATE = {
    dino: {
        x: 150,
        y: 0,
        size: 40,
        ySpeed: 0,
        speed: 6,
        isOnGround: true
    },
    boss: {
        x: 50,
        y: 0,
        size: 40,
        speed: 3,
        active: false
    },
    game: {
        gravity: 0.6,
        obstacles: [],
        delayTime: 3 * 60,
        speedMultiplier: 1,
        speedIncreaseInterval: 300
    }
};

function setup() {
    createCanvas(640, 480);
    dino.y = height - dino.size;
    boss.y = height - boss.size;
    game.obstacles.push(createObstacle());

    // Initialize background lines
    initializeBackgroundLines();
}

function initializeBackgroundLines() {
    backgroundLines = [];
    for (let i = 0; i < 20; i++) {
        backgroundLines.push({
            x: random(width),
            y: random(height - 80),
            length: random(20, 60),
            speed: random(3, 6)
        });
    }
}

function draw() {
    background("black");

    // Draw motion lines first
    drawMotionLines();
    drawBorder();

    switch (gameState) {
        case GAME_PLAYING:
            updateGame();
            break;
        case GAME_OVER:
            if (!gameOverInitialized) {
                initializeGameOver();
                gameOverInitialized = true;
            }
            break;
        case GAME_WON:
            if (!gameWonInitialized) {
                initializeGameWon();
                gameWonInitialized = true;
            }
            break;
    }
}

function drawMotionLines() {
    stroke(255, 40);  // White with 40/255 opacity
    strokeWeight(1);

    for (let line of backgroundLines) {
        // Update line position
        line.x -= line.speed * game.speedMultiplier;

        // Reset line when it goes off screen
        if (line.x + line.length < 0) {
            line.x = width;
            line.y = random(height - 80);
            line.length = random(20, 60);
        }

        // Draw the line
        beginShape();
        vertex(line.x, line.y);
        vertex(line.x + line.length, line.y);
        endShape();
    }
}

function drawBorder() {
    push();
    noFill();
    stroke(255);
    strokeWeight(5);
    rect(0, 0, width, height);
    pop();
}

function updateGame() {
    if (game.speedMultiplier >= 2 && !finalChallengeInitiated) {
        finalChallengeInitiated = true;
        finalChallengeTimer = finalChallengeDelay;  // Start the delay timer
        game.obstacles = [];  // Clear existing obstacles
    }

    // Handle final challenge delay and creation
    if (finalChallengeInitiated && finalObstacle === null) {
        finalChallengeTimer--;
        if (finalChallengeTimer <= 0) {
            createFinalObstacle();
        }
    }

    // Increase speed multiplier over time (cap at 3x)
    if (frameCount % game.speedIncreaseInterval === 0 && game.speedMultiplier < 2) {
        game.speedMultiplier += 0.5;
    }

    // Start boss movement after delay
    if (frameCount > game.delayTime) {
        boss.active = true;
    }

    // Player movement
    if (keyIsDown(RIGHT_ARROW) && dino.x < width - dino.size) {
        dino.x += dino.speed;
    }
    else if (keyIsDown(LEFT_ARROW) && dino.x > 0) {
        dino.x -= dino.speed;
    }

    // Jumping
    if (keyIsDown(32) && dino.isOnGround) {
        dino.ySpeed = -12;
        dino.isOnGround = false;
    }

    // Boss movement
    if (boss.active) {
        if (boss.x < dino.x) {
            boss.x += boss.speed;
        } else if (boss.x > dino.x) {
            boss.x -= boss.speed;
        }
    }

    updateDino();
    showDino();
    showBoss();

    // Check boss collision
    if (checkBossCollision() && dino.isOnGround) {
        gameState = GAME_OVER;
    }

    // Update and show final obstacle if it exists
    if (finalObstacle) {
        updateFinalObstacle();
        showFinalObstacle();

        // Check if boss hits final obstacle
        if (checkBossFinalObstacleCollision()) {
            gameState = GAME_WON;
        }

        // Check if player hits final obstacle
        if (checkPlayerFinalObstacleCollision()) {
            gameState = GAME_OVER;
        }
    }

    // Create new regular obstacles only if final challenge hasn't started
    if (!finalChallengeInitiated && frameCount % 90 === 0) {
        game.obstacles.push(createObstacle());
    }

    // Update regular obstacles
    for (let i = game.obstacles.length - 1; i >= 0; i--) {
        updateObstacle(game.obstacles[i]);
        showObstacle(game.obstacles[i]);

        if (checkCollision(game.obstacles[i])) {
            gameState = GAME_OVER;
        }

        if (game.obstacles[i].x + game.obstacles[i].base < 0) {
            game.obstacles.splice(i, 1);
        }
    }

    // Display speed
    textSize(20);
    fill(255);
    noStroke();
    text('Speed: ' + game.speedMultiplier.toFixed(1) + 'x', 10, 30);
}

function createFinalObstacle() {
    finalObstacle = {
        x: width,
        y: height - 100,  // Higher than regular obstacles
        base: 60,         // Wider than regular obstacles
        height: 80,      // Taller than regular obstacles, reduced height
        speed: 2          // Slower than regular obstacles
    };

    // Clear existing obstacles
    game.obstacles = [];
}

function updateFinalObstacle() {
    if (finalObstacle) {
        finalObstacle.x -= finalObstacle.speed * game.speedMultiplier;
    }
}

function showFinalObstacle() {
    if (finalObstacle) {
        fill(255, 215, 0);  // Gold color for final obstacle
        triangle(
            finalObstacle.x, height,
            finalObstacle.x + finalObstacle.base / 2, finalObstacle.y,
            finalObstacle.x + finalObstacle.base, height
        );
    }
}

function checkBossFinalObstacleCollision() {
    if (!finalObstacle) return false;

    return (
        boss.x < finalObstacle.x + finalObstacle.base &&
        boss.x + boss.size > finalObstacle.x &&
        boss.y + boss.size > finalObstacle.y
    );
}

function checkPlayerFinalObstacleCollision() {
    if (!finalObstacle) return false;

    return (
        dino.x < finalObstacle.x + finalObstacle.base &&
        dino.x + dino.size > finalObstacle.x &&
        dino.y + dino.size > finalObstacle.y
    );
}

function initializeGameOver() {
    let gameOverElement = createDiv('');
    gameOverElement.position(0, 0);
    gameOverElement.style('width', '100%');
    gameOverElement.style('height', '100%');
    gameOverElement.style('display', 'flex');
    gameOverElement.style('flex-direction', 'column');
    gameOverElement.style('justify-content', 'center');
    gameOverElement.style('align-items', 'center');
    gameOverElement.style('font-family', 'Courier New');
    gameOverElement.style('color', 'white');
    gameOverElement.style('text-align', 'center');
    gameOverElement.style('position', 'absolute');
    gameOverElement.style('top', '0');
    gameOverElement.style('left', '0');

    let gameOverTitle = createDiv('');
    gameOverTitle.parent(gameOverElement);
    gameOverTitle.style('font-size', '40px');
    gameOverTitle.style('margin-bottom', '20px');

    let typedElement = createDiv('');
    typedElement.parent(gameOverElement);
    typedElement.style('width', '300px');
    typedElement.style('font-size', '16px');

    let restartPrompt = createDiv('');
    restartPrompt.parent(gameOverElement);
    restartPrompt.style('font-size', '20px');
    restartPrompt.style('margin-top', '20px');

    new Typed(gameOverTitle.elt, {
        strings: ['GAME OVER'],
        typeSpeed: 40,
        showCursor: false,
        onComplete: () => {
            new Typed(typedElement.elt, {
                strings: [
                    'The Chase is Over...',
                    'The Obstacles Were Too Much...'
                ],
                typeSpeed: 40,
                backSpeed: 30,
                backDelay: 1000,
                startDelay: 500,
                showCursor: false,
                onComplete: () => {
                    new Typed(restartPrompt.elt, {
                        strings: ['Press SPACEBAR to try again'],
                        typeSpeed: 40,
                        showCursor: true,
                        onComplete: (self) => {
                            self.cursor.style.display = 'inline-block';
                        }
                    });
                }
            });
        }
    });
}

function initializeGameWon() {
    let gameWonElement = createDiv('');
    gameWonElement.position(0, 0);
    gameWonElement.style('width', '100%');
    gameWonElement.style('height', '100%');
    gameWonElement.style('display', 'flex');
    gameWonElement.style('flex-direction', 'column');
    gameWonElement.style('justify-content', 'center');
    gameWonElement.style('align-items', 'center');
    gameWonElement.style('font-family', 'Courier New');
    gameWonElement.style('color', 'white');
    gameWonElement.style('text-align', 'center');
    gameWonElement.style('position', 'absolute');
    gameWonElement.style('top', '0');
    gameWonElement.style('left', '0');

    let gameWonTitle = createDiv('');
    gameWonTitle.parent(gameWonElement);
    gameWonTitle.style('font-size', '20px');
    gameWonTitle.style('margin-bottom', '20px');

    // Create a link instead of a button
    let nextPageLink = createA('yesWinner.html', 'Continue');
    nextPageLink.parent(gameWonElement);
    nextPageLink.style('font-size', '20px');
    nextPageLink.style('font-family', 'Courier New');
    nextPageLink.style('margin-top', '20px');
    nextPageLink.style('padding', '10px 20px');
    nextPageLink.style('cursor', 'pointer');
    nextPageLink.style('background-color', 'white');
    nextPageLink.style('color', 'black');
    nextPageLink.style('text-decoration', 'none');
    nextPageLink.style('display', 'none'); // Initially hidden until typing animation completes

    new Typed(gameWonTitle.elt, {
        strings: ['You Led the Chase Right Into the Trap!'],
        typeSpeed: 20,
        showCursor: false,
        onComplete: () => {
            nextPageLink.style('display', 'block');
        }
    });
}

function updateDino() {
    dino.y += dino.ySpeed;
    dino.ySpeed += game.gravity;

    if (dino.y >= height - dino.size) {
        dino.y = height - dino.size;
        dino.ySpeed = 0;
        dino.isOnGround = true;
    }
}

function showDino() {
    imageMode(CORNER);
    image(dinoImage, dino.x, dino.y, dino.size, dino.size);
}

function showBoss() {
    imageMode(CORNER);
    image(bossImage, boss.x, boss.y, boss.size, boss.size);
}

function createObstacle() {
    let base = random(10, 30);
    let height = random(30, 70);
    return {
        x: width,
        y: height - 20,
        base: base,
        height: height,
        speed: 4
    };
}

function updateObstacle(obstacle) {
    obstacle.x -= obstacle.speed * game.speedMultiplier;
}

function showObstacle(obstacle) {
    fill(255);
    triangle(
        obstacle.x, height,
        obstacle.x + obstacle.base / 2, height - obstacle.height,
        obstacle.x + obstacle.base, height
    );
}

function checkBossCollision() {
    return (
        dino.x < boss.x + boss.size &&
        dino.x + dino.size > boss.x &&
        dino.y + dino.size > boss.y
    );
}

function checkCollision(obstacle) {
    return (
        dino.x < obstacle.x + obstacle.base &&
        dino.x + dino.size > obstacle.x &&
        dino.y + dino.size > height - obstacle.height
    );
}

function keyPressed() {
    if (keyCode === 32 && gameState === GAME_OVER) {
        resetGame();
    }
}

function resetGame() {
    // Reset game state
    gameState = GAME_PLAYING;
    gameOverInitialized = false;
    gameWonInitialized = false;

    // Reset player to initial state
    dino.x = INITIAL_STATE.dino.x;
    dino.y = height - INITIAL_STATE.dino.size;
    dino.ySpeed = INITIAL_STATE.dino.ySpeed;
    dino.speed = INITIAL_STATE.dino.speed;
    dino.isOnGround = INITIAL_STATE.dino.isOnGround;

    // Reset boss to initial state
    boss.x = INITIAL_STATE.boss.x;
    boss.y = height - boss.size
    boss.speed = INITIAL_STATE.boss.speed;
    boss.active = INITIAL_STATE.boss.active;

    // Reset game properties
    game.obstacles = [];
    game.speedMultiplier = INITIAL_STATE.game.speedMultiplier;
    game.gravity = INITIAL_STATE.game.gravity;
    game.delayTime = INITIAL_STATE.game.delayTime;
    game.speedIncreaseInterval = INITIAL_STATE.game.speedIncreaseInterval;

    // Reset final challenge related states
    finalChallengeInitiated = false;
    finalObstacle = null;
    finalChallengeTimer = 0;

    // Reset frame count (if using p5.js)
    frameCount = 0;

    // Reset background lines
    initializeBackgroundLines();

    // Remove any existing UI elements
    removeElements();
}
