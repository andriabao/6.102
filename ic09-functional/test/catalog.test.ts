import assert from 'node:assert';

import { range2, getNumberedMajors, getAllMajors, numberOfMajors, commaSeparatedMajors, getCatalogUrls, map, filter } from '../src/catalog.js';

describe('catalog', function() {
    it('should behave the same as before', function() {
        console.log("getNumberedMajors(): " + [...getNumberedMajors()]);
        assert.strictEqual([...getNumberedMajors()].length, 21);

        console.log("getAllMajors(): " + getAllMajors());
        assert.strictEqual(getAllMajors().length, 30);
        assert(["6", "CMS", "21W"].every((major: string) => getAllMajors().includes(major)));

        console.log("numberOfMajors(): " + numberOfMajors(getAllMajors()));
        assert.strictEqual(numberOfMajors(getAllMajors()), 30);
        assert.strictEqual(numberOfMajors([]), 0);

        console.log("commaSeparatedMajors(): " + commaSeparatedMajors(getAllMajors()));
        assert.deepStrictEqual(commaSeparatedMajors(["1","2","3"]), "1,2,3");
        assert.deepStrictEqual(commaSeparatedMajors(["1"]), "1");
        assert.deepStrictEqual(commaSeparatedMajors([]), "");

        console.log("getCatalogUrls(): " + getCatalogUrls(getAllMajors()).slice(0,2).concat(['...']));
        assert(getCatalogUrls(getAllMajors())
                    .every((url: string) => url.startsWith("http://student.mit.edu/catalog/m") && url.endsWith(".html")));
        assert.strictEqual(getCatalogUrls(getAllMajors()).length, 30 * 3);
    });

    (ifImplemented(() => range2(0,10).next()) 
        ? it
        : it.skip
    )('range() as a generator function', function() {
        const r = range2(0, 10);
        assert( ! Array.isArray(r), 'range2() should return a generator object, not an array');
        assert.deepStrictEqual([...r], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    (ifImplemented(() => map([5],(x)=>x).next())
        ? it
        : it.skip
    )('map() as a generator function', function() {
        const squares = map(range2(3, 5), n => n*n);
        assert( ! Array.isArray(squares), 'map() should return a generator object, not an array');
        assert.deepStrictEqual([...squares], [9, 16]);
    });

    (ifImplemented(() => filter([5], (x) => x>0).next())
        ? it
        : it.skip
    )('filter() as a generator function', function () {
        const perfectSquares = filter(range2(0, 20), n => Number.isInteger(Math.sqrt(n)));
        assert(!Array.isArray(perfectSquares), 'filter() should return a generator object, not an array');
        assert.deepStrictEqual([...perfectSquares], [0, 1, 4, 9, 16]);
    });

});

/**
 * Checks if some behavior we are about to test is actually implemented yet.
 * @param checkIfImplemented function that triggers the behavior
 * @returns false if the behavior throws a "not implemented" error, otherwise true
 */
function ifImplemented(checkIfImplemented: ()=>void): boolean {
    try {
        checkIfImplemented();
    } catch (e) {
        if (e instanceof Error && e.message.toLowerCase().includes('not implemented')) {
            return false; // failed with not-implemented error
        }
    }
    return true; // either succeeded or failed a different way
}