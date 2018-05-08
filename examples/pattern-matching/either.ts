// Based on provided sample by Asad Saeeduddin
import { Parameter, unknown } from "typeprops";
import { test } from "../../tests/harness";
import { GenericMonad, Matchable, Monad } from "./adt";
import { Maybe, None, maybe } from "./maybe";

// left :: a -> T a
// right :: a -> T a
// match :: { "left" :: a -> b, "right" :: a -> b } -> T a -> b
const GenericEither = <G extends GenericMonad<any>>({
    left,
    right,
    match
}: Matchable<
    G,
    {
        right: <A>(a: A) => GenericMonad<G, A>;
        left: GenericMonad<G> | (<A>(a: A) => GenericMonad<G, A>);
    }
>): Monad<G> => {
    // Functor
    // map :: (a -> b) -> T a -> T b
    const map = <A, B>(
        f: (a: A) => B
    ): (<F extends GenericMonad<G, A>>(monadic: F) => GenericMonad<F, B>) =>
        match({
            left: left as any, // We know this is correct
            right: (value: A) => right(f(value))
        });

    // Monad
    // of :: a -> T a
    const of = right;
    // chain :: (a -> T b) -> T a -> T b
    const chain = <T, U extends GenericMonad<G>>(f: (a: T) => U) =>
        match({
            left: left as any, // We know this is correct
            right: f
        });

    return { map, of, chain };
};

// A concrete representation of an Either
type Either<T, U> = Left<T> | Right<U>;
interface Left<T> {
    left: T;
}
interface Right<T> {
    right: T;
}

declare module "typeprops" {
    interface TypeProps<T, Params> {
        "examples/pattern-matching/either#either": {
            infer:
                | (T extends Left<infer T> ? [T, never] : never)
                | (T extends Right<infer U> ? [never, U] : never);
            construct: Either<Params[0], Params[1]>;
        };
    }
}
declare module "./adt" {
    interface MonadProps<T, Params> {
        "examples/pattern-matching/either#either": {
            infer: T extends Either<any, infer U> ? [U] : never;
            construct: Either<Parameter<T>, Params[0]>;
        };
    }
}

{
    const left = <T>(left: T) => ({ left } as Either<T, never>);
    const right = <T>(right: T) => ({ right } as Either<never, T>);

    const match: any = <L1, R1, L2, R2>({
        left,
        right
    }: {
        left: (left: L1) => L2;
        right: (right: R1) => R2;
    }) => (either: Either<L1, R1>): L2 | R2 =>
        "left" in either ? left(either.left) : right(either.right);

    const { of, map, chain } = GenericEither<Left<unknown> | Right<never>>({
        left,
        right,
        match
    });

    test("examples/pattern-matching/either1", test => {
        test.plan(6);

        test.deepEqual<Either<unknown, number>>(of(42))(
            map((x: number) => x * 2)(of(21))
        );
        test.deepEqual<Either<string, number>>(left("error"))(
            map((x: number) => x * 2)(left("error"))
        );
        test.deepEqual<Either<unknown, number>>(left("error"))(
            chain((x: number) => (x > 40 ? left("error") : of(x * 2)))(of(42))
        );
        test.deepEqual<Either<unknown, number>>(of(64))(
            chain((x: number) => (x > 40 ? left("error") : of(x * 2)))(of(32))
        );
        test.deepEqual<Either<unknown, Either<string, never>>>(
            of(left("error"))
        )(map(() => left("error"))(of(42)));
        test.deepEqual<Either<unknown, Either<unknown, number>>>(of(of(84)))(
            map((x: number) => of(x * 2))(of(42))
        );
    });
}

{
    const { none, just, match } = maybe;

    const { of, map, chain } = GenericEither<Maybe<never>>({
        left: none,
        right: just,
        match: <T, B>({ left, right }: { right: (value: T) => B; left: B }) =>
            match({ none: left, just: right })
    });

    test("examples/pattern-matching/either2", test => {
        test.plan(6);

        test.deepEqual<Maybe<number>>(of(42))(
            map((x: number) => x * 2)(of(21))
        );
        test.deepEqual<Maybe<number>>(none)(map((x: number) => x * 2)(none));
        test.deepEqual<Maybe<number>>(none)(
            chain((x: number) => (x > 40 ? none : of(x * 2)))(of(42))
        );
        test.deepEqual<Maybe<number>>(of(64))(
            chain((x: number) => (x > 40 ? none : of(x * 2)))(of(32))
        );
        test.deepEqual<Maybe<None>>(of(none))(map(() => none)(of(42)));
        test.deepEqual<Maybe<Maybe<number>>>(of(of(84)))(
            map((x: number) => of(x * 2))(of(42))
        );
    });
}
