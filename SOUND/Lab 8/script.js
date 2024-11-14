// Initialize Audio Context and Oscillator
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();
const ambientSound = new Audio("ambient-drone.wav");

//Variables for keys

let whiteKey = {
    width: 40,
    height: 150,
};

// Table of notes with correspending keyboard codes. Frequencies are in hertz.
// The notes start from middle C
let notesByKey = {
    65: { noteName: 'c4', frequency: 261.6, keyName: 'a' },
    83: { noteName: 'd4', frequency: 293.7, keyName: 's' },
    68: { noteName: 'e4', frequency: 329.6, keyName: 'd' },
    70: { noteName: 'f4', frequency: 349.2, keyName: 'f' },
    71: { noteName: 'g4', frequency: 392, keyName: 'g' },
    72: { noteName: 'a4', frequency: 440, keyName: 'h' },
    74: { noteName: 'b4', frequency: 493.9, keyName: 'j' },
};
// Set initial oscillator properties
oscillator.type = undefined
oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // Default frequency (A4)
oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);
gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Default volume

let keys = [];
let activeKeys = new Set();

const waveTypeSelect = document.getElementById("waveType");
waveTypeSelect.addEventListener("change", () => {
    oscillator.type = waveTypeSelect.value;
});

// Volume Control Slider
document.getElementById("volumeControl").addEventListener("input", (event) => {
    gainNode.gain.setValueAtTime(event.target.value, audioContext.currentTime);
});

// Frequency Control (Pitch) Slider
document.getElementById("frequencyControl").addEventListener("input", (event) => {
    oscillator.frequency.setValueAtTime(event.target.value, audioContext.currentTime);
});


// Reset Button to restore default settings
function resetSettings() {
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Reset volume
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // Reset frequency
    document.getElementById("volumeControl").value = 0.5;
    document.getElementById("frequencyControl").value = 440;
}

// Stop sound ????
document.getElementById("stop").addEventListener("click", () => {
    oscillator.stop();
    ambientSound.pause();
    document.getElementById("playSound").disabled = false; // Remake the play button visible
});

// Start background sound
document.getElementById("Ambiance").addEventListener("click", () => {
    ambientSound.loop = true;
    ambientSound.volume = 0.5;
    ambientSound.play();
})

function keyboard() {
    function setup() {
        createCanvas(whiteKey.width * Object.keys(notesByKeyCode).length, whiteKey.height);


        // Create key objects
        let i = 0;
        for (let keyCode in notesByKeyCode) {
            let note = notesByKeyCode[keyCode];
            let x = i * whiteKey.width;
            keys.push({
                x: x,
                y: 0,
                w: whiteKey.width,
                h: whiteKey.height,
                note: note,
                keyCode: parseInt(keyCode)
            });
            i++;
        }
    }
    function draw() {
        background(240);

        // Draw keys
        for (let key of keys) {
            // Set fill color based on whether key is active
            if (activeKeys.has(key.keyCode)) {
                fill(200, 200, 255);
            } else {
                fill(255);
            }

            // Draw key rectangle
            stroke(0);
            rect(key.x, key.y, key.w, key.h);

            // Draw note name and key letter
            fill(0);
            textAlign(CENTER);
            textSize(14);
            text(key.note.noteName, key.x + key.w / 2, key.y + key.h - 30);
            textSize(20);
            text(key.note.keyName, key.x + key.w / 2, key.y + key.h - 60);
        }
    }

    function keyPressed() {
        if (notesByKeyCode[keyCode]) {
            if (!activeKeys.has(keyCode)) {
                // Create new oscillator for this key press
                let osc = audioContext.createOscillator();
                osc.type = waveTypeSelect.value;
                osc.frequency.setValueAtTime(notesByKeyCode[keyCode].frequency, audioContext.currentTime);
                osc.connect(gainNode);
                osc.start();

                // Store oscillator with the key
                activeKeys.add(keyCode);
                notesByKeyCode[keyCode].oscillator = osc;
            }
        }
    }
}

document.getElementById("resetButton").addEventListener("click", resetSettings);