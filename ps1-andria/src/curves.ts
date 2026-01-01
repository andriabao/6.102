/* Copyright (c) 2025 MIT 6.102 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

/** Functions for working with Bézier curves. @module */

import assert from 'node:assert';
import { lerp } from './lerp.js';
import * as utils from './utils.js';

/*
 * PS1 instructions:
 * - You must strengthen, but may NOT weaken, the specifications in this file.
 */

/**
 * A point on the Cartesian plane.
 */
export type Point = { x: number, y: number };

// Create Natural Number Type from https://stackoverflow.com/questions/76698618/how-to-declare-a-natural-number-type-in-typescript
export type Integer<T extends number> = `${T}` extends `${string}.${string}`
  ? never
  : T;
export type Positive<T extends number> = `${T}` extends `-${string}`
  ? never
  : T;
export type PositiveInteger<T extends number> = Positive<Integer<T>>;
export type Natural = PositiveInteger<number>;

/**
 * Computes a single point on a Bézier curve at the given interpolation parameter.
 * 
 * @param controlPoints of the Bézier curve
 * @param t interpolation parameter
 * @returns the point on the Bézier curve with parameter t
 * @throws Error if and only if controlPoints is empty
 */
export function bezierInterpolate(controlPoints: Array<Point>, t: number): Point {
    // Used a recursive implementation,
    //       see https://en.wikipedia.org/wiki/Bézier_curve#Recursive_definition
    //       or https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm
    // base case: 1 control point
    // recursive case: n control points
    //  - compute n-1 new control points by taking each adjacent pair of control points and
    //    linearly interpolating between them
    //  - interpolate along the new (n-1)-point curve
    if (controlPoints.length === 0) {
        throw new Error('controlPoints must be nonempty');
    } else if (controlPoints.length === 1) { //base case
        return controlPoints[0];
    } else { //recursive case
        const newControlPoints = [];
        for (let i = 0; i < controlPoints.length - 1; i++) {
            newControlPoints.push({
                x: lerp(controlPoints[i].x, controlPoints[i + 1].x, t),
                y: lerp(controlPoints[i].y, controlPoints[i + 1].y, t)
            });
        }
        return bezierInterpolate(newControlPoints, t);
    }
}

/**
 * Given a Bézier curve and an easing function, produce a sequence of points suitable for animating
 * the eased movement along the curve. See https://en.wikipedia.org/wiki/Bézier_curve for an explanation
 * of Bézier curves. The easing function must satisfy:
 * - easing(t) is always in [0, 1], so that the interpolation stays on the curve
 * 
 * @param controlPoints Bézier curve control points P_0 through P_n, nonempty
 * @param easing function mapping input interpolation parameter ti, 0 <= ti <= 1, to an applied
 *   interpolation parameter, as constrained above
 * @param numSamples number of additional points sampled along the curve, or undefined to use a default value of 10
 * @returns the sequence of points on the curve, starting at P_0 and ending at P_n, with numSample additional points
 * defined by easing(ti) for ti evenly distributed in [0, 1] 
 */
export function bezierPath(controlPoints: Array<Point>, easing: (ti: number) => number, numSamples: undefined | Natural): Array<Point> {
    const defaultSamples = 10;
    const numSpaces = (numSamples ?? defaultSamples) + 1;
    const stepSize = 1 / numSpaces;
    const path = new Array<Point>();

    path.push(controlPoints[0]); //add first point

    for (let i = 1; i < numSpaces; i++) {
        path.push(bezierInterpolate(controlPoints, easing(stepSize * i)));
    }

    path.push(controlPoints[controlPoints.length - 1]); //add last point
    return path;
}
