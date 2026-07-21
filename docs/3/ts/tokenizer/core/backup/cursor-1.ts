/**
 * 【第1階層】16ビット（UTF-16コードユニット）単位の操作に特化した最小責任クラス
 */
export class CodeUnitCursor {
    private idx: number = 0;

    constructor(private readonly text: string) {}

    get position(): number {
        return this.idx;
    }

    set position(pos: number) {
        this.idx = pos;
    }

    get isEof(): boolean {
        return this.idx >= this.text.length;
    }

    advanceUnit(count: number): void {
        this.idx += count;
    }
}

/**
 * 【第2階層】Unicodeコードポイント（サロゲートペア対応）単位の計算に特化した責任クラス
 */
export class CodePointCursor {
    private readonly unitCursor: CodeUnitCursor;

    constructor(private readonly text: string) {
        this.unitCursor = new CodeUnitCursor(text);
    }

    get isEof(): boolean {
        return this.unitCursor.isEof;
    }

    getAbsolutePosition(): number {
        return this.unitCursor.position;
    }

    setAbsolutePosition(pos: number): void {
        this.unitCursor.position = pos;
    }

    /** 現在位置から、指定されたコードポイント数分進んだ物理インデックスを計算する */
    calculateTargetUnitPosition(charOffset: number): number {
        const tempCursor = new CodeUnitCursor(this.text);
        tempCursor.position = this.unitCursor.position;

        let charCount = 0;
        while (charCount < charOffset && !tempCursor.isEof) {
            const code = this.text.codePointAt(tempCursor.position);
            if (code !== undefined && code > 0xFFFF) {
                tempCursor.advanceUnit(2); // サロゲートペア
            } else {
                tempCursor.advanceUnit(1); // 通常文字
            }
            charCount++;
        }
        return tempCursor.position;
    }

    advancePoint(charCount: number = 1): void {
        this.unitCursor.position = this.calculateTargetUnitPosition(charCount);
    }
}

/**
 * 【第3階層】書記素クラスター（人間が見た目の1字と認識する単位）の計算に特化した責任クラス
 * 根拠: ECMAScript国際化API仕様 (https://tc39.es) 
 * Intl.Segmenter は指定された粒度（granularity: 'grapheme'）で文字列を正確に分割します。
 */
export class GraphemeCursor {
    private readonly cpCursor: CodePointCursor;
    private readonly segmenter: Intl.Segmenter;

    constructor(private readonly text: string) {
        this.cpCursor = new CodePointCursor(text);
        this.segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    }

    get isEof(): boolean {
        return this.cpCursor.isEof;
    }

    getAbsolutePosition(): number {
        return this.cpCursor.getAbsolutePosition();
    }

    /** 現在位置から、指定された書記素（見た目の文字数）分進んだ物理インデックスをオンデマンドに計算する */
    calculateTargetGraphemePosition(graphemeOffset: number): number {
        if (graphemeOffset === 0) {
            return this.cpCursor.getAbsolutePosition();
        }

        // オンデマンド走査: 現在位置以降のテキストの一部分だけをSegmenterに投入してメモリ消費を抑える
        const currentPos = this.cpCursor.getAbsolutePosition();
        const segments = this.segmenter.segment(this.text.substring(currentPos));
        
        let count = 0;
        let relativeIndex = 0;

        for (const segment of segments) {
            if (count === graphemeOffset) {
                break;
            }
            // 各セグメント（書記素）の文字列の長さ（CodeUnit数）を取得
            relativeIndex += segment.segment.length;
            count++;
        }

        return currentPos + relativeIndex;
    }

    advanceGrapheme(graphemeCount: number = 1): void {
        const nextPos = this.calculateTargetGraphemePosition(graphemeCount);
        this.cpCursor.setAbsolutePosition(nextPos);
    }
}

/**
 * トークナイザに提供する共通抽象インターフェース
 */
export interface TokenizerCursor {
    readonly isEof: boolean;
    peekChar(offset?: number): string;
    advance(graphemeCount?: number): void;
    substring(start: number, end: number): string;
    getAbsolutePosition(): number;
}

/**
 * 【統括】GraphemeCursorを利用し、トークナイザへ見た目の1字単位の操作を提供する責任クラス
 */
export class StringCursor implements TokenizerCursor {
    private readonly graphCursor: GraphemeCursor;

    constructor(private readonly text: string) {
        this.graphCursor = new GraphemeCursor(text);
    }

    get isEof(): boolean {
        return this.graphCursor.isEof;
    }

    getAbsolutePosition(): number {
        return this.graphCursor.getAbsolutePosition();
    }

    peekChar(offset: number = 0): string {
        if (this.isEof) return '';
        const start = this.graphCursor.calculateTargetGraphemePosition(offset);
        const end = this.graphCursor.calculateTargetGraphemePosition(offset + 1);
        return this.text.substring(start, end);
    }

    advance(graphemeCount: number = 1): void {
        this.graphCursor.advanceGrapheme(graphemeCount);
    }

    substring(start: number, end: number): string {
        return this.text.substring(start, end);
    }
}
