/* Copyright (c) 2021-2024 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

import assert from 'node:assert';
import { parseExpression } from './expressionparser.js';
import { Canvas, Image, type ImageLibrary } from './imagelibrary.js';

/**
 * An immutable data type representing an image meme expression, as defined in the PS3 handout.
 * 
 * PS3 instructions: this is a required ADT interface.
 * You MUST NOT change its name or the names or type signatures of existing methods or functions.
 * You may, however, add additional methods or classes, or strengthen the specs of existing methods.
 */
export interface Expression {

    // Data type definition: in expression-impls.ts
    
    /**
     * @returns a parsable representation of this expression, such that
     *          for all expr: Expression, expr.equalValue(parse(expr.toString()))
     */
    toString(): string;
    
    /**
     * @param that any Expression
     * @returns true if and only if this and that are structurally-equal Expressions,
     *          as defined in the PS3 handout, where different groupings with the same 
     *          image order are not considered equal.
     */
    equalValue(that: Expression): boolean;

    /**
     * @param library the library of named image files
     * @returns size of the image
     */
    size(library: ImageLibrary) : {width: number, height: number};

    /**
     * @param library the library of named image files
     * @returns canvas of the image represented by this expression
     */
    image(library: ImageLibrary): Canvas;
        
}

/**
 * Parse an expression.
 * 
 * @param input expression to parse, as defined in the PS3 handout
 * @returns expression AST for the input
 * @throws Error if the expression is syntactically invalid
 */
export function parse(input: string): Expression {
    // implement with glue code only, at most three lines
    return parseExpression(input);
}
