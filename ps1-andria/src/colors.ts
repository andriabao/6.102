/* Copyright (c) 2025 MIT 6.102 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

/** Functions for working with RGB colors. @module */

import assert from 'node:assert';
import { lerp } from './lerp.js';
import * as utils from './utils.js';

/*
 * PS1 instructions:
 * - All specifications in this file are required and you may NOT change them.
 * - Specifications with non-integral numbers assume a tolerance as explained in the handout,
 *   and you may NOT strengthen or weaken that tolerance.
 */

/**
 * A 3-tuple representing a color.
 */
export type Color = [number, number, number];

/**
 * Perform linear interpolation between RGB colors, [r,g,b] tuples of integers 0 <= r,g,b <= 255.
 * 
 * @param c0 initial RGB color
 * @param c1 final RGB color
 * @param t parameter 0 <= t <= 1
 * @returns the RGB color whose components are linearly interpolated between corresponding
 *   components of c0 and c1 with parameter t, rounded to the nearest integer (half up)
 */
export function lerpColor(c0: Color, c1: Color, t: number): Color {
    if(t < 0 || t > 1) {
        throw new Error('t must be between 0 and 1, inclusive');
    }

    return Array.from({length: 3}, (_, i) => Math.round(lerp(c0[i], c1[i], t))) as Color;
}

/**
 * Produce a multicolor gradient that transitions between the provided colors in the specified steps.
 * All colors are [r,g,b] tuples of integers 0 <= r,g,b <= 255.
 * 
 * For example, given:
 * - { 0: [0,0,252], 3: [0,126,0], 5: [254,0,0] }
 * 
 * Produces:
 * - { 0: [0,0,252], 1: [0,42,168], 2: [0,84,84], 3: [0,126,0], 4: [127,63,0], 5: [254,0,0] }
 * 
 * @param colors a map of integer keys to RGB colors, not containing keys that differ by more than 2^10
 * @returns a map whose keys are the integers from the lowest to highest keys in colors, inclusive,
 *   and each key `k` maps to the RGB color:
 *   - colors[k] if k is a key in colors
 *   - otherwise, letting `prev` and `next` be the nearest lower and higher keys in colors, respectively,
 *     the linear interpolation between colors[prev] and colors[next], rounded (half up), at t equal to
 *     k's fractional distance from prev to next
 */
export function makeGradient(colors: Map<number, Color>): Map<number, Color> {
    const sortedKeys : Array<number> = Array.from(colors.keys()).sort((key0, key1) => key0 - key1); //sorts keys in ascending order
    const gradient : Map<number, Color> = new Map(sortedKeys.map(key => [key, colors.get(key) as Color])); //initialize gradient with existing colors

    //iterate between lowest to highest key in colors
    for (let i = 0; i < sortedKeys.length - 1; i++) {
        const start : number = sortedKeys[i];
        const end : number = sortedKeys[i + 1];

        //iterate through intermediate keys
        for (let intermediate = start + 1; intermediate < end; intermediate++) {
            const colorStart = colors.get(start) as Color;
            const colorEnd = colors.get(end) as Color;    
            const lerpParameter = (intermediate - start) / (end - start);
            gradient.set(intermediate , (lerpColor(colorStart, colorEnd, lerpParameter)));
        }
    }
    return gradient;
}

/**
 * Produce a palette of RGB colors that have the same saturation and lightness as the input and evenly
 * divide the spectrum of hues using the HSL representation of RGB.
 * All input and output colors are [r,g,b] tuples of integers 0 <= r,g,b <= 255.
 * See https://en.wikipedia.org/wiki/HSL_and_HSV for an explanation of HSL and its relationship to RGB.
 * 
 * For example, a palette generated from pure green (which has hue=120°, saturation=100%, lightness=50%)
 * and n=4 would have: a bright orange (hue=30°), pure green, a dodger blue (210°), and fuchsia (300°).
 * 
 * @param color base RGB color
 * @param n number of hues to select from the spectrum of hues, nonnegative integer
 * @returns an array of exactly all the distinct RGB colors converted (and rounded, half up) from HSL colors that have:
 *   - hues, in degrees, that are multiples modulo 360 of 360/n degrees from the hue of `color`,
 *   - and the same saturation and lightness as `color`
 */
export function makePalette(color: Color, n: number): Array<Color> {
    const hueDegrees = 360;
    const palette : Set<string> = new Set();
    const [hue, saturation, lightness] = utils.rgbToHsl(color);

    //generate n colors with hue that are multiples modulo 360 of 360/n degrees from the hue of 'color'
    for(let i = 0; i < n; i++) {
        const newHue = (hue + (hueDegrees / n) * i) % hueDegrees;
        palette.add(utils.hslToRgb([newHue, saturation, lightness]).join(",")); //convert to string to avoid duplicates
    }

    return Array.from(palette).map(color => color.split(",").map(Number)) as Array<Color>;

}

/**
 * Perform interpolation of scalars with an easing function. The easing function transforms linear
 * change into change that may accelerate, oscillate, etc., and that may not be bounded or endpointed
 * by v0 and v1.
 * 
 * For example:
 * 
 *     interpolate(0, 1, t => t*t, 0.6) = 0.36
 *     interpolate(0, 10, t => t*Math.cos(2*Math.PI*t), 0.4) ≈ -3.236
 * 
 * @param v0 value when easing(t) = 0
 * @param v1 value when easing(t) = 1
 * @param easing function mapping input interpolation parameter ti, 0 <= ti <= 1, to an applied
 *   interpolation parameter, unconstrained
 * @param t input interpolation parameter
 * @returns the linear interpolation along v0 to v1 at easing(t)
 * @throws Error if t < 0 or t > 1
 */
export function interpolate(v0: number, v1: number, easing: (ti: number) => number, t: number): number {
    // In one sentence, why can you not use `lerp` with your `lerpWeak` spec to implement this function?
    // 'lerpWeak' requires v0 and v1 to be integers between 0 and 255, and requires t to be between 0 and 1 
    // while interpolate uses values of t, v0 and v1 that are unconstrained.

    if(t < 0 || t > 1) {
        throw new Error('t must be between 0 and 1, inclusive');
    }
    
    return lerp(v0, v1, easing(t));
}
