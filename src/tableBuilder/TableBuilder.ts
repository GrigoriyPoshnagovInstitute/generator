// src/tableBuilder/TableBuilder.ts
import { Rules, parseRules, Alternative as ParsedAlternative } from "./parseRules/ParseRules";
import { Table, TableRow } from "../table/Table";
import { Guides, isTerm, EMPTY } from "../guidesBuilder/GuidesBuilder";

class TableBuilder {
    private rules: Rules;

    constructor(str: string) {
        this.rules = parseRules(str);
    }

    buildTable(): Table {
        const table: Table = [];
        this.fillLeftNonTerms(table);
        this.fillRightSides(table);
        return table;
    }

    private fillLeftNonTerms(table: Table): void {
        let ptr = this.getLeftSideNonTermsNumber();
        for (const { nonTerm, alternatives } of this.rules) {
            for (const { rightSide, guides } of alternatives) {
                table.push({
                    symbol: nonTerm,
                    guides: guides,
                    shift: false,
                    error: false,
                    ptr: ptr,
                    stack: false,
                    end: false,
                });
                ptr += rightSide.length;
            }
            table[table.length - 1].error = true;
        }
    }

    private fillRightSides(table: Table): void {
        let isAxiom = true;
        for (const { alternatives } of this.rules) {
            for (const alternative of alternatives) {
                this.fillAlternative(table, alternative, isAxiom);
                isAxiom = false;
            }
        }
    }

    private fillAlternative(table: Table, alternative: ParsedAlternative, isAxiom: boolean): void {
        const { rightSide, guides } = alternative;
        for (const symbol of rightSide) {
            let row: TableRow;
            if (isTerm(symbol)) {
                if (symbol === EMPTY) {
                    row = {
                        symbol: EMPTY,
                        guides: guides,
                        shift: false,
                        error: true,
                        ptr: null,
                        stack: false,
                        end: false,
                    };
                } else {
                    row = {
                        symbol: symbol,
                        guides: new Set([symbol]),
                        shift: true,
                        error: true,
                        ptr: table.length + 1,
                        stack: false,
                        end: false,
                    };
                }
            } else {
                row = {
                    symbol: symbol,
                    guides: this.getNonTermGuides(symbol, table),
                    shift: false,
                    error: true,
                    ptr: this.getNonTermPtr(symbol, table),
                    stack: true,
                    end: false,
                };
            }
            table.push(row);
        }

        const last = table[table.length - 1];
        if (isTerm(last.symbol)) {
            last.ptr = null;
        } else {
            last.stack = false;
        }
        last.end = isAxiom;
    }

    private getNonTermPtr(symbol: string, table: Table): number {
        let ptr = 0;
        for (const row of table) {
            if (row.symbol === symbol) {
                return ptr;
            }
            ptr++;
        }
        throw new Error("unknown non term " + symbol);
    }

    private getNonTermGuides(symbol: string, table: Table): Guides {
        const result: Guides = new Set();
        const leftSideNonTermsNumber = this.getLeftSideNonTermsNumber();
        for (let i = 0; i < leftSideNonTermsNumber; i++) {
            const row = table[i];
            if (row.symbol === symbol) {
                for (const guide of row.guides) {
                    result.add(guide);
                }
            }
        }
        return result;
    }

    private getLeftSideNonTermsNumber(): number {
        let count = 0;
        for (const { alternatives } of this.rules) {
            count += alternatives.length;
        }
        return count;
    }
}

export default TableBuilder;