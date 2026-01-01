/* Copyright (c) 2007-2023 MIT 6.102/6.031/6.005 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

import fs from 'node:fs';
import open from 'open';
import { Turtle, DrawableTurtle, LineSegment, PenColor, Point } from './turtle.js';

enum Direction {
    CLOCKWISE = 1,
    COUNTERCLOCKWISE = -1
}

const circleDegrees = 360;
const halfCircleDegrees = circleDegrees / 2;
const ninetyDegrees = 90;
const fortyFiveDegrees = ninetyDegrees / 2;

/**
 * Convert radians to degrees.
 * 
 * @param radians an angle measured in radians
 * @returns the same angle expressed in degrees
 */
export function radiansToDegrees(radians: number): number {
    return radians * halfCircleDegrees / Math.PI;
}

/**
 * Draw a square.
 * 
 * @param turtle the turtle context
 * @param sideLength length of each side, must be >= 0
 */
export function drawSquare(turtle: Turtle, sideLength: number): void {

    const numSides = 4;
    const squareRadius = sideLength / Math.sqrt(2); // radius of the circle circumscribed around the square

    drawApproximateArc(turtle, squareRadius, 2*Math.PI, numSides, Direction.COUNTERCLOCKWISE);

}

/**
 * Determine the length of a chord of a circle.
 * (There is a simple formula; derive it or look it up.)
 * 
 * @param radius radius of a circle, must be > 0
 * @param angle in radians, where 0 <= angle < Math.PI
 * @returns the length of the chord subtended by the given `angle` 
 *          in a circle of the given `radius`
 */
export function chordLength(radius: number, angle: number): number {

    return 2 * radius * Math.sin(angle / 2);

}

/**
 * Approximate a circle by drawing a many-sided regular polygon, 
 * using exactly `numSides` small counterclockwise turns,
 * so that the turtle is back to its original heading and position
 * after the drawing is complete.
 * 
 * @param turtle the turtle context
 * @param radius radius of the circle circumscribed around the polygon, must be > 0
 * @param numSides number of sides of the polygon to draw, must be >= 10
 */
export function drawApproximateCircle(turtle: Turtle, radius: number, numSides: number): void {

    drawApproximateArc(turtle, radius, 2*Math.PI, numSides, Direction.COUNTERCLOCKWISE);

}

/**
 * Approximate an arc of a circle by drawing a many consecutive sides of a regular-sided polygon, 
 * using exactly `numSides` small turns in the specified direction
 * 
 * @param turtle the turtle context
 * @param radius radius of the circle circumscribed around the polygon, must be > 0
 * @param angle measure of the arc in radians, where 0 <= angle <= 2*Math.PI
 * @param numSides number of sides of the polygon to draw, must be >= 3
 * @param direction to draw the arc, must be either Direction.CLOCKWISE or Direction.COUNTERCLOCKWISE
 */
export function drawApproximateArc(turtle: Turtle, radius: number, angle: number, numSides: number, direction: Direction): void {

    for (let i = 0; i < numSides; i++) {
        turtle.forward(chordLength(radius,  angle / numSides));
        turtle.turn(radiansToDegrees(angle/numSides) * direction);
    }

}

/**
 * Calculate the distance between two points.
 * 
 * @param p1 one point
 * @param p2 another point
 * @returns Euclidean distance between p1 and p2
 */
export function distance(p1: Point, p2: Point): number {

    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

}


/**
 * Calculate the angle between two points relative to the x-axis.
 * 
 * @param p1 one point
 * @param p2 another point
 * @returns angle between p1 and p2 in degrees
 */
export function angleBetweenPoints(p1: Point, p2: Point): number {

    return radiansToDegrees(Math.atan2(p2.y - p1.y, p2.x - p1.x));

}

/**
 * Given a list of points, find a sequence of turns and moves that visits the points in order,
 * ending with the turtle facing its original heading.
 * 
 * @param points array of N input points.  Adjacent points must be distinct, and the array must not start with (0,0).
 * @returns an array of length 2N+1 of the form [turn_0, move_0, ..., turn_N-1, move_N-1, turn_N]
 *    such that if the turtle starts at (0,0) heading up (positive y direction), 
 *    and executes turn(turn_i) and forward(move_i) actions in the same order, 
 *    then it will be at points[i] after move_i for all valid i,
 *    and be back to its original upward heading after turn_N.
 */
