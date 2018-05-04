# TypeProps

[![Join the chat at https://gitter.im/TypeProps/Lobby](https://badges.gitter.im/TypeProps/Lobby.svg)](https://gitter.im/TypeProps/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Small library for describing HKTs in TypeScript

## How can you help?

This library is still in alpha mode, expect breaking changes for now. What's currently needed is lots of interaction with people trying to type complex examples. Feel free to join us at Gitter or to post issues on the repository with sample code.

## How you use it

This repository contains a lot of examples to show you how things work. Unfortunately, for usability purposes, the library is a little lenient in some places and too strict in others, so there's a razor thin edge when defining overly abstract types (like, say, a Monad HKT). Write lots of tests to make sure the type you wrote is behaving correctly. TypeProps tends to handle quite nicely for exactly the right type, even offering very good inference and assignment, but sometimes it requires some gentle love to get there.

## How it works

[Playground: Proof of concept](https://agentcooper.github.io/typescript-play/#code/C4TwDgpgBArgdgazgewO5ygXigbwL5QA+UcMANmUbHACYQBmAlnBDQNwBQHA9N1AGLwAxsGQAnDs2AQx9AIZDoAZWBzgjIYLgjxAHgDiAPlwcoZqAFs5YXfygQAHtNoBnKPogsxGg4YA0UACqhgAUpuYRwGJycC704hYAXFAhcskACnLRFhDSYi62hgDaAAwAugCUWMaBfuERZlZgYHIARmQQyfz1UBXJHl4+-AFFgWWGnHhcvFAAog5yFmAdLhxCyLHAUFnRIFo6Yskqahr7omK6MSBF41gmEU3JugCCAQBCofRwyanJz1WYYxvALyP43PpQN43ar3BpmMS5GBiDDyAB0TRCXwqnAiUzwnHWmygyFaACsICIzuIjqp1JphOddCTySJjNgcD1HlAXu9Pt8UmkoP8YcCoKChRC3jCOXD4YjkWK4Ji5NieniCRsXFtSBQ2h0qYcoMc6QamWSKVtiDrKMR4HQmCwaGzYY1rE9XpDQj0Il8foLhYDIXVZWL-VRrVQ7QxmKwepLw+QbdR7TGaNLveYEcAkSi5FAAITYKMO1hQAD8iuVVWS8hx5nVXEJWqgNGQMHaMjuIQcyVIFlaMgBxgcUAAVFAAEycNaarYONzYHZyPYM8To6whVvtjpiEYAFgCE8qbCgM3nvZg-ZkNxnRJH2GZFoN67Am7bHd3UD3E+xp74PZIS8BwkJs5wAOUTO5rT1CBnwxLcPwCa1fzPCCKAvChb2bBwlGQHIoMTGC4I3BCdwCPdtjcPtgMjWho0dFD-1wnILyvMRaJTR1G1nMVV0NY1Tj43R4CQNAMGIK4bmdGVzAxL4QRVF0GizHMhTEXZUUYFxnnU5cqwzOEKyXFdtHOF9MTgBSKgMhoazzQtk3o2MQxDCtH0pPjzPk0NrJc2UMLIIjPLkyyfLrMwGywrYQAXXjTLXeD3zIqAigPSdjz-KAYtY4Cb1ArK7noYKSKSmRyJ-E8ZhAHKZCirK0MobAivisRzNIsrAIoRj6sTAK6pAZjoCa4rX3az9v0owC2I4pyaG6ga8M6KaaNtOiSxoaY+HSMggOYABzSQ4DyeRFCgAAVcAIHSMRkDAAozrufAAkybI3EcZwaDcHTdgAGUYBAIEuOAQGdFgADcZGMGSzGM5JoYaZh6BkZIHvezxPrU3ZdERztnmMCsimeMooF7CAIbEcKGlAsQYBEDIskWFxSjKG5KfxHprThmyccNCM0dcc7yxS8GZGJ0nycpiJqdp4AArZyni1TLmQx55JFcdewnHRtwHoJkWxDFkgyZkSXzGlunHPW+WengeI7WV2VVZSsCNgamDdDOwwylNsxzdlqAXsZ5nramDhQEgKAAFk1CEAALD3nVRrWBZ5oIegrEJ8E1j63ECIWrhslHLuu26CmCIp5iEHa6F0AGQGQehzuLm67oCAAiW221oNuvaKNuebbyps+1o3yfTqAO7gO3u56B24SKABpCAQCgZg5gcKuYBruuG6byAS9bifO7tHuykSGyLv3lv7uKJeQBZ-up5kQfh4F-WbIrfWSagO+1Qrjfq6Ax3o3S+V1r7t2Pt3L2399bTjDpdAODMch5BvncUBB8b5FGjsAOOCcH4D29lwcO0ABgyB8D0M6wZzCBwsG9ZOGNvrLj+gDIGIM7iMJAMwwGVx-A9ETs3UuHtnpIJcMUbBuDPYPz9oPTgQA)

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
