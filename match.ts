import { TypeProps } from "typeprops";
import { TypeProp } from ".";

/**
 * A type-level pattern-matcher. Returns a TypeProp for a type T, with Params, given:
 *
 * 'T' is the type to match against
 * 'Params' is the parameters you want to mutate T with
 * 'Override' lets you optionally define overrides for the type dictionary
 */
export type Match<
    T,
    Params extends ArrayLike<any> = ArrayLike<any>,
    Override extends { [K in keyof Override]: TypeProp } = never
> =
    // Check each type of union separately, using [distributive conditional types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types)
    T extends infer U
        ? Dictionary<U, Params, Override>[CheckMatch<T, Params>]
        : never;

// If a match, return unique key
type CheckMatch<T, Params extends ArrayLike<any> = ArrayLike<any>> =
    // Handle the "unfound" case
    // If T is `{}` or `any`, infer `any`, this will select both paths of the conditional and return `"unfound" | KeyOf<T, Params>`
    ({} extends T ? any : Infer<T, Params>) extends never
        ? "unfound"
        : KeyOf<T, Params>;

// Match for all keys and return key if matched, then construct union
type KeyOf<T, Params extends ArrayLike<any> = ArrayLike<any>> = {
    [Key in Keys<T, Params>]: Infer<T, Params, Key> extends never ? never : Key
}[Keys<T, Params>];

// List of TypeProps keys, excluding "unfound"
type Keys<T, Params extends ArrayLike<any>> = Exclude<
    keyof TypeProps<T, Params>,
    "unfound"
>;

// Core matching algorithm
type Infer<
    T,
    Params extends ArrayLike<any>,
    Key extends Keys<T, Params> = Keys<T, Params>
> = TypeProps<T, Params>[Key]["infer"];

// Combine TypeProps and Override into single dictionary
type Dictionary<
    T,
    Params extends ArrayLike<any>,
    Override extends { [K in keyof Override]: TypeProp }
> = {
    [K in
        | (keyof TypeProps<T, Params>)
        | keyof Override]: K extends keyof Override
        ? Override[K]
        : K extends keyof TypeProps<T, Params> ? TypeProps<T, Params>[K] : never
};
