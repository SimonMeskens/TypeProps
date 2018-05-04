declare module "typeprops" {
    // Waiting for proper top type
    type unknown = {} | null | undefined;

    interface TypeProps<T = {}, Params extends ArrayLike<any> = never> {
        array: {
            infer: T extends Array<infer A> ? [A] : never;
            construct: Params[0][];
        };
        null: {
            infer: null extends T ? [never] : never;
            construct: null;
        };
        undefined: {
            infer: undefined extends T ? [never] : never;
            construct: undefined;
        };
        unfound: {
            infer: [NonNullable<T>];
            construct: Params[0];
        };
    }

    type Match<T> = T extends infer U
        ? ({} extends U
              ? any
              : TypeProps<U>[Exclude<
                    keyof TypeProps,
                    "unfound"
                >]["infer"]) extends never
            ? "unfound"
            : {
                  [Key in Exclude<keyof TypeProps, "unfound">]: TypeProps<
                      T
                  >[Key]["infer"] extends never
                      ? never
                      : Key
              }[Exclude<keyof TypeProps, "unfound">]
        : never;

    type Parameters<
        T,
        Overwrite extends {
            [K in keyof Overwrite]: {
                infer: ArrayLike<any>;
                construct: unknown;
            }
        } = {
            [K in keyof Overwrite]: {
                infer: ArrayLike<any>;
                construct: unknown;
            }
        },
        Dictionary extends {
            [K in keyof Dictionary]: {
                infer: ArrayLike<any>;
                construct: unknown;
            }
        } = Overwrite extends never
            ? TypeProps<T>
            : Combine<TypeProps<T>, Overwrite>
    > = Dictionary[Match<T>]["infer"];

    type Generic<
        T,
        Params extends ArrayLike<any> = ArrayLike<any>,
        Overwrite extends {
            [K in keyof Overwrite]: { infer: unknown; construct: unknown }
        } = { [K in keyof Overwrite]: { infer: unknown; construct: unknown } }
    > = Overwrite extends never
        ? TypeProps<T, Params>[Match<T>]["construct"]
        : Combine<TypeProps<T, Params>, Overwrite>[Match<T>]["construct"];

    type Combine<T, U> = {
        [K in keyof (T & U)]: K extends keyof U
            ? U[K]
            : K extends keyof T ? T[K] : never
    };
}
