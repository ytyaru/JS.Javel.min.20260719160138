import { Cursor } from './cursor.ts';

/**
 * すべての区切り管理者の最上位
 */
export class Separator {
    private readonly _char: string;
    constructor(char: string) {this.validate(char);this._char = char;}
    get char(): string {return this._char;}
    get chars(): string[] {return [this._char];}
    is(cursor: Cursor): boolean {return this._char === cursor.substring(cursor.index, cursor.index + this._char.length);}
    advance(cursor: Cursor): void {cursor.advance(this._char.length);}
    protected validate(char: string): void {if (char.length === 0) {throw new Error('長さは1以上であるべきです。');}}
}

/**
 * 複数のSeparatorを動的に管理し、ゲッターを自動生成するクラス
 */
export class MultiSeparator extends Separator {
    protected seps: Record<string, Separator> = {};

    constructor(options: Record<string, string>, count: number) {
        super('__MULTI_SEPARATOR_UNUSED_ROOT_CHAR__');
        this.validateOptions(options, count);
        this.make(options);
        this.makeGetter(options);
    }

    override get chars(): string[] {
        return Object.values(this.seps).flatMap(sep => sep.chars);
    }

    protected validateOptions(options: Record<string, string>, count: number): boolean {
        const keys = Object.keys(options);
        const values = Object.values(options);

        if (count !== keys.length) { throw new Error(`長さが違います。期待:${count} 実際:${keys.length}`); }

        const validationTargets: [string, string[]][] = [['key', keys], ['value', values]];
        for (const [name, targetArray] of validationTargets) {
            if (!this.valid(targetArray)) { throw new Error(`${name} が重複しています。:${targetArray}`); }
        }
        return true;
    }

    private valid(values: string[]): boolean {
        return values.length === (new Set(values)).size;
    }

    protected make(options: Record<string, string>): void {
        for (const [k, v] of Object.entries(options)) {
            this.seps[k] = new Separator(v);
        }
    }

    protected makeGetter(options: Record<string, string>): void {
        for (const key of Object.keys(options)) {
            Object.defineProperty(this, key, {
                get: () => this.seps[key],
                enumerable: true,
                configurable: false
            });
        }
    }

    override is(cursor: Cursor): boolean {
        throw new Error('MultiSeparatorに対して直接 is() を呼び出すことはできません。各ゲッタープロパティの is() を使用してください。');
    }

    override advance(cursor: Cursor): void {
        throw new Error('MultiSeparatorに対して直接 advance() を呼び出すことはできません。各ゲッタープロ比ティの advance() を使用してください。');
    }
}

export class DataSeparator extends Separator { constructor(char: string) { super(char); } }
export class PairDataSeparator extends DataSeparator { constructor(char: string) { super(char); } }
export class ListDataSeparator extends DataSeparator { constructor(char: string) { super(char); } }

export interface GridDataSeparator { readonly u: Separator; readonly l: Separator; }
export class GridDataSeparator extends MultiSeparator { constructor(u: string, l: string) { super({ u, l }, 2); } }

export interface TreeDataSeparator { readonly n: Separator; readonly c: Separator; readonly p: Separator; }
export class TreeDataSeparator extends MultiSeparator { constructor(n: string, c: string, p: string) { super({ n, c, p }, 3); } }

export interface DocumentSeparator { readonly p: Separator; readonly l: Separator; }
export class DocumentSeparator extends MultiSeparator { constructor(p: string, l: string) { super({ p, l }, 2); } }

export class AsciiDocumentSeparator extends DocumentSeparator { constructor(p: string, l: string) { super(p, l); } }
export class WindowsDocumentSeparator extends AsciiDocumentSeparator { constructor() { super('\r\n\r\n', '\r\n'); } }
export class MacDocumentSeparator extends AsciiDocumentSeparator { constructor() { super('\r\r', '\r'); } }
export class LinuxDocumentSeparator extends AsciiDocumentSeparator { constructor() { super('\n\n', '\n'); } }
export class UnicodeDocumentSeparator extends AsciiDocumentSeparator { constructor() { super('\u2029', '\u2028'); } }

