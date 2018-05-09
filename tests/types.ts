export interface ErrorUnequal<A, B> {
    "Types not equal": true;
}

export type AssertEqual<
    Actual extends Reference,
    Expected extends Reference,
    Reference = CheckEqual<Actual, Expected>
> = Reference;

export type CheckEqual<Actual, Expected> = StrictEqual<
    Actual,
    Expected
> extends true
    ? Actual & Expected
    : ErrorUnequal<Actual, Expected>;

type StrictEqual<T, U> = And<Equal<T, U> | Xnor<IsAny<T>, IsAny<U>>>;

type Equal<T, U> = And<
    ([U] extends [T] ? true : false) | ([T] extends [U] ? true : false)
>;

type IsAny<T> = boolean extends (T extends never ? true : false) ? true : false;

type And<T extends boolean, U extends boolean = never> =
    // AND of union
    (T | U) extends true ? true : false;

type Xnor<T extends boolean, U extends boolean = never> =
    // XNOR of union
    boolean extends (T | U) ? false : true;
