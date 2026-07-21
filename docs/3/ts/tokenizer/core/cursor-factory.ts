import { Cursor, CodeUnitCursor, CodePointCursor, GraphemeCursor } from './cursor.ts';
import { MetaCharRegistry } from './meta-char-registry.ts';
import { Separator } from './separator.ts';

/**
 * 登録された複雑度を表現する内部状態オブジェクト
 */
interface AnalysisState {
    requireGrapheme: boolean;
    requireSurrogatePair: boolean;
}

export class CursorFactory {
    private readonly segmenter: Intl.Segmenter;

    constructor(customSegmenter?: Intl.Segmenter) {
        this.segmenter = customSegmenter ?? new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    }

    /**
     * 【統括】引数を収集し、プライベートAPIのパイプラインを流して最終結果を返す
     */
    get(manuscript: string, separator: Separator, registry?: MetaCharRegistry): Cursor {
        const metaChars = this.collectMetaChars(separator, registry);
        const state = this.evaluateMetaChars(metaChars);
        
        return this.manufacture(manuscript, state);
    }

    /**
     * 【収集】セパレータとレジストリから重複を排除してフラットな配列を作る
     */
    private collectMetaChars(separator: Separator, registry?: MetaCharRegistry): string[] {
        const charSet = new Set<string>(separator.chars);
        if (registry) {
            for (const char of registry.getRegisteredChars()) {
                charSet.add(char);
            }
        }
        return Array.from(charSet);
    }

    /**
     * 【分析プライベートAPI 1】外側ループ。各メタ文字に対する走査の制御
     */
    private evaluateMetaChars(metaChars: string[]): AnalysisState {
        const state: AnalysisState = { requireGrapheme: false, requireSurrogatePair: false };

        for (const char of metaChars) {
            const segments = Array.from(this.segmenter.segment(char));
            this.evaluateSegments(segments, state);
            
            if (state.requireGrapheme) {
                break;
            }
        }
        return state;
    }

    /**
     * 【分析プライベートAPI 2】内側ループ。書記素セグメント内部のUnicode特性判定
     */
    private evaluateSegments(segments: Intl.SegmentData[], state: AnalysisState): void {
        for (const segment of segments) {
            const graphemeStr = segment.segment;
            
            // 結合文字（合字）の検出
            if (Array.from(graphemeStr).length > 1) {
                state.requireGrapheme = true;
                break;
            }
            
            // サロゲートペアの検出
            if (graphemeStr.length > 1) {
                state.requireSurrogatePair = true;
            }
        }
    }

    /**
     * 【製造プライベートAPI 3】分析されたステートを元に、具象クラスを組み立てて Cursor として返却
     */
    private manufacture(manuscript: string, state: AnalysisState): Cursor {
        if (state.requireGrapheme) {
            return new GraphemeCursor(manuscript, this.segmenter);
        }
        if (state.requireSurrogatePair) {
            return new CodePointCursor(manuscript);
        }
        return new CodeUnitCursor(manuscript);
    }
}

