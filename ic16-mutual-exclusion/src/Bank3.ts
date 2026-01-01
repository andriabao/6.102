import fs from 'node:fs';
import assert from 'node:assert';
import { timeout } from './timeout.js';
import { Deferred } from './Deferred.js';

class Bank {
    private accounts: Map<string, number> = new Map();
    private total: number = 0;
    private expectedAccounts: Map<string, Deferred<void>> = new Map();

    // AF(accounts, total, expectedAccounts) = a bank in which
    //         the person named `k` has accounts.get(k) dollars
    //                                 for all keys `k` in accounts,
    //         and the total money in the bank is `total` dollars
    // RI:
    //   all values in accounts are >= 0
    //   total = sum of all values in accounts
    //   TODO expectedAccounts

    private checkRep(): void {
        const allBalances = [...this.accounts.values()];
        assert(allBalances.every(balance => balance >= 0));
        assert.strictEqual(
            allBalances.reduce((x,y) => x+y, 0),
            this.total
        );
    }

    /**
     * @param person owner of the new account
     * @param initialBalance balance in the new account, must be >= 0
     */
    public makeAccount(person: string, initialBalance: number): void {
        this.accounts.set(person, initialBalance);
        this.total += initialBalance;
        this.checkRep();

        // TODO: see if this.expectedAccounts has a deferred object for this person,
        // and if so, resolve it
        const defer = this.expectedAccounts.get(person);
        if (defer !== undefined) {
            defer.resolve()
        }
    }

    /**
     * Waits until person has an account, returning immediately if they already do.
     * @param person 
     */
    public async untilAccountExists(person: string): Promise<void> {
        // TODO: if the account doesn't exist yet, put a deferred object in this.expectedAccounts
        // and return or await its promise
        if (!this.accounts.has(person)) {
            const deferred = new Deferred<void>();
            this.expectedAccounts.set(person, deferred);
            await deferred.promise;
        }
    }

    /**
     * @param person 
     * @returns true iff person has an account at this bank
     */
    public hasAccount(person: string): boolean {
        return this.accounts.has(person);
    }

    /**
     * Transfers `amount` from account named `from` to account named `to`.
     * @param from
     * @param to
     * @param amount must be >= 0
     * @throws Error if either of the accounts doesn't exist,
     *         or if the transfer would overdraw the `from` account
     */
    public transfer(from: string, to: string, amount: number): void {
        let fromBalance = this.accounts.get(from);
        if (fromBalance === undefined) { 
            throw new Error(`${from} doesn't have an account`);
        }
        let toBalance = this.accounts.get(to);
        if (toBalance === undefined) {
            throw new Error(`${to} doesn't have an account`);
        }

        if (amount > fromBalance) {
            throw new Error(`${from} doesn't have enough money`);
        }

        this.accounts.set(from, fromBalance - amount);
        this.accounts.set(to, toBalance + amount);
        this.checkRep();
        console.log('transferred', amount, 'from', from, 'to', to);
    }

    /**
     * Write an entry to the transaction file on disk.
     */
     public async record(person: string, change: number): Promise<void> {
        return fs.promises.appendFile('log.txt', `${change} ${person}\n`);
    }

    /**
     * Do an internal bank audit.
     * @throws error if the bank doesn't know how much money it has
     */
    public audit(): void {
        this.checkRep();
        console.log('audit OK');
    }
}

async function main(): Promise<void> {
    const bank = new Bank();

    async function chip() {
        bank.makeAccount('Chip', 50);
        console.log('Chip made account');
        await bank.untilAccountExists('Dale');
        bank.transfer('Chip', 'Dale', 10);
    }

    async function dale() {
        await timeout(500); // slow to get started
        bank.makeAccount('Dale', 50);
        console.log('Dale made account');
    }

    await Promise.all([
        chip(),
        dale(),
    ]);
}

main();
