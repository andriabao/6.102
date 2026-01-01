import assert from 'node:assert';

class Bank {
    private accounts: Map<string, number> = new Map();
    private total: number = 0;

    // AF(accounts, total) = a bank in which
    //         the person named `k` has accounts.get(k) dollars
    //                                 for all keys `k` in accounts,
    //         and the total money in the bank is `total` dollars
    // RI:
    //   all values in accounts are >= 0
    //   total = sum of all values in accounts

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
        const fromBalance = this.accounts.get(from);
        if (fromBalance === undefined) { 
            throw new Error(`${from} doesn't have an account`);
        }
        if (amount > fromBalance) {
            throw new Error(`${from} doesn't have enough money`);
        }
        this.accounts.set(from, fromBalance - amount);

        const toBalance = this.accounts.get(to);
        if (toBalance === undefined) {
            throw new Error(`${to} doesn't have an account`);
        }
        this.accounts.set(to, toBalance + amount);

        this.checkRep();
        console.log('transferred', amount, 'from', from, 'to', to);
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


function main(): void {
    const bank = new Bank();
    bank.makeAccount('Chip', 50);
    bank.makeAccount('Dale', 30);
    bank.audit(); // surprise audit!

    bank.transfer('Chip', 'Dale', 10);
    bank.audit(); // surprise audit!

    try {
        // Effie doesn't exist, so transfer should fail
        bank.transfer('Chip', 'Chip', 10); // TODO: change this transfer so that the bank audit below FAILS
        console.error('oops, illegal transfer was allowed');
    } catch (e) {
        console.log('illegal transfer correctly rejected');
    }
    bank.audit(); // surprise audit!
}

main();
