import assert from 'node:assert';

import { Point } from '../src/Point.js';
import { Stroke, Color } from '../src/Stroke.js';
import { LineSegment } from '../src/LineSegment.js';

describe('Point', function() {
    
    // Testing strategy:
    // 
    // Only partitioning the equalValue() op here, but
    // Point's other ops need partitioning and testing, too.
    //
    // equalValue:
    //    x is same or different
    //    y is same or different
    // Cover the "different" parts independently, rather than having a single pair that
    //   is different in both x and y at once.

    const ifImplementedIt =
        ifImplemented(() => { const pt = new Point(0, 0); pt.equalValue(pt); })
            ? it
            : it.skip;
    
    ifImplementedIt('covers x, y same', function() {
        const p1 = new Point(3, 5);
        const p2 = new Point(3, 5);
        assert.strictEqual(p1.equalValue(p1), true); // reflexive
        assert.strictEqual(p1.equalValue(p2), true);
        assert.strictEqual(p2.equalValue(p1), true); // symmetric
    });
    ifImplementedIt('covers x different', function() {
        assert.strictEqual(new Point(32, 0).equalValue(new Point(-8, 0)), false);
    });
    ifImplementedIt('covers y different', function() {
        assert.strictEqual(new Point(-.5, 473).equalValue(new Point(-.5, 948)), false);
    });
});

describe('Stroke', function() {
    
    // Testing strategy:
    // 
    // Only partitioning the equalValue() op here, but
    // Stroke's other ops need partitioning and testing, too.
    //
    // equalValue:
    //    partition: start point is same or different
    //    partition: end point is same or different
    //    partition: color is same or different
    // Cover the "different" parts independently, rather than having a single pair that
    //   is different in multiple properties at once.
    
    const ifImplementedIt = 
        ifImplemented(() => { const stroke = new Stroke(0, 0, 1, 1, Color.ORANGE); stroke.equalValue(stroke); })
            ? it 
            : it.skip;
    
    ifImplementedIt('covers start, end, color same', function() {
        const strk1 = new Stroke(1, 2, 3, 4, Color.BLACK);
        const strk2 = new Stroke(1, 2, 3, 4, Color.BLACK);
        assert.strictEqual(strk1.equalValue(strk1), true); // reflexive
        assert.strictEqual(strk1.equalValue(strk2), true);
        assert.strictEqual(strk2.equalValue(strk1), true); // symmetric
    });
    ifImplementedIt('covers start different', function() {
        const strk1 = new Stroke(8, 12, 4, 6, Color.RED);
        const strk2 = new Stroke(9, 11, 4, 6, Color.RED);
        assert.strictEqual(strk1.equalValue(strk2), false);
    });
    ifImplementedIt('covers end different', function() {
        const strk1 = new Stroke(-5, 0, -8, 0, Color.YELLOW);
        const strk2 = new Stroke(-5, 0, 16.5, 20, Color.YELLOW);
        assert.strictEqual(strk1.equalValue(strk2), false);
    });
    ifImplementedIt('covers color different', function() {
        const strk1 = new Stroke(0, 0, 0, 0, Color.GREEN);
        const strk2 = new Stroke(0, 0, 0, 0, Color.BLUE);
        assert.strictEqual(strk1.equalValue(strk2), false);
    });
});

describe('LineSegment', function() {
    
    // Testing strategy:
    // 
    // Only partitioning the equalValue() op here, but
    // LineSegment's other ops need partitioning and testing, too.
    //
    // equalValue:
    //    partition: the line segments share both endpoints, share exactly one endpoint, or share neither
    //    partition: the line segments share neither endpoint,
    //               they share one or two endpoints given at the same position in the constructors,
    //               they share one or two endpoints given at different positions in the constructors

    const ifImplementedIt =
        ifImplemented(() => { const seg = new LineSegment(0, 0, 1, 1); seg.equalValue(seg); })
            ? it
            : it.skip;

    ifImplementedIt('covers share both, same constructor position', function() {
        const seg1 = new LineSegment(1, 2, 3, 4);
        const seg2 = new LineSegment(1, 2, 3, 4);
        assert.strictEqual(seg1.equalValue(seg1), true); // reflexive
        assert.strictEqual(seg1.equalValue(seg2), true);
        assert.strictEqual(seg2.equalValue(seg1), true); // symmetric
    });
    ifImplementedIt('covers share both, different constructor position', function() {
        const seg1 = new LineSegment(1, 2, 3, 4);
        const seg2 = new LineSegment(3, 4, 1, 2);
        assert.strictEqual(seg1.equalValue(seg2), true);
        assert.strictEqual(seg2.equalValue(seg1), true); // symmetric
    });
    ifImplementedIt('covers share one, same constructor position', function() {
        const seg1 = new LineSegment(8, 12, 4, 6);
        const seg2 = new LineSegment(9, 11, 4, 6);
        assert.strictEqual(seg1.equalValue(seg2), false);
    });
    ifImplementedIt('covers share neither', function() {
        const seg1 = new LineSegment(-19, 22, -8, 0);
        const seg2 = new LineSegment(-5, 0, 16.5, 20);
        assert.strictEqual(seg1.equalValue(seg2), false);
    });
});

/**
 * Checks if some behavior we are about to test is actually implemented yet.
 * @param f function that triggers the behavior
 * @returns false if the behavior throws a "not implemented" error, otherwise true
 */
function ifImplemented(f: () => void): boolean {
    try {
        f();
    } catch (e) {
        if (e instanceof Error && e.message.toLowerCase().includes('not implemented')) {
            return false; // failed with not-implemented error
        }
    }
    return true; // either succeeded or failed a different way
}