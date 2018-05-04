import { unknown } from "typeprops";

import { StaticFunctor } from "../../lib/abstract/functor";

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

const xs = arrayFunctor.map(doubler, [4, 2]); // xs: number[]
const x = objectFunctor.map(doubler, 42); // x: number
const xNull = nullableFunctor.map(doubler, null); // xNull: null
const xSome = nullableFunctor.map(doubler, 4 as number | undefined); // xSome: number | undefined

const functor: StaticFunctor<unknown | any[]> = {
    map(fn, fa) {
        return Array.isArray(fa)
            ? arrayFunctor.map(fn, fa)
            : fa != undefined
                ? objectFunctor.map(fn, fa)
                : nullableFunctor.map(fn, fa);
    }
};

const ys = functor.map(doubler, [4, 2]); // ys: number[]
const y = functor.map(doubler, 42); // y: number
const yNull = functor.map(doubler, null); // yNull: null
const ySome = functor.map(doubler, 42 as number | undefined); // ySome: number | undefined
