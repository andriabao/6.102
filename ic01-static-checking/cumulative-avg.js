data = [ 2, 4, 6 ];
total = 0;
average = 0;
n = 0;
for (value of data) {
    n += 1;
    total += value;
    average = total / n;
    console.log(average);
}
