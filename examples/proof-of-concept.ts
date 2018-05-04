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
