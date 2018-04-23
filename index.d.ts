declare module "typeprops" {
    interface TypeProps<Type, Params extends ArrayLike<any> = never> {
        never: {
            parameters: never;
            type: never;
        };
    }

    type TypeParams<T> = TypeProps<T>[keyof TypeProps<T>]["parameters"];

    type Generic<T, Params extends ArrayLike<any> = TypeParams<T>> = TypeProps<
        T,
        Params
    >[keyof TypeProps<T>]["type"];
}
