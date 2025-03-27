// src/parser/parseRules/RawRules.ts
namespace RawRulesModule {
    export interface RawAlternative {
        rightSide: string[];
    }

    export interface RawRule {
        nonTerm: string;
        alternatives: RawAlternative[];
    }

    export type RawRules = RawRule[];
}

export type RawAlternative = RawRulesModule.RawAlternative;
export type RawRule = RawRulesModule.RawRule;
export type RawRules = RawRulesModule.RawRules;
