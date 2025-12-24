declare module 'opentype.js' {
  export function parse(buffer: ArrayBuffer): any;
  export interface Font {
    names: {
      fontFamily?: { en?: string };
      [key: string]: any;
    };
    glyphs: any;
    charToGlyphIndex(char: string): number;
    [key: string]: any;
  }
}
