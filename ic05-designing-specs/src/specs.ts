
/*
 * requires: key is in map, disregarding case
 * effects: returns value of key in map, ignoring case
 */
export function getIgnoreCase(map: Map<string, number>, key: string): number {
    
    // implementation #1:
    // if map.has(key), then return map.get(key)
    // for k of map.keys()
    //     if k.toLowerCase() == key.toLowerCase(), then return map.get(k)
    // otherwise return 0
    
    // implementation #2:
    // for k of map.keys()
    //     if k.toLowerCase() == key, then return map.get(k)
    // otherwise throw an Error

    throw new Error("not implementing today");
}



/*
 * requires: TODO
 * effects: TODO
 */
export function increment(map: Map<string, number>, keysToIncrement: Set<string>): void {
    
    // implementation #1:
    // for k of map.keys():
    //     if keysToIncrement.has(k) then map.put(k, map.get(k) + 1)

    // implementation #2:
    // for k of keysToIncrement:
    //    v = map.has(k) ? map.get(k) : 0;
    //    map.put(k, v+1)

    throw new Error("not implementing today");
}
