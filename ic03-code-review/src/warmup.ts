import { Turtle, DrawableTurtle } from './turtle.js';
import fs from 'fs';
import open from 'open';

function drawSomething(turtle: Turtle): void {
    // TODO: refactor the body of drawSomething()
    // so that it is:
    // - as DRY as possible
    // - as ETU as possible
    // Feel free to move code into new methods if you want.
    const numTurns = 3;
    const forwardDistance = 200;
    const turnAngle = 180;

    for(let i = 0; i < numTurns; i++) {
        for(let j = 0; j < 2; j++) {
            turtle.forward(forwardDistance);
            turtle.turn(turnAngle);    
        }
        turtle.turn(360 / numTurns);
    }

    // turtle.forward(200);
    // turtle.turn(180);
    // turtle.forward(200);
    // turtle.turn(180);
    // turtle.turn(120);
    // turtle.forward(200);
    // turtle.turn(180);
    // turtle.forward(200);
    // turtle.turn(180);
    // turtle.turn(120);
    // turtle.forward(200);
    // turtle.turn(180);
    // turtle.forward(200);
    // turtle.turn(180);
    // turtle.turn(120);
}

/**
 * Main program.
 * 
 * This function creates a turtle and draws in a window.
 */
function main():void {
    const turtle:Turtle = new DrawableTurtle();
    drawSomething(turtle);

    // draw into a file
    const svgDrawing = turtle.getSVG();
    fs.writeFileSync('output.html', `<html>\n${svgDrawing}</html>\n`);

    // open it in a web browser
    open('output.html');
}

main();
