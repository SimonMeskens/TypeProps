export type NormalizedTuple<T extends ArrayLike<any>> = Simplify<
    { [Key in Keys<T>]: T[Key] } & {
        [index: number]: never;
    } & {
        length: T["length"];
    }
>;

export type EmptyTuple = { length: 0 };

export type Concat<
    T extends ArrayLike<any>,
    U extends ArrayLike<any>
> = Simplify<
    { [Key in Keys<T>]: NormalizedTuple<T>[Key] } &
        {
            [Key in Keys<U>]: {
                [IncKey in ToNumberLike<
                    Add<Key, T["length"]>
                >]: NormalizedTuple<U>[Key]
            }
        }[Keys<U>] & {
            length: Add<T["length"], U["length"]>;
        }
>;

export type Push<T extends ArrayLike<any>, U> = Simplify<
    { [Key in Keys<T>]: T[Key] } &
        { [Key in ToNumberLike<T["length"]>]: U } & {
            length: Add<1, T["length"]>;
        }
>;

export type Pop<T extends ArrayLike<any>> = Simplify<
    NormalizedTuple<
        { [Key in Keys<T>]: T[Key] } & { length: Subtract<T["length"], 1> }
    >
>;

// Lots of arithmetic boilerplate
// TODO: type level tests to verify there's no off-by-one errors here
type Simplify<T> = { [Key in keyof T]: T[Key] };

type Keys<T extends ArrayLike<any>> = ({
    1: "0";
    2: "1" | Keys<{ [index: number]: any; length: 1 }>;
    3: "2" | Keys<{ [index: number]: any; length: 2 }>;
    4: "3" | Keys<{ [index: number]: any; length: 3 }>;
    5: "4" | Keys<{ [index: number]: any; length: 4 }>;
    6: "5" | Keys<{ [index: number]: any; length: 5 }>;
    7: "6" | Keys<{ [index: number]: any; length: 6 }>;
    8: "7" | Keys<{ [index: number]: any; length: 7 }>;
    9: "8" | Keys<{ [index: number]: any; length: 8 }>;
} & {
    [index: number]: never;
})[T["length"]];

type NumberLike = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type ToNumber<T extends NumberLike> = {
    0: 0;
    1: 1;
    2: 2;
    3: 3;
    4: 4;
    5: 5;
    6: 6;
    7: 7;
    8: 8;
    9: 9;
}[T];

type ToNumberLike<T extends number> = ({
    0: "0";
    1: "1";
    2: "2";
    3: "3";
    4: "4";
    5: "5";
    6: "6";
    7: "7";
    8: "8";
    9: "9";
} & {
    [index: number]: never;
})[T];

type Add<T extends number, U extends number> = {
    [index: number]: number;
    0: T;
    1: {
        [index: number]: number;
        0: 1;
        1: 2;
        2: 3;
        3: 4;
        4: 5;
        5: 6;
        6: 7;
        7: 8;
        8: 9;
        9: number;
    }[T];
    2: Add<Add<T, 1>, 1>;
    3: Add<Add<T, 2>, 1>;
    4: Add<Add<T, 3>, 1>;
    5: Add<Add<T, 4>, 1>;
    6: Add<Add<T, 5>, 1>;
    7: Add<Add<T, 6>, 1>;
    8: Add<Add<T, 7>, 1>;
    9: Add<Add<T, 8>, 1>;
}[U];

type Subtract<T extends number, U extends number> = {
    [index: number]: number;
    0: T;
    1: {
        [index: number]: number;
        0: number;
        1: 0;
        2: 1;
        3: 2;
        4: 3;
        5: 4;
        6: 5;
        7: 6;
        8: 7;
        9: 8;
    }[T];
    2: Subtract<Subtract<T, 1>, 1>;
    3: Subtract<Subtract<T, 2>, 1>;
    4: Subtract<Subtract<T, 3>, 1>;
    5: Subtract<Subtract<T, 4>, 1>;
    6: Subtract<Subtract<T, 5>, 1>;
    7: Subtract<Subtract<T, 6>, 1>;
    8: Subtract<Subtract<T, 7>, 1>;
    9: Subtract<Subtract<T, 8>, 1>;
}[U];
