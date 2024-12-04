/**
 * Houston's Bug Adventure
 * 
 * A game of catching bugs with his web
 * 
 * Instructions:
 * - Move Houston with left and right arrow keys
 * - Press spacebar to launch the web
 * - Catch bugs
 * - Once you reach a certain speed, you must face the final bug boss
 * 
 * Made with p5.js
 * https://p5js.org/
 */
"use strict";
// Variables for images
let bugImg;
let houstonImg;
let webImg;
let mineImg;

// Game states
const GAME_PLAYING = 'playing';
const GAME_OVER = 'game over';
const BOSS_FIGHT = 'boss fight';

// Current game state
let gameState = GAME_PLAYING;

// For typed.js
let typed;
let gameOverInitialized = false;
let gameWonInitialized = false;

// Houston
const spider = {
    body: {
        x: 320,
        y: 490,
        size: 150,
        speed: 10
    },
    web: {
        x: undefined,
        y: 480,
        size: 1,
        tipSize: 100,
        speed: 20,
        state: "idle"
    }
};

// Bugs
const bug = {
    x: 0,
    y: 200,
    size: 50,
    speed: 1,
    yRange: 100,
};

// Mine
const mine = {
    x: 0,
    y: 200,
    size: 10,
    speed: 7,
    collisionRadius: 30
};

//Load images
function preload() {
    bugImg = loadImage('assets/images/Bug.png');
    houstonImg = loadImage('assets/images/homeIcon.png');
    webImg = loadImage('assets/images/webShoot.png');
    mineImg = loadImage('assets/images/mine.png');
}

function setup() {
    createCanvas(640, 480);
    resetBug();
    resetMine();
    resetWeb();

}

//Contains the switch statement for all states
function draw() {
    background("black");
    drawBorder();

    switch (gameState) {
        case GAME_PLAYING:
            moveBug();
            moveMine();
            drawBug();
            drawMine();
            moveSpider();
            moveWeb();
            drawSpider();
            checkWebBugOverlap();
            checkWebMineOverlap();
            checkLoss();
            break;
        case GAME_OVER:
            if (!gameOverInitialized) {
                initializeGameOver();
                gameOverInitialized = true;
            }
            break;
        case BOSS_FIGHT:
            if (!gameWonInitialized) {
                initializeGameWon();
                gameWonInitialized = true;
            }
            drawSpider();
            break;
    }
}

//That white square 
function drawBorder() {
    push();
    noFill();
    stroke(255);
    strokeWeight(5);
    rect(0, 0, width, height);
    pop();
}

// mine movement
function moveMine() {
    mine.x += mine.speed;
    if (mine.x > width) {
        resetMine();
    }
}

//Image for the mine
function drawMine() {
    imageMode(CENTER);
    image(mineImg, mine.x, mine.y, mine.size * 2, mine.size * 2);
}

//starting point of any given new mine
function resetMine() {
    mine.x = 0;
    mine.y = random(0, 300);
}

function checkWebMineOverlap() {
    // Calculate the distance between the web and the mine
    const distance = dist(spider.web.x, spider.web.y, mine.x, mine.y);

    // Defining a collision threshold
    const collisionThreshold = (spider.web.size + mine.collisionRadius) / 2;

    // Check if the distance is less than the collision threshold, if yes, trigger the ganme over state
    if (distance < collisionThreshold) {
        gameState = GAME_OVER;
    }
}

// Move the bugs across the screen
function moveBug() {
    bug.x += bug.speed;
    bug.y += random(-10, 10);
    const startY = bug.y;
    bug.y = constrain(bug.y, startY - bug.yRange, startY + bug.yRange);
}

//image
function drawBug() {
    image(bugImg, bug.x, bug.y, bug.size, bug.size);
}

//Once you reach a certain speed, trigger the boss fight stream
//starting point of any given new bug
function resetBug() {
    if (bug.speed >= 7) {
        gameState = BOSS_FIGHT;
    }
    bug.x = 0;
    bug.y = random(bug.yRange, height - bug.yRange);
    bug.speed += 0.5;
}

//Press keys to move
function moveSpider() {
    if (keyIsDown(LEFT_ARROW)) {
        spider.body.x -= spider.body.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        spider.body.x += spider.body.speed;
    }
    spider.body.x = constrain(spider.body.x, 0, width);
}

//Determining web states
function moveWeb() {
    spider.web.x = spider.body.x;
    if (spider.web.state === "idle") {
    } else if (spider.web.state === "outbound") {
        spider.web.y += -spider.web.speed;
        if (spider.web.y <= 0) {
            spider.web.state = "inbound";
        }
    } else if (spider.web.state === "inbound") {
        spider.web.y += spider.web.speed;
        if (spider.web.y >= height) {
            spider.web.state = "idle";
        }
    }
}

//Position of the web when the player restarts the game
function resetWeb() {
    spider.web.x = spider.body.x;
    spider.web.y = spider.body.y;
    spider.web.state = "idle";
}

//The actual image for houston, the line for his web and the image for the web
function drawSpider() {
    push();
    stroke("white");
    strokeWeight(spider.web.size);
    line(spider.web.x, spider.web.y, spider.body.x, spider.body.y);
    pop();

    imageMode(CENTER);
    image(webImg, spider.web.x, spider.web.y, spider.web.tipSize, spider.web.tipSize);

    push();
    translate(spider.body.x, spider.body.y);
    rotate(PI);
    imageMode(CENTER);
    image(houstonImg, 0, 0, spider.body.size, spider.body.size);
    pop();
}

//if the bug is within the bounds of the web, the bug is caught and set the web to inbound
function checkWebBugOverlap() {
    const d = dist(spider.web.x, spider.web.y, bug.x, bug.y);
    const caught = (d < spider.web.size / 2 + bug.size / 2);
    if (caught) {
        resetBug();
        spider.web.state = "inbound";
    }
}

//To shoot the web
function keyPressed() {
    if (keyCode === 32) { // 32 is the keyCode for spacebar
        if (gameState === GAME_PLAYING && spider.web.state === "idle") {
            spider.web.state = "outbound";
        } else if (gameState === GAME_OVER) {
            resetGame();
        }
    }
}

//If a bug escapes, automatically trigger a game over
function checkLoss() {
    if (bug.x >= width) {
        gameState = GAME_OVER;
    }
}

//Ending screens
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

    //TYPED JS!!
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
    playAgainButton.mousePressed(() => {
        window.location.href = 'Boss1.html'; // Load the boss HTML file
    });

    new Typed(gameWonTitle.elt, {
        strings: ['Houston Has Eaten All the Tiny Critters!'],
        typeSpeed: 20,
        showCursor: false,
        onComplete: () => {
            playAgainButton.style('display', 'block');
        }
    });
}

function resetGameOver() {
    if (typed) {
        typed.destroy();
    }
    gameOverInitialized = false;
    removeElements();
}

function resetGameWon() {
    if (typed) {
        typed.destroy();
    }
    gameWonInitialized = false;
    removeElements();
}

function resetGame() {
    resetGameOver();
    resetGameWon();
    gameState = GAME_PLAYING;
    bug.speed = 1;
    resetBug();
    resetMine();
    reserWeb();
}