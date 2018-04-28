// Based on provided sample by Asad Saeeduddin
import { Generic, TypeTag, Infer, _ } from "typeprops";
import { Monad } from "./types";

// left :: a -> T a
// right :: a -> T a
interface GenericEitherDefinition<
    TTag extends TypeTag,
    TMap extends ArrayLike<any>
> {
    left: <T>(left: T) => Generic<TTag, never>;
    right: <T>(right: T) => Generic<TTag, [T], TMap, never>;
    match: GenericEitherMatch<TTag, TMap>;
}

// match :: { "left" :: a -> b, "right" :: a -> b } -> T a -> b
interface GenericEitherMatch<
    TTag extends TypeTag,
    TMap extends ArrayLike<any>
> {
    <L1, L2, R1, R2>(
        _: {
            left: (left: L1) => L2;
            right: (right: R1) => R2;
        }
    ): (maybe: Generic<TTag, [R1], TMap, any>) => L2 | R2;
}

const GenericEither = <TTag extends TypeTag, TMap extends ArrayLike<any>>({
    left,
    right,
    match
}: GenericEitherDefinition<TTag, TMap>): Monad<TTag, TMap> => {
    // Functor
    // map :: (a -> b) -> T a -> T b
    const map = <T, U>(
        transform: (value: T) => U
    ): (<M extends Generic<TTag, [T], TMap, any>>(
        maybe: M
    ) => Generic<TTag, [U], TMap, M>) => {
        return match({
            left: left,
            right: (value: T) => right(transform(value))
        });
    };
    //    match({ left, right: (value: T) => right(transform(value)) });

    const of = right as <T>(value: T) => Generic<TTag, [T], TMap, never>;
    const chain = <T, M extends Generic<TTag, any>>(
        transform: (value: T) => M
    ): ((maybe: Generic<TTag, [T], TMap, M>) => M) =>
        match({
            left: left,
            right: transform
        }) as ((maybe: Generic<TTag, [T], TMap, M>) => M);

    return { map, of, chain };
};

// A concrete representation of an Either
type Either<T = any, U = any> = Left<T> | Right<U>;
type Left<T> = { left: T };
type Right<T> = { right: T };

declare module "typeprops" {
    interface TypeProps<T> {
        ["examples/either#either"]: {
            infer: T extends Left<infer A>
                ? [A, never]
                : T extends Right<infer B> ? [never, B] : never;
            construct: Either<T[0], T[1]>;
        };
    }
}
{
    const left = <T>(left: T) => ({ left } as Left<T>);
    const right = <T>(right: T) => ({ right } as Right<T>);

    const match: any = <L1, R1, L2, R2>({
        left,
        right
    }: {
        left: (left: L1) => L2;
        right: (right: R1) => R2;
    }) => (either: Either<L1, R1>): L2 | R2 =>
        "left" in either ? left(either.left) : right(either.right);

    const { of, map, chain } = GenericEither<TypeTag<Either>, [Infer, _]>({
        left,
        right,
        match
    });

    console.log([
        map((x: number) => x * 2)(of(21)),
        map((x: number) => x * 2)(left("error")),
        chain((x: number) => (x > 40 ? left("error") : of(x * 2)))(of(42)),
        chain((x: number) => (x > 40 ? left("error") : of(x * 2)))(of(32)),
        map(() => left("error"))(of(42)),
        map((x: number) => of(x * 2))(of(42))
    ]);
}

// A concrete representation of a Maybe
const MAYBE = Symbol("maybe");
type Maybe<T = any> = Just<T> | None;
type Just<T> = { [MAYBE]: T };
type None = typeof MAYBE & { [key: string]: never };

declare module "typeprops" {
    interface TypeProps<T> {
        ["examples/either#maybe"]: {
            infer: T extends Maybe<infer A> ? [A] : never;
            construct: Maybe<T[0]>;
        };
    }
}

const maybe = {
    just: <T>(value: T) => ({ [MAYBE]: value } as Just<T>),
    none: {} as None,
    match: <L1, R1, L2, R2>({
        just,
        none
    }: {
        just: (value: L1) => L2;
        none: (value: R1) => R2;
    }) => (maybe: Maybe<L1>): L2 | R2 =>
        MAYBE in maybe ? just((maybe as Just<L1>)[MAYBE]) : none({} as R1)
};

// Reuse generic implementation for our Maybe
{
    const { none, just, match } = maybe;

    // translating the constructor names is boilerplate
    // I can easily abstract out into a single function call,
    // but it's good to see the guts
    const { of, map, chain } = GenericEither<TypeTag<Maybe>, [_]>({
        left: <T>(value: T) => none,
        right: just,
        match: ({ left, right }) => match({ none: left, just: right })
    });

    console.log([
        map((x: number) => x + 2)(of(42)),
        map((x: number) => x + 2)(none),
        chain((x: number) => (x > 40 ? none : of(x * 2)))(of(42)),
        chain((x: number) => (x > 40 ? none : of(x * 2)))(of(32)),
        map((x: any) => none)(of(42)),
        map((x: number) => of(x * 2))(of(42))
    ]);
}
