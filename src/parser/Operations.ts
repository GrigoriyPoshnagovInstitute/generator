// src/parser/Operations.ts
import TokenType from "../lexer/token/TokenType";

const REL_OPS: Set<TokenType> = new Set([
    TokenType.OP_EQUAL,
    TokenType.OP_NOT_EQUAL,
    TokenType.OP_GREATER,
    TokenType.OP_LESS,
    TokenType.OP_GREATER_OR_EQUAL,
    TokenType.OP_LESS_OR_EQUAL,
]);

const LOW_PRIORITY_OPS: Set<TokenType> = new Set([
    TokenType.OP_PLUS,
    TokenType.OP_MINUS,
    TokenType.OP_OR,
]);

const HIGH_PRIORITY_OPS: Set<TokenType> = new Set([
    TokenType.OP_MUL,
    TokenType.OP_DIVISION,
    TokenType.OP_DIV,
    TokenType.OP_MOD,
    TokenType.OP_AND,
]);

export function isRelOp(tokenType: TokenType): boolean {
    return REL_OPS.has(tokenType);
}

export function isLowPriorityOp(tokenType: TokenType): boolean {
    return LOW_PRIORITY_OPS.has(tokenType);
}

export function isHighPriorityOp(tokenType: TokenType): boolean {
    return HIGH_PRIORITY_OPS.has(tokenType);
}