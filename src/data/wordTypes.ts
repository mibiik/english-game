export type WordType = 'noun' | 'verb' | 'adjective' | 'adverb';

export interface WordForm {
  type: WordType;
  form: string;
}

export interface WordEntry {
  base: string;
  forms: WordForm[];
}

export interface WordTypeWithTurkish {
  type: WordType;
  turkish: string;
}

export const wordForms: WordEntry[] = [
  {
    base: 'accurate',
    forms: [
      { type: 'noun', form: 'accuracy' },
      { type: 'adjective', form: 'accurate' }
    ]
  },
  {
    base: 'appreciate',
    forms: [
      { type: 'verb', form: 'appreciate' },
      { type: 'noun', form: 'appreciation' }
    ]
  },
  {
    base: 'harm',
    forms: [
      { type: 'verb', form: 'harm' },
      { type: 'noun', form: 'harm' },
      { type: 'adjective', form: 'harmful' }
    ]
  },
  {
    base: 'demonstrate',
    forms: [
      { type: 'verb', form: 'demonstrate' },
      { type: 'noun', form: 'demonstration' }
    ]
  },
  {
    base: 'enhance',
    forms: [
      { type: 'verb', form: 'enhance' },
      { type: 'noun', form: 'enhancement' }
    ]
  },
  {
    base: 'function',
    forms: [
      { type: 'verb', form: 'function' },
      { type: 'noun', form: 'function' },
      { type: 'adjective', form: 'functional' }
    ]
  },
  {
    base: 'generate',
    forms: [
      { type: 'verb', form: 'generate' },
      { type: 'noun', form: 'generation' }
    ]
  },
  {
    base: 'innovate',
    forms: [
      { type: 'verb', form: 'innovate' },
      { type: 'noun', form: 'innovation' },
      { type: 'adjective', form: 'innovative' }
    ]
  },
  {
    base: 'value',
    forms: [
      { type: 'verb', form: 'value' },
      { type: 'noun', form: 'value' },
      { type: 'adjective', form: 'valuable' }
    ]
  },
  {
    base: 'volunteer',
    forms: [
      { type: 'verb', form: 'volunteer' },
      { type: 'noun', form: 'volunteer' },
      { type: 'adjective', form: 'voluntary' }
    ]
  }
] as const;

export const wordTypesWithTurkish: { [key: string]: WordTypeWithTurkish[] } = {
  'accurate': [
    { type: 'adjective', turkish: 'doğru' },
    { type: 'adverb', turkish: 'doğru bir şekilde' }
  ],
  'appreciate': [
    { type: 'verb', turkish: 'takdir etmek' }
  ],
  'harm': [
    { type: 'noun', turkish: 'zarar' },
    { type: 'verb', turkish: 'zarar vermek' }
  ],
  'enhance': [
    { type: 'verb', turkish: 'geliştirmek' }
  ],
  'functional': [
    { type: 'adjective', turkish: 'işlevsel' }
  ],
  'generate': [
    { type: 'verb', turkish: 'oluşturmak' }
  ],
  'imitate': [
    { type: 'verb', turkish: 'taklit etmek' }
  ],
  'innovative': [
    { type: 'adjective', turkish: 'yenilikçi' }
  ],
  'permanent': [
    { type: 'adjective', turkish: 'kalıcı' }
  ],
  'survive': [
    { type: 'verb', turkish: 'hayatta kalmak' }
  ],
  'volunteer': [
    { type: 'noun', turkish: 'gönüllü' },
    { type: 'verb', turkish: 'gönüllü olmak' }
  ],
  'alter': [
    { type: 'verb', turkish: 'değiştirmek' }
  ],
  'classic': [
    { type: 'adjective', turkish: 'klasik' },
    { type: 'noun', turkish: 'klasik eser' }
  ],
  'complicated': [
    { type: 'adjective', turkish: 'karmaşık' }
  ],
  'consistent': [
    { type: 'adjective', turkish: 'tutarlı' }
  ],
  'definite': [
    { type: 'adjective', turkish: 'belirli' }
  ],
  'eventual': [
    { type: 'adjective', turkish: 'nihai' }
  ],
  'extract': [
    { type: 'verb', turkish: 'çıkarmak' },
    { type: 'noun', turkish: 'özet' }
  ]
} as const; 