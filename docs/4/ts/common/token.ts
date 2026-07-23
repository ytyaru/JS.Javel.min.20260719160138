export interface LinerRange { start: number; end: number; }
export interface BaseToken { range: LinerRange; }

// ==========================================
// 1. 組込（Builtin）／拡張（Addon）の属性定義（最小部品）
// ==========================================

export interface Builtin {
    // 組込型は追加プロパティを持たない（型識別はTypeScriptの型システム自身が行う）
}

export interface Addon {
    /** 拡張型用型識別子。JS側から文字列で型を識別するために必須のプロパティ */
    type: string; 
}

// ==========================================
// 2. ドメイン（階層・役割）の抽象型定義
// ==========================================

export interface DocumentPartToken extends BaseToken {}
export interface DocumentToken extends BaseToken {}
export interface DataToken extends BaseToken {}

export interface ZoneToken extends DocumentToken {}
export interface PieceToken extends DocumentToken {} // PieceからPieceTokenへ名称統一

export interface AffixToken extends DocumentPartToken {}
export interface PrefixToken extends AffixToken {}
export interface SuffixToken extends AffixToken {}
export interface BodyToken extends DocumentToken {}

// ==========================================
// 3. 不変の構造体定義（ジェネリクスによる再利用化）
//    引数 T に Builtin または Addon を渡すことで、構造をDRYに使い回します。
// ==========================================

export type FenceTokenBase<T> = ZoneToken & T & {
    enclosure: { char: string; num: number; };
    prefix: TokenBase<T>; // 再帰的に属性を伝播
    suffix: TokenBase<T>;
    body: TokenBase<T>;
};

export type BlockTokenBase<T> = ZoneToken & T;

export type SpaceTokenBase<T> = ZoneToken & T & {
    count: number;
};

export type InlineTokenBase<T> = PieceToken & T;

// 汎用トークン分配器
type TokenBase<T> = 
    | FenceTokenBase<T> 
    | BlockTokenBase<T> 
    | SpaceTokenBase<T> 
    | InlineTokenBase<T>
    | (DataToken & T);

// ==========================================
// 4. 外部へ公開する最終型（エンドユーザーおよびコアが使用するAPI）
// ==========================================

// A. 組込型の実体（重複コードゼロで生成）
export type FenceToken       = FenceTokenBase<Builtin>;
export type BlockToken       = BlockTokenBase<Builtin>;
export type SpaceToken       = SpaceTokenBase<Builtin>;
export type InlineToken      = InlineTokenBase<Builtin>;
export type BuiltinDataToken = DataToken & Builtin;

// B. 拡張型の実体（type: string プロパティが自動で安全にマージされる）
export type AddonFenceToken  = FenceTokenBase<Addon>;
export type AddonBlockToken  = BlockTokenBase<Addon>;
export type AddonSpaceToken  = SpaceTokenBase<Addon>;
export type AddonInlineToken = InlineTokenBase<Addon>;
export type AddonDataToken   = DataToken & Addon;

/** Hudoシステムが扱う、すべてのトークン型の総称 */
export type Token = 
    | FenceToken 
    | BlockToken 
    | SpaceToken 
    | InlineToken 
    | BuiltinDataToken
    | AddonFenceToken 
    | AddonBlockToken 
    | AddonSpaceToken 
    | AddonInlineToken 
    | AddonDataToken;

