/**
 * Terrible New Car
 * Pippin Barr
 * 
 * A program to generate new car model names using dinosaurs.
 * 
 * Uses:
 * Darius Kazemi's corpora repository
 * https://github.com/dariusk/corpora/tree/master
 */

"use strict";

let carData = undefined;
let dinosaurData = undefined;
let langData = undefined;
let lang = "fr";

let mainText = "Click to generate a car name.";

/**
 * Load the car and dinosaur data
 */
function preload() {
    carData = loadJSON("assets/data/cars.json")
    dinosaurData = loadJSON("assets/data/dinosaurs.json")
    langData = loadJSON("assets/data/lang.json")
}

/**
 * Create the canvas
*/
function setup() {
    createCanvas(600, 400);

    // if (lang === "fr") {
    //     mainText = langData.instructions.fr;
    // }
    // else if (lang === "en") {
    //     mainText = langData.instructions.en  ;
    // }

    mainText = langData.instructions[lang];
    //Same thing but using array, not to repeat code
      
}

/**
 * Display the current main text (either instructions or a car)
*/
function draw() {
    background(0);

    push();
    fill("pink");
    textAlign(CENTER, CENTER);
    textSize(32);
    text(mainText, width / 2, height / 2);
    pop();
}

/**
 * Generate a new car name
 */
function mousePressed() {
    const car = random(carData.cars);
    const dinosaur = random(dinosaurData.dinosaurs);
    mainText = car + " " + dinosaur;
}