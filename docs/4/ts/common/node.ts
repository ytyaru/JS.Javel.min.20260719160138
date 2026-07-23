import { BaseToken, Tokens } from './token.ts';

// すべてのノードの絶対基盤となる、再利用可能部品
export interface BaseAstNode<T extends BaseToken> {
    /** 元となったToken。token.type(addon時)からアクセス可能なため、ノード側にtypeは不要 */
    token: T;
    /** 解析された意味データ（見出しレベル、ルビの親文字と読み等） */
    data: Record<string, any>;
    /** 表記の揺れやエスケープ時の全角スペース除去情報など、復元に必要な情報 */
    notation: Record<string, any>;
    /** 子ノード（未定義型を避け、かつすべての具象子孫ノードを多相的に受け入れるためのワイルドカード指定） */
    children?: BaseAstNode<any>[];
}

// ==========================================
// 1. 基底レイヤにおける組込（Builtin）／拡張（Addon）の物理的枝分かれ
// ==========================================
export interface BuiltinAstNode<T extends BaseToken> extends BaseAstNode<T> {}
export interface AddonAstNode<T extends BaseToken> extends BaseAstNode<T> {}

// ==========================================
// A. 組込（Builtin）系統のノード型定義
// ==========================================
export interface DocumentPartNode<T extends BaseToken> extends BuiltinAstNode<T> {}
export interface DocumentNode<T extends BaseToken> extends BuiltinAstNode<T> {}
export interface DataStructureNode<T extends BaseToken> extends BuiltinAstNode<T> {}

export interface ZoneNode<T extends BaseToken> extends DocumentNode<T> {}
export interface PieceNode<T extends BaseToken> extends DocumentNode<T> {}

export interface AffixNode<T extends BaseToken> extends DocumentPartNode<T> {}
export interface PrefixNode<T extends BaseToken> extends AffixNode<T> {}
export interface SuffixNode<T extends BaseToken> extends AffixNode<T> {}
export interface BodyNode<T extends BaseToken> extends DocumentNode<T> {}

// 具象組込ノード群（親の型引数で Tokens.builtin の個別定義型と1対1で縛る）
export interface NoneDataNode  extends DataStructureNode<Tokens.builtin.data.None> {}
export interface OneDataNode   extends DataStructureNode<Tokens.builtin.data.One> {}
export interface ListDataNode  extends DataStructureNode<Tokens.builtin.data.List> {}
export interface GridDataNode  extends DataStructureNode<Tokens.builtin.data.Grid> {}
export interface TreeDataNode  extends DataStructureNode<Tokens.builtin.data.Tree> {}

export interface FenceNode  extends ZoneNode<Tokens.builtin.document.zone.Fence> {}
export interface BlockNode  extends ZoneNode<Tokens.builtin.document.zone.Block> {}
export interface SpaceNode  extends ZoneNode<Tokens.builtin.document.zone.Space> {}
export interface InlineNode extends PieceNode<Tokens.builtin.document.piece.Inline> {}

// ==========================================
// B. 拡張（Addon）系統のノード型定義
// ==========================================
export interface AddonDocumentPartNode<T extends BaseToken> extends AddonAstNode<T> {}
export interface AddonDocumentNode<T extends BaseToken> extends AddonAstNode<T> {}
export interface AddonDataStructureNode<T extends BaseToken> extends AddonAstNode<T> {}

export interface AddonZoneNode<T extends BaseToken> extends AddonDocumentNode<T> {}
export interface AddonPieceNode<T extends BaseToken> extends AddonDocumentNode<T> {}

export interface AddonAffixNode<T extends BaseToken> extends AddonDocumentPartNode<T> {}
export interface AddonPrefixNode<T extends BaseToken> extends AddonAffixNode<T> {}
export interface AddonSuffixNode<T extends BaseToken> extends AddonAffixNode<T> {}

export interface AddonNoneDataNode  extends AddonDataStructureNode<Tokens.addon.data.None> {}
export interface AddonOneDataNode   extends AddonDataStructureNode<Tokens.addon.data.One> {}
export interface AddonListDataNode  extends AddonDataStructureNode<Tokens.addon.data.List> {}
export interface AddonGridDataNode  extends AddonDataStructureNode<Tokens.addon.data.Grid> {}
export interface AddonTreeDataNode  extends AddonDataStructureNode<Tokens.addon.data.Tree> {}

export interface AddonFenceNode  extends AddonZoneNode<Tokens.addon.document.zone.Fence> {}
export interface AddonBlockNode  extends AddonZoneNode<Tokens.addon.document.zone.Block> {}
export interface AddonSpaceNode  extends AddonZoneNode<Tokens.addon.document.zone.Space> {}
export interface AddonInlineNode extends AddonPieceNode<Tokens.addon.document.piece.Inline> {}

/** Hudoシステムが扱う、すべてのノードの総称 */
export type AstNode =
    | FenceNode 
    | BlockNode 
    | SpaceNode 
    | InlineNode 
    | NoneDataNode
    | OneDataNode
    | ListDataNode
    | GridDataNode
    | TreeDataNode
    | AddonFenceNode 
    | AddonBlockNode 
    | AddonSpaceNode 
    | AddonInlineNode 
    | AddonNoneDataNode
    | AddonOneDataNode
    | AddonListDataNode
    | AddonGridDataNode
    | AddonTreeDataNode;

// ==========================================
// 2. 名前空間によるマッピング
// ==========================================
export namespace AstNodes {
    export namespace builtin {
        export namespace document {
            export namespace zone {
                export type Fence = FenceNode;
                export type Block = BlockNode;
                export type Space = SpaceNode;
            }
            export namespace piece {
                export type Inline = InlineNode;
            }
        }
        export namespace data {
            export type None = NoneDataNode;
            export type One = OneDataNode;
            export type List = ListDataNode;
            export type Grid = GridDataNode;
            export type Tree = TreeDataNode;
        }
    }

    export namespace addon {
        export namespace document {
            export namespace zone {
                export type Fence = AddonFenceNode;
                export type Block = AddonBlockNode;
                export type Space = AddonSpaceNode;
            }
            export namespace piece {
                export type Inline = AddonInlineNode;
            }
        }
        export namespace data {
            export type None = AddonNoneDataNode;
            export type One = AddonOneDataNode;
            export type List = AddonListDataNode;
            export type Grid = AddonGridDataNode;
            export type Tree = AddonTreeDataNode;
        }
    }
}
