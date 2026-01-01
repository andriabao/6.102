import assert from 'assert';

/**
 * Solves quadratic equation ax^2 + bx + c = 0.
 * 
 * @param a quadratic coefficient, requires a != 0
 * @param b linear coefficient
 * @param c constant term
 * @returns a list of the real roots of the equation
 */
function quadraticRoots(a: number, b: number, c: number): Array<number> {
    throw new Error("not implementing today");
}

describe('quadraticRoots', function() {
    //
    // Testing strategy for result = quadraticRoots(a, b, c)
    //   
    // TODO: write your partitions here, using a, b, c, result
    // partition on a : a < 0, a > 0
    // partition on b : b < 0, 0 , b > 0
    // partition on c : c < 0, 0 , c > 0
    // partition on length of result : 0, 1, 2
    
    // DON'T write test cases for quadraticRoots, just partition it
});
