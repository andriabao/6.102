
export function evaluateParabola(a: Array<number>, x: number): number
// requires: a is length 3 with coefficients of quadratic equation
// effects: returns y coordinate of parabola a[2]x^2 + a[1]x + a[0] evaluated at x
{ throw new Error("not implementing today"); }



export function winner(s: string): { char: string, count: number }
// requires: s has length > 0
// effects: returns a character `char` such that no other character occurs more frequently
//          in `s`, along with its frequency `count`
{ throw new Error("not implementing today"); }



export function replace(s: string, dict: Map<string, string>): string
// requires: keys and values of dict to be distinct
// effects: returns result of doing multiple find-and-replaces on string `s`,
//          where the find patterns are the keys in `dict`
//          and the replacements are the corresponding values in `dict`;
//          the returned string contains no more matches to keys in `dict`
{ throw new Error("not implementing today"); }
