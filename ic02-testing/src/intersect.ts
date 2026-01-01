import assert from 'assert';

/**
 * Intersects two sets of numbers.
 * For example, intersect({1, 5}, {5, -2}) returns {5}.
 *
 * @param setA another set of numbers
 * @param setB another set of numbers
 * @returns the set { x : x is in both setA and setB }
 */
function intersect(setA: Set<number>, setB: Set<number>): Set<number> {
    throw new Error("not implementing today");
}


describe('intersect', function() {

    //
    // Testing strategy for result = intersect(setA, setB)
    //
    // partition on setA.size: 0, 1, >1
    // partition on setB.size: 0, 1, >1
    // partition on result.size: 0, 1, >1
    // partition by inclusion: setA = setB; setA proper-subset-of setB;
    //                           setA proper-superset-of setB; none of the above
    //
    
    it('covers setA.size=1, setB.size=1, result.size=0, inclusion is none-of-the-above', function() {
        // setA={5}, setB={8}, result={}
    });

    it('covers setA.size=0, setB.size=0, result.size=0, inclusion is setA = setB', function() {
        // setA={}, setB={}, result={}
    });

    it('covers setA.size=2, setB.size=3, result.size=2, inclusion is setA propper-subset-of setB', function() {
        // setA={0, 1}, setB={0, 1, 2}, result={0, 1}
    });

    it('covers setA.size=2, setB.size=1, result.size=1, inclusion is setA proper-superset-of setB', function() {
        // setA={1, 2}, setB={1}, result={1}
    });
    
    // TODO: add test cases to cover the rest of the partitions, following the example above:
    //    - each test case should be an it() call
    //    - its description should say which partitions the test case covers
    //    - comment inside method is the test case, with actual values for setA, setB, result
    // You don't need to do a full Cartesian product, just cover every subdomain.
    //

});
