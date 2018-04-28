// Based on provided sample by Asad Saeeduddin
import { Generic, TypeTag, _ } from "typeprops";
import { Monad } from "./types";
import { ADTDefinition } from "./types";

// just :: a -> T a
// none :: T a
// match :: { "just" :: a -> b, "none" :: b } -> T a -> b
const GenericMaybe = <TTag extends TypeTag, TMap extends ArrayLike<any>>({
    just,
    none,
    match
}: ADTDefinition<
    TTag,
    TMap,
    {
        just: <T>(value: T) => Generic<TTag, [T], TMap, never>;
        none: Generic<TTag, never>;
    }
>): Monad<TTag, TMap> => {
    // Functor
    // map :: (a -> b) -> T a -> T b
    const map = <T, U>(
        transform: (value: T) => U
    ): (<M extends Generic<TTag, [T], TMap, any>>(
        maybe: M
    ) => Generic<TTag, [U], TMap, M>) =>
        match({ none, just: (value: T) => just(transform(value)) });

    // Monad
    // of :: a -> T a
    const of = just;
    // chain :: (a -> T b) -> T a -> T b
    const chain = <T, M extends Generic<TTag, any>>(
        transform: (value: T) => M
    ): ((maybe: Generic<TTag, [T], TMap, M>) => M) =>
        match({ none: none as M, just: transform }) as ((
            maybe: Generic<TTag, [T], TMap, M>
        ) => M);

    return { map, of, chain } as Monad<TTag, TMap>;
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
                : T extends None ? [never] : never;
            construct: Maybe<T[0]>;
        };
    }
}

export const Maybe = {
    just: <T>(value: T) => ({ [MAYBE]: value } as Just<T>),
    none: {} as None,
    match: <T, B>({ just, none }: { just: (value: T) => B; none: B }) => (
        maybe: Maybe<T>
    ): B => (MAYBE in maybe ? just((maybe as Just<T>)[MAYBE]) : none)
};

{
    const { just, none, match } = Maybe;
    const { map, chain, of } = GenericMaybe<TypeTag<Maybe>, [_]>({
        just,
        none,
        match
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
