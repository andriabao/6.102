/**
 * @param n must be integer >= 0
 * @returns n!
 */
export function factorial(n: number): bigint {
    let result = 1n;
    for (let i = 1n; i <= n; ++i) {
        result *= i;
    }
    console.log(`at time ${process.hrtime.bigint().toLocaleString()}: computed ${n}!`);
    return result;
}

/**
 * @param start must be integer
 * @returns increasing sequence of integers from `start` to infinity
 */
export function* rangeToInfinity(start: number): Iterable<number> {
    let n = start;

    while (true) {
        yield n++;
    }
}

/**
 * @param f
 * @param iterable
 * @returns sequence resulting from applying `f` to every value of `iterable` in order
 */
export function* map<T,U>(f: (t:T)=>U, iterable: Iterable<T>): Iterable<U> {
    for (const x of iterable) {
        yield f(x);
    }
}

/** Main program.  Computes an increasing infinite sequence of factorials starting with 9000!. */
export function main(): void {
    for (const _ of map(factorial, rangeToInfinity(9000))) {
    }
}
