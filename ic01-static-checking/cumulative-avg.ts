let data: Array<number> = [ 2, 4, 6 ];
let total: number = 0;
let average: number = 0;
let n: number = 0;
for (let value of data) {
    n += 1;
    total += value;
    average = total / n;
    console.log(average);
}
