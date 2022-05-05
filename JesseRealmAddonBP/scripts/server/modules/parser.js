import { Token, Tokenizr, ParsingError } from './extern/tokenizr.js';
const lexer = new Tokenizr();
{
    /*lexer.rule(/'(.*)'/, (ctx, match) => {
        ctx.accept('string', match[1]);
    });*/
    lexer.rule(/(true|false)/, (ctx, match) => {
        ctx.accept('boolean', match[0] == 'true' ? true : false);
    });
    lexer.rule(/[a-zA-Z_][a-zA-Z0-9_]*/, (ctx, match) => {
        ctx.accept('id');
    });
    lexer.rule(/[0-9]+/, (ctx, match) => {
        ctx.accept('number', parseInt(match[0]));
    });
    lexer.rule(/\s+/, (ctx, match) => {
        ctx.accept('space');
    });
    lexer.rule(/!/, (ctx, match) => {
        ctx.accept('exclamation');
    });
    lexer.rule(/:/, (ctx, match) => {
        ctx.accept('colon');
    });
    lexer.rule(/,/, (ctx, match) => {
        ctx.accept('comma');
    });
    lexer.rule(/[\[\]\(\)\<\>\{\}]/, (ctx, match) => {
        ctx.accept('bracket');
    });
    lexer.rule(/#/, (ctx, match) => {
        ctx.accept('hash');
    });
    lexer.rule(/%/, (ctx, match) => {
        ctx.accept('percent');
    });
    lexer.rule(/\^/, (ctx, match) => {
        ctx.accept('caret');
    });
    lexer.rule(/=/, (ctx, match) => {
        ctx.accept('equal');
    });
    lexer.rule(/\*/, (ctx, match) => {
        ctx.accept('star');
    });
}
export function tokenize(input) {
    try {
        lexer.input(input);
    }
    catch (err) {
        if (err instanceof ParsingError) {
            const error = {
                isSyntaxError: true,
                idx: -1,
                start: err.pos,
                end: err.pos + 1,
                stack: Error().stack
            };
            throw error;
        }
        throw err;
    }
    return new Tokens(lexer.tokens());
}
export function mergeTokens(start, end, input) {
    const sub = input.substring(start.pos, end.pos + end.text.length);
    return new Token('merge', sub, sub, start.pos);
}
export function throwTokenError(token) {
    const err = {
        isSyntaxError: true,
        idx: -1,
        start: token.pos,
        end: token.pos + token.text.length,
        stack: Error().stack
    };
    throw err;
}
export function processOps(out, ops, op) {
    while (ops.length) {
        const op2 = ops.slice(-1)[0];
        if (op && op.prec > op2.prec) {
            break;
        }
        if (out.length < op2.opCount) {
            throwTokenError(op2.token);
        }
        ops.pop(); // <= op2
        for (let i = 0; i < op2.opCount; i++) {
            op2.nodes.push(out.pop());
        }
        out.push(op2);
    }
    if (op) {
        ops.push(op);
    }
}
export function parseBlock(tokens) {
    const block = {
        id: tokens.curr().value,
        data: -1,
        states: null
    };
    let token;
    function finish() {
        if (!block.id.includes(':')) {
            block.id = 'minecraft:' + block.id;
        }
        return block;
    }
    while (token = tokens.peek()) {
        switch (token.type) {
            case 'colon':
                token = tokens.next();
                const peek = tokens.peek();
                if (peek.type == 'id') {
                    if (block.id.includes(':') || block.data != -1)
                        throwTokenError(peek);
                    block.id += ':' + peek.value;
                    token = tokens.next();
                }
                else if (peek.type == 'number') {
                    if (block.data != -1)
                        throwTokenError(peek);
                    block.data = peek.value;
                    token = tokens.next();
                    return finish();
                }
                else {
                    throwTokenError(peek);
                }
                break;
            case 'bracket':
                if (token.value == '[') {
                    if (block.states != null)
                        throwTokenError(token);
                    token = tokens.next();
                    block.states = parseBlockStates(tokens);
                    return finish();
                }
                else {
                    return finish();
                }
                break;
            default:
                return finish();
        }
    }
}
export function parseBlockStates(tokens) {
    let blockStates = new Map();
    let expectingBlockValue = false;
    let blockDataName = null;
    let blockDataValue = null;
    function pushDataTag() {
        blockStates.set(blockDataName, blockDataValue);
        expectingBlockValue = false;
        blockDataName = null;
        blockDataValue = null;
    }
    let token;
    while (token = tokens.next()) {
        switch (token.type) {
            case 'id':
            case 'number':
            case 'boolean':
                if (expectingBlockValue) {
                    if (blockDataValue != null) {
                        throwTokenError(token);
                    }
                    blockDataValue = token.value;
                }
                else {
                    if (blockDataName != null || token.type == 'number' || token.type == 'boolean') {
                        throwTokenError(token);
                    }
                    blockDataName = token.value;
                }
                break;
            case 'equal':
                if (expectingBlockValue) {
                    throwTokenError(token);
                }
                expectingBlockValue = true;
                break;
            case 'comma':
                if (blockDataValue == null) {
                    throwTokenError(token);
                }
                pushDataTag();
                break;
            case 'bracket':
                if (token.value != ']' || token.value == ']' && blockDataValue == null) {
                    throwTokenError(token);
                }
                pushDataTag();
                return blockStates;
            default:
                throwTokenError(token);
        }
    }
}
class Tokens {
    constructor(tokens) {
        this.tokens = tokens;
        this.idx = -1;
    }
    curr() {
        return this.currToken;
    }
    next() {
        this.currToken = this.tokens[++this.idx];
        return this.currToken;
    }
    peek(pos = 0) {
        return this.tokens[this.idx + pos + 1];
    }
    seek(pos) {
        this.idx = pos - 1;
        return this.next();
    }
    getPos() {
        return this.idx;
    }
}