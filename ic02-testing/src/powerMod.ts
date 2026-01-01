import assert from 'assert';

/**
 * Computes base^exponent (mod modulus).
 *
 * For example, if base = 2, exponent = 3, and modulus = 5,
 * this method computes 2^3 (mod 5) = 8 (mod 5) = 3.
 * 
 * @param base     base for exponentiation, requires base >= 0
 * @param exponent exponent for exponentiation, requires exponent >= 0
 * @param modulus  divisor for modulo operation, requires modulus > 0
 * @returns base^exponent (mod modulus)
 */
function powerMod(base: bigint, exponent: bigint, modulus: bigint): bigint {
    // return powerModSlow(base, exponent, modulus);
    return powerModFast(base, exponent, modulus);
}

function powerModSlow(base: bigint, exponent: bigint, modulus: bigint): bigint {
    let n: bigint = 1n;
    for (let i = 0; i < exponent; ++i) {
        n *= base;
    }
    n = n % modulus;
    return n;
}

function powerModFast(base: bigint, exponent: bigint, modulus: bigint): bigint {
    let result: bigint;
    if (exponent === 0n) {
        result = 1n;
    } else if (exponent === 1n) {
        result = base;
    } else if (exponent % 2n === 0n) { // exponent is even
        // successive-squaring trick: this makes the runtime O(log n)
        result = powerModFast(base, exponent/2n, modulus);
        result = result*result;
    } else { // exponent is odd
        result = base * powerModFast(base, exponent-1n, modulus);
    }
    return result % modulus;
}


describe('powerMod', function() {
    //
    // Testing strategy:
    //
    // partition on base: 0, 1, >1
    // partition on exponent: 0, 1, >1
    // partition on modulus: 1, >1
    // partition: base < modulus, base = modulus, base > modulus
    
    it('covers base=0, exp=0', function() {
        assert.strictEqual(powerMod(0n, 0n, 5n), 1n);
    });
    
    it('covers base=0', function() {
        assert.strictEqual(powerMod(0n, 2n, 7n), 0n);
    });
    
    it('covers base=1', function() {
        assert.strictEqual(powerMod(1n, 8n, 3n), 1n);
    });
    
    it('covers exp=0', function() {
        assert.strictEqual(powerMod(3n, 0n, 4n), 1n);
    });
    
    it('covers exp=1', function() {
        assert.strictEqual(powerMod(28n, 1n, 5n), 3n);
    });
    
    it('covers modulus=1', function() {
        assert.strictEqual(powerMod(2n, 4n, 1n), 0n);
    });
    
    it('covers base>1, exp>1, modulus>1, base<modulus', function() {
        assert.strictEqual(powerMod(3n, 4n, 7n), 4n);
    });
    
    it('covers base>1, exp>1, modulus>1, base=modulus', function() {
        assert.strictEqual(powerMod(7n, 4n, 7n), 0n);
    });
    
    it('covers base>1, exp>1, modulus>1, base>modulus', function() {
        assert.strictEqual(powerMod(12n, 2n, 5n), 4n);
    });

    it('covers base>1, exp>1, modulus>1, base>modulus', function() {
        assert.strictEqual(powerMod(12n, 3n, 5n), 3n);
    });
});
