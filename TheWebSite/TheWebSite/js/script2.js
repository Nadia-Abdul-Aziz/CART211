/**
 * Houston's Bug Adventure - Boss Fight
 * 
 * The final showdown with Bugzilla
 * 
 * Instructions:
 * - Move Houston with left and right arrow keys
 * - Press spacebar to shoot web bullets
 * - Avoid Bugzilla's attacks and the mines
 * - Defeat Bugzilla before he defeats you
 * 
 * Made with p5.js
 * https://p5js.org/
 */
"use strict";

// Game states
const GAME_PLAYING = 'playing';
const GAME_OVER = 'lose';
const GAME_WON = 'win';

// Current game state
let gameState = GAME_PLAYING;
let gameOverInitialized = false;
let gameWonInitialized = false;

// Variables for images
let houstonImg;
let bugzillaImg;
let mineImg;

// Combat variables
let playerBullets = [];
let bossBullets = [];
let playerHealth = 100;
let bossHealth = 100;

// Shooting mechanics
let lastShotTime = 0;
const SHOT_COOLDOWN = 500;
let isReloading = false;
let reloadProgress = 0;

// Houston
let houston = {
    body: {
        x: undefined,
        y: undefined,
        size: 100,
        speed: 10
    }
};

// Bugzilla
let bugzilla = {
    body: {
        x: undefined,
        y: undefined,
        size: 400
    }
};

// Mine
let mine = {
    x: undefined,
    y: undefined,
    size: 40,
    speed: undefined,
    collisionRadius: 20
};

// Preload game assets before the game starts
function preload() {
    houstonImg = loadImage('assets/images/homeIcon.png');
    bugzillaImg = loadImage('assets/images/Boss.png');
    mineImg = loadImage('assets/images/mine.png');
}

// Initial game setup
function setup() {
    createCanvas(640, 480);
    initializePositions();
    spawnMine();
}

// Set initial positions for Houston and Bugzilla
function initializePositions() {
    // Position Houston at the bottom center of the screen
    houston.body.x = width / 2;
    houston.body.y = height - 10;

    // Position Bugzilla at the top center of the screen
    bugzilla.body.x = width / 2;
    bugzilla.body.y = 100;
}

// Main game loop
function draw() {
    background(0);
    drawBorder();

    //statement for all game states
    switch (gameState) {
        case GAME_PLAYING:
            updateGame();
            break;
        case GAME_OVER:
            //display game over screen
            if (!gameOverInitialized) {
                initializeGameOver();
                gameOverInitialized = true;
            }
            break;
        case GAME_WON:
            //display game won screen
            if (!gameWonInitialized) {
                initializeGameWon();
                gameWonInitialized = true;
            }
            break;
    }
}

// Draw a white border around the game area
function drawBorder() {
    push();
    noFill();
    stroke(255);
    strokeWeight(5);
    rect(0, 0, width, height);
    pop();
}

// Update game logic during  gameplay
function updateGame() {
    moveHouston();
    updateBullets();
    updateMine();
    drawEntities();
    updateReloadSystem();
    checkGameStatus();
}

// Handle player movement
function moveHouston() {
    // Move left when left arrow is pressed
    if (keyIsDown(LEFT_ARROW)) houston.body.x -= houston.body.speed;
    // Move right when right arrow is pressed
    if (keyIsDown(RIGHT_ARROW)) houston.body.x += houston.body.speed;

    // Constrain so houston doesn't go off the borders
    houston.body.x = constrain(houston.body.x, houston.body.size / 2, width - houston.body.size / 2);
}

