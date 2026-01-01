import time

def factorial(n):
    '''
    Returns n!, where n must be an integer >= 0
    '''
    result = 1
    for i in range(1, n+1):
        result *= i
    print(f'at time {time.monotonic_ns():,}: computed {n}!')
    return result

def range_to_infinity(start):
    '''
    Yields increasing sequence of integers from `start` to infinity,
    where start must be an integer
    '''
    n = start
    while True:
        yield n
        n += 1
    # TODO

def map(f, iterable):
    '''
    Yields sequence resulting from applying `f` to every value of `iterable` in order
    '''
    for x in iterable:
        yield f(x)

if __name__ == '__main__':
    # main program:
    # compute an increasing infinite sequence of factorials starting with 9000!
    for _ in map(factorial, range_to_infinity(9000)):
        pass
