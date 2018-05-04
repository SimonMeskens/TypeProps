import { Generic, MonadProps, Parameters } from "typeprops";

declare module "typeprops" {
    interface MonadProps<T = {}, Params extends ArrayLike<any> = never>
        extends FunctorProps<T, Params> {}
}

export type GenericMonad<F, A = any> = Generic<F, [A], MonadProps<F, [A]>>;
export type MonadParameter<F> = Parameters<F, MonadProps<F>>[0];

// There's no decent way to assure that the type representative has an "of"
export interface InstanceMonad<F> {
    map<U>(transform: (a: MonadParameter<F>) => U): GenericMonad<F, U>;

    chain<U extends GenericMonad<F>>(
        transform: (a: MonadParameter<F>) => U
    ): GenericMonad<F, MonadParameter<U>>;
}

export interface StaticMonad<G> {
    map<F extends GenericMonad<G>, U>(
        transform: (a: MonadParameter<F>) => U,
        mappable: F
    ): GenericMonad<F, U>;

    chain<F extends GenericMonad<G>, U extends GenericMonad<G>>(
        transform: (a: MonadParameter<F>) => U,
        mappable: F
    ): GenericMonad<F, MonadParameter<U>>;

    of<T>(a: T): GenericMonad<G, T>;
}
