import { unknown } from "typeprops";
import { Option } from "./option";
import { UnitLike } from "./unit";

declare module "typeprops" {
    interface TypeProps<T, Params> {
        "typeprops/examples/data#either": {
            infer: T extends Either<infer L, infer R> ? [L, R] : never;
            construct: Either<Params[0], Params[1]>;
        };
    }
}

export class Either<E, T> {
    static from<U, T>(
        iterable: Iterable<T> | ArrayLike<T> | UnitLike<T> | T,
        left: U
    ): Either<U, NonNullable<T>> {
        if (iterable == undefined) {
            return new Left(left);
        }
        let iterator = (iterable as any)[Symbol.iterator];
        if (
            typeof iterator === "function" ||
            iterator.toString() === "[object Function]"
        ) {
            let next = iterator.next();
            if (next.done) {
                return new Left(left);
            } else {
                return new Right(next.value);
            }
        }
        let value = iterable as any;
        if ("length" in value && 0 in value) {
            return new Right(value[0]);
        }

        if ("value" in value) {
            return new Right(value.value);
        }
        return new Right(value);
    }

    static isEither<E, T>(either: Either<E, T>): either is Either<E, T>;
    static isEither(either: unknown): either is Either<unknown, unknown> {
        return either instanceof Either;
    }

    value: E | T;

    protected constructor(value: E | T) {
        this.value = value;
    }

    isLeft(): this is Either<E, never> {
        return this instanceof Left;
    }

    isRight(): this is Either<never, T> {
        return this instanceof Right;
    }

    map<U>(transform: (a: T) => U): Either<E, U> {
        return this.isLeft() ? this : new Right(transform(this.value as T));
    }

    chain<U>(transform: (a: T) => Either<E, U>): Either<E, U> {
        return this.isLeft() ? this : transform(this.value as T);
    }

    toMaybe() {
        return this.isLeft() ? Option.nothing : new Option(this.value);
    }

    *[Symbol.iterator](): IterableIterator<E | T> {
        yield this.value;
    }
}

export class Left<E> extends Either<E, never> {
    constructor(a: E) {
        super(a);
    }
}

export class Right<T> extends Either<never, T> {
    constructor(a: T) {
        super(a);
    }
}

export namespace Either {
    export const of = <T>(a: T): Either<never, T> => new Right(a);

    export const isLeft = <E>(
        either: Either<E, any>
    ): either is Either<E, never> => either.isLeft();

    export const isRight = <T>(
        either: Either<any, T>
    ): either is Either<never, T> => either.isRight();

    export const map = <T, U, E>(
        transform: (a: T) => U,
        either: Either<E, T>
    ): Either<E, U> => either.map(transform);

    export const chain = <T, U, E>(
        transform: (a: T) => Either<E, U>,
        either: Either<E, T>
    ): Either<E, U> => either.chain(transform);
}
