from factorial import factorial, range_to_infinity, map
import time
from threading import Thread

def until_timeout(iterable, time_limit_in_milliseconds):
    '''
    Yields shortest prefix of `iterable` whose total time to compute
    is >= time_limit_in_milliseconds, which must be an integer
    '''
    start_ns = time.monotonic_ns()
    end_ns = start_ns + time_limit_in_milliseconds * 1_000_000
    for value in iterable:
        if time.monotonic_ns() >= end_ns:
            break
        yield value

def computeFactorials(start_n, time_limit_in_milliseconds):
    '''
    Computes an increasing sequence of factorials starting with 
    start_n!, (start_n+1)!, (start_n+2)!, ...,
    until time_limit_in_milliseconds elapses.
    '''
    factorials = map(factorial, range_to_infinity(start_n))
    for _ in until_timeout(factorials, time_limit_in_milliseconds):
        pass

# computeFactorials(4000, 500)
# computeFactorials(7000, 500)

# creates and starts a new thread that runs the provided lambda (or function)
# Thread(target=lambda: print('hello')).start()
Thread(target=lambda: computeFactorials(4000, 500)).start()
Thread(target=lambda: computeFactorials(7000, 500)).start()

