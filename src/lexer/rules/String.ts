// src/lexer/rules/String.ts
import Reader from "../../reader/Reader";

export function isQuot(c: string): boolean {
    return c === '\'';
}

export function stringRule(reader: Reader): boolean {
    if (!isQuot(reader.getChar())) {
        return false;
    }

    if (reader.isEmpty()) {
        return false;
    }

    while (!isQuot(reader.getChar())) {
        if (reader.isEmpty()) {
            return false;
        }
    }

    return true;
}