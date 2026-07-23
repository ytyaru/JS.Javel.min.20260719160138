import { SubTokenizer, TokenizerCursor } from './tokenizer-interface.ts';
import { SpaceToken } from './token.ts';

export class SpaceTokenizer implements SubTokenizer {
    match(cursor: TokenizerCursor): boolean {
        // 2連続以上の改行（LF）から始まる場合のみマッチ
        return cursor.peek(0) === '\n' && cursor.peek(1) === '\n';
    }

    parse(cursor: TokenizerCursor): SpaceToken {
        const startPos = cursor.position;
        let lfCount = 0;

        // 連続する改行をすべてカウントして消費する
        while (!cursor.isEof && cursor.peek() === '\n') {
            lfCount++;
            cursor.advance(1);
        }

        const endPos = cursor.position;
        // 仕様: count = 行数（LFの数） - 2
        const tokenCount = lfCount - 2;

        return {
            kind: 'space',
            range: { start: startPos, end: endPos },
            count: tokenCount
        };
    }
}

