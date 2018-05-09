import { Match } from "../match";
import { AssertEqual } from "./types";

type Match1 = AssertEqual<
    {
        infer: string[];
        construct: number[];
    },
    Match<string[], [number]>
>;
