// Based on provided sample by Asad Saeeduddin
import { test } from "../../tests/harness";
import { GenericMonad, Matchable, Monad } from "./adt";

// just :: a -> T a
// none :: T a
// match :: { "just" :: a -> b, "none" :: b } -> T a -> b
const GenericMaybe = <G extends GenericMonad<any>>({
    just,
    none,
    match
}: Matchable<
    G,
    {
        just: <A>(a: A) => GenericMonad<G, A>;
        none: GenericMonad<G>;
    }
>): Monad<G> => {
    // Functor
    // map :: (a -> b) -> T a -> T b
    const map = <A, B>(f: (a: A) => B) =>
        match({ none, just: (value: A) => just(f(value)) });

    // Monad
    // of :: a -> T a
    const of = just;
    // chain :: (a -> T b) -> T a -> T b
    const chain = <T, U extends GenericMonad<G>>(f: (a: T) => U) =>
        match({ none, just: f });

    return { map, of, chain };
};

// A concrete representation of a Maybe
const MAYBE = Symbol("maybe");
export type Maybe<T> = Just<T> | None;
export interface Just<T> {
    [MAYBE]: T;
}
export type None = typeof MAYBE & { [key: string]: never };

declare module "typeprops" {
    interface TypeProps<T, Params> {
        "examples/pattern-matching/maybe#maybe": {
            infer: T extends Maybe<infer A> ? [A] : never;
            construct: Maybe<Params[0]>;
        };
    }
}

const just = <A>(value: A) => ({ [MAYBE]: value } as Just<A>);
const none = {} as None;

const match = <A, B>({ just, none }: { just: (a: A) => B; none: B }) => (
    maybe: Maybe<A>
): B => (MAYBE in maybe ? just((maybe as Just<A>)[MAYBE]) : none);

export const maybe = { just, none, match };

const { map, chain, of } = GenericMaybe<Maybe<never>>({
    just,
    none,
    match
});

test("examples/pattern-matching/maybe", test => {
    test.plan(6);

    test.deepEqual<Maybe<number>>(of(44))(map((x: number) => x + 2)(of(42)));
    test.deepEqual<Maybe<number>>(none)(map((x: number) => x + 2)(none));
    test.deepEqual<Maybe<number>>(none)(
        chain((x: number) => (x > 40 ? none : of(x * 2)))(of(42))
    );
    test.deepEqual<Maybe<number>>(of(64))(
        chain((x: number) => (x > 40 ? none : of(x * 2)))(of(32))
    );
    test.deepEqual<Maybe<None>>(of(none))(map((x: number) => none)(of(42)));
    test.deepEqual<Maybe<Maybe<number>>>(of(of(84)))(
        map((x: number) => of(x * 2))(of(42))
    );
});
