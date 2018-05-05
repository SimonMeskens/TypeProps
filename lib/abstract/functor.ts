import { FunctorProps, Generic, Parameters } from "typeprops";

declare module "typeprops" {
    interface FunctorProps<T = {}, Params extends ArrayLike<any> = never> {}
}

export type GenericFunctor<F, A = any> = Generic<F, [A], FunctorProps<F, [A]>>;
export type FunctorParameter<F> = Parameters<F, FunctorProps<F>>[0];

export interface InstanceFunctor<F> {
    map<U>(transform: (a: FunctorParameter<F>) => U): GenericFunctor<F, U>;
}

export interface StaticFunctor<G> {
    map<F extends GenericFunctor<G>, U>(
        transform: (a: FunctorParameter<F>) => U,
        mappable: F
    ): GenericFunctor<F, U>;
}
