// src/lexer/token/StringifyError.ts
import Token from "./Token";
import LexerError from "../../LexerError";
import { remapTokenTypeToString } from "./RemapToken";

export function stringifyLexerError(token: Token): string {
    switch (token.error) {
        case LexerError.NONE:
            return "none";
        case LexerError.UNKNOWN_SYMBOL:
            return "unknown symbol " + token.value;
        case LexerError.INVALID_NUMBER:
            return "invalid number " + token.value;
        case LexerError.STRING_LITERAL_INCOMPLETE:
            return "string literal incomplete";
        case LexerError.EMPTY_INPUT:
            return "empty input";
        case LexerError.INVALID_ID:
            return "invalid id " + token.value;
        case LexerError.TERM_EXPECTED:
            return "term expected";
        case LexerError.PARAN_CLOSE_EXPECTED:
            return "parenthesis close expected";
        default:
            throw new Error("Unknown error");
    }
}

interface ErrorReason {
    expected: Set<string>; // Guides type will be defined later
    received: Token;
}

export function stringifyError(error: ErrorReason): string {
    const { expected, received } = error;
    let stream = `LexerError at position ${received.pos}: `;
    if (received.error === LexerError.NONE) {
        const tokenType = remapTokenTypeToString(received.type);
        stream += `{ ${Array.from(expected).join(', ')} } expected, but ${tokenType}`;
        if (received.value !== tokenType) {
            stream += ` (${received.value})`;
        }
        stream += " received.\n";
    } else {
        stream += stringifyLexerError(received) + "\n";
    }

    return stream;
}

export type { ErrorReason };