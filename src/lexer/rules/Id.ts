// src/lexer/rules/Id.ts
import Reader from "../../reader/Reader";

export function isIdChar(ch: string): boolean {
    return ch === '_' || ch === '$' || (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
}

/**
 * idChar -> _ | $ | letter
 */
export function idChar(reader: Reader): boolean {
    return isIdChar(reader.getChar());
}

/**
 * idPart -> idChar | digit
 */
export function idPart(reader: Reader): boolean {
    if (idChar(reader)) {
        return true;
    }
    reader.ungetChar();

    const char = reader.getChar();
    reader.ungetChar();
    return (char >= '0' && char <= '9');
}

/**
 * simpleIdRemainder -> e | idPart simpleIdRemainder
 */
export function simpleIdRemainder(reader: Reader): boolean {
    if (reader.isEmpty()) {
        return true;
    }

    const count = reader.getPosition();
    if (!idPart(reader)) {
        reader.seek(count);
        return true;
    }

    return simpleIdRemainder(reader);
}

/**
 * simpleId -> idChar simpleIdRemainder
 */
export function simpleId(reader: Reader): boolean {
    if (reader.isEmpty()) {
        return false;
    }

    return idChar(reader) && simpleIdRemainder(reader);
}

/**
 * idRemainder -> e | .id
 */
export function idRemainder(reader: Reader): boolean {
    if (reader.isEmpty()) {
        return true;
    }

    if (reader.peekChar() === '.') {
        reader.getChar();
        return idRule(reader);
    }

    return true;
}

/**
 * id -> simpleId idRemainder
 * idRemainder -> e | .id
 * simpleId -> idChar simpleIdRemainder
 * simpleIdRemainder -> e | idPart simpleIdRemainder
 * idPart -> idChar | digit
 * idChar -> _ | $ | letter
 */
export function idRule(reader: Reader): boolean {
    return simpleId(reader) && idRemainder(reader);
}