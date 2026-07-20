import { TokenizerCursor } from './tokenizer-interface.ts';

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

