
export function split(s: string, sep: string): Array<string>
// requires: sep.length = 1
// effects: returns array `v` such that ???
{ throw new Error("not implementing today"); }

/*
Consider these possible pieces of the postcondition we could write in the ??? above...

1. Why might we choose NOT to write
        `v` is nonempty
    as part of the postcondition?

    It is not declarative because it requires the implementer create an array with name 'v', which is also a bad name.
    This is also not well defined and coherent.-


2. Why might we choose NOT to write
        `v` has no empty strings
    as part of the postcondition?

    Could have two separators in a row in s. It is also not coherent because the implementer coulr return
    an array with random strings.


3. Why might we choose NOT to write
        `v` is made by finding the first `sep` in `s` and taking the substring
        before that as the first element, then repeating
    as part of the postcondition?

    Describes implementation rather than behavior, so it is not declarative.

*/
