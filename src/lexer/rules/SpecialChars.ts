// src/lexer/rules/SpecialChars.ts
import Reader from "../../reader/Reader";
import TokenType from "../token/TokenType";

const SPECIAL_CHARS: { [key: string]: TokenType } = {
    '(': TokenType.PARAN_OPEN,
    ')': TokenType.PARAN_CLOSE,
    '{': TokenType.CURLY_OPEN,
    '}': TokenType.CURLY_CLOSE,
    '[': TokenType.BRACKET_OPEN,
    ']': TokenType.BRACKET_CLOSE,
    ',': TokenType.COMMA,
    '+': TokenType.OP_PLUS,
    '-': TokenType.OP_MINUS,
    '*': TokenType.OP_MUL,
    '/': TokenType.OP_DIVISION,
    '=': TokenType.OP_ASSIGNMENT,
    '!': TokenType.OP_NOT_MARK,
    '<': TokenType.OP_LESS,
    '>': TokenType.OP_GREATER,
};

const DOUBLED_SPECIAL_CHARS: { [key: string]: { char: string, type: TokenType } } = {
    '=': { char: '=', type: TokenType.OP_EQUAL },
    '!': { char: '=', type: TokenType.OP_NOT_EQUAL },
    '<': { char: '=', type: TokenType.OP_LESS_OR_EQUAL },
    '>': { char: '=', type: TokenType.OP_GREATER_OR_EQUAL },
};

export function isSpecialChar(c: string): boolean {
    return SPECIAL_CHARS[c] !== undefined;
}

export function specialCharRule(reader: Reader): TokenType {
    const char = reader.getChar();
    const tokenType = SPECIAL_CHARS[char];

    if (reader.isEmpty()) {
        return tokenType;
    }

    const doubledCharDef = DOUBLED_SPECIAL_CHARS[char];
    if (doubledCharDef && doubledCharDef.char === reader.peekChar()) {
        reader.getChar();
        return doubledCharDef.type;
    }

    return tokenType;
}