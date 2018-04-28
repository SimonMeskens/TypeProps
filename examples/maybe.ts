// Based on provided sample by Asad Saeeduddin
import { Generic, TypeTag } from "typeprops";
import { Monad } from "./types";

// just :: a -> T a
// none :: T a
interface GenericMaybeDefinition<
    TNone extends Generic<TTag>,
    TTag extends TypeTag
> {
    just: <T>(value: T) => Generic<TTag, [T]>;
    none: TNone;
    match: GenericMaybeMatch<TTag>;
}

// match :: { "just" :: a -> b, "none" :: b } -> T a -> b
interface GenericMaybeMatch<TTag extends TypeTag> {
    <T, B, C>(
        _: {
            just: (value: T) => B;
            none: C;
        }
    ): (maybe: Generic<TTag, [T]>) => B | C;
}

const GenericMaybe = <
    TNone extends Generic<TTag>,
    TTag extends TypeTag = TypeTag<TNone>
>({
    just,
    none,
    match
}: GenericMaybeDefinition<TNone, TTag>): Monad<TTag> => {
    // Functor
    // map :: (a -> b) -> T a -> T b
    const map = <T, U, M extends Generic<TTag, [T]>>(
        transform: (value: T) => U
    ): ((maybe: M) => Generic<TTag, [U]>) =>
        match({ none, just: (value: T) => just(transform(value)) });

    // Monad
    // of :: a -> T a
    const of = just;
    // chain :: (a -> T b) -> T a -> T b
    const chain = <T, U, M extends Generic<TTag, [T]>>(
        transform: (value: T) => Generic<TTag, [U]>
    ): ((maybe: M) => Generic<TTag, [U]>) => match({ none, just: transform });

    return { map, of, chain } as Monad<TTag>;
};

// A concrete representation of a Maybe
export const MAYBE = Symbol("maybe");
export type Maybe<T = any> = Just<T> | None;
export type Just<T> = { [MAYBE]: T };
export type None = typeof MAYBE & { [key: string]: never };

declare module "typeprops" {
    interface TypeProps<T> {
        ["typeprops/examples#maybe"]: {
            infer: T extends Just<infer A>
                ? [A]
                : T extends None ? None : never;
            construct: Maybe<T[0]>;
        };
    }
}

export const Maybe = {
    just: <T>(value: T) => ({ [MAYBE]: value } as Just<T>),
    none: {} as None,
    match: <T, B, C>({ just, none }: { just: (value: T) => B; none: C }) => (
        maybe: Maybe<T>
    ): B | C => (MAYBE in maybe ? just((maybe as Just<T>)[MAYBE]) : none)
};

{
    const { just, none, match } = Maybe;
    const { map, chain, of } = GenericMaybe({ just, none, match });

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
