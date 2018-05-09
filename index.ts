import { Match } from "./match";

// Waiting for proper top type
export type unknown = {} | null | undefined;

// TODO: TS 2.9: add symbol support
export interface TypeProp {
    infer: ArrayLike<unknown>;
    construct: unknown;
}

export { Match } from "./match";

/**
 * Get the type parameters for type T
 *
 * 'T' is the type to get parameters for
 * 'Override' optionally allows you to override select types in the type dictionary
 */
export type Parameters<
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
export type Parameter<
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
export type Generic<
    T,
    Params extends ArrayLike<any> = ArrayLike<any>,
    Override extends { [K in keyof Override]: TypeProp } = never
> = Match<T, Params, Override>["construct"];

declare module "typeprops" {
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
}