export function findPath(points: Array<Point>): Array<number> {

    const path = [];
    let currDir = ninetyDegrees;
    let currPoint = new Point(0, 0);
    
    for (const newPoint of points) {
        const newDir = angleBetweenPoints(currPoint, newPoint);
        
        path.push((currDir-newDir) % circleDegrees);
        path.push(distance(currPoint, newPoint));
        
        currPoint = newPoint;
        currDir = newDir;
    }
    path.push(currDir-ninetyDegrees); // return to original direction

    return path;
}

/**
 * Draw your personal, custom art.
 * 
 * Many interesting images can be drawn using the simple implementation of a turtle.
 * See the problem set handout for more information.
 * 
 * Drew a pink bow with a red heart on top.
 * 
 * @param turtle the turtle context
 */
export function drawPersonalArt(turtle: Turtle): void {

    //Draw Bow
    const angleOffsets : ReadonlyArray<number> = [fortyFiveDegrees, -ninetyDegrees];
    const bowWidth = 20;
    const numSides = 100;
    const ribbonMultiplier = 4;
    const quarterCircle = Math.PI/2;

    turtle.color(PenColor.Pink);

    for (const [i, dir] of [Direction.CLOCKWISE, Direction.COUNTERCLOCKWISE].entries()) {
        // Draw bow part of bow
        turtle.turn(angleOffsets[i]);
        drawApproximateArc(turtle, bowWidth*2, quarterCircle, numSides, dir);
        drawApproximateArc(turtle, bowWidth, quarterCircle, numSides, dir);
        drawApproximateArc(turtle, bowWidth*2, quarterCircle, numSides, dir);
                
        // Draw ribbon part of bow
        turtle.turn(halfCircleDegrees);
        turtle.forward(bowWidth*ribbonMultiplier); // length of ribbon
        turtle.turn((ninetyDegrees + fortyFiveDegrees)*dir);
        turtle.forward(bowWidth/2); // diagonal cutout of ribbon
        turtle.turn(-ninetyDegrees*dir);
        turtle.forward(bowWidth/2); // diagonal cutout of ribbon
        turtle.turn((ninetyDegrees + fortyFiveDegrees)*dir);

        // Calculating offset to make ribbon line up with bow
        // Law of consines to calculate the length of the chord of the center circle of the bow subtended by the ribbon
        const ribbonChord = Math.sqrt(2*bowWidth**2-2*bowWidth**2*Math.cos(quarterCircle/2));
        // Pythagorean theorem to calculate offset needed to extend ribbon to line up with bow
        const offset = Math.sqrt(ribbonChord**2-(bowWidth/Math.sqrt(2))**2);
        turtle.forward(bowWidth*ribbonMultiplier+offset); // length of ribbon
        
        // Draw center part of bow
        turtle.turn(-fortyFiveDegrees*dir);
        drawApproximateArc(turtle, bowWidth, Math.PI-quarterCircle/2, numSides, dir);
    
    }

    drawApproximateArc(turtle, bowWidth, Math.PI/2, numSides, Direction.COUNTERCLOCKWISE); // Finish the middle of the bow

    //Draw Heart on Top
    const heartMultiplier = 3;
    const heartLength : number = bowWidth*heartMultiplier;
    turtle.color(PenColor.Red);

    // first half of heart
    turtle.turn(ninetyDegrees);
    turtle.forward(heartLength);
    drawApproximateArc(turtle, (heartLength+bowWidth)/2, Math.PI, numSides, Direction.CLOCKWISE);

    // second half of heart
    turtle.turn(-ninetyDegrees);
    drawApproximateArc(turtle, (heartLength+bowWidth)/2, Math.PI, numSides, Direction.CLOCKWISE);
    turtle.forward(heartLength);

}

/**
 * Main program.
 * 
 * This function creates a turtle and draws in a window.
 */
export function main(): void {
    const turtle: Turtle = new DrawableTurtle();

    drawPersonalArt(turtle);

    // draw into a file
    const svgDrawing = turtle.getSVG();
    fs.writeFileSync('output.html', `<html>\n${svgDrawing}</html>\n`);

    // open it in a web browser
    void open('output.html');
}
