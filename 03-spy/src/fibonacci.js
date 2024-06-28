/**
    index: 5, current 0, next 1
    index: 4, current 1, next 1
    index: 3  current 1, next 2
    index: 2  current 2, next 3
    index: 1  current 3, next 5
    index: 0: stop;
 */
class Fibonacci {
  *execute(input, current = 0, next = 1) {
    if (input === 0) {
      return;
    }

    yield current;

    yield* this.execute(input - 1, next, current + next);
  }
}

module.exports = Fibonacci;
