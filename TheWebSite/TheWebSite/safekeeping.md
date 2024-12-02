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













\




<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Word Art Generator</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Lobster&family=Roboto&display=swap" rel="stylesheet">
    <style>
        #wordArtPreview {
            opacity: 0;
            transition: opacity 1s ease-in-out;
            margin-top: 20px;
        }

        #wordArtPreview.active {
            opacity: 1;
        }

        .word-art-item {
            margin-bottom: 20px;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1 class="text-center mt-5">Settings</h1>
        <form id="wordArtForm" class="mt-4">
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" class="form-control" placeholder="Enter your name">
            </div>
            <div class="form-group">
                <label for="message">Message:</label>
                <textarea id="message" class="form-control" placeholder="Enter your message"></textarea>
            </div>
            <div class="form-group">
                <label for="fontStyle">Font Style:</label>
                <select id="fontStyle" class="form-control">
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Lobster">Lobster (Google Font)</option>
                    <option value="Roboto">Roboto (Google Font)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="fontSize">Forward Speed</label>
                <input type="range" id="volumeControl" min="0" max="1" step="0.1" value="0.5">
            </div>
            <div class="form-group">
                <label for="textColor">Text Color:</label>
                <input type="range" id="volumeControl" min="0" max="1" step="0.1" value="0.5">
            </div>
            <button type="submit" class="btn btn-primary">Generate Word Art</button>
        </form>

        <div id="wordArtPreview" class="text-center mt-4"></div>

        <div id="wordArtGallery" class="row mt-4">
            <!-- Word art items will be dynamically added here -->
        </div>
    </div>

    <script src="https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.6.1/firebase-database.js"></script>

    <script>
        const firebaseConfig = {
            apiKey: "AIzaSyBVC0nnE-5-9yDksKbX1tp03l_Pqxz60ZI",
            authDomain: "webspider-a488f.firebaseapp.com",
            projectId: "webspider-a488f",
            storageBucket: "webspider-a488f.firebasestorage.app",
            messagingSenderId: "549491897505",
            appId: "1:549491897505:web:797d60e9cb5de29e5a2ce0"
        };
        firebase.initializeApp(firebaseConfig);

        const form = document.getElementById('wordArtForm');
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const forwardSpeed = document.getElementById('name').value;
            const backSpeed = document.getElementById('message').value;
            const fontStyle = document.getElementById('fontStyle').value;
            const fontSize = document.getElementById('fontSize').value + 'px';
            const textColor = document.getElementById('textColor').value;

            // Update the preview
            const wordArtPreview = document.getElementById('wordArtPreview');
            wordArtPreview.innerHTML = `${name}: ${message}`;
            wordArtPreview.style.fontFamily = fontStyle;
            wordArtPreview.style.fontSize = fontSize;
            wordArtPreview.style.color = textColor;
            wordArtPreview.classList.remove('active');
            setTimeout(() => wordArtPreview.classList.add('active'), 10);

            // Save data to Firebase
            firebase.database().ref('wordArt').push({
                name: name,
                message: message,
                fontStyle: fontStyle,
                fontSize: fontSize,
                textColor: textColor
            });
        });

        // Display saved word art in the gallery
        firebase.database().ref('wordArt').on('child_added', function (snapshot) {
            const wordArt = snapshot.val();
            const wordArtItem = document.createElement('div');
            wordArtItem.classList.add('col-md-4', 'text-center', 'word-art-item');
            wordArtItem.innerHTML = `
        <div style="font-family: ${wordArt.fontStyle}; font-size: ${wordArt.fontSize}; color: ${wordArt.textColor};">
          ${wordArt.name}: ${wordArt.message}
        </div>
      `;
            document.getElementById('wordArtGallery').appendChild(wordArtItem);
        });
    </script>
</body>

</html>
