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
     *     construct: MyType<Parameter<T, 0>, Params[0]>
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
     * A type-level pattern-matcher. Returns a TypeProp for a type T, with Params, given:
     *
     * 'T' is the type to match against
     * 'Params' is the parameters you want to mutate T with
     * 'Override' lets you optionally define overrides for the type dictionary
     *
     * A rough overview of the algorithm:
     * - Split union type into distinct cases using a distributive conditional
     * - Construct a type dictionary using TypeProps & Override
     * - If T is '{}', set the checking type to 'any'
     * - Otherwise, set the checking type to the 'infer' property of T's TypeProp
     * - If the checking type is 'never', set the indexer to "unfound"
     * - Otherwise, use a mapped type to get the unique key for T's TypeProp, excluding "unfound" and set it as the indexer
     * - If the checking type was 'any', it will run both previous paths and return a union of "unfound" and all other unique keys as indexer
     * - Index the type dictionary with the indexer and return the TypeProp
     */
    type Match<
        T,
        Params extends ArrayLike<any> = ArrayLike<any>,
        Override extends { [K in keyof Override]: TypeProp } = never
    > = T extends infer U
        ? Dictionary<U, Params, Override>[({} extends U
              ? any
              : TypeProps<U, Params>[Exclude<
                    keyof TypeProps<U, Params>,
                    "unfound"
                >]["infer"]) extends never
              ? "unfound"
              : {
                    [Key in Exclude<
                        keyof TypeProps<U, Params>,
                        "unfound"
                    >]: TypeProps<U, Params>[Key]["infer"] extends never
                        ? never
                        : Key
                }[Exclude<keyof TypeProps<U, Params>, "unfound">]]
        : never;

    /**
     * Get the type parameters for type T
     *
     * 'T' is the type to get parameters for
     * 'Override' optionally allows you to override select types in the type dictionary
     */
    type Parameters<
        T,
        Override extends { [K in keyof Override]: TypeProp } = never
    > = Match<T, never, Override>["infer"];

    /**
     * Get a type parameter for type T
     *
     * 'T' is the type to get the parameter for
     * 'Index' optionally allows you to specify which parameter to return
     * 'Override' optionally allows you to override select types in the type dictionary
     */
    type Parameter<
        T,
        Index extends number = 0,
        Override extends { [K in keyof Override]: TypeProp } = never
    > = Parameters<T, Override>[Index];

    /**
     * Get a concrete generic type mutated from type T, with Params
     *
     * 'T' is the type to mutate
     * 'Params' is the array of type parameters to mutate into, defaults to 'ArrayLike<any>'
     * 'Override' optionally allows you to override select types in the type dictionary
     */
    type Generic<
        T,
        Params extends ArrayLike<any> = ArrayLike<any>,
        Override extends { [K in keyof Override]: TypeProp } = never
    > = Match<T, Params, Override>["construct"];

    /**
     * Construct a type dictionary
     *
     * 'T' is the type to mutate
     * 'Params' is the array of type parameters to mutate into
     * 'Override' optionally allows you to override select types in the type dictionary
     */
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
