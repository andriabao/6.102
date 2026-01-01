/* Copyright (c) 2021-2024 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */

/** Implementation of Expression. @module */

import assert from 'node:assert';
import { Expression } from './expression.js';
import { Canvas, Image, createCanvas, type ImageLibrary } from './imagelibrary.js';

/*
 * PS3 instructions: implement Expression in this file.
 */

// Data type definition
//   Expression = File(filename:string)
//                + Resize(expr: Expression, width: number, height: number)
//                + SideGlue(left: Expression, right: Expression)
//                + TopGlue(top: Expression, bottom: Expression)
//                + BottomOverlay(original: Expression, overlay: Expression)
//                + TopOverlay(original: Expression, overlay: Expression)
//                + Caption(caption: string)                
//

export class File implements Expression {

    // Abstraction function
    //      AF(filename) = an image file loaded from the filename
    // Rep invariant
    //      true
    // Safety from rep exposure
    //      all methods return immutable copies of objects

    public constructor(public readonly filename: string) {}

    /**
     * @returns a string of the form (filename), where filename is the name of the image file
     *          e.g. (boromir.jpg)
     */
    public toString(): string {
        return `(${this.filename})`;
    }

    /**
     * @inheritdoc
     */
    public equalValue(that: Expression): boolean {
        return that instanceof File && this.filename === that.filename;
    }

    /**
     * @inheritdoc
     */
    public size(library : ImageLibrary): { width: number; height: number } {
        const image = library.getImage(this.filename);
        return { width: image.width, height: image.height};
    }

    /**
     * @inheritdoc
     */
    public image(library: ImageLibrary): Canvas {
        const image = library.getImage(this.filename);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);
        return canvas;
    }
}

/**
 * 
 * @param str a string representing a single line of text (newlines in the string are ignored)
 * @returns a canvas that renders the string as text using the default system font,
 *          cropped as tightly around the text as possible
 */
function convertStringToImage(str: string): Canvas {
    const font = '20pt bold';

    // make a tiny 1x1 image at first so that we can get a Graphics object, 
    // which we need to compute the width and height of the text
    const measuringContext = createCanvas(1, 1).getContext('2d');
    measuringContext.font = font;
    const fontMetrics = measuringContext.measureText(str);
    // console.log('metrics', fontMetrics); // dimensions of text

    // now make a canvas sized to fit the text
    const canvas = createCanvas(fontMetrics.width, fontMetrics.actualBoundingBoxAscent + fontMetrics.actualBoundingBoxDescent);
    const context = canvas.getContext('2d');

    context.font = font;
    context.fillStyle = 'black';
    context.fillText(str, 0, fontMetrics.actualBoundingBoxAscent);

    context.strokeStyle = 'black';
    context.strokeText(str, 0, fontMetrics.actualBoundingBoxAscent);

    return canvas;
}

export class Caption implements Expression {

    // Abstraction function
    //      AF(caption) = an image file loaded from the caption
    // Rep invariant
    //      true
    // Safety from rep exposure
    //      all methods return immutable copies of objects

    public constructor(public readonly caption: string) {}

    /**
     * @returns the caption as a string in double quotes
     */
    public toString(): string {
        return `"${this.caption}"`;
    }

    /**
     * @inheritdoc
     */
    public equalValue(that: Expression): boolean {
        return that instanceof Caption && this.caption === that.caption;
    }

    /**
     * @inheritdoc
     */
    public size(_ : ImageLibrary): { width: number; height: number } {
        const image = convertStringToImage(this.caption);
        return { width: image.width, height: image.height};
    }

    /**
     * @inheritdoc
     */
    public image(_: ImageLibrary): Canvas {
        const image = convertStringToImage(this.caption);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);
        return canvas;
    }


}

export class SideGlue implements Expression {

    // Abstraction function
    //      AF(left, right) = an image file loaded from the left and right images glued together,
    //                        with the left image on the left and the right image on the right, centered vertically
    // Rep invariant
    //      true
    // Safety from rep exposure
    //      all methods return immutable copies of objects

    public constructor(public readonly left: Expression, public readonly right: Expression) {

    }

    /**
     * @returns a string of the filenames glued side by side separated by a pipe character, all within parentheses
     *          e.g. (boromir.jpg|tech1.png)
     */
    public toString(): string {
        return `(${this.left.toString()}|${this.right.toString()})`;
    }

