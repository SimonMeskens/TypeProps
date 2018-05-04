import { FunctorProps, Generic, Parameters } from "typeprops";
import { Either } from "../data/either";

declare module "typeprops" {
    interface FunctorProps<T = {}, Params extends ArrayLike<any> = never> {
        "typeprops/examples/data#either": {
            infer: T extends Either<any, infer R> ? [R] : never;
            construct: Either<Parameters<T>[0], Params[0]>;
        };
    }
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
