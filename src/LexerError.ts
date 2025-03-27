// src/LexerError.ts
enum LexerError {
    NONE,
    UNKNOWN_SYMBOL,
    INVALID_NUMBER,
    STRING_LITERAL_INCOMPLETE,
    EMPTY_INPUT,
    INVALID_ID,
    TERM_EXPECTED,
    PARAN_CLOSE_EXPECTED,
}

export default LexerError;