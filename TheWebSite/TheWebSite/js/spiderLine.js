//attempt at creating a up and down animation for the homescreen, dead code
//UNUSED CODE!!!




//let lineLength;
// let growing = true;

// function setup() {
//     const canvas = createCanvas(windowWidth, windowHeight);
//     canvas.position(0, 0);
//     canvas.style('pointer-events', 'none'); // Prevent interaction
//     lineLength = 50; // Initial line length

//     // Wait for the image to load before accessing its dimensions
//     const spiderImage = document.getElementById('spiderImage');
//     spiderImage.onload = drawSpiderLine;
// }

// function drawSpiderLine() {
//     const spiderImage = document.getElementById('spiderImage');
//     if (!spiderImage) return; // Handle case where image is not found

//     const rect = spiderImage.getBoundingClientRect();
//     const anchorX = rect.right - rect.width / 2;
//     const anchorY = rect.top;

//     clear(); // Clear canvas to avoid trails
//     stroke(255);
//     strokeWeight(2);
//     line(anchorX, anchorY, anchorX, anchorY + lineLength);

//     // Animate the line
//     if (growing) {
//         lineLength += 2;
//         if (lineLength > 150) growing = false;
//     } else {
//         lineLength -= 2;
//         if (lineLength < 50) growing = true;
//     }
// }

// function draw() {
// }
