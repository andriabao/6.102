/* Copyright (c) 2025 MIT 6.102 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

import assert from 'node:assert';
import { Interval } from '../src/interval.js';
import { MultiIntervalSet } from './multiintervalset.js';
import * as utils from './utils.js';

/** A 3-tuple associating a string pair with a number. */
export type LabelSimilarity = [string, string, number];

/**
 * Measure similarity between multi-interval sets with string labels.
 * 
 * Uses a client-provided definition of label similarities, where 0 is least- and 1 is most-similar.
 * 
 * The similarity between two multi-interval sets, where at least one is nonempty, is the ratio:
 *     (sum of piecewise-matching between the sets) / (span of the sets)
 * where the span is the length of the smallest interval that contains all the intervals from both
 * sets, and the amount of piecewise-matching for any unit interval [i, i+1) is:
 * -    0 if neither set has a label on that interval
 * -    0 if only one set has a label on that interval
 * -    otherwise, the similarity between labels as defined by the client, explained below
 * 
 * Two empty sets have similarity 0.
 * 
 * For example, suppose you have multi-interval sets that use labels "happy", "sad", and "meh"; and
 * similarity between labels is defined as:
 * -    1 if both are "happy", both "sad", or both "meh"
 * -    0.5 if one is meh and the other is "happy" or "sad"
 * -    0 otherwise
 * Then the similarity between these two sets:
 *     { "happy" = [[0, 1), [2,4)], "sad" = [[1,2)] }
 *     { "sad" = [[1, 2)], "meh" = [[2,3)], "happy" = [[3,4)] }
 * ... would be: (0 + 1 + 0.5 + 1) / (4 - 0) = 0.625
 * 
 * Label similarities are provided as an array of tuples, where the first two elements give a pair of
 * labels, and the third element gives the similarity between them, between 0 and 1 inclusive.
 * Similarity between labels is symmetric, so the order of labels in each tuple is irrelevant, and a
 * pair of labels may not appear more than once. The similarity between all other pairs of labels is:
 * -    1 iff they are the same string, and
 * -    0 otherwise
 * 
 * For example, the following gives the similarity values used above:
 *     [ ["happy","meh",0.5], ["meh","sad",0.5] ]
 * 
 * When the individual piecewise-matching terms, the sum of piecewise-matching between the sets, and
 * the span of the sets can be represented as number values with high precision, the returned value
 * will have similar precision. Otherwise, it may be similarly imprecise.
 * 
 * PS2 instructions: this is a required function.
 * You may strengthen its specification, but may NOT weaken it.
 * 
 * @param similarities label similarity definition as described above
 * @param setA multi-interval set with string labels
 * @param setB multi-interval set with string labels
 * @returns similarity between setA and setB as defined above
 */
export function similarity(similarities: Array<LabelSimilarity>, setA: MultiIntervalSet<string>, setB: MultiIntervalSet<string>): number {

    const similarityMap = similarityToMap(similarities);

    const unitIntervalSetA = new UnitIntervalSet(setA);
    const unitIntervalSetB = new UnitIntervalSet(setB);
    const min = Math.min(unitIntervalSetA.getMin(), unitIntervalSetB.getMin());
    const max = Math.max(unitIntervalSetA.getMax(), unitIntervalSetB.getMax())+1; // add 1 to max get end of last interval

    let sum = 0;
    for(let i = min; i < max; i++) {
        const labelA = unitIntervalSetA.getLabel(i);
        const labelB = unitIntervalSetB.getLabel(i);
        // Check if unit interval is in both sets
        if (labelA !== undefined && labelB !== undefined) {
            if (labelA === labelB) {
                sum += 1;
            } else {
                sum += similarityMap.get(labelA)?.get(labelB) ?? 0; // get similarity value from map or 0 if not found
            }
        } 
    }
    return sum/(max-min); // return sum of similarity divided by span

}

