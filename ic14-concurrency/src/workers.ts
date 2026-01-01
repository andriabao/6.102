import { factorial, rangeToInfinity, map } from './factorial.js';
import { Worker, isMainThread } from 'node:worker_threads';

/**
 * @param iterable
 * @param timeLimitInMilliseconds, must be >0
 * @returns shortest prefix of `iterable` whose total time to compute 
 *          is >= timeLimitInMilliseconds
 */
function* untilTimeout<T>(iterable: Iterable<T>, timeLimitInMilliseconds: bigint): Iterable<T> {
    const startNanoseconds = process.hrtime.bigint();
    const endNanoseconds = startNanoseconds + (timeLimitInMilliseconds * 1_000_000n);
    for (const value of iterable) {
        if (process.hrtime.bigint() >= endNanoseconds) {
            break;
        }
        yield value;
    }
}

/**
 * Computes an increasing sequence of factorials starting with
 * startN!, (startN+1)!, (startN+2)!, ...,
 * until timeLimitInMilliseconds elapses.
 * @param startN must be integer >= 0
 * @param timeLimitInMilliseconds must be >= 0
 */
export function computeFactorials(startN: number, timeLimitInMilliseconds: bigint): void {
    const factorials = map(factorial, rangeToInfinity(startN));
    for (const _ of untilTimeout(factorials, timeLimitInMilliseconds)) {
    }
}

if (isMainThread) {
    // this file was run directly
    console.log(`at time ${process.hrtime.bigint().toLocaleString()}: main started`);

    let worker = new Worker('./dist/workers.js');
    computeFactorials(4000, 500n);


    console.log(`at time ${process.hrtime.bigint().toLocaleString()}: main done`);

} else {
    // this file is running in a Worker
    console.log(`at time ${process.hrtime.bigint().toLocaleString()}: worker started`);
    computeFactorials(7000, 500n);

    console.log(`at time ${process.hrtime.bigint().toLocaleString()}: worker done`);
}