//bullet mechanics
//CLAUDE USED FOR LOGIC HELP!!!
function updateBullets() {
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        playerBullets[i].y -= 20; // Move bullets upward

        // Check collision with boss
        if (dist(playerBullets[i].x, playerBullets[i].y, bugzilla.body.x, bugzilla.body.y) < bugzilla.body.size / 2) {
            bossHealth -= 5;  // Reduce boss health
            playerBullets.splice(i, 1); // Remove bullet????? I think
            continue;
        }

        // Remove bullets that have gone off 
        screen
        if (playerBullets[i].y < 0) {
            playerBullets.splice(i, 1);
        }
    }

    // Boss shooting logic
    // CLAUDE USED
    if (random() < 0.03) { //likelihood to shoot
        // Randomly generate boss bullets within boss's width
        let bulletX = random(bugzilla.body.x - bugzilla.body.size / 6, bugzilla.body.x + bugzilla.body.size / 6);
        bossBullets.push({ x: bulletX, y: bugzilla.body.y + bugzilla.body.size / 4 });
    }

    for (let i = bossBullets.length - 1; i >= 0; i--) {
        bossBullets[i].y += 7; // Move bullets downward

        // Check collision with houston
        if (dist(bossBullets[i].x, bossBullets[i].y, houston.body.x, houston.body.y) < houston.body.size / 2) {
            playerHealth -= 10;
            bossBullets.splice(i, 1);
            continue;
        }

        if (bossBullets[i].y > height) {
            bossBullets.splice(i, 1);
        }
    }
}

//mine mechanics
function updateMine() {
    mine.y += mine.speed; // Move mine downward

    // Respawn mine if it goes off screen
    if (mine.y > height) {
        spawnMine();
    }

    // Check mine collision with houston
    const distance = dist(mine.x, mine.y, houston.body.x, houston.body.y);
    if (distance < mine.collisionRadius + houston.body.size / 2) {
        gameState = GAME_OVER; // if houston touches the mine = game over
    }
}

// Draw all game assets
function drawEntities() {
    // Draw Houston
    push();
    translate(houston.body.x, houston.body.y);
    rotate(PI);
    imageMode(CENTER);
    image(houstonImg, 0, 0, houston.body.size, houston.body.size);
    pop();

    // Draw Bugzilla
    push();
    translate(bugzilla.body.x, bugzilla.body.y);
    rotate(PI);
    imageMode(CENTER);
    image(bugzillaImg, 0, 30, bugzilla.body.size, bugzilla.body.size);
    pop();

    // Draw player bullets
    fill(255);
    playerBullets.forEach(bullet => {
        ellipse(bullet.x, bullet.y, 8, 8);
    });

    // Draw boss bullets
    bossBullets.forEach(bullet => {
        ellipse(bullet.x, bullet.y, 8, 8);
    });

    // Draw mine
    push();
    imageMode(CENTER);
    image(mineImg, mine.x, mine.y, mine.size, mine.size);
    pop();

    // Draw health bars
    drawHealthBars();

    // Draw reload indicator if reloading
    if (isReloading) {
        drawReloadIndicator();
    }
}

// Draw health bars for player and boss
function drawHealthBars() {
    push();
    textFont('Courier New');
    textSize(14);
    textAlign(CENTER, TOP);

    // Boss health bar
    stroke(255);
    strokeWeight(1);
    noFill();
    rect(20, 20, 16, 120);
    fill(0);
    noStroke();
    rect(21, 21, 14, 118);
    fill(255);
    // Map boss health to bar height
    //CLAUDE USED FOR LOGIC HELP!!
    rect(21, 21 + map(bossHealth, 100, 0, 0, 118), 14, map(bossHealth, 0, 100, 0, 118));
    text(bossHealth, 28, 145);

    // Player health bar
    stroke(255);
    strokeWeight(1);
    noFill();
    rect(width - 36, height - 140, 16, 120);
    fill(0);
    noStroke();
    rect(width - 35, height - 139, 14, 118);
    fill(255);
    rect(width - 35, height - 139 + map(playerHealth, 100, 0, 0, 118), 14, map(playerHealth, 0, 100, 0, 118));
    text(playerHealth, width - 28, height - 160);
    pop();
}

// Draw reload indicator when weapon is reloading
function drawReloadIndicator() {
    push();
    noFill();
    strokeWeight(3);
    let startAngle = -PI / 2;
    // Map reload progress to an arc
    let endAngle = map(reloadProgress, 0, 100, -PI / 2, -PI / 2 + TWO_PI);
    let indicatorSize = 30;

    stroke(0, 0, 0);
    // Draw reload progress arc
    arc(houston.body.x, houston.body.y, indicatorSize, indicatorSize, startAngle, endAngle);
    pop();
}

