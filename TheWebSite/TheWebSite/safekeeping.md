//Instructions and initial screen
//All internal push/pops removed due to redundancy and confusion due to the amount of them.
// function drawTitleScreen() {
//     textAlign(CENTER, CENTER);

//     push();
//     // Title
//     fill('white');
//     textSize(48);
//     text('SpiderSpiderSpider', width / 2, height * 0.15);

//     // Draw the start button square
//     fill('white');
//     rectMode(CENTER);
//     rect(width / 2, height * 0.3, button.width, button.height);

//     // Button text
//     fill('black');
//     textSize(24);
//     text('Start', width / 2, height * 0.295); //Trying numbers until it worked nicely

//     //Sub-text
//     fill('black');
//     textSize(7);
//     text('[SPACEBAR]', width / 2, height * 0.325);

//     //Margins and padding variables because formatting is hard
//     //Tried turning this into an object but it was giving me issues for some reason, so they live here now
//     let leftX = 150;
//     let rightX = width - 150;
//     let startY = height * 0.6;
//     let lineSpacing = 25;

//     // Left side -  Instructions
//     fill('white');
//     textSize(18);
//     textStyle(BOLD);
//     text('HOW TO WIN:', leftX, height * 0.5);

//     // Game rules
//     textStyle(NORMAL);
//     textSize(14);
//     text('1. Collect power tokens to extend your web!', leftX, startY);
//     text('2. Eat bugs to grow bigger!', leftX, startY + lineSpacing);
//     text('3. Catching farther bugs will use more power!', leftX, startY + lineSpacing * 2);
//     text('4. Grow twice as big as your opponent!', leftX, startY + lineSpacing * 3);
//     text('5. Devour your opponent with your web!', leftX, startY + lineSpacing * 4);

//     //Fine print
//     textSize(12);
//     textStyle(ITALIC);
//     text('Warning: Running out of tokens means defeat!', width / 2, startY + lineSpacing * 7);

//     // Right side - Controls
//     textStyle(BOLD);
//     textSize(18);
//     text('CONTROLS:', rightX, height * 0.5);

//     //Player 1 controls
//     textSize(14);
//     textStyle(BOLD);
//     text('Player 1 (Bottom Spider)', rightX, startY);
//     textStyle(NORMAL);
//     text('Left/Right to move - Up to shoot', rightX, startY + lineSpacing);

//     // Player 2 controls
//     textStyle(BOLD);
//     text('Player 2 (Top Spider)', rightX, startY + lineSpacing * 3);
//     text('A/D keys to move - S to shoot', rightX, startY + lineSpacing * 4);

//     pop();
// }