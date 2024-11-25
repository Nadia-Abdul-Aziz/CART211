
// Variables for images
let playerImg;
let enemyImg;

// Game states
const GAME_PLAYING = 'playing';
const GAME_OVER = 'game over';
const GAME_WON = 'game won';

// Current game state
let gameState = GAME_PLAYING;

// For typed.js
let typed;
let gameOverInitialized = false;
let gameWonInitialized = false;

let player = {
    x: 320,
    y: 430,
    width: 60,
    height: 40,
    speed: 5,
    cooldown: 0
};

let bullet = {
    x: 0,
    y: 0,
    width: 4,
    height: 10,
    active: false,
    speed: 7
};

let enemies = [];
const ENEMY_ROWS = 3;
const ENEMY_COLS = 6;
let enemyDirection = 1;

function preload() {
    playerImg = loadImage('assets/images/homeIcon.png');
    enemyImg = loadImage('assets/images/Bug.png');
}

function setup() {
    createCanvas(640, 480);
    imageMode(CENTER);
    // Initialize enemies in a grid formation
    for (let row = 0; row < ENEMY_ROWS; row++) {
        for (let col = 0; col < ENEMY_COLS; col++) {
            enemies.push({
                x: col * 80 + 100,
                y: row * 60 + 50,
                width: 40,
                height: 30,
                alive: true
            });
        }
    }
}

function draw() {
    background("black");
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
    // Draw and move player
    image(playerImg, player.x + player.width / 2, player.y + player.height / 2,
        player.width, player.height);

    if (keyIsDown(LEFT_ARROW) && player.x > 0) {
        player.x -= player.speed;
    }
    if (keyIsDown(RIGHT_ARROW) && player.x < width - player.width) {
        player.x += player.speed;
    }

    // Handle continuous shooting with cooldown
    if (player.cooldown > 0) {
        player.cooldown--;
    }
    if (keyIsDown(32) && !bullet.active && player.cooldown === 0) {
        bullet.active = true;
        bullet.x = player.x + player.width / 2 - bullet.width / 2;
        bullet.y = player.y;
        player.cooldown = 15;
    }

    // Draw and move bullet
    if (bullet.active) {
        fill(255);
        rect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed;

        if (bullet.y < 0) {
            bullet.active = false;
        }
    }

    // Move and draw enemies
    let moveDown = false;
    let enemiesAlive = false;

    enemies.forEach(enemy => {
        if (enemy.alive) {
            enemiesAlive = true;
            if ((enemy.x + enemy.width > width && enemyDirection > 0) ||
                (enemy.x < 0 && enemyDirection < 0)) {
                moveDown = true;
            }
        }
    });

    enemies.forEach(enemy => {
        if (enemy.alive) {
            if (moveDown) {
                enemy.y += 20;
            }
            enemy.x += enemyDirection * 2;

            image(enemyImg, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2,
                enemy.width, enemy.height);

            if (bullet.active && collision(bullet, enemy)) {
                enemy.alive = false;
                bullet.active = false;
            }

            if (enemy.y + enemy.height > player.y) {
                gameState = GAME_OVER;
            }
        }
    });

    if (moveDown) {
        enemyDirection *= -1;
    }

    if (!enemiesAlive) {
        gameState = GAME_WON;
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
                    'The Bugs Have Escaped...',
                    'Houston Will Forever Yearn for His Lost Nourishment...'
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
    let nextPageLink = createA('yesBoss1.html', 'Continue');
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
        strings: ['Houston Has Eaten All the Bugs!'],
        typeSpeed: 20,
        showCursor: false,
        onComplete: () => {
            nextPageLink.style('display', 'block');
        }
    });
}

function collision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
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

    // Reset player
    player.x = 320;
    player.y = 430;
    player.cooldown = 0;

    // Reset bullet
    bullet.active = false;

    // Reset enemies
    enemies = [];
    for (let row = 0; row < ENEMY_ROWS; row++) {
        for (let col = 0; col < ENEMY_COLS; col++) {
            enemies.push({
                x: col * 80 + 100,
                y: row * 60 + 50,
                width: 40,
                height: 30,
                alive: true
            });
        }
    }

    // Reset enemy direction
    enemyDirection = 1;

    // Remove any existing UI elements
    removeElements();
}