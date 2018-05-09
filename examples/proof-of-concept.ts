/**
 * Standalone example of TypeProps that can be run in a Playground
 *
 * Acknowledgement:
 * - @dagda1 for the sample code this was originally based on and the idea of a functor over `T?`
 * - @masaeedu for the sample code to test the algorithms
 * - @nadameu for help with the core design
 */
namespace poc {
    type unknown = {} | null | undefined;

    // Functor
    interface StaticFunctor<G> {
        map<F extends Generic<G>, U>(
            transform: (a: Parameters<F>[0]) => U,
            mappable: F
        ): Generic<F, [U]>;
    }

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

    // Test output

    console.log("TAP version 13");
    console.log("# TypeProps Proof of Concept");
    console.log("1..8");

    console.log(
        xs[0] === 8 && xs[1] === 4 ? "ok 1 array map" : "not ok 1 array map"
    );
    console.log(x === 84 ? "ok 2 object map" : "not ok 2 object map");
    console.log(xNull === null ? "ok 3 null map" : "not ok 3 null map");
    console.log(xSome === 8 ? "ok 4 some map" : "not ok 4 some map");
    console.log(
        ys[0] === 8 && ys[1] === 4
            ? "ok 5 generic array map"
            : "not ok 5 generic array map"
    );
    console.log(
        y === 84 ? "ok 6 generic object map" : "not ok 6 generic object map"
    );
    console.log(
        yNull === null ? "ok 7 generic null map" : "not ok 7 generic null map"
    );
    console.log(
        ySome === 84
            ? "ok 8 generic nullable map"
            : "not ok 8 generic nullable map"
    );

    // Plumbing
    interface TypeProps<T = {}, Params extends ArrayLike<any> = never> {
        array: {
            infer: T extends Array<infer A> ? [A] : never;
            construct: Params[0][];
        };
        null: {
            infer: null extends T ? [never] : never;
            construct: null;
        };
        undefined: {
            infer: undefined extends T ? [never] : never;
            construct: undefined;
        };
        unfound: {
            infer: [NonNullable<T>];
            construct: Params[0];
        };
    }

    type Match<T> = T extends infer U
        ? ({} extends U
              ? any
              : TypeProps<U>[Exclude<
                    keyof TypeProps,
                    "unfound"
                >]["infer"]) extends never
            ? "unfound"
            : {
                  [Key in Exclude<keyof TypeProps, "unfound">]: TypeProps<
                      T
                  >[Key]["infer"] extends never
                      ? never
                      : Key
              }[Exclude<keyof TypeProps, "unfound">]
        : never;

    type Parameters<T> = TypeProps<T>[Match<T>]["infer"];

    type Generic<T, Params extends ArrayLike<any> = ArrayLike<any>> = TypeProps<
        T,
        Params
    >[Match<T>]["construct"];
}
