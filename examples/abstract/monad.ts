import {
    GenericMonad,
    InstanceMonad,
    MonadParameter,
    StaticMonad
} from "../../lib/abstract/monad";
import { Either } from "../../lib/data/either";
import { Option } from "../../lib/data/option";

const instanceChain = <F extends InstanceMonad<F>, B>(
    fn: (a: MonadParameter<F>) => B,
    fa: F
) => fa.chain(fn);

const staticChain = <F, B extends GenericMonad<F>>(
    f: StaticMonad<F>,
    fn: (a: MonadParameter<F>) => B,
    fa: F
): GenericMonad<F, MonadParameter<B>> => f.chain(fn, fa);

{
    const toString = (a: number) => Option.of(a.toString());
    let option = new Option(4);
    let monad: StaticMonad<Option<any>> = Option;
    let x = monad.chain(toString, option);
    let a = instanceChain(toString, option);
    let b = staticChain(Option, toString, option);
    let staticOption: StaticMonad<Option<any>> = Option;
    let instanceOption: InstanceMonad<typeof option> = option;
    let c = staticOption.chain(toString, option);
    let d = instanceOption.chain(toString);
}

{
    const toString = (a: number) => Either.of(a.toString());
    let either = new Option(4).toEither("error");
    let a = instanceChain(toString, either);
    let b = staticChain(Either, toString, either);
    let staticEither: StaticMonad<Either<any, any>> = Either;
    let instanceEither: InstanceMonad<typeof either> = either;
    let c = staticEither.chain(toString, either);
    let d = instanceEither.chain(toString);
}
