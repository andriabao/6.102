/* Copyright (c) 2025 MIT 6.102 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

import assert from 'node:assert';
import type { Color } from '../src/colors.js';
import * as colorsModule from '../src/colors.js';
import { assertApproxEqual } from '../src/utils.js';
import * as utils from '../src/utils.js';

// PS1 instructions: test each of these functions independently
const lerpColor = undefined, gradient = undefined, palette = undefined, interpolate = undefined;

/*
 * Warning: tests you write in this file must be runnable against any implementations that follow the spec!
 * Your tests will be run against several staff implementations of these functions.
 * 
 * Do NOT strengthen the spec of any of those functions.
 */

describe('lerpColor', function() {
    const { lerpColor } = colorsModule;

    /*
     * Testing strategy
     * 
     * partition on t: 0, 0 < t < 1, 1
     * 
     * partition on each color component r, g, b for each color c0, c1: 
     *      0, 0 < color component < 255, 255
     */

    it('covers 0<t<1, c0 = [0, 0, 0], c1 = [255, 255, 255]', function() {
        assert.deepStrictEqual(
            lerpColor([0, 0, 0], [255, 255, 255], 0.1),
            [26, 26, 26],
            'expected original 10% gray between black and white'
        );
    });
    it('covers t=1, c0 : r=255, 0 <g<255, b=255, c1 : 0<r<255, g=0, 0<b<255', function() {
        assert.deepStrictEqual(
            lerpColor([255, 2, 255], [72, 0, 61], 1),
            [72, 0, 61],
            'expected second point, dark purple [72, 0, 61]'
        );
    });
    it('covers t=0, c0: 0<r<255, g=255,  0<b<255, c1: 0<r<255, 0<g<255, b=0', function() {
        assert.deepStrictEqual(
            lerpColor([126, 255, 81], [3, 14, 0], 0),
            [126, 255, 81],
            'expected first point, lime green [126, 255, 81]'
        );
    });
    it('covers 0<t<1, c0 : 0<r<255, 0<g<255, 0<b<255, c1: r=0, 0<g<255, 0<b<255', function() {
        assert.deepStrictEqual(
            lerpColor([167, 51, 91], [0, 224, 54], 0.5),
            [84, 138, 73],
            'expected darker green color [84, 138, 73]'
        );
    });
});

describe('makeGradient', function() {
    const { makeGradient } = colorsModule;

    /*
     * Testing strategy
     * 
     * partition on length of input: 0, 1, 2, >2
     * partition on sequence of keys: no keys (empty map), increasing, decreasing, non-monotonic
     * partition on step size between keys sorted in ascending order: no keys (empty map), all 1, some >1
     * partition on smallest key: no keys (empty map), <0 ,0, >0
     * partition on colors: no colors (empty map), some the same, all different
     */

    it('covers input of length 0', function() {
        assert.deepStrictEqual(
            makeGradient(new Map()),
            new Map(),
            `expected empty map`
        );
    });
    it('covers input of length 1, smallest key>0', function() {
        const start: Color = [100, 20, 200]
        assert.deepStrictEqual(
            makeGradient(new Map([[4, start]])),
            new Map([[4, start]]),
            `expected 1 color ${start}`
        );
    });
    it('covers input of length 2, '
        + 'increasing sequence of keys, '
        + '>1 step size between keys, '
        + 'smallest key=0, '
        + 'all different colors', function() {
        const start: Color = [0, 0, 252], end: Color = [0, 126, 0];
        const gradient = makeGradient(new Map([ [0, start], [3, end] ]));
        const intermediate = [ gradient.get(1), gradient.get(2) ];
        assert.deepStrictEqual(
            intermediate,
            [ [0, 42, 168], [0, 84, 84] ],
            `expected 2 colors between ${start} and ${end}`
        );
    });
    it('covers input of length>2, '
        + 'non-monotonic sequence of keys, '
        + '>1 step size between keys, '
        + 'smallest key=0, '
        + 'all different colors', function() {
        const expected = new Map([[0, [0,0,252]], [1, [0,42,168]], [2, [0,84,84]], [3, [0,126,0]], [4, [127,63,0]], [5, [254,0,0]]]);
        const gradient = makeGradient(new Map([[5, [254,0,0]], [0, [0,0,252]], [3, [0,126,0]]]));
        assert.deepStrictEqual(
            gradient,
            expected,
            `expected ${expected}`
        );
    });
    it('covers input of length 2, '
        + 'decreasing sequence of keys, '
        + '1 step size between keys, '
        + 'smallest key>0, '
        + 'some same colors', function() {
        const expected = new Map([[11, [250,61, 72] as Color],[10, [250,61,72] as Color]]);
        const gradient = makeGradient(expected);
        assert.deepStrictEqual(
            gradient,
            expected,
            `expected ${expected}`
        );
    });
    it('covers input of length >2, '
        + 'non-monotonic sequence of keys, '
        + '>1 step size between keys, '
        + 'smallest key<0, '
        + 'some same colors', function() {
        const expected = new Map([[-3, [5, 10, 15]], [-2, [74, 33, 44]], [-1, [143, 56, 73]], 
            [0, [212,79, 102]], 
            [1, [5, 10, 15]], [2, [45, 21, 77]], [3, [86, 32, 138]],
            [4, [126,43, 200]]]);
        const gradient = makeGradient(new Map([[4, [126,43, 200]], [-3, [5, 10, 15]], [0, [212,79, 102]], [1, [5, 10, 15]]]));
        assert.deepStrictEqual(
            gradient,
            expected,
            `expected ${expected}`
        );
    });


});

