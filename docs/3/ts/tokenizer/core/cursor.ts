/**
 * すべての文字走査カーソルの最上位抽象
 */
export abstract class Cursor {
    protected idx: number = 0;
    constructor(public readonly text: string) {}
    get index(): number {return this.idx;}
    set index(idx: number) {this.idx = idx;}
    get isEof(): boolean {return this.idx >= this.text.length;}
    substring(start: number, end: number): string {return this.text.substring(start, end);}
    abstract peekChar(offset?: number): string;
    abstract advance(charCount?: number): void;
}
/**
 * 16ビット符号単位駆動
 */
export class CodeUnitCursor extends Cursor {
    peekChar(offset: number = 0): string {
        if (this.isEof) return '';
        const target = this.idx + offset;
        if (target >= this.text.length) return '';
        return this.text.charAt(target);
    }

    advance(charCount: number = 1): void {
        this.idx += charCount;
    }
}

/**
 * Unicode符号位置駆動（サロゲートペアの泣き別れを防止する）
 */
export class CodePointCursor extends Cursor {
    private calculateTargetIndex(charOffset: number): number {
        let tempIdx = this.idx;
        let count = 0;
        while (count < charOffset && tempIdx < this.text.length) {
            const code = this.text.codePointAt(tempIdx);
            tempIdx += (code !== undefined && code > 0xFFFF) ? 2 : 1;
            count++;
        }
        return tempIdx;
    }

    peekChar(offset: number = 0): string {
        if (this.isEof) return '';
        const targetIdx = this.calculateTargetIndex(offset);
        if (targetIdx >= this.text.length) return '';
        const code = this.text.codePointAt(targetIdx);
        return code !== undefined ? String.fromCodePoint(code) : '';
    }

    advance(charCount: number = 1): void {
        this.idx = this.calculateTargetIndex(charCount);
    }
}

/**
 * 書記素クラスター（人間が見た目の1字と認識する単位）駆動
 */
export class GraphemeCursor extends Cursor {
    constructor(
        text: string,
        private readonly segmenter: Intl.Segmenter
    ) {
        super(text);
    }

    private calculateTargetIndex(graphemeOffset: number): number {
        if (graphemeOffset === 0) return this.idx;
        const segments = this.segmenter.segment(this.text.substring(this.idx));
        let count = 0;
        let relativeIndex = 0;
        for (const segment of segments) {
            if (count === graphemeOffset) break;
            relativeIndex += segment.segment.length;
            count++;
        }
        return this.idx + relativeIndex;
    }

    peekChar(offset: number = 0): string {
        if (this.isEof) return '';
        const start = this.calculateTargetIndex(offset);
        const end = this.calculateTargetIndex(offset + 1);
        return this.text.substring(start, end);
    }

    advance(charCount: number = 1): void {
        this.idx = this.calculateTargetIndex(charCount);
    }
}
