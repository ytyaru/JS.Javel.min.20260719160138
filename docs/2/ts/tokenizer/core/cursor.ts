export interface TokenizerCursor {
    readonly text: string;
    readonly position: number;
    readonly isEof: boolean;
    peek(offset?: number): string;
    advance(count?: number): void;
    substring(start: number, end: number): string;
}
export class StringCursor implements TokenizerCursor {
    private index: number = 0;
    constructor(public readonly text: string) {}

    get position(): number { return this.index; }
    get isEof(): boolean { return this.index >= this.text.length; }

    peek(offset: number = 0): string {
        return this.text.charAt(this.index + offset);
    }

    advance(count: number = 1): void {
        this.index += count;
    }

    substring(start: number, end: number): string {
        return this.text.substring(start, end);
    }
}

