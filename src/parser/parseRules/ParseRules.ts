// src/parser/parseRules/ParseRules.ts
import type { RawAlternative, RawRules } from "./RawRules";

namespace raw {
    export type Alternative = RawAlternative;
    export type Alternatives = RawAlternative[];
    export type Rules = RawRules;
}

function getRuleRightSide(str: string): string[] {
    const lexemes: string[] = [];
    let currentLexeme = "";
    for (const char of str) {
        if (char === ' ' || char === '\t') {
            if (currentLexeme !== "") {
                lexemes.push(currentLexeme);
                currentLexeme = "";
            }
        } else {
            currentLexeme += char;
        }
    }
    if (currentLexeme !== "") {
        lexemes.push(currentLexeme);
    }
    return lexemes;
}

function parseRawRules(input: string): RawRules {
    const rules: RawRules = [];
    const lines = input.split('\n');

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        const parts = trimmedLine.split(' -');
        if (parts.length !== 2) continue;

        const nonTerm = parts[0].trim();
        const rulePart = parts[1].trim();

        const alternative = getRuleRightSide(rulePart);

        let existingRule = rules.find(r => r.nonTerm === nonTerm);
        if (!existingRule) {
            existingRule = { nonTerm: nonTerm, alternatives: [] };
            rules.push(existingRule);
        }
        existingRule.alternatives.push({ rightSide: alternative });
    }
    return rules;
}

export { parseRawRules, type raw };
