import { unknown } from "../..";
import { StaticFunctor } from "../../lib/abstract/functor";
import { test } from "../../tests/harness";

// Examples
const arrayFunctor: StaticFunctor<any[]> = {
    map: <A, B>(fn: (a: A) => B, fa: A[]): B[] => {
        return fa.map(fn);
    }
};
const objectFunctor: StaticFunctor<object> = {
    map: <A, B>(fn: (a: A) => B, fa: A): B => {
        return fn(fa);
    }
};

// We have to manually type "map" to help out inference
const nullableFunctor: StaticFunctor<object | null | undefined> = {
    map: <A, B>(
        fn: (a: A) => B,
        fa: A | null | undefined
    ): B | null | undefined => {
        return fa != undefined ? fn(fa) : fa;
    }
};

const doubler = (x: number) => x * 2;

test("examples/abstract/nullable1", test => {
    test.plan(4);
    test.deepEqual<number[]>([8, 4])(arrayFunctor.map(doubler, [4, 2]));
    test.equal<number>(84)(objectFunctor.map(doubler, 42));
    test.equal<null>(null)(nullableFunctor.map(doubler, null));
    test.equal<number | undefined>(84)(
        nullableFunctor.map(doubler, 42 as number | undefined)
    );
});

const functor: StaticFunctor<unknown | any[]> = {
    map(fn, fa) {
        return Array.isArray(fa)
            ? arrayFunctor.map(fn, fa)
            : fa != undefined
                ? objectFunctor.map(fn, fa)
                : nullableFunctor.map(fn, fa);
    }
};

test("examples/abstract/nullable2", test => {
    test.plan(4);
    test.deepEqual<number[]>([8, 4])(functor.map(doubler, [4, 2]));
    test.equal<number>(84)(functor.map(doubler, 42));
    test.equal<null>(null)(functor.map(doubler, null));
    test.equal<number | undefined>(84)(
        functor.map(doubler, 42 as number | undefined)
    );
});