/**
 * Given an array of label similarities, return a corresponding map of label similarities 
 * where each label is mapped to a map containing a second label and the similarity between them.
 * 
 * For example, given the array: [ ["happy","meh",0.5], ["meh","sad",0.5] ], the map would be:
 * { "happy" => { "meh" => 0.5 }, "meh" => { "happy" => 0.5, "sad" => 0.5 }, "sad" => { "meh" => 0.5 } }
 * 
 * @param similarities array of LabelSimilarity tuples
 * @returns a map of label similarities
 */
export function similarityToMap(similarities: Array<LabelSimilarity>): Map<string, Map<string, number>> {
    const similarityMap = new Map<string, Map<string, number>>();
    for (const [label1, label2, value] of similarities) {
        const label1Map = similarityMap.get(label1) ?? new Map<string, number>(); // get the map for label1 or create a new one
        const label2Map = similarityMap.get(label2) ?? new Map<string, number>(); // get the map for label2 or create a new one
        
        // set the maps for label1 and label2 in the similarity map
        similarityMap.set(label1, label1Map);
        similarityMap.set(label2, label2Map);
        
        // update the similarity values for label1 and label2
        label1Map.set(label2, value);
        label2Map.set(label1, value);
    }
    return similarityMap;
}

/**
 * An immutable set of labeled interval unit intervals [i, i+1) where each interval is
 * associated with exactly one label.
 * 
 */
export class UnitIntervalSet {

    private readonly unitIntervals : Map<number, string> = new Map();
    private readonly min : number;
    private readonly max : number;

    // Abstraction function:
    //      AF(unitIntervals, min, max) = set of labeled intervals of size 1 where each key-value pair 
    //      (k,v) in unitIntervals represents a labeled unit interval [k, k+1) with label v
    // Representation invariant:
    //      all keys in unitIntervals are between min and max, inclusive
    //      min <= max when the set is nonempty
    //      
    // Safety from rep exposure:
    //      All fields are private and readonly; getLabel returns immutable string; fields are never passed to clients
    //

    private checkRep(): void {
        for (const key of this.unitIntervals.keys()) {
            assert(this.min <= key && key <= this.max);
            assert(this.min <= this.max);
        }
    }

    /**
     * Create a new unit-interval set spanning every interval [i, i+1) for integer i
     * of the given multi-interval set, with each interval associated with the
     * label of the multi-interval set that contains it.
     * 
     * @param multiIntervalSet contents of the multi-interval set
     */
    public constructor(multiIntervalSet: MultiIntervalSet<string>) {
        for(const label of multiIntervalSet.labels()) {
            const intervals = multiIntervalSet.intervals(label);
            // Iterate through all intervals corresponding to the label
            for (const i of intervals.labels()) {
                const interval = intervals.interval(i) as Interval;
                const start = Number(interval.start);
                const end = Number(interval.end);
                // Add all unit intervals in the interval
                for (let j = start; j < end; j++) {
                    this.unitIntervals.set(j, label);
                }
            }
        }
        const unitIntervalsKeys = Array.from(this.unitIntervals.keys().map(Number)); // convert keys to numbers array
        this.min = Math.min(...unitIntervalsKeys);
        this.max = Math.max(...unitIntervalsKeys);
        this.checkRep();
    }

    /**
     * Get the label associated with the given unit interval, or undefined if none.
     * 
     * @param start the low end of the unit interval
     * @returns the associated label
     */
    public getLabel(start : number) : string | undefined {
        return this.unitIntervals.get(start);
    }

    /**
     * Get the minimum start value of a unit interval in the set.
     * 
     * @returns the minimum value
     */
    public getMin() : number {
        return this.min;
    }

    /**
     * Get the maximum start value of a unit interval in the set.
     * 
     * @returns the maximum value
     */
    public getMax() : number {
        return this.max;
    }

    public toString() : string {
        let result = "";
        for (let i = this.min; i < this.max+1; i++) {
            const label = this.unitIntervals.get(i);
            result += `${i}=${label}, `;
        }
        return result;
    }

}
