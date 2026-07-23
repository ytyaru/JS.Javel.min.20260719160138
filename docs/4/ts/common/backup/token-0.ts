export interface LinerRange { start: number; end: number; }
export interface BaseToken { range: LinerRange; }
// 組込／拡張
export interface BuiltinToken extends BaseToken {}
export interface AddonToken extends BaseToken { type: string; }
// 文書Document／実録Data
export interface DocumentPartToken extends BuiltinToken {}
export interface DocumentToken extends BuiltinToken {}
export interface DataToken extends BuiltinToken {}
export interface AddonDocumentPartToken extends AddonToken {}
export interface AddonDocumentToken extends AddonToken {}
export interface AddonDataToken extends AddonToken {}
// Zone/Piece
export interface ZoneToken extends DocumentToken {}
export interface Piece extends DocumentToken {}
export interface AddonZoneToken extends AddonDocumentToken {}
export interface AddonPiece extends AddonDocumentToken {}
// Affix
export interface AffixToken extends DocumentPartToken {}
export interface PrefixToken extends AffixToken {}
export interface SuffixToken extends AffixToken {}
export interface BodyToken extends DocumentToken {}
export interface AddonAffixToken extends AddonDocumentPartToken {}
export interface AddonPrefixToken extends AddonAffixToken {}
export interface AddonSuffixToken extends AddonAffixToken {}
export interface BodyToken extends DocumentToken {}
// Builtin
export interface FenceToken extends ZoneToken {
    enclosure: { char: string; num: number; };
    prefix: AffixToken;
    suffix: SuffixToken;
    body: BodyToken;
}
export interface BlockToken extends ZoneToken {}
export interface SpaceToken extends ZoneToken {count: number;}
export interface InlineToken extends PieceToken {}
// Addon
export interface AddonFenceToken extends AddonZoneToken {
    enclosure: { char: string; num: number; };
    prefix: AffixToken;
    suffix: SuffixToken;
    body: BodyToken;
}
export interface AddonBlockToken extends AddonZoneToken {}
export interface AddonSpaceToken extends AddonZoneToken {count: number;}
export interface AddonInlineToken extends AddonPieceToken {}
