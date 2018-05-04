// Based on provided sample by Asad Saeeduddin
import { GenericMonad } from "./adt";

const array = (() => {
    const nil = [] as never[];
    const cons = <A>(head: A) => (rest: A[]): A[] => [head, ...rest];
    const match = <A>({
        cons,
        nil
    }: {
        cons: (head: A) => (rest: A[]) => GenericMonad<A>;
        nil: A;
    }) => (a: Array<A>) => (a.length === 0 ? nil : cons(a[0])(a.slice(1)));

    return { nil, cons, match };
})();

const GenericList = <G extends GenericMonad<any>>({
    cons,
    nil,
    match
}: {
    cons: <A>(
        head: A
    ) => <F extends GenericMonad<G>>(rest: F) => GenericMonad<F, A>;
    nil: GenericMonad<G>;
    match<A>(_: {
        nil: A;
        cons: (
            head: A
        ) => <F extends GenericMonad<G>>(rest: F) => GenericMonad<A>;
    }): (rest: GenericMonad<G>) => GenericMonad<A>;
}) => {
    // Misc
    const length: <F extends GenericMonad<G>>(rest: F) => number = match({
        nil: 0,
        cons: _ => rest => 1 + length(rest)
    });

    // Functor
    const map: <A, B>(
        f: (a: A) => B
    ) => (<F extends GenericMonad<G, A>>(list: F) => GenericMonad<F, B>) = f =>
        match({ nil, cons: head => rest => cons(f(head))(map(f)(rest)) });

    return { length, map };
};

let a = GenericList<any[]>(array).length([0, 1, 2]); // a: number
console.log(a);
// 3
let b = GenericList<any[]>(array).map((x: number) => x * 2)([1, 2, 3]); // b: number[]
console.log();
// [2, 4, 6]
