import * as tape from "tape";
import { CheckEqual } from "./types";

export const test = (name: string, cb: TestCase): void => {
    tape(name, t => cb(typedTest(t)));
};

const typedTest = (test: tape.Test): Test => ({
    plan: test.plan,
    end: test.end,
    fail: test.fail,
    pass: test.pass,
    timeoutAfter: test.timeoutAfter,
    skip: test.skip,
    comment: test.comment,
    throws: test.throws,
    doesNotThrow: test.doesNotThrow,

    test: (name: string, cb: TestCase): void => {
        test.test(name, t => cb(typedTest(t)));
    },

    ok: (msg?) => (value): void => {
        test.ok(value, msg);
    },

    notOk: (msg?) => (value): void => {
        test.notOk(value, msg);
    },

    equal: (expected, msg?) => (actual): void => {
        test.equal(actual, expected, msg);
    },

    notEqual: (expected, msg?) => (actual): void => {
        test.notEqual(actual, expected, msg);
    },

    deepEqual: (expected, msg?) => (actual): void => {
        test.deepEqual(actual, expected, msg);
    },

    notDeepEqual: (expected, msg?) => (actual): void => {
        test.notDeepEqual(actual, expected, msg);
    },

    deepLooseEqual: (expected, msg?) => (actual): void => {
        test.deepLooseEqual(actual, expected, msg);
    },

    notDeepLooseEqual: (expected, msg?) => (actual): void => {
        test.notDeepLooseEqual(actual, expected, msg);
    }
});

export interface TestCase {
    (test: Test): void;
}

export interface Test {
    /**
     * Create a subtest with a new test handle st from cb(st) inside the current test.
     * cb(st) will only fire when t finishes.
     * Additional tests queued up after t will not be run until all subtests finish.
     */
    test(name: string, cb: TestCase): void;

    /**
     * Declare that n assertions should be run. end() will be called automatically after the nth assertion.
     * If there are any more assertions after the nth, or after end() is called, they will generate errors.
     */
    plan(n: number): void;

    /**
     * Declare the end of a test explicitly.
     * If err is passed in t.end will assert that it is falsey.
     */
    end(err?: any): void;

    /**
     * Generate a failing assertion with a message msg.
     */
    fail(msg?: string): void;

    /**
     * Generate a passing assertion with a message msg.
     */
    pass(msg?: string): void;

    /**
     * Automatically timeout the test after X ms.
     */
    timeoutAfter(ms: number): void;

    /**
     * Generate an assertion that will be skipped over.
     */
    skip(msg?: string): void;

    /**
     * Assert that value is truthy with an optional description message msg.
     */
    ok: <Expected>(
        msg?: string
    ) => <Actual extends Reference, Reference = CheckEqual<Actual, Expected>>(
        value: Actual
    ) => void;

    /**
     * Assert that value is falsy with an optional description message msg.
     */
    notOk: <Expected>(
        msg?: string
    ) => <Actual extends Reference, Reference = CheckEqual<Actual, Expected>>(
        value: Actual
    ) => void;

    /**
     * Assert that a === b with an optional description msg.
     */
    equal: <Expected>(
        expected: any,
        msg?: string
    ) => <Actual extends Reference, Reference = CheckEqual<Actual, Expected>>(
        actual: Actual
    ) => void;

    /**
     * Assert that a !== b with an optional description msg.
     */
    notEqual: <Expected>(
        expected: any,
        msg?: string
    ) => <Actual extends Reference, Reference = CheckEqual<Actual, Expected>>(
        actual: Actual
    ) => void;

    /**
     * Assert that a and b have the same structure and nested values using node's deepEqual() algorithm with strict comparisons (===) on leaf nodes and an optional description msg.
     */
    deepEqual: <Expected>(
        expected: any,
        msg?: string
    ) => <Actual extends Reference, Reference = CheckEqual<Actual, Expected>>(
        actual: Actual
    ) => void;

    /**
     * Assert that a and b do not have the same structure and nested values using node's deepEqual() algorithm with strict comparisons (===) on leaf nodes and an optional description msg.
     */
    notDeepEqual: <Expected>(
        expected: any,
        msg?: string
    ) => <Actual extends Reference, Reference = CheckEqual<Actual, Expected>>(
        actual: Actual
    ) => void;

    /**
     * Assert that a and b have the same structure and nested values using node's deepEqual() algorithm with loose comparisons (==) on leaf nodes and an optional description msg.
     */
    deepLooseEqual: <Expected>(
        expected: any,
        msg?: string
    ) => <Actual extends Reference, Reference = CheckEqual<Actual, Expected>>(
        actual: Actual
    ) => void;

    /**
     * Assert that a and b do not have the same structure and nested values using node's deepEqual() algorithm with loose comparisons (==) on leaf nodes and an optional description msg.
     */
    notDeepLooseEqual: <Expected>(
        expected: any,
        msg?: string
    ) => <Actual extends Reference, Reference = CheckEqual<Actual, Expected>>(
        actual: Actual
    ) => void;

    /**
     * Assert that the function call fn() throws an exception.
     * expected, if present, must be a RegExp or Function, which is used to test the exception object.
     */
    throws(fn: () => void, msg?: string): void;
    throws(
        fn: () => void,
        exceptionExpected: RegExp | Function,
        msg?: string
    ): void;

    /**
     * Assert that the function call fn() does not throw an exception.
     */
    doesNotThrow(fn: () => void, msg?: string): void;
    doesNotThrow(
        fn: () => void,
        exceptionExpected: RegExp | Function,
        msg?: string
    ): void;

    /**
     * Print a message without breaking the tap output.
     * (Useful when using e.g. tap-colorize where output is buffered & console.log will print in incorrect order vis-a-vis tap output.)
     */
    comment(msg: string): void;
}
