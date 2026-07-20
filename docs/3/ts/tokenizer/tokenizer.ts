import { BaseToken } from './token.ts';
import { StringCursor } from './string-cursor.ts'; // 上記のStringCursor
import { SubTokenizer } from './tokenizer-interface.ts';
import { SpaceTokenizer } from './space-tokenizer.ts';
import { FenceTokenizer } from './fence-tokenizer.ts';
import { BlockTokenizer } from './block-tokenizer.ts';

export class Tokenizer {
    private tokenizers: SubTokenizer[];

    constructor(options?: any) {
        const fenceTokenizer = new FenceTokenizer();
        
        // 単一責任の子トークナイザを登録（評価順序が重要）
        this.tokenizers = [
            new SpaceTokenizer(),
            fenceTokenizer,
            // BlockTokenizerには「次の行頭がフェンスか」を判定する関数をDI（依存注入）する
            new BlockTokenizer((cursor) => fenceTokenizer.match(cursor))
        ];
    }

    *tokenize(manuscript: string): Generator<BaseToken, void, unknown> {
        const cursor = new StringCursor(manuscript);

        while (!cursor.isEof) {
            let matched = false;

            for (const tokenizer of this.tokenizers) {
                if (tokenizer.match(cursor)) {
                    yield tokenizer.parse(cursor);
                    matched = true;
                    break;
                }
            }

            // 万が一どのトークナイザもマッチしなかった場合の無限ループ防止（安全弁）
            if (!matched) {
                cursor.advance(1);
            }
        }
    }
}
