import {FenceToken,BlockToken,SpaceToken,InlineToken} from './token.js';
import {AstNode} from './node.js';
export class HeadingNode extends AstNode {
    data: {
        type: 'heading';
        level: number;
    },
}
