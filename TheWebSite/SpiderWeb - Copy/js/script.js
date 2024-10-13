let spider = {
    x: 250,
    y: 250,
};
let anchors = [
    { x2: 250, y2: 200, growth: 0 },
    { x2: 300, y2: 225, growth: 0 },
    { x2: 290, y2: 285, growth: 0 },
    { x2: 210, y2: 285, growth: 0 },
    { x2: 200, y2: 225, growth: 0 },
];
let currentAnchorIndex = 0; // Track the current anchor
let stepSize = 8; // Speed of the spider's movement
let growthRate = 0.5; // Growth rate of the anchors
let path = []; // Array to store the path of the spider
let frameCount = 0; // Counter for frames
const maxGrowthFrames = 350; // Maximum number of frames for anchor growth
let rotationAngle = 0; // Angle of rotation for the entire structure
let rotationSpeed = 0.001; // Speed of rotation (in radians per frame)

/**
 * Setup function.
 */
function setup() {
    createCanvas(500, 500);
}

/**
 * Draw function.
 */
function draw() {
    background("black");

    // Apply rotation
    push(); // Save the current transformation state
    translate(width / 2, height / 2); // Move the origin to the center
    rotate(rotationAngle); // Apply rotation
    translate(-width / 2, -height / 2); // Move the origin back

    drawAllAnchors();
    drawSpider();
    drawPath();

    pop(); // Restore the original transformation state

    moveSpider();
    if (frameCount < maxGrowthFrames) {
        growAnchors(); // Call function to grow anchors only if frame count is less than max
        frameCount++;
    }

    // Increment rotation angle
    rotationAngle += rotationSpeed;
}

function drawAllAnchors() {
    stroke(255);
    strokeWeight(2);
    for (let anchor of anchors) {
        line(width / 2, height / 2, anchor.x2, anchor.y2);
    }
}

function drawSpider() {
    fill(255);
    ellipse(spider.x, spider.y, 20);
}

function drawPath() {
    // Draw the path
    stroke(255, 150); // Lighten the stroke for the path
    strokeWeight(1);
    for (let i = 1; i < path.length; i++) {
        line(path[i - 1].x, path[i - 1].y, path[i].x, path[i].y);
    }
}

function moveSpider() {
    let targetAnchor = anchors[currentAnchorIndex];
    // Calculate direction to the target anchor
    let dx = targetAnchor.x2 - spider.x;
    let dy = targetAnchor.y2 - spider.y;
    // Move spider towards the target anchor
    spider.x += dx * (stepSize / dist(spider.x, spider.y, targetAnchor.x2, targetAnchor.y2));
    spider.y += dy * (stepSize / dist(spider.x, spider.y, targetAnchor.x2, targetAnchor.y2));
    // Store the spider's position in the path array
    path.push({ x: spider.x, y: spider.y });
    // Check if the spider has reached the anchor
    if (dist(spider.x, spider.y, targetAnchor.x2, targetAnchor.y2) < stepSize) {
        currentAnchorIndex = (currentAnchorIndex + 1) % anchors.length; // Move to the next anchor, loop back to 0 if at the end
    }
}

function growAnchors() {
    for (let anchor of anchors) {
        // Calculate the direction to grow the anchor outward
        let dx = anchor.x2 - width / 2; // Difference in x from center
        let dy = anchor.y2 - height / 2; // Difference in y from center
        let length = sqrt(dx * dx + dy * dy); // Calculate the length
        // Normalize direction
        let normX = dx / length;
        let normY = dy / length;
        // Increase the anchor's position by growth rate
        anchor.x2 += normX * growthRate;
        anchor.y2 += normY * growthRate;
    }
}