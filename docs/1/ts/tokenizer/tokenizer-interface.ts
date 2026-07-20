import { BaseToken } from './token.ts';

/**
 * 共通のカーソルインターフェース
 */
export interface TokenizerCursor {
    readonly text: string;
    readonly position: number;
    readonly isEof: boolean;
    peek(offset?: number): string;
    advance(count?: number): void;
    substring(start: number, end: number): string;
}

/**
 * 子トークナイザが実装すべき共通のインターフェース
 */
export interface SubTokenizer {
    /**
     * 現在のカーソル位置から自身のトークンとして解析可能か判定する
     */
    match(cursor: TokenizerCursor): boolean;
    /**
     * トークンを解析して生成する
     */
    parse(cursor: TokenizerCursor): BaseToken;
}

