
/**
 * @param milliseconds duration to wait
 * @returns a promise that fulfills no less than `milliseconds` after timeout() was called
 */
export async function timeout(milliseconds:number):Promise<void> {
    const { promise, resolve } = Promise.withResolvers<void>();
    setTimeout(resolve, milliseconds);
    return promise;
}


// busy-waiting version of timeout() -- DON'T DO THIS
function busyWait(milliseconds:number):void {
    const now = new Date();
    const deadline = new Date(now.valueOf() + milliseconds);
    while (new Date() < deadline) {
        // do nothing, just wait.

        // this is called a busy-wait;
        // it's a bad idea even for multiple-thread concurrency (i.e. Workers),
        // but it's deadly for a single thread using async/await
    }
}
