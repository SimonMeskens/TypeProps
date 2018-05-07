declare module "typeprops" {
    // Waiting for proper top type
    type unknown = {} | null | undefined;

    // TODO: TS 2.9: add symbol support
    interface TypeProp {
        infer: ArrayLike<unknown>;
        construct: unknown;
    }

    /**
     * A dictionary of 'TypeProps' that can be extended through [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces).
     *
     * 'T' is the type you want to check and/or mutate.
     * 'Params' is a list of type parameters to mutate 'T' with
     *
     * Each entry should have a unique key, typed with the following two properties:
     *
     * ```TypeScript
     * {
     *     infer: T extends MyType<infer A> ? [A] : never;
     *     construct: MyType<Params[0]>
     * }
     * ```
     *
     * 'infer' should always verify the type is correct and return 'never' otherwise. It should return an ArrayLike with a list of inferred type parameters.
     *
     * 'construct' should return the mutated type using the passed in 'Params'. It should generally not check if the passed in type 'T' is correct. If you want to reuse parameters from 'T', you can do it like this:
     *
     * ```TypeScript
     * {
     *     infer: T extends MyType<any, infer A> ? [A] : never;
     *     construct: MyType<Parameters<T>[0], Params[0]>
     * }
     * ```
     */
    interface TypeProps<T, Params extends ArrayLike<any>> {
        array: {
            infer: T extends Array<infer A> ? T : never;
            construct: Params[number][];
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

    /**
     * A type-level pattern-matcher.
     *
     * 'T' is the type to match against
     * 'Params' is the parameters you want to mutate T with
     * 'Override' lets you optionally define overrides for the type dictionary
     *
     * A rough overview of the algorithm:
     * - Split union type into distinct cases using a distributive conditional
     * - Construct a type dictionary using TypeProps & Override
     * - If T is '{}', set the indexer to 'any'
     * TODO: make Match use Override in the indexer
     * TODO: finish explaining algorithm
     */
    type Match<
        T,
        Params extends ArrayLike<any> = ArrayLike<any>,
        Override extends { [K in keyof Override]: TypeProp } = never
    > = T extends infer U
        ? Dictionary<U, Params, Override>[({} extends U
              ? any
              : Dictionary<U, Params, Override>[Exclude<
                    keyof Dictionary<U, Params, Override>,
                    "unfound"
                >]["infer"]) extends never
              ? "unfound"
              : {
                    [Key in Exclude<
                        keyof Dictionary<U, Params, Override>,
                        "unfound"
                    >]: Dictionary<
                        U,
                        Params,
                        Override
                    >[Key]["infer"] extends never
                        ? never
                        : Key
                }[Exclude<keyof Dictionary<U, Params, Override>, "unfound">]]
        : never;

    type Parameters<
        T,
        Override extends { [K in keyof Override]: TypeProp } = never
    > = Match<T, never, Override>["infer"];

    type Parameter<
        T,
        Index extends number = 0,
        Override extends { [K in keyof Override]: TypeProp } = never
    > = Parameters<T>[Index];

    type Generic<
        T,
        Params extends ArrayLike<any> = ArrayLike<any>,
        Override extends { [K in keyof Override]: TypeProp } = never
    > = Match<T, Params, Override>["construct"];

    type Dictionary<
        T,
        Params extends ArrayLike<any>,
        Override extends { [K in keyof Override]: TypeProp } = never
    > = {
        [K in
            | (keyof TypeProps<T, Params>)
            | keyof Override]: K extends keyof Override
            ? Override[K]
            : K extends keyof TypeProps<T, Params>
                ? TypeProps<T, Params>[K]
                : never
    };
}
