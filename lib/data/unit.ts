import { unknown } from "typeprops";
import { Option } from "./option";

declare const UnitId = "typeprops/lib/data/unit";

declare module "typeprops" {
    interface TypeProps<T, Params> {
        [UnitId]: {
            infer: T extends Unit<infer L> ? [L] : never;
            construct: Unit<Params[0]>;
        };
    }
}

export type UnitLike<T> = {
    value: T;
};

export class Unit<T> {
    static from<V>(
        iterable: Iterable<V> | ArrayLike<V> | UnitLike<V> | V
    ): Unit<V> {
        if (iterable == undefined) {
            return new Unit(iterable);
        }

        let iterator = (iterable as any)[Symbol.iterator];
        if (
            typeof iterator === "function" ||
            iterator.toString() === "[object Function]"
        ) {
            let next = iterator.next();
            return new Unit(next.value);
        }

        if ("length" in (iterable as any) && 0 in (iterable as any)) {
            return new Unit((iterable as any)[0]);
        }

        if ("value" in (iterable as any)) {
            return new Unit((iterable as any).value);
        }
        return new Unit(iterable as V);
    }

    static isUnit<T>(identity: Unit<T>): identity is Unit<T>;
    static isUnit(identity: unknown): identity is Unit<unknown> {
        return identity instanceof Unit;
    }

    value: T;

    constructor(value: T) {
        this.value = value;
    }

    map<U>(transform: (a: T) => U): Unit<U> {
        return new Unit(transform(this.value));
    }

    chain<U>(transform: (a: T) => Unit<U>): Unit<U> {
        return transform(this.value);
    }

    toOption(): Option<NonNullable<T>> {
        return Option.from(this);
    }

    *[Symbol.iterator](): IterableIterator<T> {
        yield this.value;
    }
}

export namespace Unit {
    export const of = <T>(a: T): Unit<T> => new Unit(a);

    export const map = <T, U>(transform: (a: T) => U, unit: Unit<T>): Unit<U> =>
        unit.map(transform);

    export const chain = <T, U>(
        transform: (a: T) => Unit<U>,
        unit: Unit<T>
    ): Unit<U> => unit.chain(transform);
}
