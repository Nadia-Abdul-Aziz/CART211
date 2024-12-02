let lineLength;
let growing = true;

function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('pointer-events', 'none'); // Prevent interaction
    lineLength = 50; // Initial line length
}

function draw() {
    clear(); // Clear canvas to avoid trails
    const spiderImage = document.getElementById('spiderImage');
    const rect = spiderImage.getBoundingClientRect();
    const anchorX = rect.right - rect.width / 2;
    const anchorY = rect.top;

    stroke(255);
    strokeWeight(2);
    line(anchorX, anchorY, anchorX, anchorY + lineLength);

    // Animate the line
    if (growing) {
        lineLength += 2;
        if (lineLength > 150) growing = false;
    } else {
        lineLength -= 2;
        if (lineLength < 50) growing = true;
    }
}