describe('makePalette', function() {
    const { makePalette } = colorsModule;

    /*
     * Testing strategy
     * 
     * partition on hue of color: 0°, 360°, 0°<hue<360°
     * partition on n: 0, 1, 2, 2<n<=600, >600
     * partition on n: evenly divides 360, does not evenly divide 360
     */

    it('covers n=0', function() {
        const color: Color = [149, 53, 78];
        const palette = makePalette(color, 0);
        assert.strictEqual(
            palette.length,
            0,
            `expected empty array`
        );
    });
    it('covers hue=0°, n=2', function() {
        const color: Color = [245, 66, 66];
        const palette = makePalette(color, 2);
        assert.strictEqual(palette.length, 2, `expected 2 colors`);
        assert(palette.some(c => isEqualColors(c, color)), `expected original color ${color}`);
        assert(palette.some(c => isEqualColors(c, [66, 245, 245] as Color)), `expected original color [66, 245, 245]`);
    });
    it('covers hue=360°, n>2, n does not divide 360', function() {
        const color: Color = [242, 176, 176];
        const expected = [
            [ 242, 176, 176 ],
            [ 242, 233, 176 ],
            [ 195, 242, 176 ],
            [ 176, 242, 214 ],
            [ 176, 214, 242 ],
            [ 195, 176, 242 ],
            [ 242, 176, 233 ]
        ];
        const palette = makePalette(color, 7);
        assert.strictEqual(palette.length, 7, `expected 7 colors`);
        for (let i = 0; i < 7; i++) {
            assert(palette.some(c => isEqualColors(c, expected[i] as Color)),
                `expected ${palette[i]} in palette`
            );
        }
    });
    it('covers 0°<hue<360°, n>2, n divides 360', function() {
        const color: Color = [0, 255, 0];
        const palette = makePalette(color, 4);
        assert.strictEqual(
            palette.length,
            4,
            `unexpected number of colors in palette from ${color}`
        );
    });
    it('covers 0°<hue<360°, n=1', function() {
        const color: Color = [137, 53, 161];
        const palette = makePalette(color, 1);
        assert.deepStrictEqual(
            palette,
            [color],
            `palette should only contain original color ${color}`
        );
    });
    it('covers 0°<hue<360°, n>600', function() {
        const color: Color = [50, 100, 150];
        const palette = makePalette(color, 601);
        assert.strictEqual(
            palette.length,
            600,
            `unexpected number of colors in palette from ${color} with n=601`
        );
    });


});

/**
 * Helper function for comparing colors
 * 
 * @param actual first Color
 * @param expected second Color
 * @returns if the two colors are equal
 */
export function isEqualColors(actual: Color, expected: Color) {
    return (actual[0] === expected[0] && actual[1] === expected[1] && actual[2] === expected[2]);
}

describe('interpolate', function() {
    const { interpolate } = colorsModule;

    /*
     * Testing strategy
     * 
     * partition on v0: 0, <0, >0
     * partition on v1: 0, <0, >0
     * partition on v0 and v1: v1>v0, v1=v0, v1<v0
     * partition on t: <0 ,0, 0<t<1, 1, >1
     * partition on easing function over [0,1]: increasing, decreasing, non-monotonic
     * partition on easing(t): <0, 0, 0 < easing(t) < 1, 1, >1
     */

    it('covers t<0', function() {
        assert.throws(
            () => interpolate(0, 1, t => t, -0.1),
            Error,
            'does not catch error for t<0'
        );
    });
    it('covers t>1', function() {
        assert.throws(
            () => interpolate(0, 1, t => t, 6),
            Error,
            'does not catch error for t>1'
        );
    });
    it('covers v0=0, '
        + 'v1>0, '
        + 'v1>v0'
        + '0<t<1, '
        + 'increasing easing function, '
        + '0<easing(t)<1', function() {
        assertApproxEqual(
            interpolate(0, 1, t => t, 0.25),
            0.25,
            'incorrect value with identity easing function'
        );
    });
    it('covers v0<0, '
        + 'v1=0, '
        + 'v1<v0'
        + 't=1, '
        + 'decreasing easing function, '
        + 'easing(t)=0', function() {
        assertApproxEqual(
            interpolate(-1, 0, t => -t*t+1, 1),
            -1,
            'incorrect value with t => -t*t+1'
        );
    });
    it('covers v0>0, '
        + 'v1>0, '
        + 'v1=v0, '
        + 't=0, '
        + "decreasing easing function, "
        + 'easing(t)=1', function() {
        assertApproxEqual(
            interpolate(2, 2, t => -Math.abs(t) + 1, 0),
            2,
            'incorrect value with t => -Math.abs(t)'
        );
    });
    it('covers v0=0, '
        + 'v1<0, '
        + 'v1<v0, '
        + 'non-monotonic easing function, '
        + 'easing(t)<0', function() {
        assertApproxEqual(
            interpolate(0, -10, t => t*Math.cos(2*Math.PI*t), 0.6),
            4.8541,
            'incorrect value with t => t*Math.cos(2*Math.PI*t)'
        );
    });    
    it('covers v0<0, '
        + 'v1>0, '
        + 'v1>v0, '
        + 'increasing easing function, '
        + 'easing(t)>1', function() {
        assertApproxEqual(
            interpolate(-7.2, 4.1, t => 2**t, 0.3),
            6.7119,
            'incorrect value with t => 2**t'
        );
    });    

});
