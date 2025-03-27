// src/table/Table.ts
import { Guides } from "../guidesBuilder/GuidesBuilder";

interface TableRow {
    symbol: string;
    guides: Guides;
    shift: boolean;
    error: boolean;
    ptr: number | null;
    stack: boolean;
    end: boolean;
}

type Table = TableRow[];

function areTablesEqual(a: Table, b: Table): boolean {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (!areTableRowsEqual(a[i], b[i])) {
            return false;
        }
    }
    return true;
}

function areTableRowsEqual(a: TableRow, b: TableRow): boolean {
    return a.symbol === b.symbol &&
        areGuidesEqual(a.guides, b.guides) &&
        a.shift === b.shift &&
        a.error === b.error &&
        a.ptr === b.ptr &&
        a.stack === b.stack &&
        a.end === b.end;
}

function areGuidesEqual(a: Guides, b: Guides): boolean {
    if (a.size !== b.size) {
        return false;
    }
    for (const item of a) {
        if (!b.has(item)) {
            return false;
        }
    }
    return true;
}

export type { TableRow, Table };
export { areTablesEqual, areTableRowsEqual, areGuidesEqual };