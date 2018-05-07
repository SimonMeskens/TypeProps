// Based on provided sample by Asad Saeeduddin
import { Parameter, unknown } from "typeprops";
import { GenericMonad, Matchable, Monad } from "./adt";
import { Maybe, maybe } from "./maybe";

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

    let a = map((x: number) => x * 2)(of(21)); // a: Either<unknown, number>
    let b = map((x: number) => x * 2)(left("error")); // b: Either<string, number>
    let c = chain((x: number) => (x > 40 ? left("error") : of(x * 2)))(of(42)); // c: Either<unknown, number>
    let d = chain((x: number) => (x > 40 ? left("error") : of(x * 2)))(of(32)); // d: Either<unknown, number>
    let e = map(() => left("error"))(of(42)); // e: Either<unknown, Either<string, never>>
    let f = map((x: number) => of(x * 2))(of(42)); // f: Either<unknown, Either<unknown, number>>

    // Examples
    console.log([a, b, c, d, e, f]);
}

{
    const { none, just, match } = maybe;

    const { of, map, chain } = GenericEither<Maybe<never>>({
        left: none,
        right: just,
        match: <T, B>({ left, right }: { right: (value: T) => B; left: B }) =>
            match({ none: left, just: right })
    });

    // Examples
    let a = map((x: number) => x + 2)(of(42)); // a: Maybe<number>
    let b = map((x: number) => x + 2)(none); // b: Maybe<number>
    let c = chain((x: number) => (x > 40 ? none : of(x * 2)))(of(42)); // c: Maybe<number>
    let d = chain((x: number) => (x > 40 ? none : of(x * 2)))(of(32)); // d: Maybe<number>
    let e = map((x: number) => none)(of(42)); // e: Maybe<None>
    let f = map((x: number) => of(x * 2))(of(42)); // f: Maybe<Maybe<number>>

    console.log([a, b, c, d, e, f]);
}
