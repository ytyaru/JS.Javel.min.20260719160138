export interface LinerRange { start: number; end: number; }
export interface BaseToken { range: LinerRange; }
export interface FenceToken extends BaseToken {
    kind: 'fence';
    enclosure: { char: string; num: number; };
    prefix: { range: LinerRange; };
    suffix: { range: LinerRange; };
    content: { range: LinerRange; };
}
export interface BlockToken extends BaseToken { kind: 'block'; }
export interface SpaceToken extends BaseToken { kind: 'space'; count: number; }
export interface InlineToken extends BaseToken { kind: 'inline'; }
