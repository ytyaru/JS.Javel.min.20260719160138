export interface LinerRange { start: number; end: number; }
export interface BaseToken { range: LinerRange; }
export interface BuiltinToken extends BaseToken {}
export interface AddonToken extends BaseToken { type: string; }
// Builtin
export interface AffixToken extends BuiltinToken {}
export interface PrefixToken extends AffixToken {}
export interface SuffixToken extends AffixToken {}
export interface BodyToken extends BuiltinToken {}
export interface FenceToken extends BuiltinToken {
    enclosure: { char: string; num: number; };
    prefix: AffixToken;
    suffix: SuffixToken;
    body: BodyToken;
}
export interface BlockToken extends BuiltinToken {}
export interface SpaceToken extends BuiltinToken {count: number;}
export interface InlineToken extends BuiltinToken {}
// Addon
export interface AddonAffixToken extends AddonToken {}
export interface AddonPrefixToken extends AddonAffixToken {}
export interface AddonSuffixToken extends AddonAffixToken {}
export interface AddonBodyToken extends AddonToken {}
export interface AddonFenceToken extends AddonToken {
    enclosure: { char: string; num: number; };
    prefix: AddonAffixToken;
    suffix: AddonSuffixToken;
    body: AddonBodyToken;
}
export interface AddonBlockToken extends AddonToken {}
export interface AddonSpaceToken extends AddonToken {count: number;}
export interface AddonInlineToken extends AddonToken {}
