def cumulative_avg(data):
    total = 0
    average = 0
    n = 0
    for value in data:
        n += 1
        total += value
        average = total / n
        # print(average)
    return average

data = [ 2, 4, 6 ]
cumulative_avg(data)
