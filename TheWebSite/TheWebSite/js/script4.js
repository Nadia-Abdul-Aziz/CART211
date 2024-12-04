

/**
 * Web invaders
 * 
 * When the bugs invade houston's web
 * 
 * Made with p5.js
 * https://p5js.org/
 */

// image variables
let playerImg;
let enemyImg;

// Game states
const GAME_PLAYING = 'playing';
const GAME_OVER = 'game over';
const GAME_WON = 'game won';

// Track the current state of the game, initially set to playing
let gameState = GAME_PLAYING;

//Variables for managing typed text animations
let typed;
let gameOverInitialized = false;
let gameWonInitialized = false;

//Houston
let player = {
    x: 320,
    y: 430,
    width: 100,
    height: 70,
    speed: 5,
    cooldown: 0       // Cooldown timer between shots
};

// Bullet
let bullet = {
    x: 0,
    y: 0,
    width: 4,
    height: 10,
    active: false,
    speed: 7
};

// Array to store enemy objects
let enemies = [];
const ENEMY_ROWS = 3;     // Number of rows of enemies
const ENEMY_COLS = 6;     // Number of columns of enemies
let enemyDirection = 1;   // Direction of enemy movement (1 for right, -1 for left)


function preload() {
    // Load player and enemy images
    playerImg = loadImage('assets/images/homeIcon.png');
    enemyImg = loadImage('assets/images/Bug.png');
}


