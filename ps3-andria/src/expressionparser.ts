/* Copyright (c) 2021-2024 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

/** Parser for image meme expressions. @module */

import assert from 'node:assert';
import { Parser, ParseTree, compile, visualizeAsUrl } from 'parserlib';
import { Expression } from './expression.js';
import { File, SideGlue, Resize, TopGlue, BottomOverlay, TopOverlay, Caption} from './expression-impls.js';

/*
 * PS3 instructions: you are free to change this file.
 */

// PS3 instructions: do not read image data in the parser
type ImageLibrary = undefined; type Canvas = undefined; type Image = undefined; const createCanvas = undefined, loadImage = undefined;

// the grammar
const grammar = `
@skip whitespace {
    expression ::= sideglue (topToBottomOperator sideglue)*;
    sideglue ::= bottomoverlay ('|' bottomoverlay)*;
    bottomoverlay ::= topoverlay ('_' topoverlay)*;
    topoverlay ::= resize ('^' resize)*;
    resize ::= primitive ('@' (number 'x' number | unknown 'x' number | number 'x' unknown))*;
    primitive ::= filename | '"' caption '"' | '(' expression ')';
}
topToBottomOperator ::= '---' '-'*;
filename ::= [A-Za-z0-9.][A-Za-z0-9._-]*;
number ::= [0-9]+;
unknown ::= '?';
whitespace ::= [ \\t\\r\\n]+;
caption ::= [^\\n"]+;
`;

// the nonterminals of the grammar
enum ExpressionGrammar {
    Expression, Resize, Primitive, TopToBottomOperator, Filename, Number, Whitespace, SideGlue, BottomOverlay, TopOverlay, Caption, Unknown
}

// compile the grammar into a parser
const parser: Parser<ExpressionGrammar> = compile(grammar, ExpressionGrammar, ExpressionGrammar.Expression);

/**
 * Parse a string into an expression.
 * 
 * @param input string to parse
 * @returns Expression parsed from the string
 * @throws ParseError if the string doesn't match the Expression grammar
 */
export function parseExpression(input: string): Expression {
    // parse the example into a parse tree
    const parseTree: ParseTree<ExpressionGrammar> = parser.parse(input);

    // display the parse tree in various ways, for debugging only
    // console.log("parse tree:\n" + parseTree);
    // console.log(visualizeAsUrl(parseTree, ExpressionGrammar));

    // make an AST from the parse tree
    const expression: Expression = makeAbstractSyntaxTree(parseTree);
    // console.log("abstract syntax tree:\n" + expression);
    
    return expression;
}
    
/**
 * Convert a parse tree into an abstract syntax tree.
 * 
 * @param parseTree constructed according to the grammar for image meme expressions
 * @returns abstract syntax tree corresponding to the parseTree
 */
function makeAbstractSyntaxTree(parseTree: ParseTree<ExpressionGrammar>): Expression {
    if (parseTree.name === ExpressionGrammar.Expression) {
        // expression ::= hglue (topToBottomOperator hglue)*;
        const children = parseTree.children;
        let expression = makeAbstractSyntaxTree(children[0] ?? assert.fail("missing child"));
        for (let i = 1; i < children.length; i += 2) {
            expression = new TopGlue(expression, makeAbstractSyntaxTree(children[i+1] ?? assert.fail("missing child")));
        }
        return expression;

    } else if (parseTree.name === ExpressionGrammar.SideGlue) {
        // hglue ::= resize ('|' resize)*;
        const children = parseTree.children;
        const subexprs = children.map(makeAbstractSyntaxTree);
        const expression : Expression = subexprs.reduce((result, subexpr) => new SideGlue(result, subexpr));
        return expression;
    } else if (parseTree.name === ExpressionGrammar.BottomOverlay) {
        const children = parseTree.children;
        const subexprs = children.map(makeAbstractSyntaxTree);
        const expression : Expression = subexprs.reduce((result, subexpr) => new BottomOverlay(result, subexpr));
        return expression;
    } else if (parseTree.name === ExpressionGrammar.TopOverlay) {
        const children = parseTree.children;
        const subexprs = children.map(makeAbstractSyntaxTree);
        const expression : Expression = subexprs.reduce((result, subexpr) => new TopOverlay(result, subexpr));
        return expression;
    } else if (parseTree.name === ExpressionGrammar.Resize) {
        // resize ::= primitive ('@' number 'x' number)*;
        const children = parseTree.children;
        const child = (children[0] ?? assert.fail("missing child"));
        let expression = makeAbstractSyntaxTree(child);

        for (let i = 1; i < children.length; i += 2) {
            const width = children[i]?.text ?? assert.fail("missing width");
            const height = children[i+1]?.text ?? assert.fail("missing height");

            if(width === '?' && height !== '?') {
                expression = new Resize(expression, '?', parseInt(height));
            } else if (height == '?' && width != '?') {
                expression = new Resize(expression, parseInt(width), '?');
            } else if (width == '?' && height == '?') {
                throw(new Error("Cannot resize to unknown width and height"));
            } else {
                expression = new Resize(expression, parseInt(width), parseInt(height));

            }
        }
        return expression;

    } else if (parseTree.name === ExpressionGrammar.Primitive) {
        // primitive ::= filename | '(' expression ')';
        return makeAbstractSyntaxTree(parseTree.children[0] ?? assert.fail("missing child"));
    } else if (parseTree.name === ExpressionGrammar.Filename) {
        // filename ::= [A-Za-z0-9./][A-Za-z0-9./_-]*;
        return new File(parseTree.text);
    } else if (parseTree.name === ExpressionGrammar.Caption)  {
        // caption ::= [^\\n"]+;
        return new Caption(parseTree.text);
    } else {
        assert.fail(`cannot make AST for ${ExpressionGrammar[parseTree.name]} node`);
    }
}
