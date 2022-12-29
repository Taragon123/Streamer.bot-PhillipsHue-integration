const colours = require('./colours.json');

export function parseHexColour(hex_raw: string): RBGAColour {
    const input_colour = hex_raw.toString().toLowerCase().replace('#','').replace('0x', '');;

    const hex6 = /^[0-9A-Fa-f]{6}$/g;
    const hex8 = /^[0-9A-Fa-f]{8}$/g;
    if (!(input_colour.match(hex6) || input_colour.match(hex8))) {
        const key_colour = colours[input_colour];
        if (key_colour == undefined) {
            throw `Invalid colour input: '${hex_raw}'. Must be hex: RRGGBB or RRGGBBAA, or use a common colour name`;
        } else {
            console.log(key_colour)
            return parseHexColour(key_colour)
        }
    }

    

    const r: number =  parseInt(input_colour.slice(0,2),16);
    const g: number =  parseInt(input_colour.slice(2,4),16);
    const b: number =  parseInt(input_colour.slice(4,6),16);
    const a: number =  parseInt(input_colour.slice(6,8),16);

    return new RBGAColour(r,g,b, isNaN(a) ? 1 : a);
}

export class RBGAColour {
    R: number;
    G: number;
    B: number;
    A: number;

    constructor(R: number ,G: number, B: number, A = 1) {
        this.R = R > 1 ? parseFloat((R / 255).toFixed(3)) : R;
        this.G = G > 1 ? parseFloat((G / 255).toFixed(3)) : G;
        this.B = B > 1 ? parseFloat((B / 255).toFixed(3)) : B;
        this.A = A > 1 ? parseFloat((A / 255).toFixed(3)) : A;
    }

    xyl(): XYLColour {
        const r = (this.R > 0.04045) ? (this.R + 0.055) / (1.0 + 0.055) ** 2.4 : (this.R / 12.92);
        const g = (this.G > 0.04045) ? (this.G + 0.055) / (1.0 + 0.055) ** 2.4 : (this.G / 12.92);
        const b = (this.B > 0.04045) ? (this.B + 0.055) / (1.0 + 0.055) ** 2.4 : (this.B / 12.92);

        const X = r * 0.649926 + g * 0.103455 + b * 0.197109;
        const Y = r * 0.234327 + g * 0.743075 + b * 0.022598;
        const Z = r * 0.0000000 + g * 0.053077 + b * 1.035763;

        let x;
        let y;
        if ((X + Y + Z) > 0 ) {
            x = parseFloat((X / (X + Y + Z)).toFixed(4));
            y = parseFloat((Y / (X + Y + Z)).toFixed(4));
        } else {
            return parseHexColour('5D0CED').xyl();
        }

        return new XYLColour(x, y, this.A);
    }

    toString(): string {
        return `R: ${this.R}, B: ${this.B}, G: ${this.G}, A: ${this.A}`;
    }
}

export class XYLColour {
    X: number;
    Y: number;
    L: number;
    
    constructor(X: number, Y: number, L=1) {
        this.X = X;
        this.Y = Y;
        this.L = parseFloat((L * 100).toFixed(4));
    }

    toString(): string {
        return `(X: ${this.X}, Y: ${this.Y}) L: ${this.L}`;
    }
}