function setup() {
    createCanvas(640, 480);
    imageMode(CENTER);
    // Initialize enemies in a grid formation
    //USED CLAUDE TO LEARN ++ METHOD!!
    for (let row = 0; row < ENEMY_ROWS; row++) {
        for (let col = 0; col < ENEMY_COLS; col++) {
            enemies.push({
                x: col * 80 + 100,     // Horizontal spacing
                y: row * 60 + 50,      // Vertical spacing
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
    // Use a switch statement to handle different game states
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
    push();

    // Translate and rotate the player image to face upwards
    translate(player.x + player.width / 2, player.y + player.height / 2);
    rotate(PI);

    // Draw the player image
    image(playerImg, 0, 0, player.width, player.height);
    pop();

    // Handle player movement left and right
    if (keyIsDown(LEFT_ARROW) && player.x > 0) {
        player.x -= player.speed;
    }
    if (keyIsDown(RIGHT_ARROW) && player.x < width - player.width) {
        player.x += player.speed;
    }

    // Manage bullet shooting cooldown
    if (player.cooldown > 0) {
        player.cooldown--; //player can only shoot once it reaches zero, decrement
    }

    // Create a new bullet when spacebar is pressed
    if (keyIsDown(32) && !bullet.active && player.cooldown === 0) {
        bullet.active = true;
        bullet.x = player.x + player.width / 2 - bullet.width / 2;
        bullet.y = player.y;
        player.cooldown = 15;  // Set cooldown between shots
    }

    // Draw and move bullet
    if (bullet.active) {
        fill(255);
        rect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed;  // Move bullet upwards

        // Deactivate bullet if it goes off screen
        if (bullet.y < 0) {
            bullet.active = false;
        }
    }

    // Enemy movement and collision detection
    let moveDown = false;
    let enemiesAlive = false;

    // Check if enemies need to change direction
    // CLAUDE USED!! not entirely sure what forEach does?? it works?
    enemies.forEach(enemy => {
        if (enemy.alive) {
            enemiesAlive = true;
            // Check if enemies have hit screen boundaries
            if ((enemy.x + enemy.width > width && enemyDirection > 0) ||
                (enemy.x < 0 && enemyDirection < 0)) {
                moveDown = true;
            }
        }
    });

    //Update enemy positions and check for collisions
    enemies.forEach(enemy => {
        if (enemy.alive) {
            // Move enemies down if they hit screen edge
            if (moveDown) {
                enemy.y += 20;
            }
            // Move enemies horizontally
            enemy.x += enemyDirection * 2;

            // Draw enemy
            image(enemyImg, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2,
                enemy.width, enemy.height);

            // Check for bullet collision with enemy
            if (bullet.active && collision(bullet, enemy)) {
                enemy.alive = false;
                bullet.active = false;
            }

            // Check if enemies have reached the player's line
            if (enemy.y + enemy.height > player.y) {
                gameState = GAME_OVER;
            }
        }
    });

    // Change enemy direction if they hit screen edges
    if (moveDown) {
        enemyDirection *= -1;
    }

    // Check if all enemies are defeated
    if (!enemiesAlive) {
        gameState = GAME_WON;
    }
}

// Initialize the game over screen with typed text
//COPIED AND PASTED INTO ALL GAMES
function initializeGameOver() {
    // Create a full-screen div for game over screen
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

    // Create title div for game over
    let gameOverTitle = createDiv('');
    gameOverTitle.parent(gameOverElement);
    gameOverTitle.style('font-size', '40px');
    gameOverTitle.style('margin-bottom', '20px');

    // Create div for additional text
    let typedElement = createDiv('');
    typedElement.parent(gameOverElement);
    typedElement.style('width', '300px');
    typedElement.style('font-size', '16px');

    // Create div for restart prompt
    let restartPrompt = createDiv('');
    restartPrompt.parent(gameOverElement);
    restartPrompt.style('font-size', '20px');
    restartPrompt.style('margin-top', '20px');

    // Use Typed.js to create typing animation for game over screen
    new Typed(gameOverTitle.elt, {
        strings: ['GAME OVER'],
        typeSpeed: 40,
        showCursor: false,
        onComplete: () => {
            new Typed(typedElement.elt, {
                strings: [
                    'The Bugs Have Made it Through...',
                    'Houston Will Forever Yearn for His Lost Web...'
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

// Initialize the game won screen with typed text and continue button
function initializeGameWon() {
    // Create a full-screen div for game won screen
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

    // Create title div for game won screen
    let gameWonTitle = createDiv('');
    gameWonTitle.parent(gameWonElement);
    gameWonTitle.style('font-size', '20px');
    gameWonTitle.style('margin-bottom', '20px');

    // Create a link to continue to the next page
    let nextPageLink = createA('yesBoss2.html', 'Continue');
    nextPageLink.parent(gameWonElement);
    nextPageLink.style('font-size', '20px');
    nextPageLink.style('font-family', 'Courier New');
    nextPageLink.style('margin-top', '20px');
    nextPageLink.style('padding', '10px 20px');
    nextPageLink.style('cursor', 'pointer');
    nextPageLink.style('background-color', 'white');
    nextPageLink.style('color', 'black');
    nextPageLink.style('text-decoration', 'none');
    nextPageLink.style('display', 'none'); // Initially hidden

    // Use Typed.js to create typing animation for game won screen
    new Typed(gameWonTitle.elt, {
        strings: ['Houston Has Stopped The Bugs!'],
        typeSpeed: 20,
        showCursor: false,
        onComplete: () => {
            // Show continue link after typing completes
            nextPageLink.style('display', 'block');
        }
    });
}

// Check collision between two rectangles
function collision(rect1, rect2) {
    // Detect if rectangles overlap on x and y axes
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
}

// Handle key press events for game restart
function keyPressed() {
    // Restart game when spacebar is pressed during game over state
    if (keyCode === 32 && gameState === GAME_OVER) {
        resetGame();
    }
}

// Reset the game to its initial state
function resetGame() {
    // Reset game state
    gameState = GAME_PLAYING;
    gameOverInitialized = false;
    gameWonInitialized = false;

    // Reset player position and cooldown
    player.x = 320;
    player.y = 430;
    player.cooldown = 0;

    // Reset bullet
    bullet.active = false;

    // Recreate enemy grid
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

    // Reset enemy movement direction
    enemyDirection = 1;

    // Remove any existing UI elements from previous game state
    removeElements();
}