    /**
     * @inheritdoc
     */
    public equalValue(that: Expression): boolean {
        return that instanceof SideGlue && this.left.equalValue(that.left) && this.right.equalValue(that.right);
    }

    /**
     * @inheritdoc
     */
    public size(library : ImageLibrary): { width: number; height: number } {
        const leftSize = this.left.size(library);
        const rightSize = this.right.size(library);
        return { width: leftSize.width + rightSize.width, height: Math.max(leftSize.height, rightSize.height) };
    }

    /**
     * @inheritdoc
     */
    public image(library: ImageLibrary): Canvas {
        const leftCanvas = this.left.image(library);
        const rightCanvas = this.right.image(library);
        const canvas = createCanvas(this.size(library).width, this.size(library).height);
        const ctx = canvas.getContext('2d');

        //center smaller image next to larger image
        ctx.drawImage(leftCanvas, 0, Math.max((canvas.height-leftCanvas.height)/2, 0), leftCanvas.width, leftCanvas.height);
        ctx.drawImage(rightCanvas, leftCanvas.width, Math.max((canvas.height-rightCanvas.height)/2, 0), rightCanvas.width, rightCanvas.height);
        return canvas;
    }
}

export type Unknown = '?';

export class Resize implements Expression {

    // Abstraction function
    //      AF(exp, width, height) = an image file loaded from the exp image resized to width and height
    // Rep invariant
    //      width and height are positive integers or '?', width and height are not both '?'
    // Safety from rep exposure
    //      all methods return immutable copies of objects

    public constructor(public readonly expr: Expression, public readonly width: number | Unknown, public readonly height: number | Unknown) { }

    /**
     * @returns a string of the form (expr@widthxheight)
     *          e.g. (boromir.jpg@2x2)
     */
    public toString(): string {
        return `(${this.expr.toString()}@${this.width}x${this.height})`;
    }

    /**
     * @inheritdoc
     */
    public equalValue(that: Expression): boolean {
        return that instanceof Resize && this.expr.equalValue(that.expr) && this.width === that.width && this.height === that.height;
    }

    /**
     * @inheritdoc
     */
    public size(library : ImageLibrary): { width: number; height: number } {
        if (this.width === '?' && this.height !== '?') {
            const scaleRatio = this.height / this.expr.size(library).height;
            return {width : Math.round(this.expr.size(library).width * scaleRatio), height : this.height};
        } else if (this.width !== '?' && this.height === '?') {
            const scaleRatio = this.width / this.expr.size(library).width;
            return {width : this.width, height : Math.round(this.expr.size(library).height * scaleRatio)};
        } else if(this.width !== '?' && this.height !== '?') {
            return {width: this.width, height: this.height};
        } else {
            throw new Error('Cannot resize to unknown dimensions');
        }
    }

    /**
     * @inheritdoc
     */
    public image(library: ImageLibrary): Canvas {
        const exprCanvas = this.expr.image(library);
        const width = this.size(library).width;
        const height = this.size(library).height;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(exprCanvas, 0, 0, exprCanvas.width, exprCanvas.height, 0, 0, width, height);
        return canvas;
    }

}



export class TopGlue implements Expression {

    // Abstraction function
    //      AF(left, right) = an image file loaded from the top and bottom images glued together,
    //                        with the top image on top and the bottom image on bottom, centered horizontally
    // Rep invariant
    //      true
    // Safety from rep exposure
    //      all methods return immutable copies of objects

    public constructor(public readonly top: Expression, public readonly bottom: Expression) {}

    /**
     * @returns a string of the filenames glued top to bottom separated by a --- character, all within parentheses
     *          e.g. (boromir.jpg---tech1.png)
     */
    public toString(): string {
        return `(${this.top.toString()}---${this.bottom.toString()})`;
    }

    /**
     * @inheritdoc
     */
    public equalValue(that: Expression): boolean {
        return that instanceof TopGlue && this.top.equalValue(that.top) && this.bottom.equalValue(that.bottom);
    }

    /**
     * @inheritdoc
     */
    public size(library : ImageLibrary): { width: number; height: number } {
        const topSize = this.top.size(library);
        const bottomSize = this.bottom.size(library);
        return { width: Math.max(topSize.width, bottomSize.width), height: topSize.height + bottomSize.height };
    }

