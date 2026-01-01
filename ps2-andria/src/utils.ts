/* Copyright (c) 2025 MIT 6.102 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

/** Utility functions. @module */

import assert from 'node:assert';
import { Interval } from './interval.js';
import { IntervalSet, IntervalConflictError } from './intervalset.js';
import { MultiIntervalSet } from './multiintervalset.js';

/*
 * PS2 instructions: use this file to define public utility functions.
 * 
 * You may define small private helper functions in individual implementation files.
 * For helper functions of any complexity and/or helpers used by both implementations and tests,
 * define them here and test them in `test/utils.test.ts`.
 */

/** Default tolerance for assertApproxEqual. */
export const defaultTolerance = 0.001;

/**
 * @param actual actual value
 * @param expected expected value
 * @param message optional error message
 * @param tolerance optional error tolerance, overriding the default
 * @throws AssertionError iff |actual-expected| > tolerance
 */
export function assertApproxEqual(actual: number, expected: number, message?: string, tolerance=defaultTolerance): void {
    if (Math.abs(actual - expected) > tolerance) {
        throw new assert.AssertionError({
            message,
            actual: `${actual}`,
            expected: `${expected} ± ${tolerance}`,
            operator: 'not approx. eq.',
            stackStartFn: assert.AssertionError,
        });
    }
}


/**
 * Asserts that two intervals are equal.
 * @param actual interval 
 * @param expected interval
 * @param message optional error message
 */
export function assertEqualIntervals(actual: Interval, expected: Interval, message?: string): void {
    assert.strictEqual(actual.start, expected.start, message);
    assert.strictEqual(actual.end, expected.end, message);
}

/**
 * Asserts that two interval sets are equal.
 * @param actual interval set
 * @param expected interval set
 * @param message optional error message
 */
export function assertEqualIntervalSet(actual: IntervalSet<number>, expected: IntervalSet<number>, message?: string): void {
    assert.deepStrictEqual(actual.labels().size, expected.labels().size, message);
    for (const label of actual.labels()) {
        assertEqualIntervals(actual.interval(label) as Interval, expected.interval(label) as Interval, message);
    }
}

/**
 * Checks whether two intervals overlap.
 * @param intervalA first interval
 * @param intervalB second interval
 * @returns true if the intervals overlap, false otherwise
 */
export function checkOverlap(intervalA: Interval, intervalB: Interval): boolean {
    return intervalA.start < intervalB.end && intervalB.start < intervalA.end;
}