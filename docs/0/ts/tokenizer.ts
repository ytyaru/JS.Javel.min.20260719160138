import { BaseToken, FenceToken, BlockToken, LinerRange } from './token.js';

/**
 * 原稿の読み込み位置を管理するクラス（入力管理の単一責任）
 */
class Cursor {
    private index: number = 0;
    constructor(private readonly text: string) {}

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

/**
 * パーサコンビネータの基底ユーティリティ（パターンマッチの責任）
 */
class Combinators {
    /**
     * 特定の文字が指定回数以上連続しているかを判定し、その個数を返す
     */
    static matchRepeatedChar(cursor: Cursor, char: string, minCount: number): number {
        let count = 0;
        while (cursor.peek(count) === char) {
            count++;
        }
        return count >= minCount ? count : 0;
    }

    /**
     * 改行（LF）または終端までの範囲を走査する
     */
    static scanUntilLfOrEof(cursor: Cursor): void {
        while (!cursor.isEof && cursor.peek() !== '\n') {
            cursor.advance();
        }
    }
}

/**
 * トークン生成の制御クラス（トークナイズの責任）
 */
export class Tokenizer {
    constructor(options?: any) {
        // オプションによる動作変更が必要な場合はここで保持します
    }

    /**
     * 文字列からトークンを順次生成するジェネレーター
     */
    *tokenize(manuscript: string): Generator<BaseToken, void, unknown> {
        const cursor = new Cursor(manuscript);

        while (!cursor.isEof) {
            // 1. フェンスの解析を試みる
            const fenceToken = this.tryParseFence(cursor);
            if (fenceToken) {
                yield fenceToken;
                continue;
            }

            // 2. フェンスでない場合はブロックとして処理する
            const blockToken = this.parseBlock(cursor);
            if (blockToken) {
                yield blockToken;
            }
        }
    }

    /**
     * フェンス構造の解析を試みる内部メソッド
     */
    private tryParseFence(cursor: Cursor): FenceToken | null {
        const startPos = cursor.position;
        const char = cursor.peek();

        // フェンスの代表例として「-」または「`」の3文字以上の連続を検証対象とする
        if (char !== '-' && char !== '`') {
            return null;
        }

        const num = Combinators.matchRepeatedChar(cursor, char, 3);
        if (num === 0) {
            return null;
        }

        // 開始フェンスの確定
        const prefixStart = startPos;
        cursor.advance(num);
        Combinators.scanUntilLfOrEof(cursor);
        if (cursor.peek() === '\n') { cursor.advance(); } // LF消費
        const prefixEnd = cursor.position;

        // コンテンツの走査（同じフェンスが出現するか、EOFまで）
        const contentStart = cursor.position;
        let suffixStart = cursor.position;
        let suffixEnd = cursor.position;
        let hasEndFence = false;

        while (!cursor.isEof) {
            const currentLineStart = cursor.position;
            const currentNum = Combinators.matchRepeatedChar(cursor, char, num);

            if (currentNum >= num) {
                suffixStart = currentLineStart;
                cursor.advance(currentNum);
                Combinators.scanUntilLfOrEof(cursor);
                if (cursor.peek() === '\n') { cursor.advance(); }
                suffixEnd = cursor.position;
                hasEndFence = true;
                break;
            }

            // 行を進める
            Combinators.scanUntilLfOrEof(cursor);
            if (cursor.peek() === '\n') { cursor.advance(); }
        }

        const contentEnd = hasEndFence ? suffixStart : cursor.position;

        return {
            kind: 'fence',
            range: { start: startPos, end: cursor.position },
            enclosure: { char, num },
            prefix: { range: { start: prefixStart, end: prefixEnd } },
            content: { range: { start: contentStart, end: contentEnd } },
            suffix: { range: { start: suffixStart, end: suffixEnd } }
        };
    }

    /**
     * ブロック（次の構造の開始、または改行・終端まで）を解析する内部メソッド
     */
    private parseBlock(cursor: Cursor): BlockToken | null {
        const startPos = cursor.position;

        // 次のフェンスの開始が来るか、原稿の終端に達するまで文字を進める
        while (!cursor.isEof) {
            const nextChar = cursor.peek();
            
            // 次の行頭などでフェンスが始まる可能性があるか検知
            if (nextChar === '-' || nextChar === '`') {
                const num = Combinators.matchRepeatedChar(cursor, nextChar, 3);
                if (num >= 3) {
                    // ここでブロックを終了し、次のフェンス処理へ譲る
                    break;
                }
            }

            // 通常の文字として消費
            cursor.advance();
        }

        const endPos = cursor.position;
        if (startPos === endPos) {
            return null;
        }

        return {
            kind: 'block',
            range: { start: startPos, end: endPos }
        };
    }
}

