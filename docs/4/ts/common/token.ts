export interface LinerRange { start: number; end: number; }
export interface BaseToken { range: LinerRange; }

// ==========================================
// 1. 基底レイヤにおける組込（Builtin）／拡張（Addon）の物理的枝分かれ
// ==========================================
export interface BuiltinToken extends BaseToken {}
export interface AddonToken extends BaseToken { type: string; }

// ==========================================
// A. 組込（Builtin）系統の継承ツリー
// ==========================================
export interface DocumentPartToken extends BuiltinToken {}
export interface DocumentToken extends BuiltinToken {}
export interface DataStructureToken extends BuiltinToken {}

export interface ZoneToken extends DocumentToken {}
export interface PieceToken extends DocumentToken {}

export interface AffixToken extends DocumentPartToken {}
export interface PrefixToken extends AffixToken {}
export interface SuffixToken extends AffixToken {}
export interface BodyToken extends DocumentToken {}

export interface NoneDataToken extends DataStructureToken {}
export interface OneDataToken extends DataStructureToken {}
export interface ListDataToken extends DataStructureToken {}
export interface GridDataToken extends DataStructureToken {}
export interface TreeDataToken extends DataStructureToken {}

export interface FenceToken extends ZoneToken {
    enclosure: { char: string; num: number; };
    prefix: AffixToken;
    suffix: SuffixToken;
    body: BodyToken;
}
export interface BlockToken extends ZoneToken {}
export interface SpaceToken extends ZoneToken { count: number; }
export interface InlineToken extends PieceToken {}

// ==========================================
// B. 拡張（Addon）系統の継承ツリー
// ==========================================
export interface AddonDocumentPartToken extends AddonToken {}
export interface AddonDocumentToken extends AddonToken {}
export interface AddonDataStructureToken extends AddonToken {}

export interface AddonZoneToken extends AddonDocumentToken {}
export interface AddonPieceToken extends AddonDocumentToken {}

export interface AddonAffixToken extends AddonDocumentPartToken {}
export interface AddonPrefixToken extends AddonAffixToken {}
export interface AddonSuffixToken extends AddonAffixToken {}

export interface AddonNoneDataToken extends AddonDataStructureToken {}
export interface AddonOneDataToken extends AddonDataStructureToken {}
export interface AddonListDataToken extends AddonDataStructureToken {}
export interface AddonGridDataToken extends AddonDataStructureToken {}
export interface AddonTreeDataToken extends AddonDataStructureToken {}

export interface AddonFenceToken extends AddonZoneToken {
    enclosure: { char: string; num: number; };
    prefix: AffixToken;
    suffix: SuffixToken;
    body: BodyToken;
}
export interface AddonBlockToken extends AddonZoneToken {}
export interface AddonSpaceToken extends AddonZoneToken { count: number; }
export interface AddonInlineToken extends AddonPieceToken {}

// ==========================================
// 2. 名前空間によるマッピング
// ==========================================
export namespace Token {
    export namespace builtin {
        export namespace document {
            export namespace zone {
                export type Fence = FenceToken;
                export type Block = BlockToken;
                export type Space = SpaceToken;
            }
            export namespace piece {
                export type Inline = InlineToken;
            }
        }
        export namespace data {
            export type None = NoneDataToken;
            export type One = OneDataToken;
            export type List = ListDataToken;
            export type Grid = GridDataToken;
            export type Tree = TreeDataToken;
        }
    }

    export namespace addon {
        export namespace document {
            export namespace zone {
                export type Fence = AddonFenceToken;
                export type Block = AddonBlockToken;
                export type Space = AddonSpaceToken;
            }
            export namespace piece {
                export type Inline = AddonInlineToken;
            }
        }
        export namespace data {
            export type None = AddonNoneDataToken;
            export type One = AddonOneDataToken;
            export type List = AddonListDataToken;
            export type Grid = AddonGridDataToken;
            export type Tree = AddonTreeDataToken;
        }
    }
}
