/* Copyright (c) 2025 MIT 6.102 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

/** Toolbox of functions for constructing simple animations. @module */

import assert from 'node:assert';
import { Polyline, Frame, Animation, framerate, animateToFile } from '../lib/animate.js';
import { Color, lerpColor, makeGradient, makePalette, interpolate } from './colors.js';
import { Point, bezierInterpolate, bezierPath } from './curves.js';
import * as utils from './utils.js';

/*
 * PS1 instructions: define animation toolbox functions below.
 */

/**
 * Given a drawing, creates an animation of the drawing moving along a path defined by a list
 * of points, where each point represents the position of the drawing at a given frame.
 * In addition, the color of the drawing changes over the frames according to a gradient.
 * 
 * @param drawing list of list of points, where each inner list represents a curve in the drawing.
 * Both the outer list and the inner lists must be nonempty, and all inner lists must have the same length.
 * @param gradient mapping of frame number to color, where the color of the entire drawing at the given frame 
 * is the value of the mapping at that frame number. Keys must be consecutive integers starting from 0.
 * @param path along which the drawing travels, must have the same length as the gradient.
 * @returns animation as the list of frames
 */
export function movingAnimation(drawing: Array<Array<Point>>, gradient: Map<number, Color>, path: Array<Point>) : Animation {
    const animation = new Array<Frame>();
    //iterate through all points in path
    for (const [frameCount, point] of path.entries()) {
        const frame = new Array<Polyline>();
        for(const curve of drawing) {
            const points = Array<Point>();
            for(const circlePoint of curve) { //iterate through all points in drawing
                //offset the drawing by the current point in path
                points.push({x: circlePoint.x + point.x, y: circlePoint.y + point.y});
            }
            frame.push({ color: gradient.get(frameCount) as Color, points: points });
        }
        animation.push(frame);
    }
    return animation;
}

/**
 * Given a drawing, creates an animation of the drawing being revealed according to a path defined by a list
 * of points, where each point represents the proportion of drawing that is revealed.
 * In addition, the color of the drawing changes according to a color palette.
 * 
 * @param drawing list of list of points, where each inner list represents a curve in the drawing.
 * Both the outer list and the inner lists must be nonempty, and all inner lists must have the same length.
 * Each curve must have length at least 2.
 * @param colorPalette each curve follows, where the nth color in the palette is the color connecting the 
 * nth and n+1th point in each curve. Must have length equal to (number of points in each curve - 1)
 * @param path whose x value represents the proportion of drawing that is revealed. Each x value must be
 * between 0 and 1, inclusive.
 * @returns animation as the list of frames
 */
export function revealAnimation(drawing: Array<Array<Point>>, colorPalette: Color[], path: Point[]) : Animation {
    const animation = new Array<Frame>();
    for (const fraction of path) {
        const frame = new Array<Polyline>();
        for(const curve of drawing) {
            for(let i = 0; i < colorPalette.length*fraction.x; i++) { //iterate through all revealed points
                frame.push({ color: colorPalette[i], points: [curve[i], curve[i+1]] });
            }
        }
        animation.push(frame);
    }
    return animation;
}
/*
 * PS1 instructions: everything above is entirely up to you.
 * Implement the functions below to reproduce the animations in the problem set handout, using
 * your functions above. A useful toolbox should keep these implementations short!
 * Do NOT change the names or signatures of these functions.
 */

/**
 * Generate and save example #1 "alley-oop" from the handout to "example1.html".
 */
export function handoutExampleOne(): void {
    // ESLint will complain about magic numbers in the following declarations, but you may ignore
    // those warnings. For example, naming the individual red/green/blue components of the staff's
    // arbitrarily-chosen colors does not make the code easier to understand.
    const durationSec = 1;
    const circleShape = [
        [ { x: 10, y: 10 }, { x: 10, y: 17 }, { x: 20, y: 17 }, { x: 20, y: 10 } ],
        [ { x: 10, y: 10 }, { x: 10, y: 3 }, { x: 20, y: 3 }, { x: 20, y: 10 } ],
    ];
    const upDown = [ { x: 0, y: 0 }, { x: 40, y: 110 }, { x: 80, y: 0 } ];
    const cubicInOut = (t: number): number => 4 * (t - .5)**3 + .5;
    const gray: Color = [ 128, 128, 128 ];
    const greenYellow: Color = [ 173, 255, 47 ];

    //create bezier curves for circle shape
    const circleCurves = [bezierPath(circleShape[0], t => t, undefined), bezierPath(circleShape[1], t => t, undefined).reverse()];
    const colorGradient = makeGradient(new Map([[0, gray], [durationSec*framerate-1, greenYellow]]));
    const path = bezierPath(upDown, cubicInOut, durationSec*framerate-2);

    const animation = movingAnimation(circleCurves, colorGradient, path);

    animateToFile(animation, 'example1.html');
}

/**
 * Generate and save example #2 "rainbow connection" from the handout to "example2.html".
 */
export function handoutExampleTwo(): void {
    // ESLint will complain about magic numbers in the following declarations, but you may ignore
    // those warnings. For example, naming the individual control points in the staff's
    // arbitrarily-chosen easing function does not make the code easier to understand.
    const durationSec = 2;
    const heartShape = [
        [ { x: 50, y: 25 }, { x: 34, y: 42 }, { x: 2, y: 36 }, { x: 0, y: 0 }, { x: 50, y: -40 } ],
        [ { x: 50, y: -40 }, { x: 100, y: 0 }, { x: 98, y: 36 }, { x: 66, y: 42 }, { x: 50, y: 25 } ],
    ];
    const easeInOutIn = [ .25, 1, -1, 1, 1, 1, 1 ];
    const turquoise: Color = [ 39, 229, 220 ];

    const numPoints = 300;

    //map 1d easing function to 2d easing function
    const easeInOutInPoints : Array<Point> = (easeInOutIn).map(num => ({x: num, y: 0}));
    //create bezier curves for heart shape
    const heartCurves = [bezierPath(heartShape[0], t => t, numPoints-1), bezierPath(heartShape[1], t => t, numPoints-1)];
    const colorPalette = makePalette(turquoise, numPoints);
    const path = bezierPath(easeInOutInPoints, t => t, durationSec*framerate-2);

    const animation = revealAnimation(heartCurves, colorPalette, path);

    animateToFile(animation, 'example2.html');
}
