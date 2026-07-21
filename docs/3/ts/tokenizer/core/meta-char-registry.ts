import { Cursor, CodeUnitCursor, CodePointCursor, GraphemeCursor } from './cursor.js';
/**
 * すべてのトークナイザ構成部品からメタ文字を一元的に収集・管理する責任
 */
export class MetaCharRegistry {
    private readonly chars: Set<string> = new Set();

    /** メタ文字をレジストリに登録する */
    register(metaChar: string): void {
        if (metaChar.length === 0) return;
        this.chars.add(metaChar);
    }

    /** 登録されたすべてのユニークなメタ文字のリストを返す */
    getRegisteredChars(): string[] {
        return Array.from(this.chars);
    }
}

