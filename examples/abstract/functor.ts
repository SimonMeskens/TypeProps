import {
    FunctorParameter,
    GenericFunctor,
    InstanceFunctor,
    StaticFunctor
} from "../../lib/abstract/functor";
import { Either } from "../../lib/data/either";
import { Option } from "../../lib/data/option";

const instanceMap = <F extends InstanceFunctor<F>, B>(
    fn: (a: FunctorParameter<F>) => B,
    fa: F
): GenericFunctor<F, B> => fa.map(fn);

const staticMap = <F, B>(
    f: StaticFunctor<F>,
    fn: (a: FunctorParameter<F>) => B,
    fa: F
): GenericFunctor<F, B> => f.map(fn, fa);

const toString = (a: number) => a.toString();

{
    let option = new Option(4);
    let a = instanceMap(toString, option);
    let b = staticMap(Option, toString, option);
    let staticOption: StaticFunctor<Option<any>> = Option;
    let instanceOption: InstanceFunctor<typeof option> = option;
    let c = staticOption.map(toString, option);
    let d = instanceOption.map(toString);
}

{
    let either = new Option(4).toEither("error");
    let a = instanceMap(toString, either);
    let b = staticMap(Either, toString, either);
    let staticEither: StaticFunctor<Either<any, any>> = Either;
    let instanceEither: InstanceFunctor<typeof either> = either;
    let c = staticEither.map(toString, either);
    let d = instanceEither.map(toString);
}
