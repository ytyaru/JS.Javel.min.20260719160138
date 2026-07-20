import { BaseToken } from '../../token/token.js';
import { TokenizerCursor } from './cursor.js';
export interface ZoneTokenizer {
    match(cursor: TokenizerCursor): boolean;
    parse(cursor: TokenizerCursor): BaseToken;
}
