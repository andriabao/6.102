import fs from 'node:fs';

// suppose all the cash machines share a single bank account, stored in a file named `account.txt`

export function readBalance(): number {
    const fileData = fs.readFileSync('account.txt').toString();
    return parseInt(fileData);
}

export function writeBalance(balance: number) {
    fs.writeFileSync('account.txt', balance.toString());
}


/*** Debugging notes ***

What are the symptoms, what behavior do you observe?


How are you investigating the problem?


What is the race condition? What does a bad interleaving look like?


Finally, try to fix... or at least work around... the problem
*/
