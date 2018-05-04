import { Generic, Parameters } from "typeprops";

export interface MonadProps<T = {}, Params extends ArrayLike<any> = never> {}

export type GenericMonad<F, A = any> = Generic<F, [A], MonadProps<F, [A]>>;
export type MonadParameter<F> = Parameters<F, MonadProps<F>>[0];

export interface Monad<G> {
    // Functor
    // map :: (a -> b) -> T a -> T b
    map<T, U>(
        transform: (a: T) => U
    ): <F extends GenericMonad<G, T>>(monadic: F) => GenericMonad<F, U>;

    // Monad
    // chain :: (a -> T b) -> T a -> T b
    chain<T, U extends GenericMonad<G>>(
        transform: (a: T) => U
    ): <F extends GenericMonad<G, T>>(monadic: F) => U;

    // of :: a -> T a
    of<T>(a: T): GenericMonad<G, T>;
}

export type Matchable<
    G extends GenericMonad<any>,
    Cons extends {
        [Key in keyof Cons]:
            | GenericMonad<G>
            | (<T>(value: T) => GenericMonad<G>)
    }
> = Cons & {
    match<A, B>(
        cons: {
            [Key in keyof Cons]:
                | (Cons[Key] extends GenericMonad<G, A> ? B : never)
                | (Cons[Key] extends (<T>(value: T) => GenericMonad<G, T>)
                      ? ((value: A) => B)
                      : never)
        }
    ): <F extends GenericMonad<G, A>>(monadic: F) => B;
};
