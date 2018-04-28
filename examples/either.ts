// Based on provided sample by Asad Saeeduddin
import { Generic, TypeTag, Infer, _ } from "typeprops";
import { Monad } from "./types";

// left :: a -> T a
// right :: a -> T a
interface GenericEitherDefinition<
    TTag extends TypeTag,
    TMap extends ArrayLike<any>
> {
    left: Generic<TTag, never> | (<T>(left: T) => Generic<TTag, never>);
    right: <T>(right: T) => Generic<TTag, [T], TMap, never>;
    match: GenericEitherMatch<TTag, TMap>;
}

// match :: { "left" :: a -> b, "right" :: a -> b } -> T a -> b
interface GenericEitherMatch<
    TTag extends TypeTag,
    TMap extends ArrayLike<any>
> {
    <T, U>(
        _: {
            left: U | ((left: T) => U);
            right: (right: T) => U;
        }
    ): (maybe: Generic<TTag, [T], TMap, any>) => U;
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

    // Monad
    // of :: a -> T a
    const of = right as <T>(value: T) => Generic<TTag, [T], TMap, never>;
    // chain :: (a -> T b) -> T a -> T b
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
        ["typeprops/examples#either"]: {
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

    // Examples
    console.log([
        map((x: number) => x * 2)(of(21)),
        map((x: number) => x * 2)(left("error")),
        chain((x: number) => (x > 40 ? left("error") : of(x * 2)))(of(42)),
        chain((x: number) => (x > 40 ? left("error") : of(x * 2)))(of(32)),
        map(() => left("error"))(of(42)),
        map((x: number) => of(x * 2))(of(42))
    ]);
}

// Reuse generic implementation for our Maybe
import { Maybe } from "./maybe";
{
    const { none, just, match } = Maybe;

    const { of, map, chain } = GenericEither<TypeTag<Maybe>, [_]>({
        left: none,
        right: just,
        match: (<T, B>({ left, right }: { right: (value: T) => B; left: B }) =>
            match({ none: left, just: right })) as GenericEitherMatch<
            TypeTag<Maybe>,
            [_]
        >
    });

    // Examples
    console.log([
        map((x: number) => x + 2)(of(42)),
        map((x: number) => x + 2)(none),
        chain((x: number) => (x > 40 ? none : of(x * 2)))(of(42)),
        chain((x: number) => (x > 40 ? none : of(x * 2)))(of(32)),
        map((x: any) => none)(of(42)),
        map((x: number) => of(x * 2))(of(42))
    ]);
}
