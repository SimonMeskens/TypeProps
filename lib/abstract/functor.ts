import { FunctorProps, Generic, Parameter } from "typeprops";

declare module "typeprops" {
    interface FunctorProps<T, Params extends ArrayLike<any>> {}
}

export type GenericFunctor<F, A = any> = Generic<F, [A], FunctorProps<F, [A]>>;
export type FunctorParameter<F> = Parameter<F, 0, FunctorProps<F, any[]>>;

export interface InstanceFunctor<F> {
    map<U>(transform: (a: FunctorParameter<F>) => U): GenericFunctor<F, U>;
}

export interface StaticFunctor<G> {
    map<F extends GenericFunctor<G>, U>(
        transform: (a: FunctorParameter<F>) => U,
        mappable: F
    ): GenericFunctor<F, U>;
}
