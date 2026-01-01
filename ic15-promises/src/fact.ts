import { timeout } from './timeout.js';

/**
 * @param n must be >= 0
 * @returns n!
 */
async function factorial(n: number): Promise<bigint> {
    console.log(`starting fact(${n})`);
    let result = 1n;
    for (let i = 1n; i <= n; ++i) {
        console.log(`working on fact(${n})`);
        result *= i;
        await timeout(0);
    }
    console.log(`done fact(${n})`);
    return result;
}

const promise1 = factorial(99);
const promise2 = factorial(100);
console.log(await promise1, 'and', await promise2);
// await promise1;
// await promise2;
