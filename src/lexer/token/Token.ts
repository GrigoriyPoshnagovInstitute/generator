// src/lexer/token/Token.ts
import TokenType from "./TokenType";
import LexerError from "../../LexerError";

interface Token {
    type: TokenType;
    value: string;
    pos: number;
    error: LexerError;
}

function createToken(type: TokenType, value: string, pos: number, error: LexerError = LexerError.NONE): Token {
    return { type, value, pos, error };
}

export default Token;
export { createToken };