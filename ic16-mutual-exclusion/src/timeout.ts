import { Deferred } from './Deferred.js';

/**
 * @param milliseconds duration to wait
 * @returns a promise that fulfills `milliseconds` after timeout() was called
 */
export async function timeout(milliseconds:number): Promise<void> {
    const deferred = new Deferred<void>();
    setTimeout(() => deferred.resolve(), milliseconds);
    return deferred.promise;
}
