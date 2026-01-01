/* Copyright (c) 2025 MIT 6.102 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

import assert from 'node:assert';
import { Point, bezierInterpolate, bezierPath } from '../src/curves.js';
import { assertApproxEqual } from '../src/utils.js';
import * as utils from '../src/utils.js';

describe('bezierInterpolate', function() {
    /*
     * Testing strategy:
     * 
     * partition on t: <0, 0, 0<t<1, t>1
     * partition on length of controlPoints: 0, 1, 2, >2
     */

    it('covers length of controlPoints=0', function() {
        assert.throws(
            () => bezierInterpolate([], 8000),
            Error,
            'does not catch error for empty array'
        );
    });
    it('covers t<0, length of controlPoints=1', function() {
        const point = bezierInterpolate([ { x: 61, y: -5 }], -5.4);
        assert.deepStrictEqual(point, { x: 61, y: -5}, 'expected P_0 at t=0');
    });
    it('covers t>0, length of controlPoints=2', function() {
        const point = bezierInterpolate([ { x: 0, y: 0 }, { x: 1, y: 1 } ], 0.4);
        assert.deepStrictEqual(point, { x: 0.4, y: 0.4 }, 'expected linear interpolation between two points');
    });
    it('covers t<0, length of controlPoints>2', function() {
        const point = bezierInterpolate([ { x: 72, y: 160}, { x: -69, y: 170}, { x: -82, y: -2}], -21.2);
        // n=2: [{x: 3061.2, y: -52}, {x: 206.6, y: 3816.4}
        assertApproxEqual(point.x, 63578.72, 'unexpected result for n>2');
        assertApproxEqual(point.y, -82062.08 , 'unexpected result for n>2');
    });
    it('covers 0<t<1, length of controlPoints>2', function() {
        const point = bezierInterpolate([ { x: -72, y: 160}, { x: 69, y: -170}, { x: 82, y: -2}], 0.3);
        assertApproxEqual(point.x, 1.08, 'unexpected result for 0<t<1');
        assertApproxEqual(point.y, 6.82 , 'unexpected result for 0<t<1');
    });



});

describe('bezierPath', function() {
    /*
     * Testing strategy:
     * 
     * partition on length of controlPoints: 2, >2 (Bezier curve cannot have less than 2 control points)
     * partition on numPoints: undefined, 0, >0
     * partition on result of easing function: always 0, always 1, varies between [0,1]
     * 
     */

    it('covers numPoints=undefined', function() {
        const path = bezierPath([{ x: 10, y: 20 }, {x: -31, y: 49}], t => t*t, undefined);
        assert.strictEqual(path.length, 12, 'expected 12 points');
    });
    it('covers numPoints=0', function() {
        const path = bezierPath([{ x: 10, y: 20 }, {x: -31, y: 49}], t => t*t, 0);
        assert.deepStrictEqual(path, [{ x: 10, y: 20 }, {x: -31, y: 49}], 'expected 2 points');
    });
    it('covers length of controlPoints=2, numPoints>0', function() {
        const path = bezierPath([{ x: -10, y: -10 }, {x: 10, y: 10}], t => t, 3);
        assert.deepStrictEqual(path, [{ x: -10, y: -10 }, {x: -5, y: -5}, {x: 0, y: 0}, {x: 5, y: 5}, {x: 10, y: 10}], 
            'expected 5 points on a line');
    });
    it('covers length of controlPoints>2, numPoints>0, easing function varies between [0,1]', function() {
        const path = bezierPath([{ x: 10, y: 10 }, { x: 0, y: 0 }, { x: 10, y: 0 }], t => t*t, 4);
        assert.strictEqual(path.length, 6, 'expected 6 points');
    });
    it('covers easing function always 0', function() {
        const path = bezierPath([{ x: 10, y: 10 }, { x: 0, y: 0 }, { x: 10, y: 0 }], t => 0, 4);
        assert.deepStrictEqual(path, [{ x: 10, y: 10 }, { x: 10, y: 10 }, { x: 10, y: 10 }, { x: 10, y: 10 },{ x: 10, y: 10 }, { x: 10, y: 0}], 
            'expected first 5 points equal to first control point');
    });
    it('covers easing function always 1', function() {
        const path = bezierPath([{ x: 10, y: 10 }, { x: 0, y: 0 }, { x: 10, y: 0 }], t => 1, 4);
        assert.deepStrictEqual(path, [{ x: 10, y: 10 }, { x: 10, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 0 }], 
            'expected first and last points equal to first and last control points');
    });

});
