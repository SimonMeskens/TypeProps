declare module "typeprops" {
    type _<
        T extends keyof typeof util.Placeholder = 0
    > = typeof util.Placeholder[T] & { index: T };
    type Infer = typeof util.InferSymbol;

    interface TypeProps<T extends any = any> {
        never: {
            infer: T extends never ? { length: 0 } : never;
            construct: never;
        };
    }

    type TypeTag<T = any> = {
        [K in keyof TypeProps]: TypeProps<T>[K]["infer"] extends never
            ? never
            : K
    }[keyof TypeProps];

    type TypeProxy<
        Tag extends keyof TypeProps,
        Map extends ArrayLike<any>,
        T,
        Params extends ArrayLike<any> = ArrayLike<any>
    > = {
        [Key in keyof util.ToTuple<Map>]: Key extends number
            ? Map[Key] extends Infer
                ? T extends never
                    ? never
                    : Key extends keyof TypeParams<T, Tag>
                        ? TypeParams<T, Tag>[Key]
                        : never
                : Map[Key] extends _<infer Index>
                    ? Params[Index]
                    : util.ToTuple<Map>[Key]
            : Map["length"]
    };

    type TypeParams<
        T,
        Tag extends keyof TypeProps = keyof TypeProps
    > = util.ToTuple<
        Infer extends T
            ? {
                  [index: number]: any;
                  length: TypeProps<T>[Tag]["infer"]["length"];
              }
            : TypeProps<T>[Tag]["infer"]
    >;

    type Generic<
        Tag extends keyof TypeProps,
        Params extends ArrayLike<any> = ArrayLike<any>,
        Map extends ArrayLike<any> = {
            [index: number]: _;
            length: Params["length"];
        },
        T = never
    > = TypeProps<TypeProxy<Tag, Map, T, Params>>[Tag]["construct"];

    namespace util {
        const InferSymbol: unique symbol;
        const Placeholder: {
            readonly 0: unique symbol;
            readonly 1: unique symbol;
            readonly 2: unique symbol;
            readonly 3: unique symbol;
            readonly 4: unique symbol;
            readonly 5: unique symbol;
            readonly 6: unique symbol;
            readonly 7: unique symbol;
            readonly 8: unique symbol;
            readonly 9: unique symbol;
        };

        type TupleKey = {
            [index: number]: number;
            1: 0;
            2: 0 | 1;
            3: 0 | 1 | 2;
            4: 0 | 1 | 2 | 3;
            5: 0 | 1 | 2 | 3 | 4;
            6: 0 | 1 | 2 | 3 | 4 | 5;
            7: 0 | 1 | 2 | 3 | 4 | 5 | 6;
            8: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
            9: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
        };

        type ToTuple<T extends ArrayLike<any>> = {
            [Key in TupleKey[T["length"]] | "length"]: T[Key]
        };
    }
}
