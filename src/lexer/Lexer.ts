// src/lexer/Lexer.ts
import Reader from "../reader/Reader";
import Token, { createToken } from "./token/Token";
import TokenType from "./token/TokenType";
import LexerError from "../LexerError";
import { idRule, isIdChar } from "./rules/Id";
import { numberRule } from "./rules/Number";
import { stringRule, isQuot } from "./rules/String";
import { specialCharRule, isSpecialChar } from "./rules/SpecialChars";
import { checkReserved } from "./rules/ReservedWords";

class Lexer {
    private reader: Reader;

    constructor(input: string) {
        this.reader = new Reader(input);
    }

    getToken(): Token {
        this.skipWhitespaces();
        if (this.isEmpty()) {
            return createToken(TokenType.ERROR, "", this.reader.getPosition(), LexerError.EMPTY_INPUT);
        }

        const char = this.reader.peekChar();

        if (isIdChar(char)) {
            return checkReserved(this.id());
        }
        if (char >= '0' && char <= '9') {
            return this.number();
        }
        if (isQuot(char)) {
            return this.string();
        }
        if (isSpecialChar(char)) {
            return this.specialChar();
        }

        return createToken(TokenType.ERROR, char, this.reader.getPosition(), LexerError.UNKNOWN_SYMBOL);
    }

    peekToken(): Token {
        const pos = this.reader.getPosition();
        const token = this.getToken();
        this.reader.seek(pos);
        return token;
    }

    isEmpty(): boolean {
        this.skipWhitespaces();
        return this.reader.isEmpty();
    }

    private id(): Token {
        const startPos = this.reader.getPosition();
        this.reader.recordStart();
        if (!idRule(this.reader)) {
            return createToken(TokenType.ERROR, "", startPos, LexerError.INVALID_ID);
        }

        return createToken(TokenType.ID, this.reader.stopRecord(), startPos);
    }

    private number(): Token {
        const startPos = this.reader.getPosition();
        this.reader.recordStart();
        const isInteger = { value: false };
        if (!numberRule(this.reader, isInteger)) {
            return createToken(TokenType.ERROR, "", startPos, LexerError.INVALID_NUMBER);
        }

        return createToken(isInteger.value ? TokenType.INTEGER : TokenType.FLOAT, this.reader.stopRecord(), startPos);
    }

    private string(): Token {
        const startPos = this.reader.getPosition();
        this.reader.recordStart();
        if (!stringRule(this.reader)) {
            return createToken(TokenType.ERROR, "", startPos, LexerError.STRING_LITERAL_INCOMPLETE);
        }

        return createToken(TokenType.STRING_LITERAL, this.reader.stopRecord(), startPos);
    }

    private specialChar(): Token {
        const startPos = this.reader.getPosition();
        this.reader.recordStart();
        const tokenType = specialCharRule(this.reader);
        return createToken(tokenType, this.reader.stopRecord(), startPos);
    }

    private skipWhitespaces(): void {
        while (!this.reader.isEmpty() && this.reader.peekChar() === ' ') {
            this.reader.getChar();
        }
    }
}

export default Lexer;