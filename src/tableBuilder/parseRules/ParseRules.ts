// src/tableBuilder/parseRules/ParseRules.ts
import { Guides } from "../../guidesBuilder/GuidesBuilder";

interface Alternative {
    rightSide: string[];
    guides: Guides;
}
interface Rule {
    nonTerm: string;
    alternatives: Alternative[];
}
type Rules = Rule[];


function getGuidesFromStream(str: string): Guides {
    const result: Guides = new Set();
    const tokens = str.trim().split(/\s+/);
    for (const token of tokens) {
        if (token) {
            result.add(token);
        }
    }
    return result;
}

function getRuleRightSideFromStream(str: string): string[] {
    const lexemes: string[] = [];
    let currentLexeme = "";
    for (const char of str) {
        if (char === ' ' || char === '\t') {
            if (currentLexeme !== "") {
                lexemes.push(currentLexeme);
                currentLexeme = "";
            }
        } else if (char === '/') {
            if (currentLexeme !== "") {
                lexemes.push(currentLexeme);
                currentLexeme = "";
            }
            break;
        }
        else {
            currentLexeme += char;
        }
    }
    if (currentLexeme !== "") {
        lexemes.push(currentLexeme);
    }
    return lexemes;
}

function getAlternativeFromStream(lineStream: string): Alternative {
    const rightSideStream = lineStream.substring(0, lineStream.indexOf('/')).trim();
    const guidesStream = lineStream.substring(lineStream.indexOf('/') + 1).trim();

    const rightSide = getRuleRightSideFromStream(rightSideStream);
    const guides = getGuidesFromStream(guidesStream);

    return { rightSide, guides };
}


function parseRules(input: string): Rules {
    const rules: Rules = [];
    const lines = input.split('\n');

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        const parts = trimmedLine.split(' -');
        if (parts.length !== 2) continue;

        const nonTerm = parts[0].trim();
        const ruleLine = parts[1].trim();

        const alternative = getAlternativeFromStream(ruleLine);

        let existingRule = rules.find(r => r.nonTerm === nonTerm);
        if (!existingRule) {
            existingRule = { nonTerm: nonTerm, alternatives: [] };
            rules.push(existingRule);
        }
        existingRule.alternatives.push(alternative);
    }

    return rules;
}

export type { Rules, Rule, Alternative };
export { parseRules };