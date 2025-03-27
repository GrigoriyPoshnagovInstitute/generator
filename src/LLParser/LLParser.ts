// src/LLParser/LLParser.ts
import Lexer from "../lexer/Lexer";
import { Table, TableRow } from "../table/Table";
import Token from "../lexer/token/Token";
import LexerError from "../LexerError";
import { remapTokenTypeToString } from "../lexer/token/RemapToken";
import { ErrorReason } from "./error/StringifyError";

const END_SYMBOL = "#";

class LLParser {
    private lexer: Lexer;
    private table: Table;
    private index: number = 0;
    private row: TableRow;
    private error: ErrorReason | null = null;
    private symbol: string = "";
    private lastToken: Token | null = null;
    private stack: number[] = [];

    constructor(table: Table) {
        this.table = table;
        this.row = this.table[0];
        this.lexer = new Lexer(""); // Lexer is initialized in parse method
    }

    parse(input: string): boolean {
        this.lexer = new Lexer(input);
        this.index = 0;
        this.row = this.table[0];
        this.error = null;
        this.stack = [];
        this.shift();

        while (true) {
            const { guides, shift, error, ptr, stack, end } = this.row;
            if (!guides.has(this.symbol)) {
                if (error) {
                    this.recordError();
                    return false;
                }
                this.index++;
                if (this.index >= this.table.length) return false; // Prevent out of bounds
                this.row = this.table[this.index];
                continue;
            }

            if (end) {
                return true;
            }

            if (shift) {
                this.shift();
            }

            if (stack) {
                this.stack.push(this.index + 1);
            }

            if (ptr !== null) {
                this.index = ptr;
            } else {
                if (this.stack.length === 0) return false; // Stack is empty unexpectedly
                this.index = this.stack.pop()!;
            }
            if (this.index >= this.table.length) return false; // Prevent out of bounds
            this.row = this.table[this.index];
        }
    }

    getError(): ErrorReason | null {
        return this.error;
    }

    private shift(): void {
        const token = this.lexer.getToken();
        this.recordToken(token);
        this.symbol = token.error === LexerError.EMPTY_INPUT
            ? END_SYMBOL
            : remapTokenTypeToString(token.type);
    }

    private recordToken(token: Token): void {
        this.lastToken = token;
    }

    private recordError(): void {
        if (this.lastToken) {
            this.error = {
                expected: this.row.guides,
                received: this.lastToken,
            };
        }
    }
}

export default LLParser;
export type { ErrorReason };