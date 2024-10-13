/**
 * The Web Site - Web Spinning
 * Nadia Abdul Aziz
 * 
 * Just a spider making their web
 */

"use strict";

// ALL VARIABLES

let spider = {
    x: 250,
    y: 250,
}

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
    y2: 285,
}

let anchor4 = {
    x2: 210,
    y2: 285,
}

let anchor5 = {
    x2: 200,
    y2: 225,
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
    drawSpider();
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

function drawSpider() {
    push();
    ellipse(spider.x, spider.y, 20);
    pop();
}


function drawAnchor1() {

    anchor1.y2 = anchor1.y2 - 0.4;

    line(width / 2, height / 2, anchor1.x2, anchor1.y2);
}

function drawAnchor2() {

    anchor2.x2 = anchor2.x2 + 0.3;
    anchor2.y2 = anchor2.y2 - 0.3;

    line(width / 2, height / 2, anchor2.x2, anchor2.y2);
}

function drawAnchor3() {

    anchor3.x2 = anchor3.x2 + 0.3;
    anchor3.y2 = anchor3.y2 + 0.3;

    line(width / 2, height / 2, anchor3.x2, anchor3.y2);
}

function drawAnchor4() {

    anchor4.x2 = anchor4.x2 - 0.3;
    anchor4.y2 = anchor4.y2 + 0.3;

    //anchor4.y2 = constrain(anchor4.y2, )

    line(width / 2, height / 2, anchor4.x2, anchor4.y2);
}

function drawAnchor5() {

    anchor5.x2 = anchor5.x2 - 0.3;
    anchor5.y2 = anchor5.y2 - 0.3;

    line(width / 2, height / 2, anchor5.x2, anchor5.y2);
}