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
    size: 10,
    speed: undefined,
    collisionRadius: 20
};

function preload() {
    houstonImg = loadImage('assets/images/homeIcon.png');
    bugzillaImg = loadImage('assets/images/Bug.png');
}

function setup() {
    createCanvas(640, 480);
    initializePositions();
    spawnMine();
}

function initializePositions() {
    houston.body.x = width / 2;
    houston.body.y = height - 50;

    bugzilla.body.x = width / 2;
    bugzilla.body.y = 100;
}

function draw() {
    background(0);
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

function drawBorder() {
    push();
    noFill();
    stroke(255);
    strokeWeight(5);
    rect(0, 0, width, height);
    pop();
}

function updateGame() {
    moveHouston();
    updateBullets();
    updateMine();
    drawEntities();
    updateReloadSystem();
    checkGameStatus();
}

function moveHouston() {
    if (keyIsDown(LEFT_ARROW)) houston.body.x -= houston.body.speed;
    if (keyIsDown(RIGHT_ARROW)) houston.body.x += houston.body.speed;
    houston.body.x = constrain(houston.body.x, houston.body.size / 2, width - houston.body.size / 2);
}

function updateBullets() {
    // Update player bullets
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        playerBullets[i].y -= 20;

        // Check collision with boss
        if (dist(playerBullets[i].x, playerBullets[i].y, bugzilla.body.x, bugzilla.body.y) < bugzilla.body.size / 2) {
            bossHealth -= 5;
            playerBullets.splice(i, 1);
            continue;
        }

        // Remove off-screen bullets
        if (playerBullets[i].y < 0) {
            playerBullets.splice(i, 1);
        }
    }

    // Boss shooting logic
    if (random() < 0.03) {
        let bulletX = random(bugzilla.body.x - bugzilla.body.size / 6, bugzilla.body.x + bugzilla.body.size / 6);
        bossBullets.push({ x: bulletX, y: bugzilla.body.y + bugzilla.body.size / 4 });
    }

    // Update boss bullets
    for (let i = bossBullets.length - 1; i >= 0; i--) {
        bossBullets[i].y += 7;

        // Check collision with player
        if (dist(bossBullets[i].x, bossBullets[i].y, houston.body.x, houston.body.y) < houston.body.size / 2) {
            playerHealth -= 10;
            bossBullets.splice(i, 1);
            continue;
        }

        // Remove off-screen bullets
        if (bossBullets[i].y > height) {
            bossBullets.splice(i, 1);
        }
    }
}

function updateMine() {
    mine.y += mine.speed;
    if (mine.y > height) {
        spawnMine();
    }

    // Check mine collision with player
    const distance = dist(mine.x, mine.y, houston.body.x, houston.body.y);
    if (distance < mine.collisionRadius + houston.body.size / 2) {
        gameState = GAME_OVER;
    }
}

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

    // Draw bullets
    fill(255);
    playerBullets.forEach(bullet => {
        ellipse(bullet.x, bullet.y, 10, 10);
    });
    bossBullets.forEach(bullet => {
        ellipse(bullet.x, bullet.y, 10, 10);
    });

    // Draw mine
    push();
    noStroke();
    fill("red");
    ellipse(mine.x, mine.y, mine.size);
    pop();

    // Draw health bars
    drawHealthBars();

    // Draw reload indicator if needed
    if (isReloading) {
        drawReloadIndicator();
    }
}

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

function drawReloadIndicator() {
    push();
    noFill();
    strokeWeight(3);
    let startAngle = -PI / 2;
    let endAngle = map(reloadProgress, 0, 100, -PI / 2, -PI / 2 + TWO_PI);
    let indicatorSize = 30;

    stroke(255, 0, 0);
    arc(houston.body.x, houston.body.y, indicatorSize, indicatorSize, startAngle, endAngle);
    pop();
}

function updateReloadSystem() {
    if (isReloading) {
        const currentTime = millis();
        reloadProgress = map(currentTime - lastShotTime, 0, SHOT_COOLDOWN, 0, 100);
        if (currentTime - lastShotTime >= SHOT_COOLDOWN) {
            isReloading = false;
            reloadProgress = 0;
        }
    }
}

function spawnMine() {
    mine.x = random(width);
    mine.y = 0;
    mine.speed = random(4, 8);
}

function checkGameStatus() {
    if (playerHealth <= 0) {
        gameState = GAME_OVER;
    } else if (bossHealth <= 0) {
        gameState = GAME_WON;
    }
}

function keyPressed() {
    if (key === ' ') {
        if (gameState === GAME_PLAYING) {
            const currentTime = millis();
            if (!isReloading && currentTime - lastShotTime >= SHOT_COOLDOWN) {
                playerBullets.push({ x: houston.body.x, y: houston.body.y - houston.body.size / 2 });
                lastShotTime = currentTime;
                isReloading = true;
                reloadProgress = 0;
            }
        } else if (gameState === GAME_OVER) {
            resetGame();
        }
    }
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
        window.location.href = 'Winner.html';
    });
}

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