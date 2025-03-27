// src/guidesBuilder/GuidesBuilder.ts
import { parseRawRules, raw } from "../parser/parseRules/ParseRules";
import printContainer from "../print/PrintContainer";

type Guides = Set<string>;
type Rules = raw.Rules;
const EMPTY = "e";

function isTerm(term: string): boolean {
    const NON_TERM_MIN_SIZE = 3;
    const NON_TERM_FIRST_CHAR = '<';
    return term.length < NON_TERM_MIN_SIZE || term[0] !== NON_TERM_FIRST_CHAR;
}

class GuidesBuilder {
    private rules: Rules;
    private nonTerms: Set<string> = new Set();
    private lexemes: Set<string> = new Set();
    private guides: Map<string, Guides> = new Map();

    constructor(str: string) {
        this.rules = parseRawRules(str);
        this.init();
    }

    buildGuidedRules(): string | null {
        this.buildRelationFirst();
        this.transitiveClosure();

        let ss = "";
        for (const rule of this.rules) {
            const left = rule.nonTerm;
            const nonTermGuides = this.getGuides(left);
            for (const alternative of rule.alternatives) {
                let alternativeGuides: Guides = new Set();
                const first = alternative.rightSide[0];
                if (first === EMPTY) {
                    continue;
                }
                if (!isTerm(first)) {
                    const guides = this.getGuides(first);
                    for (const guide of guides) {
                        alternativeGuides.add(guide);
                        nonTermGuides.delete(guide);
                    }
                } else {
                    alternativeGuides.add(first);
                    nonTermGuides.delete(first);
                }

                ss += `${left} -${alternative.rightSide} /${printContainer(Array.from(alternativeGuides))}\n`;
            }

            for (const alternative of rule.alternatives.filter(alt => alt.rightSide[0] === EMPTY)) {
                ss += `${left} -${alternative.rightSide} /${printContainer(Array.from(nonTermGuides))}\n`;
            }
        }

        return ss;
    }

    private init(): void {
        for (const rule of this.rules) {
            this.nonTerms.add(rule.nonTerm);
            this.lexemes.add(rule.nonTerm);
            for (const alternative of rule.alternatives) {
                for (const lexeme of alternative.rightSide) {
                    this.lexemes.add(lexeme);
                }
            }
        }
    }

    private getGuides(nonTerm: string): Guides {
        let result: Guides = new Set();
        const nonTermGuides = this.guides.get(nonTerm);
        if (nonTermGuides) {
            for (const guide of nonTermGuides) {
                if (isTerm(guide)) {
                    result.add(guide);
                }
            }
        }
        return result;
    }

    private buildRelationFirst(): void {
        for (const rule of this.rules) {
            const left = rule.nonTerm;
            for (const alternative of rule.alternatives) {
                const guide = alternative.rightSide[0];
                let guides: Guides;
                if (guide === EMPTY) {
                    guides = this.getFollow(left);
                } else {
                    guides = new Set([guide]);
                }

                let currentGuides = this.guides.get(left) || new Set();
                for(const g of guides) {
                    currentGuides.add(g);
                }
                this.guides.set(left, currentGuides);
            }
        }
    }

    private getFollow(nonTerm: string): Guides {
        let followLexemes: Guides = new Set();
        for (const rule of this.rules) {
            const left = rule.nonTerm;
            for (const alternative of rule.alternatives) {
                for (let i = 0; i < alternative.rightSide.length; ++i) {
                    if (alternative.rightSide[i] !== nonTerm) {
                        continue;
                    }
                    const isLast = i === alternative.rightSide.length - 1;
                    let follow: Guides;
                    if (isLast) {
                        if (left !== nonTerm) {
                            follow = this.getFollow(left);
                        } else {
                            follow = new Set();
                        }
                    } else {
                        follow = new Set([alternative.rightSide[i + 1]]);
                    }

                    for(const f of follow) {
                        followLexemes.add(f);
                    }
                }
            }
        }

        return followLexemes;
    }

    private transitiveClosure(): void {
        for (const k of this.lexemes) {
            for (const nonTerm of this.nonTerms) {
                for (const lexeme of this.lexemes) {
                    const nonTermGuides = this.guides.get(nonTerm);
                    const kGuides = this.guides.get(k);

                    if (nonTermGuides && nonTermGuides.has(k) && kGuides && kGuides.has(lexeme)) {
                        let currentGuides = this.guides.get(nonTerm) || new Set();
                        currentGuides.add(lexeme);
                        this.guides.set(nonTerm, currentGuides);
                    }
                }
            }
        }
    }
}

export default GuidesBuilder;
export type { Guides };
export { EMPTY, isTerm };
