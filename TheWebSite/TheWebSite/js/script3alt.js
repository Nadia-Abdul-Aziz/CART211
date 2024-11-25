/**
 * SpiderSpiderSpider
 * 
 * Nadia Abdul Aziz
 * 
 * A multiplayer game where you collect power to eat bugs, then get bigger than your opponent to eventually eat them. 
 * Based on the original code of FrogFrogFrog, and inspired by my website being created for CART211
 * 
 * Instructions & explanation (SEE IDEA DOCUMENT FOR MORE DETAILS):
 * - Each player begins with 2 default power tokens
 * - Tokens are used to power the spider's web, the more tokens you have, the farther your web will go.
 * - Collect yellow power tokens with your web
 * - Player 1 controls = arrow keys + up key
 * - Player 2 controls = A/D + S
 * - Spider itself does not move, only rotate 
 * - Power bank maximum is 10, 10 tokens are needed to reach the end of the canvas, and synonymously to eat your opponent. 
 * - Catch bugs with your web to grow in size
 * - Each bug eaten results in a growth value of 10
 * - Depending on the distance of the bug from your spider, the corresponding amount of power tokens will be substracted
 * - Having zero tokens left results in an automatic loss
 * - Regardless of your opponent's size, you must be double their size to eat them (with the exception of an opponent at no growth, in which case you must be at 10)
 * - To win you must be able to both reach your opponent, and be double their size. 
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

//Defining variables for images
let houstonImg;
let webImg;
let bugImg

//Loading assets
function preload() {
    houstonImg = loadImage('assets/images/homeIcon.png');
    webImg = loadImage('assets/images/webShoot.png');
    bugImg = loadImage('assets/images/Bug.png');
}

//For end screens
let gameOverInitialized = false;
let gameWonInitialized = false;
let typed;

//Game States
const gamePlaying = 'playing';
const gameWon = 'game won'

//Default state, starts on the title screen
let gameState = gamePlaying;

//Variable to insert reason for player 1 or 2 winning in win screen.
let winReason = '';

// Array to store bugs
let bugs = [];

// Array to store power tokens
let powerTokens = [];

// Time variables for bug spawn
let lastSpawnTime = 0;
const spawnInterval = 3000 //5 seconds

// Variables for size counter
let player1Size = 0;
let player2Size = 0;

//Each start with 2 tokens
let player1Tokens = 2;
let player2Tokens = 2;

//Maximum that can be stored in the bank
const maxTokens = 10;

//Amount needed to win
const winTokens = 10;

//Object for keyboard rotation (Both players)
let move = {
    leftKeyActive: false,
    rightKeyActive: false,
    aKeyActive: false,
    dKeyActive: false,
}

//Start & play again button object
let button = {
    width: 100,
    height: 40,
}

// Spiders
let player1 = {
    // Main body the player controls
    body: {
        x: 320,
        y: 480,
        size: 150, //Starting size
        rotation: 0, //DEFAULT VALUE, no rotation
        growthAmount: 0 //Amount of growth gained (to show on visual counter)
    },

    //Web the spider shoots to catch bugs
    web: {
        x: 320,
        y: 480,
        size: 1,
        tipSize: 75, //Different size for the tip to increase surface area
        speed: 20,
        state: "idle", //DEFAULT VALUE
        distance: 0, //distance from origin spider NEEDED FOR THE TRIG CALCULATIONS
        maxDistance: 0 //For power token distance calculation
    }
};

//Same as player1
let player2 = {
    body: {
        x: 320,
        y: 0,
        size: 150,
        rotation: 0,
        growthAmount: 0
    },
    web: {
        x: 320,
        y: 0,
        size: 1,
        tipSize: 75,
        speed: 20,
        state: "idle",
        distance: 0,
        maxDistance: 0
    }
};

//Making the bug
// Had to be up here, else it wouldn't run
function createBug(speed, directionChance) {
    const bug = {
        // Position (random start from left side)
        x: 0,
        y: random(height),
        // Size
        size: 50,
        // Movement properties
        speed: speed,
        changeDirectionChance: directionChance,
        // Random starting angle (dynamic)
        moveAngle: random(-45, 45),
        // Default range
    };
    return bug;
}

// Creates the canvas and initializes the bugs/tokens and sets angle mode

function setup() {
    createCanvas(640, 480);
    angleMode(DEGREES);
    // Creates the first bug and adds it to the bug array
    // 5 = speed of the bug
    // 0.05 = 5% chance to change direction each frame
    bugs.push(createBug(5, 0.05));
    //Creates the first power token and adds it to the array
    powerTokens.push(createPowerToken());
}

//Contains the switch statement for all game states 
function draw() {
    background('black');
    // Always draw the border regardless of game state
    drawBorder();

    switch (gameState) {
        case gamePlaying:
            newSpawn();
            drawBug();
            drawPowerTokens();
            drawPlayer1();
            drawPlayer2();
            moveSpider();
            moveWeb();
            displayStats();
            managePowerTokens();
            checkWebPowerTokenCollisions();
            checkAllWebBugOverlaps();
            checkWinCondition();
            break;
        case gameWon:
            if (!gameWonInitialized) {
                initializeGameWon();
                gameWonInitialized = true;
            }
            break;
    }
}

//Screen that opens when a win condition is met, gives the option to play again.
//Again, all internal push/pops removed
function drawGameWonScreen() {
    textAlign(CENTER, CENTER);

    push();

    // Display win
    fill('white');
    textStyle(BOLD);
    textSize(24);
    //Shows specific reasoning for win/loss
    text(winReason, width / 2, height / 2 - 40);

    // restart button
    fill('white');
    rectMode(CENTER);
    rect(width / 2, height / 2 + 40, button.width, button.height);

    // Button text
    fill('black');
    textSize(14);
    text('Restart', width / 2, height / 2 + 40);

    pop();
}

//Runs when the player starts the game for the second time
function resetGame() {

    // Reset players
    player1.body.growthAmount = 0;
    player2.body.growthAmount = 0;
    player1.body.rotation = 0;
    player2.body.rotation = 0;
    player1.web.state = "idle";
    player2.web.state = "idle";

    // Reset tokens back to original value
    player1Tokens = 2;
    player2Tokens = 2;

    // Clear arrays
    bugs = [];
    powerTokens = [];

    // Erase game won data, not sure if it's necessary but...just in case.
    winReason = '';

    // Adds initial bug and power token to the canvas when the game starts
    bugs.push(createBug(5, 0.05));
    powerTokens.push(createPowerToken());
}

//Just a cool little border for the canvas, nothing more
function drawBorder() {
    push();
    noFill();
    stroke('white');
    strokeWeight(5);
    rect(0, 0, width, height);
    pop();
}

//Deals with the keyboard and player input
function keyPressed() {

    //Spacebar to change states (Title - playing, Won - playing)
    if (keyCode === 32) {
        if (gameState === gameTitle) {
            resetGame();
            gameState = gamePlaying;
        }
        else if (gameState === gameWon) {
            resetGame();
            gameState = gamePlaying;
        }
    }

    //Rotation controls for Player 1, left & right arrow
    if (keyCode === LEFT_ARROW) {
        move.leftKeyActive = true;
    }
    else if (keyCode === RIGHT_ARROW) {
        move.rightKeyActive = true;
    }
    //Rotation controls for Player 2, A & D
    if (keyCode === 68) {  // D key
        move.aKeyActive = true;
    }
    else if (keyCode === 65) {  // A key
        move.dKeyActive = true;
    }

    //Web controls of Player 1, up arrow
    if (keyCode === UP_ARROW) {
        if (player1.web.state === "idle" && player1Tokens > 0) {
            player1.web.state = "outbound";
            player1.web.distance = 0; //for now, see Move Web for token influence on the web
        }
    }
    //Web controls for player 2, S key
    if (keyCode === 83) { // S key
        if (player2.web.state === "idle" && player2Tokens > 0) {
            player2.web.state = "outbound";
            player2.web.distance = 0;
        }
    }
}

//User input when they let go of the keys, rotation stops
//Web inbound is not dependent on user input!! That is not in this function.
function keyReleased() {

    //Player 1
    if (keyCode === LEFT_ARROW) {
        move.leftKeyActive = false;
    }
    else if (keyCode === RIGHT_ARROW) {
        move.rightKeyActive = false;
    }

    //Player 2
    if (keyCode === 68) {  // D key
        move.aKeyActive = false;
    }
    else if (keyCode === 65) {  // A key
        move.dKeyActive = false;
    }
}

//Rotation mechanism
//Spider rotates by 1 pixel when the arrows are pressed, constrained to a maximum of 40 pixels on either side
function moveSpider() {

    //Player 1
    if (move.leftKeyActive) {
        player1.body.rotation = constrain(player1.body.rotation - 1, -40, 40);
    }
    if (move.rightKeyActive) {
        player1.body.rotation = constrain(player1.body.rotation + 1, -40, 40);
    }

    //Player 2
    if (move.aKeyActive) {
        player2.body.rotation = constrain(player2.body.rotation - 1, -40, 40);
    }
    if (move.dKeyActive) {
        player2.body.rotation = constrain(player2.body.rotation + 1, -40, 40);
    }
}

// creating token properties
//So I've discovered that I don't need external variables and this is so much faster for returns.
function createPowerToken() {
    return {
        x: 0,
        y: random(50, 430), // generation limits, minimum distance of 1 token (50px) needed to well...catch tokens...don't run out.
        size: 15,
        speed: 7,
        value: 1 // power tokens given when collected, updates counter
    };
}

// Drawing the power token, appearance
//For...of loop adds the tokens to the array
function drawPowerTokens() {
    for (let token of powerTokens) {
        push();
        noStroke();
        fill("yellow");
        ellipse(token.x, token.y, token.size);
        fill("black");
        textSize(10);
        textAlign(CENTER, CENTER);
        text("+", token.x, token.y); //Plus symbol in the middle, for funsies
        pop();
    }
}

//Divides distance traveled by the spider's web by 50 (50 pixels = 1 token), uses math.ceil to round up and returns the amount of tokens used, reduces from counter
function calculateTokenCost(distance) {
    return Math.ceil(distance / 50); //Math function I discovered, it works??
}

// power token spawn logic
// Checked a few tutorials because this was hard
function managePowerTokens() {

    // Loop through the array backwards to remove elements
    for (let i = powerTokens.length - 1; i >= 0; i--) {
        let token = powerTokens[i];

        //Move the token
        token.x += token.speed;

        //Generate new token once initial one reaches half the canvas
        if (token.x >= width / 2 && powerTokens.length === 1) {
            powerTokens.push(createPowerToken());
        }

        // remove tokens off screen
        if (token.x > width) {
            powerTokens.splice(i, 1);
        }
    }
    //If all tokens on screen are somehow eaten, push a new one into the array
    if (powerTokens.length === 0) {
        powerTokens.push(createPowerToken());
    }
}

// Checks if the spider's web touched the power tokens
// Used some tutorials again
function checkWebPowerTokenCollisions() {

    //Removing items
    for (let i = powerTokens.length - 1; i >= 0; i--) {
        //Getting current token to check
        let token = powerTokens[i];

        // Check collision with player 1's web
        //Finding the distance between the two points
        const distance1 = dist(player1.web.x, player1.web.y, token.x, token.y);
        //collision detected if the distance is half of the sum of the two 
        if (distance1 < (player1.web.tipSize + token.size) / 2) {
            //Increase player tokens
            player1Tokens = Math.min(maxTokens, player1Tokens + token.value);
            //removing collected token from screen
            powerTokens.splice(i, 1);
            //resetting web to come back to the spider
            player1.web.state = "inbound";
            continue;

        }

        // Check collision with player 2's web, same thing
        const distance2 = dist(player2.web.x, player2.web.y, token.x, token.y);
        if (distance2 < (player2.web.tipSize + token.size) / 2) {
            player2Tokens = Math.min(maxTokens, player2Tokens + token.value);
            powerTokens.splice(i, 1);
            player2.web.state = "inbound";
        }
    }
}


//Visually drawing each player's spider
function drawPlayer1() {

    //Web string
    push();
    stroke("white");
    strokeWeight(player1.web.size);
    line(player1.web.x, player1.web.y, player1.body.x, player1.body.y);
    pop();

    //Web tip
    imageMode(CENTER);
    image(webImg, player1.web.x, player1.web.y, player1.web.tipSize, player1.web.tipSize);

    //Spider body
    push();
    imageMode(CENTER);
    translate(player1.body.x, player1.body.y);
    rotate(180); //Rotating the phyisical image permanently 
    rotate(player1.body.rotation); //Related to user input, gameplay rotation
    image(houstonImg, 0, 0, player1.body.size + player1.body.growthAmount * 3, player1.body.size + player1.body.growthAmount * 3);
    pop();
}

//Same as player 1
function drawPlayer2() {
    push();
    stroke("white");
    strokeWeight(player2.web.size);
    line(player2.web.x, player2.web.y, player2.body.x, player2.body.y);
    pop();

    push();
    imageMode(CENTER);
    translate(player2.web.x, player2.web.y);
    rotate(180);
    image(webImg, 0, 0, player2.web.tipSize, player2.web.tipSize);
    pop();

    push();
    imageMode(CENTER);
    translate(player2.body.x, player2.body.y);
    rotate(player2.body.rotation);
    image(houstonImg, 0, 0, player2.body.size + player2.body.growthAmount * 3, player2.body.size + player2.body.growthAmount * 3);
    pop();
}

//Size & token counter to view how big you or your opponent are
function displayStats() {

    //PLayer 1 counters
    push();
    fill('yellow');
    textSize(16);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text('Tokens: ' + player1Tokens, 50, 460);
    text('Size: ' + player1.body.growthAmount, 590, 460);
    pop();

    //Player 2 counters
    push();
    fill('yellow');
    textSize(16);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text('Tokens: ' + player2Tokens, 50, 20);
    text('Size: ' + player2.body.growthAmount, 590, 20);
    pop();
}

//Anything and everything to do with the movement of the web for both player
function moveWeb() {
    // Player 1 Web Logic
    // State 1: Idle
    // When web is not being shot, it stays behind the player's body
    if (player1.web.state === "idle") {
        // Reset web position and distance when idle
        player1.web.x = player1.body.x;
        player1.web.y = player1.body.y;
        player1.web.distance = 0;
    }
    // State 2: outbound
    else if (player1.web.state === "outbound") {

        // Calculate max allowed distance based on tokens
        const maxDistance = player1Tokens * 50; // Each token adds 50 pixels to web range

        // Update web position
        //calculating the angle with trig
        player1.web.distance += player1.web.speed;
        let angle = -player1.body.rotation - 180;
        player1.web.x = player1.body.x + player1.web.distance * sin(angle);
        player1.web.y = player1.body.y + player1.web.distance * cos(angle);

        // Store the maximum distance reached for token cost calculation
        player1.web.maxDistance = player1.web.distance;

        // Check for maximum distance or border collision, convert to inbound
        if (player1.web.distance >= maxDistance ||
            player1.web.y <= 0 ||
            player1.web.x <= 0 ||
            player1.web.x >= width) {
            player1.web.state = "inbound";
        }
    }

    //state 3: inbound
    else if (player1.web.state === "inbound") {
        // Retract web
        //calculate angle again
        player1.web.distance -= player1.web.speed;
        let angle = -player1.body.rotation - 180;
        player1.web.x = player1.body.x + player1.web.distance * sin(angle);
        player1.web.y = player1.body.y + player1.web.distance * cos(angle);

        // Reset to idle when fully retracted
        if (player1.web.distance <= 0) {
            player1.web.state = "idle";
            player1.web.x = player1.body.x;
            player1.web.y = player1.body.y;
            player1.web.distance = 0;
        }
    }

    // Player 2 Web Logic, almost the same as player 1, with minor differences
    if (player2.web.state === "idle") {
        player2.web.x = player2.body.x;
        player2.web.y = player2.body.y;
        player2.web.distance = 0;
    }
    else if (player2.web.state === "outbound") {
        const maxDistance = player2Tokens * 50;

        player2.web.distance += player2.web.speed;
        let angle = -player2.body.rotation;
        player2.web.x = player2.body.x + player2.web.distance * sin(angle);
        player2.web.y = player2.body.y + player2.web.distance * cos(angle);


        player2.web.maxDistance = player2.web.distance;


        if (player2.web.distance >= maxDistance ||
            player2.web.y >= height ||
            player2.web.x <= 0 ||
            player2.web.x >= width) {
            player2.web.state = "inbound";
        }
    }
    else if (player2.web.state === "inbound") {

        player2.web.distance -= player2.web.speed;
        let angle = -player2.body.rotation;
        player2.web.x = player2.body.x + player2.web.distance * sin(angle);
        player2.web.y = player2.body.y + player2.web.distance * cos(angle);


        if (player2.web.distance <= 0) {
            player2.web.state = "idle";
            player2.web.x = player2.body.x;
            player2.web.y = player2.body.y;
            player2.web.distance = 0;
        }
    }
}

//Creating new bugs every 5 seconds
//Overcomplicated, could have just used setInterval from time events...
function newSpawn() {
    // Constraining to max 10 bugs
    //Generate new bug if previous spawn was 5 seconds or more prior
    if (bugs.length < 5 && millis() - lastSpawnTime >= spawnInterval) {

        //Randomizing
        const newSpeed = random(5, 8);
        const newDirectionChance = random(0.05, 0.1);
        //Push new bug to the array
        bugs.push(createBug(newSpeed, newDirectionChance));
        //Updating spawn time 
        lastSpawnTime = millis();
    }
}

//Iterating through bugs array to draw/move the bugs
function drawBug() {
    for (let bug of bugs) {
        moveSingleBug(bug);
        drawSingleBug(bug);
    }
}

//Responsible for updating the properties of a single bug, speed, direction and collisions
//Initially attempted with noise() but did not produce desired results. 
function moveSingleBug(bug) {

    //Setting angle range that the bug can randomly change direction to if random value is less than changeDirectionChance
    if (random() < bug.changeDirectionChance) {
        bug.moveAngle += random(-60, 60);
    }

    //Updating position using trig to update its x and y 
    // I don't know anymore with this trig stuff, I just look at documentation and assume it'll work, I wrote it a while ago and I don't actually know what this does, it does something. 
    bug.x += cos(bug.moveAngle) * bug.speed;
    bug.y += sin(bug.moveAngle) * bug.speed;

    // Wall collisions
    // If the bug's x is less than 0 (left wall), set X to 0 and reverse the direction
    if (bug.x < 0) {
        bug.x = 0;
        bug.moveAngle = -bug.moveAngle + 180;
    }
    //if greater than canvas width, reverse
    else if (bug.x > width - bug.size) {
        bug.x = width - bug.size;
        bug.moveAngle = -bug.moveAngle + 180;
    }
    // y is less than 0 (top wall), reverse
    if (bug.y < 0) {
        bug.y = 0;
        bug.moveAngle = -bug.moveAngle;
    }
    //greater than canvas height, reverse
    else if (bug.y > height - bug.size) {
        bug.y = height - bug.size;
        bug.moveAngle = -bug.moveAngle;
    }
}

//Visually drawing the bug, inserting image
function drawSingleBug(bug) {
    image(bugImg, bug.x, bug.y, bug.size, bug.size);
}

// Verifying that a bug was caught
function checkAllWebBugOverlaps() {
    for (let bug of bugs) {
        //check if Player 1's web is not idle
        if (player1.web.state !== "idle") {
            // Calculate the distance between the bug and Player 1's web
            const d1 = dist(player1.web.x, player1.web.y, bug.x, bug.y);

            // Determine if the bug is caught by web, distance less than half the sum of the web size and the bug size
            const caught1 = (d1 < player1.web.size / 2 + bug.size / 2);

            // If the bug is caught
            if (caught1) {
                // Calculate the token cost based on the distance traveled 
                const tokenCost = calculateTokenCost(player1.web.distance);

                // Subtract the token cost from counter
                player1Tokens -= tokenCost;

                // If run out of tokens, the game is over and the other player wins
                if (player1Tokens <= 0) {
                    gameState = gameWon;
                    //Text to display on game won screen
                    winReason = 'PLAYER 2 WINS! Player 1 ran out of power...';
                    return;
                }

                // Remove the caught bug from the array
                bugs.splice(bugs.indexOf(bug), 1);

                // Set web state to retract back to idle
                player1.web.state = "inbound";

                // Increase the player's body growth amount (for counter) and size (visible growth)
                player1.body.growthAmount += 10;
                player1Size += 1;

                // Skip checking Player 2's web since this bug has already been caught
                continue;
            }
        }

        if (player2.web.state !== "idle") {
            const d2 = dist(player2.web.x, player2.web.y, bug.x, bug.y);
            const caught2 = (d2 < player2.web.size / 2 + bug.size / 2);

            if (caught2) {
                const tokenCost = calculateTokenCost(player2.web.distance);
                player2Tokens -= tokenCost;

                if (player2Tokens <= 0) {
                    gameState = gameWon;
                    winReason = 'PLAYER 1 WINS! Player 2 ran out of power...';
                    return;
                }

                bugs.splice(bugs.indexOf(bug), 1);
                player2.web.state = "inbound";
                player2.body.growthAmount += 10;
                player2Size += 1;
            }
        }
    }
}
//function to check all conditions under which an opponent has been devoured.
function checkWinCondition() {
    // Check if player1 meets win conditions
    //Special condition for zero, because 0x0 is also zero, if one is zero the other must have eaten one token
    if ((player2.body.growthAmount === 0 && player1.body.growthAmount >= 10) ||
        //Checks if opponent is half your size
        (player2.body.growthAmount > 0 && player1.body.growthAmount >= player2.body.growthAmount * 2)) {
        //haved enough tokens to win
        if (player1Tokens >= winTokens) {
            //Actually touching the opponent, change state to win.
            let distanceToPlayer2 = dist(player1.web.x, player1.web.y, player2.body.x, player2.body.y);
            if (distanceToPlayer2 < (player1.web.tipSize + player2.body.size) / 2) {
                gameState = gameWon;
                //text displayed
                winReason = 'PLAYER 1 WINS! PLAYER 2 WAS DEVOURED!';
            }
        }
    }

    // Check if player2 meets win conditions
    if ((player1.body.growthAmount === 0 && player2.body.growthAmount >= 10) ||
        (player1.body.growthAmount > 0 && player2.body.growthAmount >= player1.body.growthAmount * 2)) {
        if (player2Tokens >= winTokens) {
            let distanceToPlayer1 = dist(player2.web.x, player2.web.y, player1.body.x, player1.body.y);
            if (distanceToPlayer1 < (player2.web.tipSize + player1.body.size) / 2) {
                gameState = gameWon;
                winReason = 'PLAYER 2 WINS! PLAYER 1 WAS DEVOURED!';
            }
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
                strings: [winReason],  // Use your existing winReason here
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

    // Check if Player 1 won by looking at the winReason text
    const player1Won = winReason.includes('PLAYER 1 WINS');

    let actionButton = createButton(player1Won ? 'Next Level' : 'Try Again');
    actionButton.parent(gameWonElement);
    actionButton.style('font-size', '20px');
    actionButton.style('font-family', 'Courier New');
    actionButton.style('margin-top', '20px');
    actionButton.style('padding', '10px 20px');
    actionButton.style('cursor', 'pointer');

    actionButton.mousePressed(() => {
        if (player1Won) {
            window.location.href = 'invasion1.html'; // Go to next level if Player 1 won
        } else {
            resetGame(); // Reset the game if Player 2 won
            gameState = gamePlaying;
            resetGameWon();
        }
    });

    new Typed(gameWonTitle.elt, {
        strings: [winReason],
        typeSpeed: 20,
        showCursor: false,
        onComplete: () => {
            actionButton.style('display', 'block');
        }
    });
}


// Add these reset functions
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