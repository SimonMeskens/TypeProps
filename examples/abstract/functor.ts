import {
    FunctorParameter,
    GenericFunctor,
    InstanceFunctor,
    StaticFunctor
} from "../../lib/abstract/functor";
import { Either } from "../../lib/data/either";
import { Option } from "../../lib/data/option";
import { test } from "../../tests/harness";

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

test("examples/abstract/functor1", test => {
    test.plan(4);

    let option = new Option(4);
    let staticOption: StaticFunctor<Option<any>> = Option;
    let instanceOption: InstanceFunctor<typeof option> = option;

    test.deepEqual<Option<string>>(option.map(toString))(
        instanceMap(toString, option)
    );
    test.deepEqual<Option<string>>(option.map(toString))(
        staticMap(Option, toString, option)
    );
    test.deepEqual<Option<string>>(option.map(toString))(
        staticOption.map(toString, option)
    );
    test.deepEqual<Option<string>>(option.map(toString))(
        instanceOption.map(toString)
    );
});

test("examples/abstract/functor2", test => {
    test.plan(4);

    let either = new Option(4).toEither("error");
    let staticEither: StaticFunctor<Either<any, any>> = Either;
    let instanceEither: InstanceFunctor<typeof either> = either;

    test.deepEqual<Either<string, string>>(either.map(toString))(
        instanceMap(toString, either)
    );
    test.deepEqual<Either<string, string>>(either.map(toString))(
        staticMap(Either, toString, either)
    );
    test.deepEqual<Either<string, string>>(either.map(toString))(
        staticEither.map(toString, either)
    );
    test.deepEqual<Either<string, string>>(either.map(toString))(
        instanceEither.map(toString)
    );
});
