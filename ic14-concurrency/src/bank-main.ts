import assert from 'node:assert';
import { Worker, isMainThread } from 'node:worker_threads';
import { readBalance, writeBalance } from './bank-account.js';

// this file should be run directly
assert.strictEqual(true, isMainThread);

// start with a balance of 200
writeBalance(200);

console.log('starting balance is', readBalance())
process.on('beforeExit', () => console.log('ending balance is', readBalance()));

const NUMBER_OF_CASH_MACHINES = 2;

for (let machine = 0; machine < NUMBER_OF_CASH_MACHINES; machine++) {
    new Worker('./dist/bank-cash-machine.js');
}
