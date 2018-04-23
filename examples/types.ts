import { Generic, TypeParams } from "typeprops";
import { Push, Pop } from "./tuple";

// Interface is monadic over the rightmost type parameter only
export interface Monad<TGeneric> {
    // Functor
    // map :: (a -> b) -> T a -> T b
    map: <T, U>(
        transform: (value: T) => U
    ) => (
        o: Generic<TGeneric, [T]>
    ) => Generic<TGeneric, Push<Pop<TypeParams<TGeneric>>, U>>;

    // Monad
    // of :: a -> T a
    of: <T>(value: T) => Generic<TGeneric, Push<Pop<TypeParams<TGeneric>>, T>>;
    // chain :: (a -> T b) -> T a -> T b
    chain: <T, U>(
        transform: (a: T) => Generic<TGeneric, [U]>
    ) => (
        maybe: Generic<TGeneric, [T]>
    ) => Generic<TGeneric, Push<Pop<TypeParams<TGeneric>>, U>>;
}
