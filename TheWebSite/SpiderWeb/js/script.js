/**
 * The Web Site - Web Spinning
 * Nadia Abdul Aziz
 * 
 * Just a spider making their web
 */

"use strict";

// ALL VARIABLES

let centerX = 250;
let centerY = 250;

let anchor1 = {
    x2: 250,
    y2: 200,
}

let anchor2 = {
    x2: 300,
    y2: 225,
}

let anchor3 = {
    x2: 290,
    y2: 275,
}

let anchor4 = {
    x2: 200,
    y2: 280,
}

let anchor5 = {
    x2: 190,
    y2: 220,
}

/**
 * OH LOOK I DIDN'T DESCRIBE SETUP!!
*/
function setup() {
    createCanvas(500, 500);
}

/**
 * OOPS I DIDN'T DESCRIBE WHAT MY DRAW DOES!
*/
function draw() {
    background("black");
    drawAllAnchor();

}

function drawAllAnchor() {
    stroke(255);
    strokeWeight(2);
    drawAnchor1();
    drawAnchor2();
    drawAnchor3();
    drawAnchor4();
    drawAnchor5();
}


function drawAnchor1() {
    line(width / 2, height / 2, anchor1.x2, anchor1.y2);
}

function drawAnchor2() {
    line(width / 2, height / 2, anchor2.x2, anchor2.y2);
}

function drawAnchor3() {
    line(width / 2, height / 2, anchor3.x2, anchor3.y2);
}

function drawAnchor4() {
    line(width / 2, height / 2, anchor4.x2, anchor4.y2);
}

function drawAnchor5() {
    line(width / 2, height / 2, anchor5.x2, anchor5.y2);
}