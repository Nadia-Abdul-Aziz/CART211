let player, boss;
let playerBullets = [];
let bossBullets = [];
let mine;
let playerHealth = 100;
let bossHealth = 100;
let gameState = 'playing';
let gameOverInitialized = false;
let gameWonInitialized = false;

let playerImg;
let bossImg;

function preload() {
    playerImg = loadImage('assets/images/homeIcon.png');
    bossImg = loadImage('assets/images/Bug.png');
}

function setup() {
    createCanvas(640, 480);
    player = {
        x: width / 2,
        y: height - 50,
        size: 100
    };
    boss = {
        x: width / 2,
        y: 100,
        size: 400
    };
    // Initialize single mine
    spawnMine();
}

function draw() {
    background(0);
    drawBorder();

    switch (gameState) {
        case 'playing':
            updateGame();
            break;
        case 'lose':
            if (!gameOverInitialized) {
                initializeGameOver();
                gameOverInitialized = true;
            }
            break;
        case 'win':
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
    // Move player
    if (keyIsDown(LEFT_ARROW)) player.x -= 10;
    if (keyIsDown(RIGHT_ARROW)) player.x += 10;
    player.x = constrain(player.x, player.size / 2, width - player.size / 2);

    // Update and draw mine
    updateMine();
    drawMine();
    checkMineCollision();

    // Draw player
    push();
    translate(player.x, player.y);
    rotate(PI);
    imageMode(CENTER);
    image(playerImg, 0, 0, player.size, player.size);
    pop();

    // Draw boss
    push();
    translate(boss.x, boss.y);
    rotate(PI);
    imageMode(CENTER);
    image(bossImg, 0, 30, boss.size, boss.size);
    pop();

    // Draw vertical health bars
    drawVerticalHealthBars();

    // Update and draw player bullets
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        playerBullets[i].y -= 20;
        fill(255);
        ellipse(playerBullets[i].x, playerBullets[i].y, 10, 10);

        // Check for collision with boss
        if (dist(playerBullets[i].x, playerBullets[i].y, boss.x, boss.y) < boss.size / 2) {
            bossHealth -= 5;
            playerBullets.splice(i, 1);
            continue;
        }

        // Remove bullets that go off screen
        if (playerBullets[i] && playerBullets[i].y < 0) {
            playerBullets.splice(i, 1);
        }
    }

    // Boss shoots randomly
    if (random() < 0.03) { // 3% chance every frame
        let bulletX = random(boss.x - boss.size / 6, boss.x + boss.size / 6);
        bossBullets.push({ x: bulletX, y: boss.y + boss.size / 4 });
    }

    // Update and draw boss bullets
    for (let i = bossBullets.length - 1; i >= 0; i--) {
        bossBullets[i].y += 7;
        fill(255);
        ellipse(bossBullets[i].x, bossBullets[i].y, 10, 10);

        // Check for collision with player
        if (dist(bossBullets[i].x, bossBullets[i].y, player.x, player.y) < player.size / 2) {
            playerHealth -= 10;
            bossBullets.splice(i, 1);
        }

        // Remove bullets that go off screen
        if (bossBullets[i] && bossBullets[i].y > height) {
            bossBullets.splice(i, 1);
        }
    }

    // Check for game over
    if (playerHealth <= 0) {
        gameState = 'lose';
    } else if (bossHealth <= 0) {
        gameState = 'win';
    }
}

function spawnMine() {
    mine = {
        x: random(width),
        y: 0,
        size: 10,
        speed: random(4, 8), // Increased speed range
        collisionRadius: 20
    };
}

function updateMine() {
    mine.y += mine.speed;
    if (mine.y > height) {
        spawnMine();
    }
}

function drawMine() {
    push();
    noStroke();
    fill("red");
    ellipse(mine.x, mine.y, mine.size);
    pop();
}

function checkMineCollision() {
    // Calculate the distance between the mine and the player
    const distance = dist(mine.x, mine.y, player.x, player.y);

    // Check if the distance is less than the collision threshold
    if (distance < mine.collisionRadius + player.size / 2) {
        gameState = 'lose';
    }
}

function drawVerticalHealthBars() {
    push();
    textFont('Courier New');
    textSize(14);
    textAlign(CENTER, TOP);

    // Boss health bar (top left corner)
    stroke(255);
    strokeWeight(1);
    noFill();
    rect(20, 20, 16, 120);  // Border
    fill(0);
    noStroke();
    rect(21, 21, 14, 118);  // Black background
    fill(255);
    rect(21, 21 + map(bossHealth, 100, 0, 0, 118), 14, map(bossHealth, 0, 100, 0, 118));  // White health
    // Number
    noStroke();
    fill(255);
    text(bossHealth, 28, 145);  // Placed below the bar

    // Player health bar (bottom right corner)
    stroke(255);
    strokeWeight(1);
    noFill();
    rect(width - 36, height - 140, 16, 120);  // Border
    fill(0);
    noStroke();
    rect(width - 35, height - 139, 14, 118);  // Black background
    fill(255);
    rect(width - 35, height - 139 + map(playerHealth, 100, 0, 0, 118), 14, map(playerHealth, 0, 100, 0, 118));  // White health
    // Number
    noStroke();
    fill(255);
    text(playerHealth, width - 28, height - 160);  // Placed above the bar

    pop();
}

function keyPressed() {
    if (key === ' ') {
        if (gameState === 'playing') {
            playerBullets.push({ x: player.x, y: player.y - player.size / 2 });
        } else if (gameState === 'lose') {
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

    // CSS ANIMATION !!!!
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
    player = {
        x: width / 2,
        y: height - 50,
        size: 100
    };
    boss = {
        x: width / 2,
        y: 100,
        size: 400
    };
    // Reset mine
    spawnMine();
    playerHealth = 100;
    bossHealth = 100;
    playerBullets = [];
    bossBullets = [];
    gameState = 'playing';
    gameOverInitialized = false;
    gameWonInitialized = false;
}