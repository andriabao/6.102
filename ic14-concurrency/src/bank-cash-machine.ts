import assert from 'node:assert';
import { isMainThread } from 'node:worker_threads';

import { readBalance, writeBalance } from './bank-account.js';

// this file should run in a Worker
assert.strictEqual(false, isMainThread);

function deposit(): void {
    let balance = readBalance();
    balance = balance + 1;
    writeBalance(balance);
}

function withdraw(): void {
    let balance = readBalance();
    balance = balance - 1;
    writeBalance(balance);
}

const TRANSACTIONS_PER_MACHINE = 100;

for (let txn = 0; txn < TRANSACTIONS_PER_MACHINE; txn++) {
    deposit(); // put a dollar in
    withdraw(); // take it back out
}
