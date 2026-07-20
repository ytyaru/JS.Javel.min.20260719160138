import { SubTokenizer, TokenizerCursor } from './tokenizer-interface.ts';
import { BlockToken } from './token.ts';

export class BlockTokenizer implements SubTokenizer {
    constructor(private readonly isFenceStart: (cursor: TokenizerCursor) => boolean) {}

    match(cursor: TokenizerCursor): boolean {
        // EOFでなければ常にブロックを開始できる（最悪単一のテキストとして処理）
        return !cursor.isEof;
    }

    parse(cursor: TokenizerCursor): BlockToken {
        const startPos = cursor.position;

        while (!cursor.isEof) {
            // 1. 2連続改行が来たら、ブロックの境界なので終了する
            if (cursor.peek(0) === '\n' && cursor.peek(1) === '\n') {
                break;
            }

            // 2. 改行の直後（＝次の行頭）にフェンスが始まるか確認する
            if (cursor.peek(0) === '\n') {
                // 1文字進めて、次の行頭のカーソル状態を仮想的に作る
                cursor.advance(1);
                const isFenceNext = this.isFenceStart(cursor);
                
                // 次の行頭からフェンスが始まるなら、この改行の手前（前の行末）でブロックを終了する
                if (isFenceNext) {
                    // advanceした分を考慮し、改行の手前で止めるためのロジック
                    // 実際には、改行自体はブロックに含めず、外側で制御するか、
                    // ここでループを抜ける。今回は直前の状態を維持するため、
                    // カーソルの位置調整をしてブレイクします。
                    break; 
                }
                // フェンスでなければ、改行をブロックの一部として消費して続行
                continue;
            }

            cursor.advance(1);
        }

        return {
            kind: 'block',
            range: { start: startPos, end: cursor.position }
        };
    }
}

