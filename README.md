# TypeProps

[![Join the chat at https://gitter.im/TypeProps/Lobby](https://badges.gitter.im/TypeProps/Lobby.svg)](https://gitter.im/TypeProps/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Small library for describing HKTs in TypeScript

## How to install

```
npm install typeprops
```

After install, you can import types like so:

```TypeScript
import { Generic, Parameters, unknown } from "typeprops";
```

## How can you help?

This library is still in alpha mode, expect breaking changes for now. What's currently needed is lots of interaction with people trying to type complex examples. Feel free to join us at Gitter or to post issues on the repository with sample code.

## How you use it

This repository contains a lot of examples to show you how things work. Unfortunately, for usability purposes, the library is a little lenient in some places and too strict in others, so there's a razor thin edge when defining overly abstract types (like, say, a Monad HKT). Write lots of tests to make sure the type you wrote is behaving correctly. TypeProps tends to handle quite nicely for exactly the right type, even offering very good inference and assignment, but sometimes it requires some gentle love to get there.

## How it works

[Playground: Proof of concept](https://agentcooper.github.io/typescript-play/#code/PQKhCgAIUhlAXAhgOwCaIDYHtkFNK4AeiAtgA4b5YBmkAKgJ5m4AKATlmQM6TwAWieJADGKSACN8bAK7JIASzmJILDIgYBzDrNRQI0SAEFhAa2RYA7pVQbcJXMngAuPZAC0kAALoN6AIyQ1FhsvHz4XKQU+MJYqPj88jwWiDzB8hqKmBgMEim4qJA4kCgF-Pjycco0xYGywvDBhQBuuCEABnQA-G2uHp4kKYi4+dKBjWWQEeSUIrHxWLy4XEITmBpp-CRcvV7IiOj2o0EhYRhkkBby-KHRwfhxXOnIesDge-ZcZIjC+GRYwpAAN5QSCg+BMfCyMyWOQAXiBAF9IAAfSDIaQYDAoyA6XDURT5ADc4BBoOAwEgADE6g02KSFI5WtRvvgEIJ5MJqch6sEADwAcQAfED6aDQQMyLzKQRCPAHKgePyHK0OQLBQAaSAAVUFAApRWLDfA2CguMcSE5ILrEJaWIgTfY5WwuFLBQBtAAMAF0AJSQWHCrXqg2G8WIMhfcSUS2UkOQH2WpV4Niqymat1ar2C4mGhEkw3kyAAUWI0yW9JiyGWxTYJoYXJ5bEtbPgHIbtN5KAYbqz-pFobFEstvMMmoAQnrqMhLdbLYY-QHIGPNcy5z2E0ue-7hcCBwO2Lh4NI2HJmQA6CW6qc+nN7vO52+gyvVrDiABWuHq7eCzaQrc5NJ8q+H71MK8K7nuQ6QCO46TtOVo2kYC7CsugSIfOlpjtu-Z7oaB5HiegTIFeiA3nG95igij6zFWQjopiiBRrg35NnAf5toBbC8sBn5CKi9FYqiuL4ngqBgThA5QTBS56nGhpTjO6HIUuwa4fJ6HYgJ2LCQSui4RuWH8Rigk4mgeK6dhEFqZA+HHqeygAITwjpomQJ0REkX6lrMtRub0lR+Zis+QioFg0hMSE8K6oQlroiQkhsMphAGAATMSFY4NWhA8PC9p1ixF7hrqoXhZQbDpgALJqKW+oSkCFtlsXSPFrQ9hltGQMl8I8V+nGFWQxVhRFmoVSlN71RSMVos1CXtVlAByxl9gJjGUAVl4lcN02YuNDWLZiTWYnNQiELAWD2MtxmrcxfUbUNZUjcUPBxQl2lmSJ+S7ZNZ32E1LUhEJ726YFT6ZUI1Ccb+7IAdyHZQuYFhyKiXY9uJVmhpeU4rqRElqbZhGGLW6hnokhN1p5cl7u5eXqOtRVY2hPqUwO3mOc5QOiczanuT18B0wNDPMkz1nWYdahMfzV7INjZG4RRoIBcdkAMDltSw8E-WDaVrSVdVtUTcrXB-QlbWGsFyt9hD6tsJrm0PZAo1fcrxutErDD7Vi8JW42tv3Tr20YE77vGWLbs-fgXu3UVdv+6NT3Tf9b1xB9qBB+HLsA6ZyfA-ShZ0EsQhhfAZDSPAIM0VwWCUGe2AaLqABEdCGCwkAtM68hFH4ADM9ey0FmVV7gNdYHX9cAMT0BC7CcDw0-VNUADCOA-GQ8C99Rz6D8Po9+GeZ4ABzr+Xm-V7X+q4dlnpev6sLwvvkAAGQP51XBun41+3-CFVuZA9dYCYkAAg0xyBKeukBLT13MIXABQCiYgPDPXekfdQZVi3mfLqt9ID72-u5P+ACUqFHfLxSAoDwG-ygYUfBhCQJCFAcgiuaCR7RQ9jfeEWlcH-0gF3AOJCEFkMgVgaBXCeF0I3gPU+TDTrnQjpg++HCAHf0rhdUhECKGcMUdI3hZAj5m3EUPM+cYVZX1YVgx+z8jHvxMRVLm8jIAAFZIC2GTByGsdYtGIJFvwtRACHFOJVACYB7ikFiNQRIuuhiTHYJ-ngyAAA2RxyoUwAl5u4rxgjKFxISc45JRD6hBMNPQk++imGGJYZ-HhtiADsWT-EiL4ao9JnDql+KSXU7RwS5qMPCbhBg4dInWM8bY++LSXErSYvkkWDShHDMSaMq64zQEdNzhSVQM1FAaHpIoJ0zIfiT2YNPbgvI6B9kBAiTUdoHQ8CIHKNAPAybqAADLyBMLgTsyAGDiTwG3HccZgGWnRrhRQ1BWiWmOdc+Udy4G8iBa0Iwwp3JukMNfWKuA26+T3MFGQ9RbT2lIK-b0PZ0UKyJQHf5XMYWsS0uC259Af5ui+a0ZFaJUWtBJbo2iWLnABxJQFXCLl8hks8RSy0-KCjUoVLShFDK2BMulWy-uHLpDYqzuZUSPKSWyCCDoQVIthWQDdPNHAHtrpHMFF6eVKDlicpxZcq+6r-Ll3BMwSAABZQQwg+Cmr7GC2UEKGTApCFqOM7ldSnJlDciVQbPGgmpu8rmoJQVTw4IcnUboSzCAwNIOIvJ417heQwaojB9nJq4KpaNA566arCmgDx5bIBmrdPXCl9dfThr9dKmxv8q06FraLXG5a3QAGlcA5EUMWQgGas2vPzYWpNM9NSVuQFqmtZrE3Fpnjmute46C5sNO6YdDAvSNubdfcVz0WV0i3QOdyHar2hktAe3NCI00TszdmmdtAi2sBLQu7tK6vRxhRWix1EIVC4sdK0F0dBxJfoOVB90br4AetNUeptS7WgtvSkaUDSZ-FHPOeBq5vqaX3IYE8l5byPl9lI+R15XZBQwbnYcuMdAy0DguXi+kCH3Weug6hzFSq17mvAHmIAA)

This library uses a type-level pattern matcher to match types against a "type dictionary". The type dictionary contains types I call "TypeProps", which describe two things:

*   Can I infer parameters for this type?
*   Given another type, how do I construct a new type?

Here's the base type dictionary, which defines what do with arrays, null, undefined and the generic case:

```TypeScript
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
```

Using "declaration merging", you can add more types to this dictionary, and the library also supports adding secondary dictionaries, to express things like `Functor (Either e) a` in Haskell (functor only has one type parameter, Either has two, a secondary mapping is needed).

### What's with the weird null, undefined and unfound cases?

These were put in to support abstracting nullables as a Monad. The follow code demonstrates that:

```TypeScript
const nullableFunctor: StaticFunctor<object | null | undefined> = {
    map: <A, B>(
        fn: (a: A) => B,
        fa: A | null | undefined
    ): B | null | undefined => {
        return fa != undefined ? fn(fa) : fa;
    }
};
```

This is a very powerful idea, but be careful exposing it to other libraries that expect Static-land compliance. As far as I can tell, this function is not compliant with that spec. I might need to pull the feature out in the future if day-to-day use shows that it makes other types incorrect, but for now I haven't found such cases.
