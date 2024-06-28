const Fibonacci = require("./fibonacci");
const sinon = require("./sinon");
const assert = require("node:assert/strict");

(async () => {
  {
    const fibonacci = new Fibonacci();
    const spy = sinon.spy(fibonacci, fibonacci.execute.name);
    for (const value of fibonacci.execute(5));

    const expectedCallCount = 6;
    assert.strictEqual(spy.callCount, expectedCallCount);

    const call2 = spy.getCall(2);
    const { args } = call2;
    const expectedParams = [3, 1, 2];
    assert.deepStrictEqual(
      args,
      expectedParams,
      "the args array is not equal to the expected_params"
    );
  }

  {
    const fibonacci = new Fibonacci();
    const spy = sinon.spy(fibonacci, fibonacci.execute.name);

    const results = [...fibonacci.execute(3)];

    assert.deepStrictEqual(
      results,
      [0, 1, 1],
      "the results array is not equal to the expected_values"
    );

    const expectedCallCount = 4;
    assert.strictEqual(spy.callCount, expectedCallCount);

    const call2 = spy.getCall(2);
    const { args } = call2;
    const expectedParams = [1, 1, 2];
    assert.deepStrictEqual(
      args,
      expectedParams,
      "the args array is not equal to the expected_params"
    );
  }
})();
