// src/reader/Reader.ts
class Reader {
    private input: string;
    private position: number = 0;
    private record: string = "";

    constructor(input: string) {
        this.input = input;
    }

    getChar(): string {
        if (this.isEmpty()) {
            throw new Error("EOF LexerError: tried to get char from an empty reader");
        }
        this.position++;
        const char = this.input[this.position - 1];
        this.record += char;
        return char;
    }

    peekChar(): string {
        return this.input[this.position];
    }

    ungetChar(): void {
        if (this.position > 0) {
            this.position--;
            this.record = this.record.slice(0, -1);
        }
    }

    getPosition(): number {
        return this.position;
    }

    isEmpty(): boolean {
        return this.position >= this.input.length;
    }

    seek(pos: number): void {
        const dropLen = this.position - pos;
        if (dropLen <= this.record.length) {
            this.record = this.record.slice(0, this.record.length - dropLen);
        } else {
            this.record = "";
        }
        this.position = pos;
    }

    recordStart(): void {
        this.record = "";
    }

    stopRecord(): string {
        return this.record;
    }
}

export default Reader;