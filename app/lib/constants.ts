import { FontDefinition } from './types';

export const FONT_LIST: FontDefinition[] = [
  {
    name: 'Noto Sans TC',
    family: '"Noto Sans TC", sans-serif',
    category: 'sans-serif',
    tags: ['tc'],
    description: 'Universal, clean sans-serif for Traditional Chinese.',
  },
  {
    name: 'Noto Serif TC',
    family: '"Noto Serif TC", serif',
    category: 'serif',
    tags: ['tc'],
    description: 'Elegant serif specifically for Traditional Chinese.',
  },
  {
    name: 'Noto Sans SC',
    family: '"Noto Sans SC", sans-serif',
    category: 'sans-serif',
    tags: ['sc'],
    description: 'Universal, clean sans-serif for Simplified Chinese.',
  },
  {
    name: 'Noto Serif SC',
    family: '"Noto Serif SC", serif',
    category: 'serif',
    tags: ['sc'],
    description: 'Elegant serif specifically for Simplified Chinese.',
  },
  {
    name: 'Ma Shan Zheng',
    family: '"Ma Shan Zheng", cursive',
    category: 'handwriting',
    tags: ['sc', 'tc'], // Supports a good range of TC but primary SC
    description: 'Calligraphic style with brush strokes.',
  },
  {
    name: 'ZCOOL KuaiLe',
    family: '"ZCOOL KuaiLe", sans-serif',
    category: 'display',
    tags: ['sc'],
    description: 'Playful, thick strokes, great for headlines.',
  },
  {
    name: 'ZCOOL XiaoWei',
    family: '"ZCOOL XiaoWei", serif',
    category: 'serif',
    tags: ['sc'],
    description: 'Delicate and somewhat ancient feel.',
  },
  {
    name: 'ZCOOL QingKe HuangYou',
    family: '"ZCOOL QingKe HuangYou", sans-serif',
    category: 'display',
    tags: ['sc'],
    description: 'Geometric and modern display font.',
  },
  {
    name: 'Long Cang',
    family: '"Long Cang", cursive',
    category: 'handwriting',
    tags: ['sc'],
    description: 'Free-flowing cursive script.',
  },
  {
    name: 'Zhi Mang Xing',
    family: '"Zhi Mang Xing", cursive',
    category: 'handwriting',
    tags: ['sc'],
    description: 'Expressive brush calligraphy.',
  },
  {
    name: 'Liu Jian Mao Cao',
    family: '"Liu Jian Mao Cao", cursive',
    category: 'handwriting',
    tags: ['sc'],
    description: 'Wild cursive style.',
  },
];

export const SAMPLE_TEXTS = {
  tc: '信念、想法、思想很強的人，即使心情很糟、內心受傷，也還是會朝著目的奔跑。',
};
