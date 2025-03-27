// src/lexer/rules/Number.ts
import Reader from "../../reader/Reader";

function digit(c: string): boolean {
    return c >= '0' && c <= '9';
}

function nonZero(c: string): boolean {
    return c > '0' && c <= '9';
}

/**
 * expRem -> e | digit expRem
 */
function expRem(reader: Reader): boolean {
    if (reader.isEmpty()) {
        return true;
    }

    if (digit(reader.peekChar())) {
        reader.getChar();
        return expRem(reader);
    }

    return true;
}

/**
 * expVal -> nonZero expRem
 */
function expVal(reader: Reader): boolean {
    return !reader.isEmpty() && nonZero(reader.getChar()) && expRem(reader);
}

/**
 * exp -> + expVal | - expVal
 */
function exp(reader: Reader): boolean {
    if (reader.isEmpty()) {
        return false;
    }

    const sign = reader.getChar();
    return (sign === '+' || sign === '-') && expVal(reader);
}

/**
 * expPart -> e | e exp | E exp
 */
function expPart(reader: Reader, isInteger: { value: boolean }): boolean {
    if (reader.isEmpty()) {
        return true;
    }

    const ch = reader.peekChar();
    if (ch === 'e' || ch === 'E') {
        isInteger.value = false;
        reader.getChar();
        return exp(reader);
    }

    return true;
}

/**
 * mantissaRem -> e | digit mantissaRem
 */
function mantissaRem(reader: Reader): boolean {
    if (reader.isEmpty()) {
        return true;
    }

    if (digit(reader.peekChar())) {
        reader.getChar();
        return mantissaRem(reader);
    }

    return true;
}

/**
 * mantissa -> digit mantissaRem
 */
function mantissa(reader: Reader): boolean {
    if (reader.isEmpty()) {
        return false;
    }

    return digit(reader.getChar()) && mantissaRem(reader);
}

/**
 * optMantissa -> e | .mantissa
 */
function optMantissa(reader: Reader, isInteger: { value: boolean }): boolean {
    if (reader.isEmpty()) {
        return true;
    }

    if (reader.peekChar() === '.') {
        isInteger.value = false;
        reader.getChar();
        return mantissa(reader);
    }

    return !digit(reader.peekChar());
}

/**
 * numberRem -> e | digit numberRem | .mantissa
 */
function numberRem(reader: Reader, isInteger: { value: boolean }): boolean {
    if (reader.isEmpty()) {
        return true;
    }

    if (digit(reader.peekChar())) {
        reader.getChar();
        return numberRem(reader, isInteger);
    }

    if (reader.peekChar() === '.') {
        isInteger.value = false;
        reader.getChar();
        return mantissa(reader);
    }

    return true;
}

/**
 * num -> nonZero numberRem | 0 optMantissa
 */
function num(reader: Reader, isInteger: { value: boolean }): boolean {
    if (reader.isEmpty()) {
        return false;
    }

    const ch = reader.peekChar();
    if (nonZero(ch)) {
        reader.getChar();
        return numberRem(reader, isInteger);
    }

    if (ch === '0') {
        reader.getChar();
        return optMantissa(reader, isInteger);
    }

    return false;
}

/**
 * number -> num expPart
 * num -> nonZero numberRem | 0 optMantissa
 * numberRem -> e | digit numberRem | .mantissa
 * optMantissa -> e | .mantissa
 * mantissa -> digit mantissaRem
 * mantissaRem -> e | digit mantissaRem
 * expPart -> e | e exp | E exp
 * exp -> + expVal | - expVal
 * expVal -> nonZero expRem
 * expRem -> e | digit expRem
 */
export function numberRule(reader: Reader, isInteger: { value: boolean }): boolean {
    isInteger.value = true;
    return num(reader, isInteger) && expPart(reader, isInteger);
}