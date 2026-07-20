import { TokenizerCursor } from './cursor.js';

/**
 * すべての区切り管理者の最上位
 */
export class Separator {
    private readonly string char;
    constructor(char) {this.char=char;}
    get char() {return this.char}
    is(cursor: TokenizerCursor): boolean {return this.char === cursor.substring(0, char.length)}
    advance(cursor: TokenizerCursor): void {cursor.advance(this.char.length)};
}
export class MultiSeparator extends Separator {
    private readonly seps: Record<string, any>; // any
    constructor(options, count) {
        this.validate(options, count);
        this.make(options);
    }
    protected validate(options, count) {
        ['key','value'].map(n=>this.throw(n,count));
        return true;
    }
    private throw(name: string = 'key' | 'value', count:number) {
        const targets = Object[`${name}`s](options);
        if (count !== targets.length) {throw new Error(`長さが違います。期待:${count} 実際:${targets.length}`)}
        if (this.valid(targets)) {
            throw new Error(`${name} が重複しています。:${targets}`);
        }
    }
    private valid(values) {return values.length === (new Set(values)).size;}
    protected make(options) {
        this.seps = {};
        for (let [k,v] of Object.entries(options) {
            this.seps[k] = new Separator(v);
        }
    }
    protected makeGetter() {
        // どうにかしてsepsのデータを使ってゲッターを動的生成する。
        // Object.defineProperty();とか使って。
    }
}
export class DataSeparator extends Separator {constructor(char){super(char);}}
export class PairDataSeparator extends DataSeparator {constructor(char){super(char);}}
export class ListDataSeparator extends DataSeparator {constructor(char){super(char);}}
export class GridDataSeparator extends DataSeparator {
    constructor(u,l) {super({u,l})}
//    constructor(u,l) {this._={u:new Separator(u), r:new Separator(r)}}
//    get u() {return this._.u}
//    get r() {return this._.r}
}
export class TreeDataSeparator extends DataSeparator {
    constructor(n,c,p) {super({n,c,p})}
//    constructor(n,c,p) {this._={n:new Separator(n), c:new Separator(c), p:new Separator(p)}}
//    get n() {return this._.n}
//    get c() {return this._.c}
//    get p() {return this._.p}
}
// 16種クラス＝4つのデータ構造×4パターン(win/mac/linux/unicode)
// ...

// Affix解析時はDataSeparatorをそのAffixの型に合わせて使う。例えばfence/affix/line.tsならListDataSeparatorを使う。full.tsなら全部を適宜使う。

/**
 * 文書《ドキュメント》構造の区切りに特化した責任を持つ抽象クラス
 */
export class class DocumentSeparator extends Separator {
    constructor(p,l) {super({p,l})}
//    constructor(p,l) {this._={p:new Separator(p), l:new Separator(l)}}
//    get p() {return this._.p}
//    get l() {return this._.l}
}
export class AsciiDocumentSeparator extends DocumentSeparator {
    constructor(p,l) {super({p,l})}
}
export class WindowsDocumentSeparator extends AsciiDocumentSeparator {
    constructor() {super({p:'\r\n\r\n',l:'\r\n'})}
}
export class MacDocumentSeparator extends AsciiDocumentSeparator {
    constructor() {super({p:'\r\r',l:'\r'})}
}
export class LinuxDocumentSeparator extends AsciiDocumentSeparator {
    constructor() {super({p:'\n\n',l:'\n'})}
}
export class UnicodeDocumentSeparator extends AsciiDocumentSeparator {
    constructor() {super({p:'\u2029',l:'\u2028'})}
}

