/* Copyright (c) 2025 MIT 6.102 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

/** Function for performing linear interpolation. @module */

import assert from 'node:assert';

/**
 * Perform linear interpolation between two numbers representing RGB color components.
 * @param v0 initial integer value 0 <= v0 <= 255
 * @param v1 final integer value 0 <= v1 <= 255
 * @param t interpolation parameter 0 <= t <= 1
 * @returns the value linearly interpolated between v0 and v1 with parameter t
 */
function lerpWeak(v0: number, v1: number, t: number): number {
    const maxColorValue = 255;

    if(t < 0 || t > 1) {
        throw new Error('t must be between 0 and 1, inclusive');
    } else if (v0 < 0 || v0 > maxColorValue || v1 < 0 || v1 > maxColorValue) {
        throw new Error('v0 and v1 must be between 0 and 255, inclusive');
    }

    return v0 + t * (v1 - v0);
}

/**
 * Perform linear interpolation between two scalars, with an unbounded interpolation parameter.
 * @param v0 initial scalar
 * @param v1 final scalar
 * @param t interpolation parameter
 * @returns the value linearly interpolated between v0 and v1 with parameter t
 */
function lerpStrong(v0: number, v1: number, t: number): number {
    return v0 + t * (v1 - v0);
}

// In three sentences, explicate the relationship between your `lerpWeak` and `lerpStrong`...
// 1. In one sentence, explain the relationship between their preconditions:
// The precondition of 'lerpWeak' is stronger than the precondition of 'lerpStrong'.
// 2. In one sentence, explain the relationship between their postconditions:
// The postcondition of 'lerpWeak' is the same postcondition of 'lerpStrong'.
// 3. In one sentence, explain the resulting relationship between their specs:
// 'lerpStrong' has a stronger spec than 'lerpWeak'.

// `lerp` is the name used by clients of this function.
export const lerp = lerpStrong;

/** PS1 instructions: both implementations are exported for PS1 testing purposes only. */
export const forTestingOnly = { lerpWeak, lerpStrong };
