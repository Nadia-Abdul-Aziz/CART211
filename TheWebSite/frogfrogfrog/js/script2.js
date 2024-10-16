let player, boss;
let playerBullets = [];
let bossBullets = [];
let playerHealth = 100;
let bossHealth = 100;
let gameState = 'playing';
let gameOverInitialized = false;
let gameWonInitialized = false;

function setup() {
    createCanvas(640, 480);
    player = {
        x: width / 2,
        y: height - 50,
        size: 50
    };
    boss = {
        x: width / 2,
        y: 100,
        size: 100
    };
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

    // Draw player
    push();
    translate(player.x, player.y);
    rotate(PI);
    imageMode(CENTER);
    fill(0, 255, 0);
    triangle(0, -player.size / 2, -player.size / 2, player.size / 2, player.size / 2, player.size / 2);
    pop();

    // Draw boss
    fill(255, 0, 0);
    ellipse(boss.x, boss.y, boss.size);

    // Update and draw player bullets
    for (let i = playerBullets.length - 1; i >= 0; i--) {
        playerBullets[i].y -= 20;
        fill(255);
        ellipse(playerBullets[i].x, playerBullets[i].y, 10, 10);

        // Check for collision with boss
        if (dist(playerBullets[i].x, playerBullets[i].y, boss.x, boss.y) < boss.size / 2) {
            bossHealth -= 5;
            playerBullets.splice(i, 1);
        }

        // Remove bullets that go off screen
        if (playerBullets[i] && playerBullets[i].y < 0) {
            playerBullets.splice(i, 1);
        }
    }

    // Boss shoots every 60 frames
    if (frameCount % 60 === 0) {
        bossBullets.push({ x: boss.x, y: boss.y });
    }

    // Update and draw boss bullets
    for (let i = bossBullets.length - 1; i >= 0; i--) {
        bossBullets[i].y += 7;
        fill(255, 0, 0);
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

    // Display health
    textFont('Courier New');
    textSize(20);
    fill(255);
    text(`Player Health: ${playerHealth}`, 10, 30);
    text(`Boss Health: ${bossHealth}`, 10, 60);

    // Check for game over
    if (playerHealth <= 0) {
        gameState = 'lose';
    } else if (bossHealth <= 0) {
        gameState = 'win';
    }
}

function keyPressed() {
    if (key === ' ' && gameState === 'playing') {
        playerBullets.push({ x: player.x, y: player.y - player.size / 2 });
    }
    if (key === 'r' && (gameState === 'lose' || gameState === 'win')) {
        resetGame();
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
                    'the boss has defeated you...',
                    'the bugs will overrun the world...'
                ],
                typeSpeed: 40,
                backSpeed: 30,
                backDelay: 1000,
                startDelay: 500,
                showCursor: false,
                onComplete: () => {
                    new Typed(restartPrompt.elt, {
                        strings: ['Press R to restart'],
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

    let gameWonTitle = createDiv('');
    gameWonTitle.parent(gameWonElement);
    gameWonTitle.style('font-size', '20px');
    gameWonTitle.style('margin-bottom', '20px');

    let playAgainButton = createButton('Continue');
    playAgainButton.parent(gameWonElement);
    playAgainButton.style('font-size', '20px');
    playAgainButton.style('font-family', 'Courier New');
    playAgainButton.style('margin-top', '20px');
    playAgainButton.style('padding', '10px 20px');
    playAgainButton.style('cursor', 'pointer');
    playAgainButton.mousePressed(resetGame);

    new Typed(gameWonTitle.elt, {
        strings: ['YOU HAVE DEFEATED THE BOSS BUG!'],
        typeSpeed: 20,
        showCursor: false,
        onComplete: () => {
            playAgainButton.style('display', 'block');
        }
    });
}

function resetGame() {
    removeElements();
    player = {
        x: width / 2,
        y: height - 50,
        size: 50
    };
    boss = {
        x: width / 2,
        y: 100,
        size: 100
    };
    playerHealth = 100;
    bossHealth = 100;
    playerBullets = [];
    bossBullets = [];
    gameState = 'playing';
    gameOverInitialized = false;
    gameWonInitialized = false;
}