    /**
     * @inheritdoc
     */
    public image(library: ImageLibrary): Canvas {
        const topCanvas = this.top.image(library);
        const bottomCanvas = this.bottom.image(library);
        const canvas = createCanvas(this.size(library).width, this.size(library).height);
        const ctx = canvas.getContext('2d');

        //center smaller image next to larger image
        ctx.drawImage(topCanvas, Math.max(0, (canvas.width-topCanvas.width)/2), 0, topCanvas.width, topCanvas.height);
        ctx.drawImage(bottomCanvas, Math.max(0, (canvas.width-bottomCanvas.width)/2), topCanvas.height, bottomCanvas.width, bottomCanvas.height);

        return canvas;
    }
}

export class BottomOverlay implements Expression {

    // Abstraction function
    //      AF(original, overlay) = an image file loaded from the original image, with overlay on top of it, aligned to the bottom and centered
    // Rep invariant
    //      true
    // Safety from rep exposure
    //      all methods return immutable copies of objects

    public constructor(public readonly original: Expression, public readonly overlay: Expression) {}

    /**
     * @returns a string of the form (original_overlay), where original is the original image and overlay is the overlay image
     *          e.g. (boromir.jpg_tech1.png)
     */
    public toString(): string {
        return `(${this.original.toString()}_${this.overlay.toString()})`;
    }

    /**
     * @inheritdoc
     */
    public equalValue(that: Expression): boolean {
        return that instanceof BottomOverlay && this.original.equalValue(that.original) && this.overlay.equalValue(that.overlay);
    }

    /**
     * @inheritdoc
     */
    public size(library : ImageLibrary): { width: number; height: number } {
        const originalSize = this.original.size(library);
        const overlaySize = this.overlay.size(library);
        return { width: Math.max(originalSize.width, overlaySize.width), height: Math.max(originalSize.height, overlaySize.height) };
    }

    /**
     * @inheritdoc
     */
    public image(library: ImageLibrary): Canvas {
        const originalCanvas = this.original.image(library);
        const overlayCanvas = this.overlay.image(library);
        const canvas = createCanvas(this.size(library).width, this.size(library).height);
        const ctx = canvas.getContext('2d');

        //draw overlay centered over original and aligned to the bottom
        const x = (canvas.width - overlayCanvas.width) / 2;
        const y = canvas.height - overlayCanvas.height;
        ctx.drawImage(originalCanvas, 0, 0, originalCanvas.width, originalCanvas.height);
        ctx.drawImage(overlayCanvas, x, y, overlayCanvas.width, overlayCanvas.height);
        return canvas;
    }

}

export class TopOverlay implements Expression {

    // Abstraction function
    //      AF(original, overlay) = an image file loaded from the original image, with overlay on top of it, aligned to the top and centered
    // Rep invariant
    //      true
    // Safety from rep exposure
    //      all methods return immutable copies of objects

    public constructor(public readonly original: Expression, public readonly overlay: Expression) {}

    /**
     * @returns a string of the form (original^overlay), where original is the original image and overlay is the overlay image
     *          e.g. (boromir.jpg^tech1.png)
     */
    public toString(): string {
        return `(${this.original.toString()}^${this.overlay.toString()})`;
    }

    /**
     * @inheritdoc
     */
    public equalValue(that: Expression): boolean {
        return that instanceof TopOverlay && this.original.equalValue(that.original) && this.overlay.equalValue(that.overlay);
    }

    /**
     * @inheritdoc
     */
    public size(library : ImageLibrary): { width: number; height: number } {
        const originalSize = this.original.size(library);
        const overlaySize = this.overlay.size(library);
        return { width: Math.max(originalSize.width, overlaySize.width), height: Math.max(originalSize.height, overlaySize.height) };
    }

    /**
     * @inheritdoc
     */
    public image(library: ImageLibrary): Canvas {
        const originalCanvas = this.original.image(library);
        const overlayCanvas = this.overlay.image(library);
        const canvas = createCanvas(this.size(library).width, this.size(library).height);
        const ctx = canvas.getContext('2d');

        //draw overlay centered over original and aligned to the top
        const x = (canvas.width - overlayCanvas.width) / 2;
        ctx.drawImage(originalCanvas, 0, 0, originalCanvas.width, originalCanvas.height);
        ctx.drawImage(overlayCanvas, x, 0, overlayCanvas.width, overlayCanvas.height);
        return canvas;
    }

}