import {BaseToken} from './token.js';
export interface AstNode {
    /** 具体的な型名('heading'や'thematic-break'等) */
    type: string;
    /** 元となったToken。token.kindとnode.typeの二つでAstNodeの種別を特定可能 */
    token: BaseToken;
    /** 解析された意味データ（見出しレベル、ルビの親文字と読み等） */
    data: Record<string, any>;
    /** 表記の揺れやエスケープ時の全角スペース除去情報など、復元に必要な情報 */
    notation: Record<string, any>;
    /** 子ノード（段落内のインライン要素やフェンス内の要素など） */
    children?: AstNode[];
}

