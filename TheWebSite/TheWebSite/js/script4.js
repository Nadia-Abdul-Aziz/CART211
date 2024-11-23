
//Space invaders
let player = {
    x: 300,
    y: 550,
    width: 60,
    height: 20,
    speed: 5
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

function setup() {
    createCanvas(600, 600);
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
    background(0);

    // Draw and move player
    fill(0, 255, 0);
    rect(player.x, player.y, player.width, player.height);

    if (keyIsDown(LEFT_ARROW) && player.x > 0) {
        player.x -= player.speed;
    }
    if (keyIsDown(RIGHT_ARROW) && player.x < width - player.width) {
        player.x += player.speed;
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

    // Check if enemies need to change direction
    enemies.forEach(enemy => {
        if (enemy.alive) {
            enemiesAlive = true;
            if ((enemy.x + enemy.width > width && enemyDirection > 0) ||
                (enemy.x < 0 && enemyDirection < 0)) {
                moveDown = true;
            }
        }
    });

    // Move enemies
    enemies.forEach(enemy => {
        if (enemy.alive) {
            if (moveDown) {
                enemy.y += 20;
            }
            enemy.x += enemyDirection * 2;

            // Draw enemy
            fill(255, 0, 0);
            rect(enemy.x, enemy.y, enemy.width, enemy.height);

            // Check for collision with bullet
            if (bullet.active) {
                if (collision(bullet, enemy)) {
                    enemy.alive = false;
                    bullet.active = false;
                }
            }

            // Check for game over
            if (enemy.y + enemy.height > player.y) {
                noLoop();
                textSize(32);
                fill(255);
                textAlign(CENTER);
                text('GAME OVER', width / 2, height / 2);
            }
        }
    });

    if (moveDown) {
        enemyDirection *= -1;
    }

    // Check for win condition
    if (!enemiesAlive) {
        noLoop();
        textSize(32);
        fill(255);
        textAlign(CENTER);
        text('YOU WIN!', width / 2, height / 2);
    }
}

function keyPressed() {
    // Space bar to shoot
    if (keyCode === 32 && !bullet.active) {
        bullet.active = true;
        bullet.x = player.x + player.width / 2 - bullet.width / 2;
        bullet.y = player.y;
    }
}

function collision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
}