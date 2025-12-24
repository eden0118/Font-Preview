declare module 'opentype.js' {
  export interface Font {
    names: {
      postScriptName?: { en: string };
      fontFamily?: { en: string };
      fontSubfamily?: { en: string };
    };
    glyphs: {
      length: number;
    };
    numMetrics?: number;
  }

  export interface GlyphSet {
    get(glyphId: number): Glyph;
  }

  export interface Glyph {
    unicode?: number;
  }

  export function parse(buffer: ArrayBuffer): Font;
  export function load(url: string, callback: (err: Error | null, font?: Font) => void): void;
}
