// src/lexer/rules/ReservedWords.ts
import TokenType from "../token/TokenType";
import Token from "../token/Token";

const RESERVED_WORDS: { [key: string]: TokenType } = {
    "mod": TokenType.OP_MOD,
    "div": TokenType.OP_DIV,
    "and": TokenType.OP_AND,
    "or": TokenType.OP_OR,
    "not": TokenType.OP_NOT,
    "true": TokenType.TRUE,
    "false": TokenType.FALSE,
};

function toLower(s: string): string {
    return s.toLowerCase();
}

export function checkReserved(token: Token): Token {
    const lowerValue = toLower(token.value);
    if (RESERVED_WORDS[lowerValue] !== undefined) {
        return {
            type: RESERVED_WORDS[lowerValue],
            value: token.value,
            pos: token.pos,
            error: token.error,
        };
    }
    return token;
}