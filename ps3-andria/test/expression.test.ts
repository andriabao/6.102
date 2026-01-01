/* Copyright (c) 2021-2024 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

import assert from 'assert';
import * as parserlib from 'parserlib';
import { Canvas, Image, createCanvas, ImageLibrary } from '../src/imagelibrary.js';
import { Expression, parse } from '../src/expression.js';
import { File, SideGlue, Resize } from '../src/expression-impls.js';

const library = new ImageLibrary('img',
    'boromir.jpg',
    'tech1.png', 'tech2.png', 'tech3.png', 'tech4.png', 'tech5.png', 'tech6.png',
    'blue.png', 'red.png', 'black.png', 'white.png',
    // if you depend on additional images in your tests, add them here
    // keep image files small to ensure Didit can build your repo
);

/**
 * Tests for the Expression abstract data type.
 */
 describe('Expression', function () {

    // testing strategy for each operation of Expression:
    //
    // constructor, toString, equalValue, size, image:
    //   partition on primitives in expression: only file, caption and file
    //   partition on operations: no operations, one of |, @, ^, _, ---, multiple identical operations, multiple different operations

    it('parserlib needs to be version 4.0.x', function() {
        assert(parserlib.VERSION.startsWith("4.0"));
    });

    it('no operations', function() {
        const expr = parse('boromir.jpg');
        assert(expr.toString() === '(boromir.jpg)');
        assert(expr.equalValue(parse('boromir.jpg')));
        assert(expr.size(library).width === library.getImage('boromir.jpg').width);
        assert(expr.size(library).height === library.getImage('boromir.jpg').height);
        const canvas = expr.image(library);
        assert(canvas.height === library.getImage('boromir.jpg').height);
        assert(canvas.width === library.getImage('boromir.jpg').width);
    });

    it('file with caption', function() {
        const expr = parse('tech6.png _ ("all your base"---"are belong to us")');
        assert(expr.toString() === '((tech6.png)_("all your base"---"are belong to us"))');
        assert(expr.size(library).width === 200);
        assert(expr.size(library).height === 160);
    });

    it('single operation', function() {
        const expr = parse('tech3.png ^ "title"');
        assert(expr.toString() === '((tech3.png)^"title")');
        assert(expr.equalValue(parse('tech3.png^"title"')));
        assert(!expr.equalValue(parse('"title" ^ tech3.png')));
        assert(expr.equalValue(parse('(tech3.png) ^ ("title")')));

        assert(expr.size(library).width === 200);
        assert(expr.size(library).height === 150);
        const canvas = expr.image(library);
        assert(canvas.height === 150);
        assert(canvas.width === 200);
    });

    it('multiple resizes', function() {
        const expr = parse('tech1.png @99x101@    ? x150 @93x?');
        assert(expr.toString() === '((((tech1.png)@99x101)@?x150)@93x?)');
        assert(expr.equalValue(parse('((((tech1.png)@99x101)@?x150)@93x?)')));
        assert(expr.size(library).width === 93);
        assert(expr.size(library).height === 95);
        const canvas = expr.image(library);
        assert(canvas.height === 95);
        assert(canvas.width === 93);
    });

    it('multiple operations', function() {
        const expr = parse('black.png@600x50 ^ "TECH SUPPORT"@?x50 ---------------------------------- tech1.png | tech2.png@200x150 | tech3.png ---------------------------------- (  black.png@200x25 ^ "What my friends think I do"@?x15  | black.png@200x25 ^ "What my mom thinks I do"@?x15  | black.png@200x25 ^ "What society thinks I do"@?x15   ) ---------------------------------- black.png@600x25 ---------------------------------- tech4.png | tech5.png@200x160 | tech6.png ---------------------------------- (  black.png@200x25 ^ "What my boss thinks I do"@?x15   | black.png@200x25 ^ "What I think I do"@?x15  | black.png@200x25 ^ "What I actually do"@?x15       ) ---------------------------------- black.png@600x25');
        assert(expr.toString() === '(((((((((black.png)@600x50)^("TECH SUPPORT"@?x50))---(((tech1.png)|((tech2.png)@200x150))|(tech3.png)))---(((((black.png)@200x25)^("What my friends think I do"@?x15))|(((black.png)@200x25)^("What my mom thinks I do"@?x15)))|(((black.png)@200x25)^("What society thinks I do"@?x15))))---((black.png)@600x25))---(((tech4.png)|((tech5.png)@200x160))|(tech6.png)))---(((((black.png)@200x25)^("What my boss thinks I do"@?x15))|(((black.png)@200x25)^("What I think I do"@?x15)))|(((black.png)@200x25)^("What I actually do"@?x15))))---((black.png)@600x25))');
        assert(expr.equalValue(parse('(black.png@600x50 ^ "TECH SUPPORT"@?x50 ---------------------------------- tech1.png | tech2.png@200x150 | tech3.png ---------------------------------- (  black.png@200x25 ^ "What my friends think I do"@?x15  | black.png@200x25 ^ "What my mom thinks I do"@?x15  | black.png@200x25 ^ "What society thinks I do"@?x15   ) ---------------------------------- black.png@600x25 ---------------------------------- tech4.png | tech5.png@200x160 | tech6.png ---------------------------------- (  black.png@200x25 ^ "What my boss thinks I do"@?x15   | black.png@200x25 ^ "What I think I do"@?x15  | black.png@200x25 ^ "What I actually do"@?x15       ) ---------------------------------- black.png@600x25)')));
        assert(expr.size(library).width === 600);
        assert(expr.size(library).height === 460);
        const canvas = expr.image(library);
        assert(canvas.height === 460);
        assert(canvas.width === 600);
    });

    it('multiple identical operations', function() {
        const expr = parse('tech1.png | tech2.png | tech3.png');
        assert(expr.toString() === '(((tech1.png)|(tech2.png))|(tech3.png))');
        assert(expr.equalValue(parse('((tech1.png | tech2.png | tech3.png))')));
        assert(!expr.equalValue(parse('tech1.png |(tech2.png | tech3.png)')));
        assert(expr.size(library).width === 600);
        assert(expr.size(library).height === 150);
        const canvas = expr.image(library);
        assert(canvas.height === 150);
        assert(canvas.width === 600);

    });
    
});
