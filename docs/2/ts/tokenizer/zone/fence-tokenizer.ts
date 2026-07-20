import { SubTokenizer, TokenizerCursor } from './tokenizer-interface.ts';
import { FenceToken } from './token.ts';

export class FenceTokenizer implements SubTokenizer {
    match(cursor: TokenizerCursor): boolean {
        // フェンスは必ず行頭始まり（今回は簡易的に3連続以上の特定の記号を想定。例として「＝」や「-」）
        const char = cursor.peek(0);
        if (char !== '＝' && char !== '-' && char !== '`') {
            return false;
        }
        return cursor.peek(1) === char && cursor.peek(2) === char;
    }

    parse(cursor: TokenizerCursor): FenceToken {
        const startPos = cursor.position;
        const char = cursor.peek();
        
        // 連続するフェンス記号の数を数える
        let num = 0;
        while (cursor.peek(num) === char) {
            num++;
        }

        // 開始フェンス行の終了（LF）まで進める
        const prefixStart = startPos;
        cursor.advance(num);
        while (!cursor.isEof && cursor.peek() !== '\n') { cursor.advance(1); }
        if (cursor.peek() === '\n') { cursor.advance(1); }
        const prefixEnd = cursor.position;

        const contentStart = cursor.position;
        let contentEnd = cursor.position;
        let suffixStart = cursor.position;
        let suffixEnd = cursor.position;

        // 閉じフェンスの探索
        while (!cursor.isEof) {
            const currentPos = cursor.position;
            
            // 行頭で同じ文字が同じ数以上連続しているか
            let matchCount = 0;
            while (cursor.peek(matchCount) === char) {
                matchCount++;
            }

            if (matchCount >= num) {
                contentEnd = currentPos;
                suffixStart = currentPos;
                cursor.advance(matchCount);
                while (!cursor.isEof && cursor.peek() !== '\n') { cursor.advance(1); }
                if (cursor.peek() === '\n') { cursor.advance(1); }
                suffixEnd = cursor.position;
                break;
            }

            // 次の行へ
            while (!cursor.isEof && cursor.peek() !== '\n') { cursor.advance(1); }
            if (cursor.peek() === '\n') { cursor.advance(1); }
            contentEnd = cursor.position;
        }

        return {
            kind: 'fence',
            range: { start: startPos, end: cursor.position },
            enclosure: { char, num },
            prefix: { range: { start: prefixStart, end: prefixEnd } },
            content: { range: { start: contentStart, end: contentEnd } },
            suffix: { range: { start: suffixStart, end: suffixEnd } }
        };
    }
}

