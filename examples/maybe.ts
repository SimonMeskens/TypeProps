// Based on provided sample by Asad Saeeduddin
import { Generic } from "typeprops";
import { Monad } from "./types";

// just :: a -> T a
// none :: T a
interface GenericMaybeDefinition<
    TJust extends <T>(value: T) => Generic<TMaybe, [T]>,
    TNone extends Generic<TMaybe>,
    TMaybe = ReturnType<TJust> | TNone
> {
    just: TJust;
    none: TNone;
    match: GenericMaybeMatch<TMaybe>;
}

// match :: { "just" :: a -> b, "none" :: b } -> T a -> b
interface GenericMaybeMatch<TMaybe> {
    <T, B, C>(
        _: {
            just: (value: T) => B;
            none: C;
        }
    ): (maybe: Generic<TMaybe, [T]>) => B | C;
}

const GenericMaybe = <
    TJust extends <T>(value: T) => Generic<TMaybe, [T]>,
    TNone extends Generic<TMaybe, any>,
    TMaybe = ReturnType<TJust> | TNone
>({
    just,
    none,
    match
}: GenericMaybeDefinition<TJust, TNone>): Monad<TMaybe> => {
    // Functor
    // map :: (a -> b) -> T a -> T b
    const map = <T, U>(
        transform: (value: T) => U
    ): ((maybe: Generic<TMaybe, [T]>) => Generic<TMaybe, [U]>) =>
        match({ none, just: (value: T) => just(transform(value)) });

    // Monad
    // of :: a -> T a
    const of = just;
    // chain :: (a -> T b) -> T a -> T b
    const chain = <T, U>(
        transform: (value: T) => Generic<TMaybe, [U]>
    ): ((maybe: Generic<TMaybe, [T]>) => Generic<TMaybe, [U]>) =>
        match({ none, just: transform });

    return { map, of, chain };
};

// A concrete representation of a Maybe
const MAYBE = Symbol("maybe");
type Maybe<T = any> = Just<T> | None;
type Just<T> = { [MAYBE]: T };
type None = typeof MAYBE & { [key: string]: never };

declare module "typeprops" {
    interface TypeProps<Type, Params extends ArrayLike<any>> {
        ["examples/maybe#maybe"]: {
            parameters: Type extends Maybe<infer A> ? [A] : never;
            type: Type extends Maybe ? Maybe<Params[0]> : never;
        };
    }
}
{
    const just = <T>(value: T) => ({ [MAYBE]: value });
    const none = {} as None;

    const match = <T, B, C>({ just, none }: { just: (x: T) => B; none: C }) => (
        maybe: Maybe<T>
    ): B | C => (MAYBE in maybe ? just((maybe as Just<T>)[MAYBE]) : none);

    const { map, chain, of } = GenericMaybe({ just, none, match });

    // Examples
    console.log([
        map((x: number) => x + 2)(of(42)),
        map((x: number) => x + 2)(none),
        chain((x: number) => (x > 40 ? none : of(x * 2)))(of(42)),
        chain((x: number) => (x > 40 ? none : of(x * 2)))(of(32)),
        map((x: number) => none)(of(42)),
        map((x: number) => of(x * 2))(of(42))
    ]);
}
