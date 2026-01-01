/* Copyright (c) 2025 MIT 6.102 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

import assert from 'node:assert';
import { Interval } from './interval.js';
import { IntervalSet, IntervalConflictError, makeIntervalSet } from './intervalset.js';
import * as utils from './utils.js';

/**
 * A mutable set of labeled intervals, where each label is associated with one or more non-overlapping
 * half-open intervals [start, end). Neither intervals with the same label nor with different labels
 * may overlap.
 * 
 * For example, { "A"=[[0,10)], "B"=[[20,30)] } is a multi-interval set where the labels are strings
 * "A" and "B". We could add "A"=[10,20) to that set to obtain { "A"=[[0,10),[10,20)], "B"=[[20,30)] }.
 * 
 * Labels are of arbitrary type `Label` and are compared for equality using ===. They may not be null
 * or undefined.
 * 
 * PS2 instructions: this is a required ADT.
 * You may not change the specifications or add new methods.
 * 
 * @typeParam Label type of labels in this set, compared for equality using ===
 */
export class MultiIntervalSet<Label> {

    private intervalSets: Map<Label, IntervalSet<number>> = new Map();

    // Abstraction function:
    //   AF(intervalSets) = { (l, s) | l in intervalSets.keys(), s = intervalSets.get(l) },
    //                      where (l, s) is a labeled interval set with label l and intervals s
    // Representation invariant:
    //   - All intervals across every IntervalSet must be non-overlapping
    //   - For each interval in the set, the start value must be less than the end value
    // Safety from rep exposure:
    //      intervalSets is private; clear returns immutable Boolean value; labels returns a copy of the set of labels; 
    //      although mutable Lable objects, are passed to the client labels are stored and retrieved only by reference 
    //      with === and never modified by this ADT, meaning mutation of labels by clients will not affect the integrity 
    //      of the rep invariants; intervals also returns a new copy of the IntervalSet with immutable bigint values

    /**
     * Create a new multi-interval set containing the given labeled intervals; or empty if none
     * 
     * @param initial optional initial contents of the new multi-interval set
     */
    public constructor(initial?: IntervalSet<Label>) {
        if (initial !== undefined) {
            for (const label of initial.labels()) {
                const interval = initial.interval(label) as Interval;
                this.add(interval.start, interval.end, label);
            }
        }
        this.checkRep();
    }

    private checkRep(): void {
        const checkSet = makeIntervalSet<number>();
        let counter = 0;
        for (const intervalSet of this.intervalSets.values()) {
            for (const l of intervalSet.labels()) {
                const interval = intervalSet.interval(l) as Interval;
                checkSet.add(interval.start, interval.end, counter);
                counter++;
            }
        }
    }

    /**
     * Add a labeled interval to this set, if it is not already present and it does not conflict with
     * existing intervals.
     * 
     * Labeled intervals *conflict* if:
     * - they have the same label with different, overlapping intervals; or
     * - they have different labels with overlapping intervals.
     * 
     * For example, if this set is { "A"=[[0,10),[20,30)] },
     * - add("A"=[0,10)) has no effect
     * - add("B"=[10,20)) adds "B"=[[10,20)]
     * - add("C"=[20,30)) throws IntervalConflictError
     * 
     * @param start low end of the interval, inclusive
     * @param end high end of the interval, exclusive, must be greater than start
     * @param label label to add
     * @throws an {@link IntervalConflictError} if label is already in this set and is associated with
     *   an interval other than [start,end) that overlaps [start,end), or if an interval in this set
     *   with a different label overlaps [start,end)
     */
    public add(start: bigint, end: bigint, label: Label): void {
        if (start >= end) {
            throw new Error('start must be less than end');
        }
        
        // Check if overlapping interval exists
        for (const [existingLabel, existingIntervalSet] of this.intervalSets.entries()) {
            for (const l of existingIntervalSet.labels()) {
                const interval = existingIntervalSet.interval(l) as Interval;
                if(label === existingLabel && start === interval.start && end === interval.end) { // do nothing if interval is already present
                    return;
                }
                if (utils.checkOverlap(new Interval(start, end), interval)) { // check if interval overlaps with existing intervals
                    throw new IntervalConflictError("Overlapping interval detected");
                }

            }
        }
        const newIntervalSet = this.intervalSets.get(label) ?? makeIntervalSet<number>();
        const numLabel = newIntervalSet.labels().size;
        newIntervalSet.add(start, end, numLabel); // add new interval

        if (!this.intervalSets.has(label)) { // add new interval set to the map if label is not present
            this.intervalSets.set(label, newIntervalSet);
        }
        this.checkRep();
    }

    /**
     * Remove all intervals from this set.
     * 
     * @returns true if this set was non-empty, and false otherwise
     */
    public clear(): boolean {
        const wasEmpty = this.intervalSets.size === 0;
        this.intervalSets = new Map();
        this.checkRep();
        return !wasEmpty;
    }

    /**
     * Get the labels in this set.
     * 
     * @returns the labels in this set
     */
    public labels(): Set<Label> {
        return new Set(this.intervalSets.keys());
    }

    /**
     * Get all the intervals in this set associated with a given label, if any. The returned set has
     * integer labels that act as indices: label 0 is associated with the lowest interval, 1 the next,
     * and so on, for all the intervals in this set that have the provided label.
     * 
     * For example, if this set is { "A"=[[0,10),[20,30)], "B"=[[10,20)] },
     * - intervals("A") returns { 0=[0,10), 1=[20,30) }
     * 
     * @param label the label
     * @returns a new interval set that associates integer indices with the in-order intervals of
     *          label in this set
     */
    public intervals(label: Label): IntervalSet<number> {

        const intervalSet = this.intervalSets.get(label);

        if (intervalSet === undefined) {
            return makeIntervalSet<number>();
        }
        
        // Sort the intervals by start value
        const sortedIntervals: [bigint, bigint][] = [];
        for (const label of intervalSet.labels()) {
            const interval = intervalSet.interval(label) as Interval;
            sortedIntervals.push([interval.start, interval.end]);
        }
        sortedIntervals.sort((a, b) => Number(a[0] - b[0]));

        // Create a new IntervalSet with the sorted intervals
        const result = makeIntervalSet<number>();
        sortedIntervals.forEach((interval, index) => {
            result.add(interval[0], interval[1], index);
        });

        this.checkRep();
        return result;
    }

    public toString(): string {
        const intervals = Array.from(this.intervalSets.entries()).map(([label, set]) => {
            return `${label}=${set.toString()}`;
        }).join(",");
        return `{${intervals}}`;
    }
}