// Manage reload system for player's weapon
function updateReloadSystem() {
    if (isReloading) {
        const currentTime = millis();
        // Calculate reload progress
        reloadProgress = map(currentTime - lastShotTime, 0, SHOT_COOLDOWN, 0, 100);

        // Reset reload state when cooldown is done
        if (currentTime - lastShotTime >= SHOT_COOLDOWN) {
            isReloading = false;
            reloadProgress = 0;
        }
    }
}

// Spawn a new mine at a random horizontal position
function spawnMine() {
    mine.x = random(width);
    mine.y = 0;
    mine.speed = random(4, 8);
}

// Check for won or lost
function checkGameStatus() {
    if (playerHealth <= 0) {
        gameState = GAME_OVER;  // Player loses if health reaches 0
    } else if (bossHealth <= 0) {
        gameState = GAME_WON;   // Player wins if boss health reaches 0
    }
}

// Handle key press events
function keyPressed() {
    if (key === ' ') {
        if (gameState === GAME_PLAYING) {
            const currentTime = millis();
            // Check if can shoot (not reloading and cooldown passed)
            if (!isReloading && currentTime - lastShotTime >= SHOT_COOLDOWN) {
                // Create bullet at player's position
                playerBullets.push({ x: houston.body.x, y: houston.body.y - houston.body.size / 2 });
                lastShotTime = currentTime;
                isReloading = true;
                reloadProgress = 0;
            }
        } else if (gameState === GAME_OVER) {
            // Restart game if spacebar pressed during game over
            resetGame();
        }
    }
}

// Initialize game over screen with typed text effects
//copied and pasted from previous documents
function initializeGameOver() {
    // Create div for game over screen
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

    // Create title element
    let gameOverTitle = createDiv('');
    gameOverTitle.parent(gameOverElement);
    gameOverTitle.style('font-size', '40px');
    gameOverTitle.style('margin-bottom', '20px');

    // Create text description element
    let typedElement = createDiv('');
    typedElement.parent(gameOverElement);
    typedElement.style('width', '300px');
    typedElement.style('font-size', '16px');

    // Create restart prompt
    let restartPrompt = createDiv('');
    restartPrompt.parent(gameOverElement);
    restartPrompt.style('font-size', '20px');
    restartPrompt.style('margin-top', '20px');

    //animation using previously created divs
    new Typed(gameOverTitle.elt, {
        strings: ['GAME OVER'],
        typeSpeed: 40,
        showCursor: false,
        onComplete: () => {
            new Typed(typedElement.elt, {
                strings: [
                    'Unfortunately for poor little Houston...',
                    '...Bugzilla reigned too high on the food chain'
                ],
                typeSpeed: 40,
                backSpeed: 30,
                backDelay: 1000,
                startDelay: 500,
                showCursor: false,
                onComplete: () => {
                    new Typed(restartPrompt.elt, {
                        strings: ['Press the SPACEBAR to restart'],
                        typeSpeed: 40,
                        showCursor: true,
                        onComplete: (self) => {
                            self.cursor.style.display = 'inline-block';
                        },
                        loop: false
                    });
                }
            });
        }
    });
}

//Similar to previous game lost
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

    //Flashing animation for ending screen
    let style = createElement('style');
    style.html(`
        @keyframes flash {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
        }
        .flash-text {
            animation: flash 0.7s infinite;
            font-size: 30px;
        }
    `);
    let gameWonTitle = createDiv('WINNER WINNER BUG DINNER!');
    gameWonTitle.parent(gameWonElement);
    gameWonTitle.class('flash-text');

    let continueButton = createButton('Continue');
    continueButton.parent(gameWonElement);
    continueButton.style('font-size', '20px');
    continueButton.style('font-family', 'Courier New');
    continueButton.style('margin-top', '20px');
    continueButton.style('padding', '10px 20px');
    continueButton.style('cursor', 'pointer');
    continueButton.mousePressed(() => {
        window.location.href = 'Winner.html'; //link to the winnign stream
    });
}

//runs when the player starts the game for the second time
function resetGame() {
    removeElements();
    initializePositions();
    spawnMine();
    playerHealth = 100;
    bossHealth = 100;
    playerBullets = [];
    bossBullets = [];
    gameState = GAME_PLAYING;
    gameOverInitialized = false;
    gameWonInitialized = false;
    lastShotTime = 0;
    isReloading = false;
    reloadProgress = 0;
}