import { Generic, TypeTag, _ } from "typeprops";

export interface Monad<Tag extends TypeTag, Map extends ArrayLike<any> = [_]> {
    // Functor
    // map :: (a -> b) -> T a -> T b
    map: <T, U>(
        transform: (value: T) => U
    ) => <M extends Generic<Tag, [T], Map, any>>(
        monad: M
    ) => Generic<Tag, [U], Map, M>;

    // Monad
    // of :: a -> T a
    of: <T>(value: T) => Generic<Tag, [T], Map, never>;
    // chain :: (a -> T b) -> T a -> T b
    chain: <T, M extends Generic<Tag, any>>(
        transform: (a: T) => M
    ) => (monad: Generic<Tag, [T], Map, M>) => M;
}
