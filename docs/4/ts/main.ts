import {AstNode} from './node.js';
import {Tokenizer} from './tokenizer.js';
import {Lexer} from './lexer.js';
class DocPart {
    private _id: 'front' | 'back' | 'body' = 'front';
    get id() {return this._id}
    update(node: AstNode) {
        if ('body'!==this._id && 'heading'===node.type && 1===node.data.level) {this._id = 'body';}
        else if ('front'===this._id && 'thematic-break'===node.type) {this._id = 'back';}
    }
}
// TODO: optionsの型が未定義（当分は未定義でいい）
export class Hudo {
    // TypeScriptが this._ の構造を理解できるようにプロパティを宣言
    private _: {
        tokenizer: Tokenizer;
        lexer: Lexer;
        part: DocPart;
    };
    constructor(langs: Languages[]) {
        this._ = {} as any; // 保持ルールを優先するためのアサーション
        this._.tokenizer = new Tokenizer(langs);
        this._.lexer = new Lexer(langs);
        this._.part = new DocPart();
    }
    *parse(manuscript: string, options?: any): Generator<AstNode, void, unknown> {
        for (let token of this._.tokenizer.tokenize(manuscript)) {
            const node = this._.lexer.lex(token);
            this._.part.update(node);
            yield node;
        }
    }
}
