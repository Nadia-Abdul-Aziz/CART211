//For automatic opponent
let opponent = {
    // Configuration
    enabled: true,
    decisionInterval: 500, //In miliseconds
    lastDecisionTime: 0,
    tokenThreshold: 5,
    angleDeadzone: 5,
    shootingTolerance: 10,

    // What is it doing rn
    currentTarget: null,
    currentStrategy: 'collect', // collect, hunt or attack
}

function findNearestToken() {
    if (powerTokens.length === 0) return null;
    let nearest = powerTokens[0];
    let shortestDist = dist(player2.body.x, player2.body.y, nearest.x, nearest.y);

    for (let token of powerTokens) {
        let d = dist(player2.body.x, player2.body.y, token.x, token.y);
        if (d < shortestDist) {
            shortestDist = d;
            nearest = token;
        }
    }
    return nearest;
}

function findNearestBug() {
    if (bugs.length === 0) return null;
    let nearest = bugs[0];
    let shortestDist = dist(player2.body.x, player2.body.y, nearest.x, nearest.y);

    for (let bug of bugs) {
        let d = dist(player2.body.x, player2.body.y, bug.x, bug.y);
        if (d < shortestDist) {
            shortestDist = d;
            nearest = bug;
        }
    }
    return nearest;
}

function canReachTarget(target) {
    if (!target) return false;
    let distance = dist(player2.body.x, player2.body.y, target.x, target.y);
    return distance <= player2Tokens * 50; // Each token gives 50 pixels range
}

function calculateTargetAngle(target) {
    if (!target) return 0;
    let dx = target.x - player2.body.x;
    let dy = target.y - player2.body.y;
    return degrees(atan2(dx, dy));
}

function shouldAttackPlayer() {
    // Check if we're big enough to eat player 1
    let canEat = (player1.body.growthAmount === 0 && player2.body.growthAmount >= 10) ||
        (player1.body.growthAmount > 0 && player2.body.growthAmount >= player1.body.growthAmount * 2);

    // Check if we have enough tokens to reach player
    let hasTokens = player2Tokens >= opponent.tokenThreshold;

    return canEat && hasTokens;
}

function updateOpponent() {
    if (gameState !== gamePlaying) return;

    // Only make decisions at interval
    if (millis() - opponent.lastDecisionTime < opponent.decisionInterval) return;
    opponent.lastDecisionTime = millis();

    // Reset movement
    move.aKeyActive = false;
    move.dKeyActive = false;

    // Choose strategy
    if (shouldAttackPlayer()) {
        opponent.currentStrategy = 'attack';
        opponent.currentTarget = { x: player1.body.x, y: player1.body.y };
    } else if (player2Tokens < opponent.tokenThreshold) {
        opponent.currentStrategy = 'collect';
        opponent.currentTarget = findNearestToken();
    } else {
        opponent.currentStrategy = 'hunt';
        opponent.currentTarget = findNearestBug();
    }

    // If we have a target, aim at it
    if (opponent.currentTarget) {
        let targetAngle = calculateTargetAngle(opponent.currentTarget);
        let angleDiff = targetAngle - player2.body.rotation;

        // Normalize angle difference
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;

        // Rotate towards target
        if (angleDiff > opponent.angleDeadzone) {
            move.dKeyActive = true;
        } else if (angleDiff < -opponent.angleDeadzone) {
            move.aKeyActive = true;
        }

        // Shoot web if aimed correctly and in range
        if (Math.abs(angleDiff) < opponent.shootingTolerance &&
            canReachTarget(opponent.currentTarget) &&
            player2.web.state === "idle") {
            keyPressed({ keyCode: 83 }); // Simulate S key press
        }
    }
}