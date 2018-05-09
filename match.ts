import { TypeProps } from "typeprops";
import { TypeProp } from ".";

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
export type Match<
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
 * Construct a type dictionary
 *
 * 'T' is the type to mutate
 * 'Params' is the array of type parameters to mutate into
 * 'Override' optionally allows you to override select types in the type dictionary
 */
export type Dictionary<
    T,
    Params extends ArrayLike<any>,
    Override extends { [K in keyof Override]: TypeProp } = never
> = {
    [K in
        | (keyof TypeProps<T, Params>)
        | keyof Override]: K extends keyof Override
        ? Override[K]
        : K extends keyof TypeProps<T, Params> ? TypeProps<T, Params>[K] : never
};
