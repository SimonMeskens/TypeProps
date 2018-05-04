import { unknown } from "typeprops";
import { Either, Left, Right } from "./either";
import { UnitLike } from "./unit";

declare module "typeprops" {
    interface TypeProps<T, Params> {
        "typeprops/examples/data#option": {
            infer: T extends Option<infer L> ? [L] : never;
            construct: Params[0] extends infer A ? Option<A> : never;
        };
    }
}

export type Nullable<T = unknown> = T | null | undefined;
export type None = Option<never>;

export class Option<T> {
    static nothing: None = new Option(undefined as never);

    static from<V>(
        iterable: Iterable<V> | ArrayLike<V> | UnitLike<V> | V
    ): Option<NonNullable<V>> {
        if (iterable == undefined) {
            return Option.nothing;
        }
        let iterator = (iterable as any)[Symbol.iterator];
        if (
            typeof iterator === "function" ||
            iterator.toString() === "[object Function]"
        ) {
            let next = iterator.next();
            return new Option(next.value);
        }
        let value = iterable as any;
        if ("length" in value && 0 in value) {
            return new Option(value[0]);
        }

        if ("value" in value) {
            return new Option(value.value);
        }
        return new Option(value);
    }

    static isOption<T>(maybe: Option<T>): maybe is Option<T>;
    static isOption(maybe: unknown): maybe is Option<{}> {
        return maybe instanceof Option;
    }

    value: Nullable<T>;

    constructor(value: Nullable<T>) {
        this.value = value;

        if (value == undefined) {
            return Option.nothing;
        }
    }

    isNothing(): this is None {
        return this.value == undefined;
    }

    map<U>(transform: (a: T) => U): Option<U> {
        return this.value == undefined
            ? Option.nothing
            : new Option(transform(this.value));
    }

    chain<U>(transform: (a: T) => Option<U>): Option<U> {
        return this.value == undefined ? Option.nothing : transform(this.value);
    }

    toEither<E>(left: E): Either<E, T> {
        return this.value == undefined ? new Left(left) : new Right(this.value);
    }

    *[Symbol.iterator](): IterableIterator<T | void> {
        if (this.value != undefined) yield this.value;
    }
}

export class Some<T extends {}> extends Option<T> {
    constructor(a: T) {
        if (a == undefined)
            throw new TypeError(`argument is null or undefined`);
        super(a);
    }
}

export namespace Option {
    export const zero = (): None => Option.nothing;

    export const of = <T>(a: T): Option<T> => new Option(a);

    export const isNothing = <T>(maybe: Option<T>): maybe is None =>
        maybe.isNothing();

    export const map = <T, U>(
        transform: (a: T) => U,
        maybe: Option<T>
    ): Option<U> => maybe.map(transform);

    export const chain = <T, U>(
        transform: (a: T) => Option<U>,
        maybe: Option<T>
    ): Option<U> => maybe.chain(transform);
}
