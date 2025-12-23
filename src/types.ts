export interface FontDefinition {
  name: string;
  family: string;
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting';
  tags: ('tc' | 'sc' | 'en' | 'ja' | 'ko')[];
  description?: string;
  isCustom?: boolean;
}

export enum DetectedLanguage {
  TC = 'Traditional Chinese',
  SC = 'Simplified Chinese',
  JA = 'Japanese',
  KO = 'Korean',
  EN = 'English',
  UNKNOWN = 'Unknown/Mixed',
}
