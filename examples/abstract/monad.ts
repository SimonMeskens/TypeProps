import {
    GenericMonad,
    InstanceMonad,
    MonadParameter,
    StaticMonad
} from "../../lib/abstract/monad";
import { Either } from "../../lib/data/either";
import { Option } from "../../lib/data/option";
import { test } from "../../tests/harness";

const instanceChain = <F extends InstanceMonad<F>, B>(
    fn: (a: MonadParameter<F>) => B,
    fa: F
) => fa.chain(fn);

const staticChain = <F, B extends GenericMonad<F>>(
    f: StaticMonad<F>,
    fn: (a: MonadParameter<F>) => B,
    fa: F
): GenericMonad<F, MonadParameter<B>> => f.chain(fn, fa);

test("examples/abstract/monad1", test => {
    test.plan(4);

    const toString = (a: number) => Option.of(a.toString());

    let option = new Option(4);
    let staticOption: StaticMonad<Option<any>> = Option;
    let instanceOption: InstanceMonad<typeof option> = option;

    test.deepEqual<Option<string>>(option.chain(toString))(
        instanceChain(toString, option)
    );
    test.deepEqual<Option<string>>(option.chain(toString))(
        staticChain(Option, toString, option)
    );
    test.deepEqual<Option<string>>(option.chain(toString))(
        staticOption.chain(toString, option)
    );
    test.deepEqual<Option<string>>(option.chain(toString))(
        instanceOption.chain(toString)
    );
});

test("examples/abstract/monad2", test => {
    test.plan(4);

    const toString = (a: number) => Either.of(a.toString());

    let either = new Option(4).toEither("error");
    let staticEither: StaticMonad<Either<any, any>> = Either;
    let instanceEither: InstanceMonad<typeof either> = either;

    test.deepEqual<Either<string, string>>(either.chain(toString))(
        instanceChain(toString, either)
    );
    test.deepEqual<Either<string, string>>(either.chain(toString))(
        staticChain(Either, toString, either)
    );
    test.deepEqual<Either<string, string>>(either.chain(toString))(
        staticEither.chain(toString, either)
    );
    test.deepEqual<Either<string, string>>(either.chain(toString))(
        instanceEither.chain(toString)
    );
});
