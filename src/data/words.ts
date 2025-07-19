export interface WordDetail {
  headword: string;
  turkish: string;
  unit: string;
  section: string;
  forms: {
    verb: string[];
    noun: string[];
    adjective: string[];
    adverb: string[];
  };
  collocations: string[];
}

export const newDetailedWords_part1: WordDetail[] = [
  // =================================================================
  // UNIT 1: READING & WRITING
  // =================================================================
  {
    headword: 'accurate',
    turkish: 'doğru',
    unit: '1',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['accuracy'],
      adjective: ['accurate', 'inaccurate'],
      adverb: ['accurately', 'inaccurately'],
    },
    collocations: [
      'absolute/complete accuracy',
      'to be very/extremely/highly (in)accurate',
    ],
  },
  {
    headword: 'appreciation',
    turkish: 'takdir',
    unit: '1',
    section: 'Reading & Writing',
    forms: {
      verb: ['appreciate'],
      noun: ['appreciation'],
      adjective: ['appreciative'],
      adverb: [],
    },
    collocations: [
      'to appreciate sth',
      'to have/show/develop/express appreciation',
      'deep/great/real appreciation',
      'a lack of appreciation',
    ],
  },
  {
    headword: 'combination',
    turkish: 'kombinasyon',
    unit: '1',
    section: 'Reading & Writing',
    forms: {
      verb: ['combine'],
      noun: ['combination'],
      adjective: [],
      adverb: [],
    },
    collocations: ['a combination of sth', 'in combination with'],
  },
  {
    headword: 'contemporary',
    turkish: 'çağdaş',
    unit: '1',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: [],
      adjective: ['contemporary'],
      adverb: ['contemporarily'],
    },
    collocations: [
      'a contemporary design/painting/painter/artist',
      'contemporary poetry/music/dance/fiction',
    ],
  },
  {
    headword: 'demonstrate',
    turkish: 'göstermek',
    unit: '1',
    section: 'Reading & Writing',
    forms: {
      verb: ['demonstrate'],
      noun: ['demonstration', 'demonstrator'],
      adjective: ['demonstrative'],
      adverb: [],
    },
    collocations: ['to demonstrate sth to sb', 'to demonstrate against/for sth'],
  },
  {
    headword: 'enhance',
    turkish: 'geliştirmek',
    unit: '1',
    section: 'Reading & Writing',
    forms: {
      verb: ['enhance'],
      noun: ['enhancement'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to enhance sth', 'to enhance reputation/satisfaction/quality'],
  },
  {
    headword: 'entire',
    turkish: 'bütün',
    unit: '1',
    section: 'Reading & Writing',
    forms: { verb: [], noun: [], adjective: ['entire'], adverb: ['entirely'] },
    collocations: ['the entire day/week/book', 'to be entirely different'],
  },
  {
    headword: 'functional',
    turkish: 'işlevsel',
    unit: '1',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['function', 'functionality'],
      adjective: ['functional'],
      adverb: ['functionally'],
    },
    collocations: ['a function of sth', 'to fulfil/perform a function'],
  },
  {
    headword: 'notion',
    turkish: 'kavram',
    unit: '1',
    section: 'Reading & Writing',
    forms: { verb: [], noun: ['notion'], adjective: [], adverb: [] },
    collocations: ['notion of', 'a common/popular notion'],
  },
  {
    headword: 'generate',
    turkish: 'oluşturmak',
    unit: '1',
    section: 'Reading & Writing',
    forms: {
      verb: ['generate'],
      noun: ['generation', 'generator'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to generate electricity', 'to generate profits/ideas/excitement'],
  },
  {
    headword: 'harm',
    turkish: 'zarar',
    unit: '1',
    section: 'Reading & Writing',
    forms: { verb: ['harm'], noun: ['harm'], adjective: ['harmful', 'harmless'], adverb: [] },
    collocations: ['to cause/do harm', 'no harm done', 'out of harm\'s way'],
  },
  {
    headword: 'imitate',
    turkish: 'taklit etmek',
    unit: '1',
    section: 'Reading & Writing',
    forms: {
      verb: ['imitate'],
      noun: ['imitation', 'imitator'],
      adjective: ['imitative'],
      adverb: [],
    },
    collocations: ['to imitate someone\'s voice/style'],
  },
  {
    headword: 'incident',
    turkish: 'olay',
    unit: '1',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['incident', 'incidence'],
      adjective: ['incidental'],
      adverb: [],
    },
    collocations: [
      'a serious/major/small/minor incident',
      'to deal with/handle an incident',
    ],
  },
  {
    headword: 'inherit',
    turkish: 'miras almak',
    unit: '1',
    section: 'Reading & Writing',
    forms: {
      verb: ['inherit'],
      noun: ['inheritance'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to inherit money/property from sb', 'to inherit a trait'],
  },
  {
    headword: 'innovative',
    turkish: 'yenilikçi',
    unit: '1',
    section: 'Reading & Writing',
    forms: {
      verb: ['innovate'],
      noun: ['innovation'],
      adjective: ['innovative'],
      adverb: [],
    },
    collocations: ['an innovative approach/idea/solution'],
  },
  {
    headword: 'overseas',
    turkish: 'denizaşırı',
    unit: '1',
    section: 'Reading & Writing',
    forms: { verb: [], noun: [], adjective: ['overseas'], adverb: ['overseas'] },
    collocations: ['overseas student/travel/market'],
  },
  {
    headword: 'permanent',
    turkish: 'kalıcı',
    unit: '1',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['permanence'],
      adjective: ['permanent'],
      adverb: ['permanently'],
    },
    collocations: ['permanent damage/job/address'],
  },
  {
    headword: 'philosophy',
    turkish: 'felsefe',
    unit: '1',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['philosophy', 'philosopher'],
      adjective: ['philosophical'],
      adverb: ['philosophically'],
    },
    collocations: ['a philosophy of life', 'political philosophy'],
  },
  {
    headword: 'resident',
    turkish: 'sakin',
    unit: '1',
    section: 'Reading & Writing',
    forms: {
      verb: ['reside'],
      noun: ['resident', 'residence'],
      adjective: ['residential'],
      adverb: [],
    },
    collocations: ['local residents', 'a residential area'],
  },
  {
    headword: 'survive',
    turkish: 'hayatta kalmak',
    unit: '1',
    section: 'Reading & Writing',
    forms: {
      verb: ['survive'],
      noun: ['survival', 'survivor'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to survive an accident/a disaster', 'survival of the fittest'],
  },
  {
    headword: 'value',
    turkish: 'değer',
    unit: '1',
    section: 'Reading & Writing',
    forms: {
      verb: ['value', 'overvalue', 'undervalue'],
      noun: ['value'],
      adjective: ['valuable', 'invaluable'],
      adverb: [],
    },
    collocations: ['high/low value', 'to be of great value'],
  },
  {
    headword: 'volunteer',
    turkish: 'gönüllü',
    unit: '1',
    section: 'Reading & Writing',
    forms: {
      verb: ['volunteer'],
      noun: ['volunteer'],
      adjective: ['voluntary'],
      adverb: ['voluntarily'],
    },
    collocations: ['to volunteer for a task', 'volunteer work'],
  },

  // =================================================================
  // UNIT 1: LISTENING & SPEAKING
  // =================================================================
  {
    headword: 'alter',
    turkish: 'değiştirmek',
    unit: '1',
    section: 'Listening & Speaking',
    forms: {
      verb: ['alter'],
      noun: ['alteration'],
      adjective: ['alterable'],
      adverb: [],
    },
    collocations: ['to alter a plan/decision', 'to make alterations to sth'],
  },
  {
    headword: 'classic',
    turkish: 'klasik',
    unit: '1',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: ['classic'], adjective: ['classic'], adverb: [] },
    collocations: ['a classic example/film/novel'],
  },
  {
    headword: 'complicated',
    turkish: 'karmaşık',
    unit: '1',
    section: 'Listening & Speaking',
    forms: {
      verb: ['complicate'],
      noun: ['complication'],
      adjective: ['complicated'],
      adverb: [],
    },
    collocations: ['a complicated process/situation'],
  },
  {
    headword: 'consistent',
    turkish: 'tutarlı',
    unit: '1',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['consistency', 'inconsistency'],
      adjective: ['consistent', 'inconsistent'],
      adverb: ['consistently'],
    },
    collocations: ['to be consistent with sth', 'to lack consistency'],
  },
  {
    headword: 'definite',
    turkish: 'belirli',
    unit: '1',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['definition'],
      adjective: ['definite', 'indefinite'],
      adverb: ['definitely'],
    },
    collocations: ['a definite answer/plan'],
  },
  {
    headword: 'eventual',
    turkish: 'nihai',
    unit: '1',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: [], adjective: ['eventual'], adverb: ['eventually'] },
    collocations: ['the eventual outcome/result'],
  },
  {
    headword: 'extract',
    turkish: 'çıkarmak',
    unit: '1',
    section: 'Listening & Speaking',
    forms: { verb: ['extract'], noun: ['extract', 'extraction'], adjective: [], adverb: [] },
    collocations: ['to extract a tooth/information', 'a short extract from a book'],
  },
  {
    headword: 'feature',
    turkish: 'özellik',
    unit: '1',
    section: 'Listening & Speaking',
    forms: { verb: ['feature'], noun: ['feature'], adjective: [], adverb: [] },
    collocations: ['a key/main feature', 'to feature prominently'],
  },
  {
    headword: 'feedback',
    turkish: 'geri bildirim',
    unit: '1',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: ['feedback'], adjective: [], adverb: [] },
    collocations: ['to give/receive/provide feedback', 'positive/negative feedback'],
  },
  {
    headword: 'flexible',
    turkish: 'esnek',
    unit: '1',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['flexibility'],
      adjective: ['flexible', 'inflexible'],
      adverb: ['flexibly'],
    },
    collocations: ['flexible working hours', 'to be flexible with sth'],
  },
  {
    headword: 'illustrate',
    turkish: 'örneklemek',
    unit: '1',
    section: 'Listening & Speaking',
    forms: {
      verb: ['illustrate'],
      noun: ['illustration', 'illustrator'],
      adjective: ['illustrative'],
      adverb: [],
    },
    collocations: ['to illustrate a point/an idea'],
  },
  {
    headword: 'income',
    turkish: 'gelir',
    unit: '1',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: ['income'], adjective: [], adverb: [] },
    collocations: ['annual/monthly income', 'a source of income', 'low/high income'],
  },
  {
    headword: 'insist',
    turkish: 'ısrar etmek',
    unit: '1',
    section: 'Listening & Speaking',
    forms: {
      verb: ['insist'],
      noun: ['insistence'],
      adjective: ['insistent'],
      adverb: [],
    },
    collocations: ['to insist on (doing) sth', 'to insist that...'],
  },
  {
    headword: 'interact',
    turkish: 'etkileşimde bulunmak',
    unit: '1',
    section: 'Listening & Speaking',
    forms: {
      verb: ['interact'],
      noun: ['interaction'],
      adjective: ['interactive'],
      adverb: [],
    },
    collocations: ['to interact with sb/sth', 'social interaction'],
  },
  {
    headword: 'integrate',
    turkish: 'entegre etmek',
    unit: '1',
    section: 'Listening & Speaking',
    forms: {
      verb: ['integrate'],
      noun: ['integration'],
      adjective: ['integral'],
      adverb: [],
    },
    collocations: ['to integrate sth into/with sth', 'an integral part of sth'],
  },
  {
    headword: 'layer',
    turkish: 'katman',
    unit: '1',
    section: 'Listening & Speaking',
    forms: { verb: ['layer'], noun: ['layer'], adjective: [], adverb: [] },
    collocations: ['a layer of dust/paint', 'in layers'],
  },
  {
    headword: 'method',
    turkish: 'yöntem',
    unit: '1',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['method', 'methodology'],
      adjective: ['methodical'],
      adverb: [],
    },
    collocations: ['a traditional/modern method', 'a method of doing sth'],
  },
  {
    headword: 'obvious',
    turkish: 'açık',
    unit: '1',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: [], adjective: ['obvious'], adverb: ['obviously'] },
    collocations: ['it is obvious that...', 'for obvious reasons'],
  },
  {
    headword: 'operate',
    turkish: 'çalıştırmak',
    unit: '1',
    section: 'Listening & Speaking',
    forms: {
      verb: ['operate'],
      noun: ['operation', 'operator'],
      adjective: ['operational'],
      adverb: [],
    },
    collocations: ['to operate a machine/business', 'to be in operation'],
  },
  {
    headword: 'phase',
    turkish: 'evre',
    unit: '1',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: ['phase'], adjective: [], adverb: [] },
    collocations: ['the first/next/final phase', 'to phase sth in/out'],
  },
  {
    headword: 'process',
    turkish: 'süreç',
    unit: '1',
    section: 'Listening & Speaking',
    forms: { verb: ['process'], noun: ['process'], adjective: [], adverb: [] },
    collocations: ['the decision-making process', 'in the process of doing sth'],
  },
  {
    headword: 'reaction',
    turkish: 'tepki',
    unit: '1',
    section: 'Listening & Speaking',
    forms: { verb: ['react'], noun: ['reaction'], adjective: [], adverb: [] },
    collocations: ['a chemical reaction', 'a reaction to sth'],
  },
  {
    headword: 'rely',
    turkish: 'güvenmek',
    unit: '1',
    section: 'Listening & Speaking',
    forms: {
      verb: ['rely'],
      noun: ['reliance', 'reliability'],
      adjective: ['reliable', 'unreliable'],
      adverb: ['reliably'],
    },
    collocations: ['to rely on sb/sth', 'you can rely on it'],
  },
  {
    headword: 'similarity',
    turkish: 'benzerlik',
    unit: '1',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: ['similarity'], adjective: ['similar'], adverb: ['similarly'] },
    collocations: ['a similarity between A and B', 'to bear a similarity to'],
  },
  {
    headword: 'struggle',
    turkish: 'mücadele etmek',
    unit: '1',
    section: 'Listening & Speaking',
    forms: { verb: ['struggle'], noun: ['struggle'], adjective: [], adverb: [] },
    collocations: ['to struggle with/against sth', 'a power struggle'],
  },

  // =================================================================
  // UNIT 1: EXTRA WORDS
  // =================================================================
  {
    headword: 'attribute',
    turkish: 'nitelik',
    unit: '1',
    section: 'Extra Words',
    forms: {
      verb: ['attribute'],
      noun: ['attribute', 'attribution'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to attribute sth to sth/sb', 'a key attribute'],
  },
  {
    headword: 'dynamic',
    turkish: 'dinamik',
    unit: '1',
    section: 'Extra Words',
    forms: {
      verb: [],
      noun: ['dynamic', 'dynamics'],
      adjective: ['dynamic'],
      adverb: ['dynamically'],
    },
    collocations: ['a dynamic personality', 'group dynamics'],
  },
  {
    headword: 'merge',
    turkish: 'birleşmek',
    unit: '1',
    section: 'Extra Words',
    forms: { verb: ['merge'], noun: ['merger'], adjective: [], adverb: [] },
    collocations: ['to merge with another company', 'the two roads merge'],
  },
  {
    headword: 'paradigm',
    turkish: 'paradigma',
    unit: '1',
    section: 'Extra Words',
    forms: { verb: [], noun: ['paradigm'], adjective: [], adverb: [] },
    collocations: ['a paradigm shift'],
  },
  {
    headword: 'precise',
    turkish: 'kesin',
    unit: '1',
    section: 'Extra Words',
    forms: {
      verb: [],
      noun: ['precision'],
      adjective: ['precise', 'imprecise'],
      adverb: ['precisely'],
    },
    collocations: ['at that precise moment', 'to be precise'],
  },
  {
    headword: 'reject',
    turkish: 'reddetmek',
    unit: '1',
    section: 'Extra Words',
    forms: { verb: ['reject'], noun: ['rejection'], adjective: [], adverb: [] },
    collocations: ['to reject an offer/idea/proposal'],
  },
  {
    headword: 'satisfaction',
    turkish: 'memnuniyet',
    unit: '1',
    section: 'Extra Words',
    forms: {
      verb: ['satisfy'],
      noun: ['satisfaction', 'dissatisfaction'],
      adjective: ['satisfactory', 'satisfied', 'unsatisfied'],
      adverb: [],
    },
    collocations: ['job satisfaction', 'to express satisfaction with sth'],
  },
  {
    headword: 'theme',
    turkish: 'tema',
    unit: '1',
    section: 'Extra Words',
    forms: { verb: [], noun: ['theme'], adjective: ['thematic'], adverb: [] },
    collocations: ['the main theme of a book', 'a theme park'],
  },

  // =================================================================
  // UNIT 2: READING & WRITING
  // =================================================================
  {
    headword: 'abstract',
    turkish: 'soyut',
    unit: '2',
    section: 'Reading & Writing',
    forms: { verb: [], noun: ['abstract', 'abstraction'], adjective: ['abstract'], adverb: [] },
    collocations: ['abstract art/idea/concept'],
  },
  {
    headword: 'analyze',
    turkish: 'analiz etmek',
    unit: '2',
    section: 'Reading & Writing',
    forms: {
      verb: ['analyze'],
      noun: ['analysis', 'analyst'],
      adjective: ['analytical'],
      adverb: [],
    },
    collocations: ['to analyze data/results'],
  },
  {
    headword: 'anxiety',
    turkish: 'kaygı',
    unit: '2',
    section: 'Reading & Writing',
    forms: { verb: [], noun: ['anxiety'], adjective: ['anxious'], adverb: [] },
    collocations: ['to feel anxiety about sth', 'anxiety disorder'],
  },
  {
    headword: 'assign',
    turkish: 'atamak',
    unit: '2',
    section: 'Reading & Writing',
    forms: { verb: ['assign'], noun: ['assignment'], adjective: [], adverb: [] },
    collocations: ['to assign a task to sb', 'to get an assignment'],
  },
  {
    headword: 'appearance',
    turkish: 'görünüş',
    unit: '2',
    section: 'Reading & Writing',
    forms: { verb: ['appear'], noun: ['appearance'], adjective: [], adverb: [] },
    collocations: ['physical appearance', 'to make an appearance'],
  },
  {
    headword: 'assume',
    turkish: 'varsaymak',
    unit: '2',
    section: 'Reading & Writing',
    forms: { verb: ['assume'], noun: ['assumption'], adjective: [], adverb: [] },
    collocations: ['to assume that...', 'to make an assumption'],
  },
  {
    headword: 'category',
    turkish: 'kategori',
    unit: '2',
    section: 'Reading & Writing',
    forms: {
      verb: ['categorize'],
      noun: ['category', 'categorization'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to fall into a category', 'to create a new category'],
  },
  {
    headword: 'circumstance',
    turkish: 'durum',
    unit: '2',
    section: 'Reading & Writing',
    forms: { verb: [], noun: ['circumstance'], adjective: [], adverb: [] },
    collocations: ['under/in the circumstances', 'unforeseen circumstances'],
  },
  {
    headword: 'complex',
    turkish: 'karmaşık',
    unit: '2',
    section: 'Reading & Writing',
    forms: { verb: [], noun: ['complexity'], adjective: ['complex'], adverb: [] },
    collocations: ['a complex issue/problem'],
  },
  {
    headword: 'comprehensive',
    turkish: 'kapsamlı',
    unit: '2',
    section: 'Reading & Writing',
    forms: {
      verb: ['comprehend'],
      noun: ['comprehension'],
      adjective: ['comprehensive'],
      adverb: ['comprehensively'],
    },
    collocations: ['a comprehensive list/study/review'],
  },
  {
    headword: 'concrete',
    turkish: 'somut',
    unit: '2',
    section: 'Reading & Writing',
    forms: { verb: [], noun: ['concrete'], adjective: ['concrete'], adverb: [] },
    collocations: ['concrete evidence/proof/example'],
  },
  {
    headword: 'consider',
    turkish: 'düşünmek',
    unit: '2',
    section: 'Reading & Writing',
    forms: {
      verb: ['consider'],
      noun: ['consideration'],
      adjective: ['considerable', 'considerate'],
      adverb: [],
    },
    collocations: ['to consider sth carefully', 'to take into consideration'],
  },
  {
    headword: 'constant',
    turkish: 'sabit',
    unit: '2',
    section: 'Reading & Writing',
    forms: { verb: [], noun: [], adjective: ['constant'], adverb: ['constantly'] },
    collocations: ['constant pressure/change', 'to remain constant'],
  },
  {
    headword: 'depressed',
    turkish: 'depresif',
    unit: '2',
    section: 'Reading & Writing',
    forms: {
      verb: ['depress'],
      noun: ['depression'],
      adjective: ['depressed', 'depressing'],
      adverb: [],
    },
    collocations: ['to feel depressed', 'a depressing movie'],
  },
  {
    headword: 'encounter',
    turkish: 'karşılaşmak',
    unit: '2',
    section: 'Reading & Writing',
    forms: { verb: ['encounter'], noun: ['encounter'], adjective: [], adverb: [] },
    collocations: [
      'to encounter difficulties/problems',
      'a chance encounter',
    ],
  },
  {
    headword: 'equal',
    turkish: 'eşit',
    unit: '2',
    section: 'Reading & Writing',
    forms: {
      verb: ['equal', 'equalize'],
      noun: ['equality', 'inequality'],
      adjective: ['equal', 'unequal'],
      adverb: ['equally'],
    },
    collocations: ['equal rights/opportunities', 'to be equal to sth'],
  },
  {
    headword: 'failure',
    turkish: 'başarısızlık',
    unit: '2',
    section: 'Reading & Writing',
    forms: { verb: ['fail'], noun: ['failure'], adjective: [], adverb: [] },
    collocations: ['failure to do sth', 'a complete failure'],
  },
  {
    headword: 'hypothesize',
    turkish: 'hipotez kurmak',
    unit: '2',
    section: 'Reading & Writing',
    forms: {
      verb: ['hypothesize'],
      noun: ['hypothesis'],
      adjective: ['hypothetical'],
      adverb: [],
    },
    collocations: ['to hypothesize that...'],
  },
  {
    headword: 'implication',
    turkish: 'ima',
    unit: '2',
    section: 'Reading & Writing',
    forms: { verb: ['imply'], noun: ['implication'], adjective: [], adverb: [] },
    collocations: ['the implications of a decision', 'to have serious implications'],
  },
  {
    headword: 'inappropriate',
    turkish: 'uygunsuz',
    unit: '2',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: [],
      adjective: ['inappropriate', 'appropriate'],
      adverb: ['inappropriately'],
    },
    collocations: ['inappropriate behavior/comments'],
  },
  {
    headword: 'influence',
    turkish: 'etki',
    unit: '2',
    section: 'Reading & Writing',
    forms: {
      verb: ['influence'],
      noun: ['influence'],
      adjective: ['influential'],
      adverb: [],
    },
    collocations: ['to have an influence on sb/sth', 'a major influence'],
  },
  {
    headword: 'interpret',
    turkish: 'yorumlamak',
    unit: '2',
    section: 'Reading & Writing',
    forms: {
      verb: ['interpret'],
      noun: ['interpretation', 'interpreter'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to interpret results/a dream'],
  },
  {
    headword: 'logical',
    turkish: 'mantıksal',
    unit: '2',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['logic'],
      adjective: ['logical', 'illogical'],
      adverb: ['logically'],
    },
    collocations: ['a logical conclusion/explanation'],
  },
  {
    headword: 'predict',
    turkish: 'tahmin etmek',
    unit: '2',
    section: 'Reading & Writing',
    forms: {
      verb: ['predict'],
      noun: ['prediction'],
      adjective: ['predictable', 'unpredictable'],
      adverb: [],
    },
    collocations: ['to predict the future/outcome', 'to make a prediction'],
  },
  {
    headword: 'possess',
    turkish: 'sahip olmak',
    unit: '2',
    section: 'Reading & Writing',
    forms: { verb: ['possess'], noun: ['possession'], adjective: [], adverb: [] },
    collocations: ['to possess a quality/skill'],
  },
  {
    headword: 'relevance',
    turkish: 'ilgi',
    unit: '2',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['relevance', 'irrelevance'],
      adjective: ['relevant', 'irrelevant'],
      adverb: [],
    },
    collocations: ['to have relevance to sth', 'of no relevance'],
  },
  {
    headword: 'reluctant',
    turkish: 'isteksiz',
    unit: '2',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['reluctance'],
      adjective: ['reluctant'],
      adverb: ['reluctantly'],
    },
    collocations: ['to be reluctant to do sth'],
  },
  {
    headword: 'sense',
    turkish: 'duyu',
    unit: '2',
    section: 'Reading & Writing',
    forms: { verb: ['sense'], noun: ['sense'], adjective: ['sensible', 'sensitive'], adverb: [] },
    collocations: ['a sense of humor/direction', 'to make sense'],
  },
  {
    headword: 'sole',
    turkish: 'tek',
    unit: '2',
    section: 'Reading & Writing',
    forms: { verb: [], noun: [], adjective: ['sole'], adverb: ['solely'] },
    collocations: ['the sole survivor/reason/purpose'],
  },
  {
    headword: 'sophisticated',
    turkish: 'sofistike',
    unit: '2',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['sophistication'],
      adjective: ['sophisticated'],
      adverb: [],
    },
    collocations: ['sophisticated technology/taste/equipment'],
  },
  {
    headword: 'strengthen',
    turkish: 'güçlendirmek',
    unit: '2',
    section: 'Reading & Writing',
    forms: {
      verb: ['strengthen'],
      noun: ['strength'],
      adjective: ['strong'],
      adverb: ['strongly'],
    },
    collocations: ['to strengthen ties/a relationship/an argument'],
  },
  {
    headword: 'trigger',
    turkish: 'tetiklemek',
    unit: '2',
    section: 'Reading & Writing',
    forms: { verb: ['trigger'], noun: ['trigger'], adjective: [], adverb: [] },
    collocations: ['to trigger a memory/an alarm/a reaction'],
  },
  {
    headword: 'willing',
    turkish: 'istekli',
    unit: '2',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['willingness'],
      adjective: ['willing', 'unwilling'],
      adverb: ['willingly'],
    },
    collocations: ['to be willing to do sth'],
  },

  // =================================================================
  // UNIT 2: LISTENING & SPEAKING
  // =================================================================
  {
    headword: 'addictive',
    turkish: 'bağımlılık yapan',
    unit: '2',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['addiction', 'addict'],
      adjective: ['addictive'],
      adverb: [],
    },
    collocations: ['addictive drugs/behavior', 'to be addictive'],
  },
  {
    headword: 'admit',
    turkish: 'kabul etmek',
    unit: '2',
    section: 'Listening & Speaking',
    forms: { verb: ['admit'], noun: ['admission'], adjective: [], adverb: [] },
    collocations: ['to admit a mistake', 'to admit that...'],
  },
  {
    headword: 'affect',
    turkish: 'etkilemek',
    unit: '2',
    section: 'Listening & Speaking',
    forms: { verb: ['affect'], noun: [], adjective: [], adverb: [] },
    collocations: ['to affect a decision/the outcome'],
  },
  {
    headword: 'anticipate',
    turkish: 'öngörmek',
    unit: '2',
    section: 'Listening & Speaking',
    forms: {
      verb: ['anticipate'],
      noun: ['anticipation'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to anticipate problems/changes'],
  },
  {
    headword: 'capacity',
    turkish: 'kapasite',
    unit: '2',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: ['capacity'], adjective: [], adverb: [] },
    collocations: ['storage capacity', 'to have the capacity to do sth'],
  },
  {
    headword: 'claim',
    turkish: 'iddia etmek',
    unit: '2',
    section: 'Listening & Speaking',
    forms: { verb: ['claim'], noun: ['claim'], adjective: [], adverb: [] },
    collocations: ['to make a claim', 'to claim responsibility'],
  },
  {
    headword: 'concentration',
    turkish: 'konsantrasyon',
    unit: '2',
    section: 'Listening & Speaking',
    forms: { verb: ['concentrate'], noun: ['concentration'], adjective: [], adverb: [] },
    collocations: ['to require concentration', 'a lack of concentration'],
  },
  {
    headword: 'concept',
    turkish: 'kavram',
    unit: '2',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: ['concept'], adjective: [], adverb: [] },
    collocations: ['the concept of democracy', 'a difficult concept'],
  },
  {
    headword: 'conversation',
    turkish: 'konuşma',
    unit: '2',
    section: 'Listening & Speaking',
    forms: { verb: ['converse'], noun: ['conversation'], adjective: [], adverb: [] },
    collocations: ['to have a conversation with sb', 'to start a conversation'],
  },
  {
    headword: 'criticism',
    turkish: 'eleştiri',
    unit: '2',
    section: 'Listening & Speaking',
    forms: {
      verb: ['criticize'],
      noun: ['criticism', 'critic'],
      adjective: ['critical'],
      adverb: [],
    },
    collocations: ['to face/receive criticism', 'constructive criticism'],
  },
  {
    headword: 'distract',
    turkish: 'dikkatini dağıtmak',
    unit: '2',
    section: 'Listening & Speaking',
    forms: {
      verb: ['distract'],
      noun: ['distraction'],
      adjective: ['distracted'],
      adverb: [],
    },
    collocations: ['to distract sb from sth', 'to get distracted'],
  },
  {
    headword: 'diverse',
    turkish: 'çeşitli',
    unit: '2',
    section: 'Listening & Speaking',
    forms: {
      verb: ['diversify'],
      noun: ['diversity'],
      adjective: ['diverse'],
      adverb: [],
    },
    collocations: ['a diverse range of products', 'a diverse population'],
  },
  {
    headword: 'enable',
    turkish: 'imkan tanımak',
    unit: '2',
    section: 'Listening & Speaking',
    forms: { verb: ['enable'], noun: [], adjective: [], adverb: [] },
    collocations: ['to enable sb to do sth'],
  },
  {
    headword: 'establish',
    turkish: 'kurmak',
    unit: '2',
    section: 'Listening & Speaking',
    forms: {
      verb: ['establish'],
      noun: ['establishment'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to establish a company/a relationship/a fact'],
  },
  {
    headword: 'evidence',
    turkish: 'kanıt',
    unit: '2',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: ['evidence'], adjective: ['evident'], adverb: [] },
    collocations: ['clear/strong evidence', 'to find evidence of sth'],
  },
  {
    headword: 'examine',
    turkish: 'incelemek',
    unit: '2',
    section: 'Listening & Speaking',
    forms: {
      verb: ['examine'],
      noun: ['examination', 'examiner'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to examine the evidence/a patient'],
  },
  {
    headword: 'identify',
    turkish: 'tanımlamak',
    unit: '2',
    section: 'Listening & Speaking',
    forms: {
      verb: ['identify'],
      noun: ['identification', 'identity'],
      adjective: ['identifiable'],
      adverb: [],
    },
    collocations: ['to identify a problem/a cause'],
  },
  {
    headword: 'impact',
    turkish: 'etki',
    unit: '2',
    section: 'Listening & Speaking',
    forms: { verb: ['impact'], noun: ['impact'], adjective: [], adverb: [] },
    collocations: ['to have an impact on sth', 'a significant impact'],
  },
  {
    headword: 'impressed',
    turkish: 'etkilenmiş',
    unit: '2',
    section: 'Listening & Speaking',
    forms: {
      verb: ['impress'],
      noun: ['impression'],
      adjective: ['impressed', 'impressive'],
      adverb: [],
    },
    collocations: ['to be impressed by/with sth', 'to make a good impression'],
  },
  {
    headword: 'interfere',
    turkish: 'müdahale etmek',
    unit: '2',
    section: 'Listening & Speaking',
    forms: {
      verb: ['interfere'],
      noun: ['interference'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to interfere in/with sth'],
  },
  {
    headword: 'lack',
    turkish: 'eksiklik',
    unit: '2',
    section: 'Listening & Speaking',
    forms: { verb: ['lack'], noun: ['lack'], adjective: [], adverb: [] },
    collocations: ['a lack of something', 'to lack experience/confidence'],
  },
  {
    headword: 'observation',
    turkish: 'gözlem',
    unit: '2',
    section: 'Listening & Speaking',
    forms: {
      verb: ['observe'],
      noun: ['observation', 'observer'],
      adjective: [],
      adverb: [],
    },
    collocations: ['under observation', 'to make an observation'],
  },
  {
    headword: 'participant',
    turkish: 'katılımcı',
    unit: '2',
    section: 'Listening & Speaking',
    forms: {
      verb: ['participate'],
      noun: ['participant', 'participation'],
      adjective: [],
      adverb: [],
    },
    collocations: ['a participant in a study/event'],
  },
  {
    headword: 'potential',
    turkish: 'potansiyel',
    unit: '2',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['potential'],
      adjective: ['potential'],
      adverb: ['potentially'],
    },
    collocations: ['potential danger/risk/benefit', 'to have the potential to do sth'],
  },
  {
    headword: 'precisely',
    turkish: 'tam olarak',
    unit: '2',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['precision'],
      adjective: ['precise'],
      adverb: ['precisely'],
    },
    collocations: ['not precisely', 'to define precisely'],
  },
  {
    headword: 'promote',
    turkish: 'tanıtmak',
    unit: '2',
    section: 'Listening & Speaking',
    forms: {
      verb: ['promote'],
      noun: ['promotion'],
      adjective: ['promotional'],
      adverb: [],
    },
    collocations: ['to promote a product/an event', 'to get a promotion'],
  },
  {
    headword: 'psychologist',
    turkish: 'psikolog',
    unit: '2',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['psychologist', 'psychology'],
      adjective: ['psychological'],
      adverb: ['psychologically'],
    },
    collocations: ['to see a psychologist', 'educational psychologist'],
  },
  {
    headword: 'revenue',
    turkish: 'gelir',
    unit: '2',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: ['revenue'], adjective: [], adverb: [] },
    collocations: ['tax revenue', 'to generate revenue'],
  },
  {
    headword: 'sample',
    turkish: 'örnek',
    unit: '2',
    section: 'Listening & Speaking',
    forms: { verb: ['sample'], noun: ['sample'], adjective: [], adverb: [] },
    collocations: ['a blood/tissue sample', 'a random sample'],
  },
  {
    headword: 'underestimate',
    turkish: 'küçümsemek',
    unit: '2',
    section: 'Listening & Speaking',
    forms: {
      verb: ['underestimate'],
      noun: ['underestimation'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to underestimate the cost/difficulty'],
  },

  // =================================================================
  // UNIT 2: EXTRA WORDS
  // =================================================================
  {
    headword: 'adequate',
    turkish: 'yeterli',
    unit: '2',
    section: 'Extra Words',
    forms: {
      verb: [],
      noun: ['adequacy', 'inadequacy'],
      adjective: ['adequate', 'inadequate'],
      adverb: ['adequately'],
    },
    collocations: ['adequate for a purpose', 'to be adequate'],
  },
  {
    headword: 'coordination',
    turkish: 'koordinasyon',
    unit: '2',
    section: 'Extra Words',
    forms: {
      verb: ['coordinate'],
      noun: ['coordination', 'coordinator'],
      adjective: [],
      adverb: [],
    },
    collocations: ['hand-eye coordination', 'in coordination with'],
  },
  {
    headword: 'facilitate',
    turkish: 'kolaylaştırmak',
    unit: '2',
    section: 'Extra Words',
    forms: {
      verb: ['facilitate'],
      noun: ['facilitator'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to facilitate a process/discussion'],
  },
  {
    headword: 'obligation',
    turkish: 'yükümlülük',
    unit: '2',
    section: 'Extra Words',
    forms: {
      verb: ['oblige'],
      noun: ['obligation'],
      adjective: ['obligatory'],
      adverb: [],
    },
    collocations: ['a legal/moral obligation', 'to have an obligation to do sth'],
  },
  {
    headword: 'ratio',
    turkish: 'oran',
    unit: '2',
    section: 'Extra Words',
    forms: { verb: [], noun: ['ratio'], adjective: [], adverb: [] },
    collocations: ['the ratio of A to B'],
  },
  {
    headword: 'urge',
    turkish: 'dürtü',
    unit: '2',
    section: 'Extra Words',
    forms: { verb: ['urge'], noun: ['urge'], adjective: [], adverb: [] },
    collocations: ['to urge sb to do sth', 'to feel an urge'],
  },
  {
    headword: 'acknowledge',
    turkish: 'kabul etmek',
    unit: '3',
    section: 'Reading & Writing',
    forms: {
      verb: ['acknowledge'],
      noun: ['acknowledgement'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to acknowledge a fact/the truth', 'to acknowledge receipt of sth'],
  },
  {
    headword: 'advance',
    turkish: 'ilerleme',
    unit: '3',
    section: 'Reading & Writing',
    forms: {
      verb: ['advance'],
      noun: ['advance', 'advancement'],
      adjective: ['advanced'],
      adverb: [],
    },
    collocations: ['an advance in technology', 'to make an advance', 'in advance'],
  },
  {
    headword: 'attitude',
    turkish: 'tutum',
    unit: '3',
    section: 'Reading & Writing',
    forms: { verb: [], noun: ['attitude'], adjective: [], adverb: [] },
    collocations: ['a positive/negative attitude', 'attitude towards sb/sth'],
  },
  {
    headword: 'authority',
    turkish: 'otorite',
    unit: '3',
    section: 'Reading & Writing',
    forms: {
      verb: ['authorize'],
      noun: ['authority', 'authorization'],
      adjective: ['authoritative'],
      adverb: [],
    },
    collocations: ['to have authority over sb', 'an expert/authority on a subject'],
  },
  {
    headword: 'beneficial',
    turkish: 'faydalı',
    unit: '3',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['benefit', 'beneficiary'],
      adjective: ['beneficial'],
      adverb: [],
    },
    collocations: ['to be beneficial to sb/sth', 'a beneficial effect'],
  },
  {
    headword: 'capable',
    turkish: 'yetkin',
    unit: '3',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['capability'],
      adjective: ['capable', 'incapable'],
      adverb: [],
    },
    collocations: ['to be capable of doing sth'],
  },
  {
    headword: 'conduct',
    turkish: 'yürütmek',
    unit: '3',
    section: 'Reading & Writing',
    forms: { verb: ['conduct'], noun: ['conduct'], adjective: [], adverb: [] },
    collocations: ['to conduct a survey/an experiment/an investigation', 'code of conduct'],
  },
  {
    headword: 'cope',
    turkish: 'başa çıkmak',
    unit: '3',
    section: 'Reading & Writing',
    forms: { verb: ['cope'], noun: [], adjective: [], adverb: [] },
    collocations: ['to cope with a problem/stress'],
  },
  {
    headword: 'decade',
    turkish: 'on yıl',
    unit: '3',
    section: 'Reading & Writing',
    forms: { verb: [], noun: ['decade'], adjective: [], adverb: [] },
    collocations: ['for a decade', 'in the last decade'],
  },
  {
    headword: 'deliberate',
    turkish: 'kasıtlı',
    unit: '3',
    section: 'Reading & Writing',
    forms: {
      verb: ['deliberate'],
      noun: ['deliberation'],
      adjective: ['deliberate'],
      adverb: ['deliberately'],
    },
    collocations: ['a deliberate act/decision'],
  },
  {
    headword: 'domestic',
    turkish: 'yerli',
    unit: '3',
    section: 'Reading & Writing',
    forms: {
        verb: ['domesticate'],
        noun: ['domestication'],
        adjective: ['domestic'],
        adverb: ['domestically'],
      },
      collocations: ['domestic flight/affairs/violence', 'domestic animal'],
  },
  {
    headword: 'education',
    turkish: 'eğitim',
    unit: '3',
    section: 'Reading & Writing',
    forms: {
        verb: ['educate'],
        noun: ['education', 'educator'],
        adjective: ['educational'],
        adverb: [],
      },
      collocations: ['higher education', 'a good education'],
  },
  {
    headword: 'essential',
    turkish: 'temel',
    unit: '3',
    section: 'Reading & Writing',
    forms: { verb: [], noun: [], adjective: ['essential'], adverb: ['essentially'] },
    collocations: ['it is essential to do sth', 'an essential part of sth'],
  },
  {
    headword: 'fundamental',
    turkish: 'temel',
    unit: '3',
    section: 'Reading & Writing',
    forms: {
        verb: [],
        noun: ['fundamental'],
        adjective: ['fundamental'],
        adverb: ['fundamentally'],
      },
      collocations: ['a fundamental change/difference/principle'],
  },
  {
    headword: 'maintenance',
    turkish: 'bakım',
    unit: '3',
    section: 'Reading & Writing',
    forms: { verb: ['maintain'], noun: ['maintenance'], adjective: [], adverb: [] },
    collocations: ['car/building maintenance', 'to carry out maintenance'],
  },
  {
    headword: 'minor',
    turkish: 'küçük',
    unit: '3',
    section: 'Reading & Writing',
    forms: { verb: [], noun: ['minority'], adjective: ['minor'], adverb: [] },
    collocations: ['a minor problem/injury/change'],
  },
  {
    headword: 'outcome',
    turkish: 'sonuç',
    unit: '3',
    section: 'Reading & Writing',
    forms: { verb: [], noun: ['outcome'], adjective: [], adverb: [] },
    collocations: ['the likely/final outcome', 'a positive/negative outcome'],
  },
  {
    headword: 'rapid',
    turkish: 'hızlı',
    unit: '3',
    section: 'Reading & Writing',
    forms: { verb: [], noun: [], adjective: ['rapid'], adverb: ['rapidly'] },
    collocations: ['rapid growth/change/decline'],
  },
  {
    headword: 'recommend',
    turkish: 'tavsiye etmek',
    unit: '3',
    section: 'Reading & Writing',
    forms: {
      verb: ['recommend'],
      noun: ['recommendation'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to recommend sb/sth to sb', 'to follow a recommendation'],
  },
  {
    headword: 'regulation',
    turkish: 'düzenleme',
    unit: '3',
    section: 'Reading & Writing',
    forms: {
      verb: ['regulate'],
      noun: ['regulation', 'regulator'],
      adjective: [],
      adverb: [],
    },
    collocations: ['government/safety regulations', 'to comply with regulations'],
  },
  {
    headword: 'separate',
    turkish: 'ayırmak',
    unit: '3',
    section: 'Reading & Writing',
    forms: {
      verb: ['separate'],
      noun: ['separation'],
      adjective: ['separate'],
      adverb: ['separately'],
    },
    collocations: ['to separate A from B', 'to live in separate rooms'],
  },
  {
    headword: 'sufficient',
    turkish: 'yeterli',
    unit: '3',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: [],
      adjective: ['sufficient', 'insufficient'],
      adverb: ['sufficiently'],
    },
    collocations: ['sufficient for a purpose', 'sufficient time/money/evidence'],
  },
  {
    headword: 'summarize',
    turkish: 'özetlemek',
    unit: '3',
    section: 'Reading & Writing',
    forms: { verb: ['summarize'], noun: ['summary'], adjective: [], adverb: [] },
    collocations: ['to summarize the main points', 'in summary'],
  },
  {
    headword: 'survey',
    turkish: 'anket',
    unit: '3',
    section: 'Reading & Writing',
    forms: { verb: ['survey'], noun: ['survey'], adjective: [], adverb: [] },
    collocations: ['to conduct/carry out a survey', 'according to a recent survey'],
  },
  {
    headword: 'threaten',
    turkish: 'tehdit etmek',
    unit: '3',
    section: 'Reading & Writing',
    forms: { verb: ['threaten'], noun: ['threat'], adjective: ['threatening'], adverb: [] },
    collocations: ['to threaten to do sth', 'to pose a threat to sb/sth'],
  },
  {
    headword: 'worth',
    turkish: 'değer',
    unit: '3',
    section: 'Reading & Writing',
    forms: { verb: [], noun: ['worth'], adjective: ['worth', 'worthwhile', 'worthless'], adverb: [] },
    collocations: ['to be worth doing sth', 'it\'s not worth it'],
  },
  
  // =================================================================
  // UNIT 3: LISTENING & SPEAKING
  // =================================================================
  {
    headword: 'adapt',
    turkish: 'uyarlamak',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['adapt'],
      noun: ['adaptation', 'adaptability'],
      adjective: ['adaptable', 'adapted'],
      adverb: [],
    },
    collocations: ['to adapt to a new situation/environment', 'to adapt sth for sth'],
  },
  {
    headword: 'combine',
    turkish: 'birleştirmek',
    unit: '3',
    section: 'Listening & Speaking',
    forms: { verb: ['combine'], noun: ['combination'], adjective: [], adverb: [] },
    collocations: ['to combine A and B', 'a combination of factors'],
  },
  {
    headword: 'confirm',
    turkish: 'onaylamak',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['confirm'],
      noun: ['confirmation'],
      adjective: ['confirmed'],
      adverb: [],
    },
    collocations: ['to confirm a booking/an appointment', 'to confirm that...'],
  },
  {
    headword: 'consist',
    turkish: 'oluşmak',
    unit: '3',
    section: 'Listening & Speaking',
    forms: { verb: ['consist'], noun: [], adjective: [], adverb: [] },
    collocations: ['to consist of sth'],
  },
  {
    headword: 'destruction',
    turkish: 'yıkım',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['destroy'],
      noun: ['destruction'],
      adjective: ['destructive'],
      adverb: [],
    },
    collocations: ['the destruction of the environment', 'mass destruction'],
  },
  {
    headword: 'detect',
    turkish: 'tespit etmek',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['detect'],
      noun: ['detection', 'detective'],
      adjective: ['detectable'],
      adverb: [],
    },
    collocations: ['to detect a sound/a smell/a change'],
  },
  {
    headword: 'disaster',
    turkish: 'felaket',
    unit: '3',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: ['disaster'], adjective: ['disastrous'], adverb: [] },
    collocations: ['a natural disaster', 'an environmental disaster'],
  },
  {
    headword: 'dramatically',
    turkish: 'dramatik bir şekilde',
    unit: '3',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: [], adjective: ['dramatic'], adverb: ['dramatically'] },
    collocations: ['to increase/fall dramatically', 'a dramatic improvement'],
  },
  {
    headword: 'emerge',
    turkish: 'ortaya çıkmak',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['emerge'],
      noun: ['emergence'],
      adjective: ['emerging'],
      adverb: [],
    },
    collocations: ['to emerge from sth', 'an emerging market/trend'],
  },
  {
    headword: 'expand',
    turkish: 'genişlemek',
    unit: '3',
    section: 'Listening & Speaking',
    forms: { verb: ['expand'], noun: ['expansion'], adjective: [], adverb: [] },
    collocations: ['to expand a business', 'to expand rapidly'],
  },
  {
    headword: 'evolve',
    turkish: 'evrimleşmek',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['evolve'],
      noun: ['evolution'],
      adjective: ['evolutionary'],
      adverb: [],
    },
    collocations: ['to evolve from sth', 'to evolve over time'],
  },
  {
    headword: 'gain',
    turkish: 'kazanmak',
    unit: '3',
    section: 'Listening & Speaking',
    forms: { verb: ['gain'], noun: ['gain'], adjective: [], adverb: [] },
    collocations: ['to gain experience/knowledge/weight', 'no pain, no gain'],
  },
  {
    headword: 'justify',
    turkish: 'haklı çıkarmak',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['justify'],
      noun: ['justification'],
      adjective: ['justified', 'unjustified'],
      adverb: [],
    },
    collocations: ['to justify a decision/an action', 'to provide justification for sth'],
  },
  {
    headword: 'maintain',
    turkish: 'sürdürmek',
    unit: '3',
    section: 'Listening & Speaking',
    forms: { verb: ['maintain'], noun: ['maintenance'], adjective: [], adverb: [] },
    collocations: ['to maintain standards/contact/a building'],
  },
  {
    headword: 'natural',
    turkish: 'doğal',
    unit: '3',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: ['nature'], adjective: ['natural', 'unnatural'], adverb: ['naturally'] },
    collocations: ['natural resources/disaster/causes'],
  },
  {
    headword: 'nutrition',
    turkish: 'beslenme',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['nutrition', 'nutritionist'],
      adjective: ['nutritional', 'nutritious'],
      adverb: [],
    },
    collocations: ['good/poor nutrition', 'a source of nutrition'],
  },
  {
    headword: 'occupy',
    turkish: 'işgal etmek',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['occupy'],
      noun: ['occupation', 'occupant'],
      adjective: ['occupied'],
      adverb: [],
    },
    collocations: ['to occupy a position/a seat', 'to be occupied with sth'],
  },
  {
    headword: 'option',
    turkish: 'seçenek',
    unit: '3',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: ['option'], adjective: ['optional'], adverb: [] },
    collocations: ['to have several options', 'the best option', 'to keep your options open'],
  },
  {
    headword: 'preserve',
    turkish: 'korumak',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['preserve'],
      noun: ['preservation', 'preservative'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to preserve food/a building/a tradition'],
  },
  {
    headword: 'protection',
    turkish: 'koruma',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['protect'],
      noun: ['protection', 'protector'],
      adjective: ['protective'],
      adverb: [],
    },
    collocations: ['protection from/against sth', 'to offer/provide protection'],
  },
  {
    headword: 'release',
    turkish: 'serbest bırakmak',
    unit: '3',
    section: 'Listening & Speaking',
    forms: { verb: ['release'], noun: ['release'], adjective: [], adverb: [] },
    collocations: ['to release a prisoner/a film/a product', 'the release of energy'],
  },
  {
    headword: 'restore',
    turkish: 'onarmak',
    unit: '3',
    section: 'Listening & Speaking',
    forms: { verb: ['restore'], noun: ['restoration'], adjective: [], adverb: [] },
    collocations: ['to restore a building/a painting/order'],
  },
  {
    headword: 'source',
    turkish: 'kaynak',
    unit: '3',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: ['source'], adjective: [], adverb: [] },
    collocations: ['a source of information/energy/income', 'the main source'],
  },
  {
    headword: 'spread',
    turkish: 'yaymak',
    unit: '3',
    section: 'Listening & Speaking',
    forms: { verb: ['spread'], noun: ['spread'], adjective: ['widespread'], adverb: [] },
    collocations: ['to spread a disease/rumors/butter'],
  },
  {
    headword: 'technique',
    turkish: 'teknik',
    unit: '3',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: ['technique'], adjective: ['technical'], adverb: ['technically'] },
    collocations: ['a new/modern technique', 'a technique for doing sth'],
  },
  {
    headword: 'unpredictable',
    turkish: 'öngörülemez',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['predict'],
      noun: ['prediction'],
      adjective: ['unpredictable', 'predictable'],
      adverb: [],
    },
    collocations: ['unpredictable weather/behavior'],
  },
  {
    headword: 'visible',
    turkish: 'görünür',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['visibility'],
      adjective: ['visible', 'invisible'],
      adverb: ['visibly'],
    },
    collocations: ['clearly visible', 'to be visible to the naked eye'],
  },
  
  // =================================================================
  // UNIT 3: EXTRA WORDS
  // =================================================================
  {
    headword: 'accompany',
    turkish: 'eşlik etmek',
    unit: '3',
    section: 'Extra Words',
    forms: { verb: ['accompany'], noun: [], adjective: [], adverb: [] },
    collocations: ['to accompany sb to a place', 'to be accompanied by sth'],
  },
  {
    headword: 'constrain',
    turkish: 'kısıtlamak',
    unit: '3',
    section: 'Extra Words',
    forms: {
      verb: ['constrain'],
      noun: ['constraint'],
      adjective: ['constrained'],
      adverb: [],
    },
    collocations: ['to be constrained by sth', 'financial constraints'],
  },
  {
    headword: 'display',
    turkish: 'sergilemek',
    unit: '3',
    section: 'Extra Words',
    forms: { verb: ['display'], noun: ['display'], adjective: [], adverb: [] },
    collocations: ['on display', 'to display emotions/symptoms'],
  },
  {
    headword: 'external',
    turkish: 'dış',
    unit: '3',
    section: 'Extra Words',
    forms: { verb: [], noun: [], adjective: ['external', 'internal'], adverb: ['externally'] },
    collocations: ['external pressure/factors/walls'],
  },
  {
    headword: 'selection',
    turkish: 'seçim',
    unit: '3',
    section: 'Extra Words',
    forms: { verb: ['select'], noun: ['selection'], adjective: ['selective'], adverb: [] },
    collocations: ['a wide selection of sth', 'the process of selection'],
  },
  {
    headword: 'unjustly',
    turkish: 'haksızca',
    unit: '3',
    section: 'Extra Words',
    forms: {
      verb: [],
      noun: ['injustice'],
      adjective: ['unjust', 'just'],
      adverb: ['unjustly'],
    },
    collocations: ['to be treated unjustly'],
  },
  
  // =================================================================
  // UNIT 4: READING & WRITING
  // =================================================================
  {
    headword: 'abandon',
    turkish: 'terk etmek',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['abandon'],
      noun: ['abandonment'],
      adjective: ['abandoned'],
      adverb: [],
    },
    collocations: ['to abandon a plan/a ship/a child', 'an abandoned building'],
  },
  {
    headword: 'alternative',
    turkish: 'alternatif',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['alternate'],
      noun: ['alternative'],
      adjective: ['alternative'],
      adverb: ['alternatively'],
    },
    collocations: ['an alternative to sth', 'to have no alternative'],
  },
  {
    headword: 'approve',
    turkish: 'onaylamak',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['approve'],
      noun: ['approval', 'disapproval'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to approve of sth', 'to give approval for sth'],
  },
  {
    headword: 'arise',
    turkish: 'ortaya çıkmak',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: ['arise'], noun: [], adjective: [], adverb: [] },
    collocations: ['if the opportunity arises', 'a problem has arisen'],
  },
  {
    headword: 'brief',
    turkish: 'kısa',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: ['brief'], noun: ['briefing'], adjective: ['brief'], adverb: ['briefly'] },
    collocations: ['a brief description/visit/moment', 'in brief'],
  },
  {
    headword: 'challenge',
    turkish: 'meydan okumak',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['challenge'],
      noun: ['challenge'],
      adjective: ['challenging'],
      adverb: [],
    },
    collocations: ['to face a challenge', 'to accept a challenge', 'a big challenge'],
  },
  {
    headword: 'competition',
    turkish: 'rekabet',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['compete'],
      noun: ['competition', 'competitor'],
      adjective: ['competitive'],
      adverb: [],
    },
    collocations: ['fierce competition', 'to enter a competition', 'in competition with'],
  },
  {
    headword: 'convenient',
    turkish: 'uygun',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['convenience', 'inconvenience'],
      adjective: ['convenient', 'inconvenient'],
      adverb: ['conveniently'],
    },
    collocations: ['a convenient time/place/method'],
  },
  {
    headword: 'eventually',
    turkish: 'sonunda',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: [], noun: [], adjective: ['eventual'], adverb: ['eventually'] },
    collocations: [],
  },
  {
    headword: 'expertise',
    turkish: 'uzmanlık',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: [], noun: ['expertise', 'expert'], adjective: ['expert'], adverb: [] },
    collocations: ['expertise in a field', 'to have/lack expertise'],
  },
  {
    headword: 'extend',
    turkish: 'uzatmak',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: ['extend'], noun: ['extension'], adjective: ['extensive'], adverb: [] },
    collocations: ['to extend a deadline/a visa', 'an extension of sth'],
  },
  {
    headword: 'highlight',
    turkish: 'vurgulamak',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: ['highlight'], noun: ['highlight'], adjective: [], adverb: [] },
    collocations: ['to highlight the main points/a problem'],
  },
  {
    headword: 'import',
    turkish: 'ithal etmek',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: ['import'], noun: ['import', 'importer'], adjective: [], adverb: [] },
    collocations: ['to import goods from a country'],
  },
  {
    headword: 'ignore',
    turkish: 'görmezden gelmek',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: ['ignore'], noun: ['ignorance'], adjective: ['ignorant'], adverb: [] },
    collocations: ['to ignore advice/a warning/a person'],
  },
  {
    headword: 'initially',
    turkish: 'başlangıçta',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: ['initiate'], noun: ['initial', 'initiative'], adjective: ['initial'], adverb: ['initially'] },
    collocations: ['initially, I thought...'],
  },
  {
    headword: 'investment',
    turkish: 'yatırım',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: ['invest'], noun: ['investment', 'investor'], adjective: [], adverb: [] },
    collocations: ['to make an investment', 'a good/wise investment', 'return on investment'],
  },
  {
    headword: 'numerous',
    turkish: 'çok sayıda',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: [], noun: [], adjective: ['numerous'], adverb: [] },
    collocations: ['numerous occasions/examples/times'],
  },
  {
    headword: 'objective',
    turkish: 'amaç',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: [], noun: ['objective'], adjective: ['objective'], adverb: ['objectively'] },
    collocations: ['the main objective', 'to achieve an objective'],
  },
  {
    headword: 'ordinary',
    turkish: 'sıradan',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: [], noun: [], adjective: ['ordinary', 'extraordinary'], adverb: ['ordinarily'] },
    collocations: ['an ordinary day', 'out of the ordinary'],
  },
  {
    headword: 'policy',
    turkish: 'politika',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: [], noun: ['policy'], adjective: [], adverb: [] },
    collocations: ['company/government policy', 'a strict policy', 'to adopt a policy'],
  },
  {
    headword: 'primary',
    turkish: 'birincil',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: [], noun: [], adjective: ['primary'], adverb: ['primarily'] },
    collocations: ['the primary cause/reason/concern', 'primary school'],
  },
  {
    headword: 'propose',
    turkish: 'önermek',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: ['propose'], noun: ['proposal'], adjective: [], adverb: [] },
    collocations: ['to propose a plan/a solution', 'to propose marriage'],
  },
  {
    headword: 'purchase',
    turkish: 'satın almak',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: ['purchase'], noun: ['purchase'], adjective: [], adverb: [] },
    collocations: ['to make a purchase', 'proof of purchase'],
  },
  {
    headword: 'replacement',
    turkish: 'yedek',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: ['replace'], noun: ['replacement'], adjective: [], adverb: [] },
    collocations: ['a replacement for sb/sth', 'a replacement part'],
  },
  {
    headword: 'stability',
    turkish: 'istikrar',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['stabilize'],
      noun: ['stability', 'instability'],
      adjective: ['stable', 'unstable'],
      adverb: [],
    },
    collocations: ['economic/political stability', 'to maintain stability'],
  },
  {
    headword: 'transform',
    turkish: 'dönüştürmek',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['transform'],
      noun: ['transformation'],
      adjective: ['transformative'],
      adverb: [],
    },
    collocations: ['to transform sth into sth else', 'a complete transformation'],
  },
  {
    headword: 'variable',
    turkish: 'değişken',
    unit: '4',
    section: 'Reading & Writing',
    forms: { verb: ['vary'], noun: ['variable', 'variation'], adjective: ['variable'], adverb: [] },
    collocations: ['a key variable', 'the temperature is variable'],
  },
  
  // =================================================================
  // UNIT 4: LISTENING & SPEAKING
  // =================================================================
  {
    headword: 'approach',
    turkish: 'yaklaşım',
    unit: '4',
    section: 'Listening & Speaking',
    forms: { verb: ['approach'], noun: ['approach'], adjective: ['approachable'], adverb: [] },
    collocations: ['a new/different approach', 'an approach to a problem'],
  },
  {
    headword: 'approximately',
    turkish: 'yaklaşık olarak',
    unit: '4',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: [], adjective: ['approximate'], adverb: ['approximately'] },
    collocations: [],
  },
  {
    headword: 'attraction',
    turkish: 'çekicilik',
    unit: '4',
    section: 'Listening & Speaking',
    forms: { verb: ['attract'], noun: ['attraction'], adjective: ['attractive'], adverb: [] },
    collocations: ['tourist attraction', 'to feel an attraction to sb'],
  },
  {
    headword: 'barrier',
    turkish: 'engel',
    unit: '4',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: ['barrier'], adjective: [], adverb: [] },
    collocations: ['a barrier to communication/success', 'to break down barriers'],
  },
  {
    headword: 'bother',
    turkish: 'rahatsız etmek',
    unit: '4',
    section: 'Listening & Speaking',
    forms: { verb: ['bother'], noun: ['bother'], adjective: [], adverb: [] },
    collocations: ['to bother sb', 'don\'t bother to do sth', 'can\'t be bothered'],
  },
  {
    headword: 'commitment',
    turkish: 'bağlılık',
    unit: '4',
    section: 'Listening & Speaking',
    forms: { verb: ['commit'], noun: ['commitment'], adjective: ['committed'], adverb: [] },
    collocations: ['a commitment to sth', 'to make a commitment', 'a lack of commitment'],
  },
  {
    headword: 'confused',
    turkish: 'şaşkın',
    unit: '4',
    section: 'Listening & Speaking',
    forms: { verb: ['confuse'], noun: ['confusion'], adjective: ['confused', 'confusing'], adverb: [] },
    collocations: ['to be/get confused', 'to confuse A with B', 'a confusing situation'],
  },
  {
    headword: 'conventional',
    turkish: 'geleneksel',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['convention'],
      adjective: ['conventional', 'unconventional'],
      adverb: ['conventionally'],
    },
    collocations: ['conventional methods/wisdom/weapons'],
  },
  {
    headword: 'enthusiastic',
    turkish: 'hevesli',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['enthusiasm', 'enthusiast'],
      adjective: ['enthusiastic'],
      adverb: ['enthusiastically'],
    },
    collocations: ['to be enthusiastic about sth'],
  },
  {
    headword: 'executive',
    turkish: 'yönetici',
    unit: '4',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: ['executive'], adjective: ['executive'], adverb: [] },
    collocations: ['a senior/chief executive', 'an executive decision'],
  },
  {
    headword: 'global',
    turkish: 'küresel',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['globalize'],
      noun: ['globalization'],
      adjective: ['global'],
      adverb: ['globally'],
    },
    collocations: ['global warming', 'a global market/economy'],
  },
  {
    headword: 'implement',
    turkish: 'uygulamak',
    unit: '4',
    section: 'Listening & Speaking',
    forms: { verb: ['implement'], noun: ['implementation'], adjective: [], adverb: [] },
    collocations: ['to implement a plan/a policy/a system'],
  },
  {
    headword: 'install',
    turkish: 'kurmak',
    unit: '4',
    section: 'Listening & Speaking',
    forms: { verb: ['install'], noun: ['installation'], adjective: [], adverb: [] },
    collocations: ['to install software/equipment'],
  },
  {
    headword: 'intense',
    turkish: 'yoğun',
    unit: '4',
    section: 'Listening & Speaking',
    forms: { verb: ['intensify'], noun: ['intensity'], adjective: ['intense'], adverb: ['intensely'] },
    collocations: ['intense pressure/heat/competition'],
  },
  {
    headword: 'issue',
    turkish: 'sorun',
    unit: '4',
    section: 'Listening & Speaking',
    forms: { verb: ['issue'], noun: ['issue'], adjective: [], adverb: [] },
    collocations: ['a political/social/environmental issue', 'to raise an issue'],
  },
  {
    headword: 'monitor',
    turkish: 'izlemek',
    unit: '4',
    section: 'Listening & Speaking',
    forms: { verb: ['monitor'], noun: ['monitor'], adjective: [], adverb: [] },
    collocations: ['to monitor a situation/progress/sb\'s health'],
  },
  {
    headword: 'occur',
    turkish: 'oluşmak',
    unit: '4',
    section: 'Listening & Speaking',
    forms: { verb: ['occur'], noun: ['occurrence'], adjective: [], adverb: [] },
    collocations: ['it never occurred to me', 'an event occurred'],
  },
  {
    headword: 'priority',
    turkish: 'öncelik',
    unit: '4',
    section: 'Listening & Speaking',
    forms: { verb: ['prioritize'], noun: ['priority'], adjective: ['prior'], adverb: [] },
    collocations: ['to be a top/high priority', 'to give priority to sth'],
  },
  {
    headword: 'random',
    turkish: 'rastgele',
    unit: '4',
    section: 'Listening & Speaking',
    forms: { verb: [], noun: [], adjective: ['random'], adverb: ['randomly'] },
    collocations: ['at random', 'a random selection/sample'],
  },
  {
    headword: 'representative',
    turkish: 'temsilci',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['represent'],
      noun: ['representative', 'representation'],
      adjective: ['representative'],
      adverb: [],
    },
    collocations: ['a sales representative', 'a representative of a group'],
  },
  {
    headword: 'retain',
    turkish: 'tutmak',
    unit: '4',
    section: 'Listening & Speaking',
    forms: { verb: ['retain'], noun: ['retention'], adjective: [], adverb: [] },
    collocations: ['to retain control/information/heat'],
  },
  {
    headword: 'reveal',
    turkish: 'ortaya çıkarmak',
    unit: '4',
    section: 'Listening & Speaking',
    forms: { verb: ['reveal'], noun: ['revelation'], adjective: [], adverb: [] },
    collocations: ['to reveal a secret/the truth/information'],
  },
  {
    headword: 'visual',
    turkish: 'görsel',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['visualize'],
      noun: ['vision', 'visualization'],
      adjective: ['visual'],
      adverb: ['visually'],
    },
    collocations: ['visual aids/effects/art'],
  },
  
  // =================================================================
  // UNIT 4: EXTRA WORDS
  // =================================================================
  {
    headword: 'dominant',
    turkish: 'baskın',
    unit: '4',
    section: 'Extra Words',
    forms: {
      verb: ['dominate'],
      noun: ['dominance', 'domination'],
      adjective: ['dominant'],
      adverb: [],
    },
    collocations: ['a dominant position/role/gene'],
  },
  {
    headword: 'hesitate',
    turkish: 'tereddüt etmek',
    unit: '4',
    section: 'Extra Words',
    forms: {
      verb: ['hesitate'],
      noun: ['hesitation', 'hesitancy'],
      adjective: ['hesitant'],
      adverb: [],
    },
    collocations: ['to hesitate before doing sth', 'without hesitation'],
  },
  {
    headword: 'irony',
    turkish: 'ironi',
    unit: '4',
    section: 'Extra Words',
    forms: { verb: [], noun: ['irony'], adjective: ['ironic'], adverb: ['ironically'] },
    collocations: ['the irony of a situation'],
  },
  {
    headword: 'mode',
    turkish: 'mod',
    unit: '4',
    section: 'Extra Words',
    forms: { verb: [], noun: ['mode'], adjective: [], adverb: [] },
    collocations: ['a mode of transport/payment/operation'],
  },
  {
    headword: 'orient',
    turkish: 'yönlendirmek',
    unit: '4',
    section: 'Extra Words',
    forms: { verb: ['orient'], noun: ['orientation'], adjective: ['oriented'], adverb: [] },
    collocations: ['to orient sb towards sth', 'customer-oriented'],
  },
  {
    headword: 'pursue',
    turkish: 'takip etmek',
    unit: '4',
    section: 'Extra Words',
    forms: { verb: ['pursue'], noun: ['pursuit'], adjective: [], adverb: [] },
    collocations: ['to pursue a goal/a career/an interest'],
  },
  {
    headword: 'sedentary',
    turkish: 'hareketsiz',
    unit: '4',
    section: 'Extra Words',
    forms: { verb: [], noun: [], adjective: ['sedentary'], adverb: [] },
    collocations: ['a sedentary lifestyle/job'],
  },
  {
    headword: 'supplement',
    turkish: 'takviye',
    unit: '4',
    section: 'Extra Words',
    forms: {
      verb: ['supplement'],
      noun: ['supplement'],
      adjective: ['supplementary'],
      adverb: [],
    },
    collocations: ['a dietary supplement', 'to supplement your income'],
  },
  {
      "headword": "associate",
      "turkish": "ilişkilendirmek",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["associate"],
        "noun": ["association"],
        "adjective": ["associated"],
        "adverb": []
      },
      "collocations": ["to be associated with sth"]
    },
    {
      "headword": "budget",
      "turkish": "bütçe",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["budget"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["family budget", "to be on a budget"]
    },
    {
      "headword": "collapse",
      "turkish": "çöküş, çökmek",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["collapse"],
        "noun": ["collapse"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "the collapse of society/economy",
        "in the danger of collapse",
        "a sudden/economic/mental/physical collapse"
      ]
    },
    {
      "headword": "consequently",
      "turkish": "sonuç olarak",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["consequence"],
        "adjective": ["consequent"],
        "adverb": ["consequently"]
      },
      "collocations": [
        "to have dangerous/serious/consequences",
        "to lead to/suffer/face consequences",
        "as a consequence of sth",
        "social/political/economic consequences"
      ]
    },
    {
      "headword": "convince",
      "turkish": "ikna etmek",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["convince"],
        "noun": [],
        "adjective": ["convincing", "convinced"],
        "adverb": []
      },
      "collocations": ["to make a convincing argument", "to convince sb to do sth"]
    },
    {
      "headword": "dependent",
      "turkish": "bağımlı",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["depend"],
        "noun": ["dependency", "dependence", "independence"],
        "adjective": ["dependent", "independent"],
        "adverb": ["independently"]
      },
      "collocations": [
        "dependency on sth/sb",
        "to depend on sth/sb",
        "to be dependent on/upon sth/sb (for sth)"
      ]
    },
    {
      "headword": "determine",
      "turkish": "belirlemek, karar vermek",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["determine"],
        "noun": ["determination"],
        "adjective": ["determined"],
        "adverb": []
      },
      "collocations": ["to determine to do something", "to have/show/determination"]
    },
    {
      "headword": "distinguish",
      "turkish": "ayırt etmek, seçkin olmak",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["distinguish"],
        "noun": [],
        "adjective": ["distinguished"],
        "adverb": []
      },
      "collocations": ["to distinguish sb/sth from sb/sth", "a distinguished person/career"]
    },
    {
      "headword": "effective",
      "turkish": "etkili",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["effect"],
        "adjective": ["effective", "ineffective"],
        "adverb": ["effectively", "ineffectively"]
      },
      "collocations": ["partially effective"]
    },
    {
      "headword": "exceed",
      "turkish": "aşmak, geçmek",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["exceed"],
        "noun": ["excess"],
        "adjective": ["excess"],
        "adverb": []
      },
      "collocations": ["to exceed one's capacity/expectations", "to exceed the speed limit"]
    },
    {
      "headword": "exposure",
      "turkish": "maruz kalma, ifşa",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["expose"],
        "noun": ["exposure"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "to expose something to sth",
        "to expose somebody to sth",
        "to be exposed to sth",
        "high/massive/excessive exposure"
      ]
    },
    {
      "headword": "funding",
      "turkish": "finansman, fon sağlama",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["fund"],
        "noun": ["funding"],
        "adjective": ["funding"],
        "adverb": []
      },
      "collocations": ["government/education/research funding"]
    },
    {
      "headword": "gather",
      "turkish": "toplamak, bir araya gelmek",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["gather"],
        "noun": ["gathering"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to quickly/slowly gather", "a formal gathering"]
    },
    {
      "headword": "infected",
      "turkish": "enfekte olmuş",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["infect"],
        "noun": ["infection"],
        "adjective": ["infectious", "infected"],
        "adverb": []
      },
      "collocations": [
        "to have/suffer from/develop an infection",
        "to treat/fight an infection",
        "infectious disease",
        "to get/become infected heavily"
      ]
    },
    {
      "headword": "insight",
      "turkish": "içgörü",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["insight"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to provide/give an insight into sth", "to offer insight"]
    },
    {
      "headword": "persuade",
      "turkish": "ikna etmek",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["persuade"],
        "noun": ["persuasion"],
        "adjective": ["persuasive"],
        "adverb": []
      },
      "collocations": [
        "to persuade sb to do sth",
        "to persuade sb into doing sth",
        "to try/manage/fail to persuade sb",
        "persuasive argument/evidence"
      ]
    },
    {
      "headword": "polluted",
      "turkish": "kirli, kirlenmiş",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["pollute"],
        "noun": ["pollution"],
        "adjective": ["polluted", "unpolluted"],
        "adverb": []
      },
      "collocations": [
        "water/air/noise/light pollution",
        "pollution levels/control",
        "polluted air/water/rivers",
        "to pollute sth with sth"
      ]
    },
    {
      "headword": "prevention",
      "turkish": "önleme",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["prevent"],
        "noun": ["prevention"],
        "adjective": ["preventable"],
        "adverb": []
      },
      "collocations": [
        "disease/accident/crime prevention",
        "to prevent sb from doing sth",
        "preventable diseases/accidents"
      ]
    },
    {
      "headword": "productive",
      "turkish": "üretken",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["produce", "reproduce"],
        "noun": ["(re)production", "product", "producer"],
        "adjective": ["productive", "unproductive"],
        "adverb": ["productively"]
      },
      "collocations": ["productive land/workers/meetings"]
    },
    {
      "headword": "proof",
      "turkish": "kanıt, ispat",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["prove"],
        "noun": ["proof"],
        "adjective": ["proven"],
        "adverb": []
      },
      "collocations": ["to prove sth to sb", "to have proof", "concrete/absolute proof"]
    },
    {
      "headword": "related",
      "turkish": "ilişkili",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["relate"],
        "noun": ["relation"],
        "adjective": ["related"],
        "adverb": []
      },
      "collocations": ["related to", "in relation to"]
    },
    {
      "headword": "significant",
      "turkish": "önemli, anlamlı",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["significance"],
        "adjective": ["significant", "insignificant"],
        "adverb": ["significantly"]
      },
      "collocations": ["to be significant to or for sth/sb", "to attach significance to"]
    },
    {
      "headword": "suffer",
      "turkish": "acı çekmek, maruz kalmak",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["suffer"],
        "noun": ["suffering"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to suffer from an illness"]
    },
    {
      "headword": "supply",
      "turkish": "tedarik, sağlamak",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["supply"],
        "noun": ["supply"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["a food/water/money supply", "an endless supply of sth"]
    },
    {
      "headword": "ultimately",
      "turkish": "nihayetinde",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["ultimate"],
        "adverb": ["ultimately"]
      },
      "collocations": ["the ultimate aim"]
    },
    {
      "headword": "undergo",
      "turkish": "geçirmek, yaşamak",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["undergo"],
        "noun": [],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to undergo a development process"]
    },
    {
      "headword": "virtual",
      "turkish": "sanal",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["virtual"],
        "adverb": ["virtually"]
      },
      "collocations": ["virtual reality"]
    },
    {
      "headword": "widespread",
      "turkish": "yaygın",
      "unit": "5",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["widespread"],
        "adverb": []
      },
      "collocations": ["widespread damage/support"]
    },
    // =================================================================
    // UNIT 5: LISTENING & SPEAKING
    // =================================================================
    {
      "headword": "assess",
      "turkish": "değerlendirmek, tahmin etmek",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["assess"],
        "noun": ["assessment"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to make/give assessment", "assessment methods"]
    },
    {
      "headword": "aim",
      "turkish": "amaç, hedeflemek",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["aim"],
        "noun": ["aim"],
        "adjective": ["aimless"],
        "adverb": []
      },
      "collocations": ["to have/achieve an aim", "to aim for/at sth", "to aim to do sth"]
    },
    {
      "headword": "claim",
      "turkish": "iddia etmek, talep etmek",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["claim"],
        "noun": ["claim"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["a false claim", "to claim to do/be something"]
    },
    {
      "headword": "classic",
      "turkish": "klasik",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["classic"],
        "adjective": ["classical", "classic"],
        "adverb": ["classically"]
      },
      "collocations": [
        "a classic car/classic good looks",
        "classic example/mistake/case/design",
        "classical music/musician/composer",
        "classical literature"
      ]
    },
    {
      "headword": "clarify",
      "turkish": "açıklığa kavuşturmak",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["clarify"],
        "noun": ["clarification"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to fully/further clarify", "to clarify expectations"]
    },
    {
      "headword": "concentration",
      "turkish": "konsantrasyon, yoğunlaşma",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["concentrate"],
        "noun": ["concentration"],
        "adjective": ["concentrated"],
        "adverb": []
      },
      "collocations": [
        "a large/high/small/low concentration of sth",
        "the concentration of sth increases/decreases"
      ]
    },
    {
      "headword": "concern",
      "turkish": "endişe, ilgilendirmek",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["concern"],
        "noun": ["concern"],
        "adjective": ["concerned"],
        "adverb": []
      },
      "collocations": ["to be concerned with"]
    },
    {
      "headword": "conclude",
      "turkish": "sonuçlandırmak, varmak (sonuca)",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["conclude"],
        "noun": ["conclusion"],
        "adjective": ["conclusive"],
        "adverb": []
      },
      "collocations": ["to conclude sth", "in conclusion", "conclusive proof/evidence/findings"]
    },
    {
      "headword": "critical",
      "turkish": "eleştirel, kritik",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["criticize"],
        "noun": ["criticism"],
        "adjective": ["critical"],
        "adverb": ["critically"]
      },
      "collocations": ["to criticize sb for sth", "a critical comment/report", "critical thinking"]
    },
    {
      "headword": "cure",
      "turkish": "tedavi, iyileştirmek",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["cure"],
        "noun": ["cure"],
        "adjective": ["curable", "incurable"],
        "adverb": []
      },
      "collocations": ["a cure for an illness/poverty", "to find a cure", "to cure sb of sth"]
    },
    {
      "headword": "digest",
      "turkish": "sindirmek",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["digest"],
        "noun": ["digestion"],
        "adjective": ["digestive", "digestible"],
        "adverb": []
      },
      "collocations": [
        "good/poor digestion",
        "digestive system/organs/juices etc.",
        "easily digestible food"
      ]
    },
    {
      "headword": "dimension",
      "turkish": "boyut",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["dimension"],
        "adjective": ["dimensional"],
        "adverb": []
      },
      "collocations": [
        "to have many dimensions",
        "to add a new/an extra/another dimension (to sth)",
        "political/social/economic dimension",
        "three-dimensional/(3D)"
      ]
    },
    {
      "headword": "eliminate",
      "turkish": "ortadan kaldırmak, elemek",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["eliminate"],
        "noun": ["elimination"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to eliminate sth (from sth)"]
    },
    {
      "headword": "ethnicity",
      "turkish": "etnik köken",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["ethnicity"],
        "adjective": ["ethnic"],
        "adverb": ["ethnically"]
      },
      "collocations": ["ethnic origin/groups/clothes/jewelry/food"]
    },
    {
      "headword": "exist",
      "turkish": "var olmak",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["exist"],
        "noun": ["existence"],
        "adjective": ["existing"],
        "adverb": []
      },
      "collocations": ["human existence", "to bring sth into existence"]
    },
    {
      "headword": "explicitly",
      "turkish": "açıkça, belirgin bir şekilde",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["explicit"],
        "adverb": ["explicitly"]
      },
      "collocations": ["to be explicit about sth", "explicitly forbidden"]
    },
    {
      "headword": "extinct",
      "turkish": "nesli tükenmiş",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["extinction"],
        "adjective": ["extinct"],
        "adverb": []
      },
      "collocations": ["to go/become extinct", "extinct species/animals", "in danger of extinction"]
    },
    {
      "headword": "framework",
      "turkish": "çerçeve, yapı",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["framework"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["constitutional/organizational framework"]
    },
    {
      "headword": "harmful",
      "turkish": "zararlı",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["harm"],
        "noun": ["harm"],
        "adjective": ["harmful", "harmless"],
        "adverb": ["harmlessly"]
      },
      "collocations": ["to do/cause harm"]
    },
    {
      "headword": "indicate",
      "turkish": "göstermek, belirtmek",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["indicate"],
        "noun": ["indication", "indicator"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["regard/see sth as an indication of sth"]
    },
    {
      "headword": "infection",
      "turkish": "enfeksiyon",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["infect"],
        "noun": ["infection"],
        "adjective": ["infectious"],
        "adverb": []
      },
      "collocations": [
        "to have/suffer from/develop an infection",
        "to treat/fight an infection",
        "infectious disease"
      ]
    },
    {
      "headword": "obtain",
      "turkish": "edinmek, elde etmek",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["obtain"],
        "noun": [],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to obtain a degree", "to be able/unable to obtain"]
    },
    {
      "headword": "occupation",
      "turkish": "meslek, işgal",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["occupy"],
        "noun": ["occupation"],
        "adjective": ["occupational"],
        "adverb": []
      },
      "collocations": ["an occupational hazard"]
    },
    {
      "headword": "proof",
      "turkish": "kanıt, ispat",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["prove"],
        "noun": ["proof"],
        "adjective": ["proven"],
        "adverb": []
      },
      "collocations": ["to have proof", "concrete/absolute/clear proof"]
    },
    {
      "headword": "refuse",
      "turkish": "reddetmek",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["refuse"],
        "noun": ["refusal"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to refuse a(n) request/visa/invitation/offer"]
    },
    {
      "headword": "reinforce",
      "turkish": "güçlendirmek, pekiştirmek",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["reinforce"],
        "noun": ["reinforcement"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to reinforce a belief", "to reinforce with/by sth", "positive reinforcement"]
    },
    {
      "headword": "resistant",
      "turkish": "dayanıklı, dirençli",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["resist"],
        "noun": ["resistance"],
        "adjective": ["resistant"],
        "adverb": []
      },
      "collocations": [
        "resistance to/from",
        "to put up/offer resistance",
        "wind/air/water resistance",
        "to resist the urge/a trend/a tendency"
      ]
    },
    {
      "headword": "symptom",
      "turkish": "belirti, semptom",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["symptom"],
        "adjective": ["symptomatic"],
        "adverb": []
      },
      "collocations": ["to display a symptom", "symptoms of a disease"]
    },
    {
      "headword": "stress",
      "turkish": "stres, vurgulamak",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["stress=emphasize", "stress"],
        "noun": ["stress"],
        "adjective": ["stressful", "stressed"],
        "adverb": ["stressfully"]
      },
      "collocations": [
        "to stress the importance of sth",
        "to stress the need for sth",
        "a stressful time/situation/life",
        "to be/feel stressed"
      ]
    },
    {
      "headword": "treat",
      "turkish": "tedavi etmek, davranmak",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["treat"],
        "noun": ["treatment"],
        "adjective": ["treatable"],
        "adverb": []
      },
      "collocations": [
        "emergency/long-term/dental/medical treatment",
        "to have/require/receive/undergo treatment"
      ]
    },
    {
      "headword": "valid",
      "turkish": "geçerli",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["validity"],
        "adjective": ["valid", "invalid"],
        "adverb": []
      },
      "collocations": [
        "to give sb treatment",
        "a treatment method",
        "to be in treatment for",
        "(in)valid reasons",
        "a valid claim/argument"
      ]
    },
    {
      "headword": "vary",
      "turkish": "değişmek, çeşitlilik göstermek",
      "unit": "5",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["vary"],
        "noun": ["variation", "variety"],
        "adjective": ["various"],
        "adverb": []
      },
      "collocations": ["to vary considerably/enormously"]
    },
    // =================================================================
    // UNIT 5: EXTRA WORDS
    // =================================================================
    {
      "headword": "allocate",
      "turkish": "tahsis etmek, ayırmak",
      "unit": "5",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["allocate"],
        "noun": ["allocation"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to allocate time/money/resources/funds", "allocate sth for sth/to sth"]
    },
    {
      "headword": "deviate",
      "turkish": "sapmak, ayrılmak",
      "unit": "5",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["deviate"],
        "noun": ["deviation"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to deviate from sth", "deviation from"]
    },
    {
      "headword": "dismiss",
      "turkish": "kovmak, reddetmek",
      "unit": "5",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["dismiss"],
        "noun": ["dismissal"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to dismiss an idea/the class"]
    },
    {
      "headword": "interrupt",
      "turkish": "kesmek, bölmek",
      "unit": "5",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["interrupt"],
        "noun": ["interruption"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["without interruptions"]
    },
    {
      "headword": "primitive",
      "turkish": "ilkel",
      "unit": "5",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["primitive"],
        "adverb": ["primitively"]
      },
      "collocations": ["primitive tools", "primitive behavior (negative)"]
    },
    {
      "headword": "radical",
      "turkish": "radikal, köklü",
      "unit": "5",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": [],
        "noun": ["radical (a person)"],
        "adjective": ["radical"],
        "adverb": ["radically"]
      },
      "collocations": ["radical changes/ideas/solutions"]
    },
    {
      "headword": "reward",
      "turkish": "ödül, ödüllendirmek",
      "unit": "5",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["reward"],
        "noun": ["reward"],
        "adjective": ["rewarding"],
        "adverb": []
      },
      "collocations": [
        "to reward sb with sth",
        "to reward sb for (doing) sth",
        "to get/receive one's reward",
        "a financially rewarding career"
      ]
    },
    {
      "headword": "temporary",
      "turkish": "geçici",
      "unit": "5",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["temporary"],
        "adverb": ["temporarily"]
      },
      "collocations": ["on a temporary basis", "temporary measure"]
    },
    // =================================================================
    // UNIT 6: READING & WRITING
    // =================================================================
    {
      "headword": "annually",
      "turkish": "yıllık olarak",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["annual"],
        "adverb": ["annually"]
      },
      "collocations": ["annual income/reports", "annual budget/income/cost"]
    },
    {
      "headword": "assist",
      "turkish": "yardım etmek",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["assist"],
        "noun": ["assistance", "assistant"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to give/offer sb assistance", "to assist with sth", "to assist sb in doing sth"]
    },
    {
      "headword": "commerce",
      "turkish": "ticaret",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["commerce"],
        "adjective": ["commercial"],
        "adverb": ["commercially"]
      },
      "collocations": ["international/domestic commerce", "commerce between/with"]
    },
    {
      "headword": "consumption",
      "turkish": "tüketim",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["consume"],
        "noun": ["consumer", "consumption", "consumerism"],
        "adjective": ["consumer"],
        "adverb": []
      },
      "collocations": [
        "consumer rights",
        "to protect/satisfy consumer",
        "to boost/increase/reduce consumption",
        "high/low consumption"
      ]
    },
    {
      "headword": "decline",
      "turkish": "düşüş, azalmak",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["decline"],
        "noun": ["decline"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "to decline in importance/size",
        "steep/steady/sharp decline in sth",
        "the decline of a civilization"
      ]
    },
    {
      "headword": "determine",
      "turkish": "belirlemek, karar vermek",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["determine"],
        "noun": ["determination"],
        "adjective": ["determined"],
        "adverb": []
      },
      "collocations": [
        "absolute/strong/clear determination",
        "to show/be full of/require/lack determination"
      ]
    },
    {
      "headword": "discrimination",
      "turkish": "ayrımcılık",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["discriminate"],
        "noun": ["discrimination"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "to discriminate against sb/a group of people",
        "age/racial/genetic discrimination"
      ]
    },
    {
      "headword": "disrupt",
      "turkish": "aksatmak, bozmak",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["disrupt"],
        "noun": ["disruption"],
        "adjective": ["disruptive"],
        "adverb": []
      },
      "collocations": ["to be disrupted by sth", "to cause (serious/widespread) disruption"]
    },
    {
      "headword": "distribution",
      "turkish": "dağıtım",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["distribute", "redistribute"],
        "noun": ["distribution", "redistribution"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "redistribution of wealth/resources",
        "to distribute sth among/to sb",
        "to distribute fairly/equally"
      ]
    },
    {
      "headword": "diversity",
      "turkish": "çeşitlilik",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["diversity"],
        "adjective": ["diverse"],
        "adverb": []
      },
      "collocations": [
        "cultural/ethnic/biological/genetic/religious diversity",
        "diversity of sth",
        "to encourage/promote diversity"
      ]
    },
    {
      "headword": "gradually",
      "turkish": "yavaş yavaş, kademeli olarak",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["gradual"],
        "adverb": ["gradually"]
      },
      "collocations": ["a gradual increase/decrease"]
    },
    {
      "headword": "grant",
      "turkish": "hibe, vermek",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["grant"],
        "noun": ["grant"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["grant sb sth", "grant sth to sb", "a government/research/student grant"]
    },
    {
      "headword": "inevitable",
      "turkish": "kaçınılmaz",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["inevitability"],
        "adjective": ["inevitable"],
        "adverb": ["inevitably"]
      },
      "collocations": ["an inevitable result/ consequence"]
    },
    {
      "headword": "minority",
      "turkish": "azınlık",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["minority"],
        "adjective": ["minority"],
        "adverb": []
      },
      "collocations": ["a minority group/opinion"]
    },
    {
      "headword": "processed",
      "turkish": "işlenmiş",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["process"],
        "noun": ["process"],
        "adjective": ["processed"],
        "adverb": []
      },
      "collocations": [
        "to process data/information",
        "to process an application (or other documents)"
      ]
    },
    {
      "headword": "proportion",
      "turkish": "oran, orantı",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["proportion"],
        "adjective": ["proportional"],
        "adverb": []
      },
      "collocations": [
        "production process",
        "processed food",
        "a large/small/equal/significant/direct proportion"
      ]
    },
    {
      "headword": "reasonable",
      "turkish": "makul, mantıklı",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["reason"],
        "adjective": ["reasonable"],
        "adverb": ["reasonably"]
      },
      "collocations": [
        "the main/major reason for sth",
        "a reasonable explanation/excuse",
        "a reasonable question/price",
        "perfectly/entirely reasonable"
      ]
    },
    {
      "headword": "resemble",
      "turkish": "benzemek",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["resemble"],
        "noun": ["resemblance"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "to closely resemble sth/sb",
        "a close/strong resemblance (between sth/sb and sth/sb)"
      ]
    },
    {
      "headword": "restriction",
      "turkish": "kısıtlama",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["restrict"],
        "noun": ["restriction"],
        "adjective": ["restricted", "restrictive"],
        "adverb": []
      },
      "collocations": ["to restrict sb's behavior", "to restrict seriously/unnecessarily"]
    },
    {
      "headword": "settlement",
      "turkish": "yerleşim, anlaşma",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["settle"],
        "noun": ["settlement"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to reach a legal settlement", "to settle in", "settlement of"]
    },
    {
      "headword": "shortage",
      "turkish": "kıtlık, eksiklik",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["shortage"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to create/cause a shortage", "a water/food/housing shortage"]
    },
    {
      "headword": "slight",
      "turkish": "hafif, ufak",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["slight"],
        "adverb": ["slightly"]
      },
      "collocations": ["a slight increase/change/difference/improvement", "to increase/decrease slightly"]
    },
    {
      "headword": "species",
      "turkish": "tür",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["species"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["human/extinct species"]
    },
    {
      "headword": "steadily",
      "turkish": "istikrarlı bir şekilde",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["steady"],
        "adverb": ["steadily"]
      },
      "collocations": ["to remain steady"]
    },
    {
      "headword": "substantial",
      "turkish": "önemli, büyük",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["substantial"],
        "adverb": ["substantially"]
      },
      "collocations": ["substantial decrease/increase"]
    },
    {
      "headword": "sustainable",
      "turkish": "sürdürülebilir",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["sustain"],
        "noun": ["sustainability"],
        "adjective": ["sustainable"],
        "adverb": []
      },
      "collocations": ["sustainable energy sources", "environmentally sustainable"]
    },
    {
      "headword": "threat",
      "turkish": "tehdit",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["threaten"],
        "noun": ["threat"],
        "adjective": ["threatening"],
        "adverb": []
      },
      "collocations": ["to pose a threat", "a threat against sth"]
    },
    {
      "headword": "variation",
      "turkish": "varyasyon, çeşitlilik",
      "unit": "6",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["vary"],
        "noun": ["variation", "variety"],
        "adjective": ["various", "variable"],
        "adverb": []
      },
      "collocations": [
        "varying types of sth",
        "variation of/in/among/between",
        "to vary greatly/slightly"
      ]
    },
    // =================================================================
    // UNIT 6: LISTENING & SPEAKING
    // =================================================================
    {
      "headword": "aware",
      "turkish": "farkında",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["awareness"],
        "adjective": ["aware", "unaware"],
        "adverb": []
      },
      "collocations": [
        "to have/raise awareness",
        "to be/become aware/unaware of sth",
        "a lack of awareness",
        "environmental/political/social awareness"
      ]
    },
    {
      "headword": "compile",
      "turkish": "derlemek, toplamak",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["compile"],
        "noun": ["compilation"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to compile data", "to compile sth from/for sth", "a compilation album"]
    },
    {
      "headword": "conscious",
      "turkish": "bilinçli",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["conscious (psychology)", "consciousness"],
        "adjective": ["conscious"],
        "adverb": ["consciously"]
      },
      "collocations": ["half-conscious", "conscious of (doing) sth"]
    },
    {
      "headword": "construct",
      "turkish": "inşa etmek",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["construct"],
        "noun": ["construction"],
        "adjective": ["constructive"],
        "adverb": []
      },
      "collocations": ["to give constructive advice/criticism"]
    },
    {
      "headword": "convert",
      "turkish": "dönüştürmek",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["convert"],
        "noun": ["conversion"],
        "adjective": ["convertible"],
        "adverb": []
      },
      "collocations": [
        "to convert sb to a religion",
        "to convert a building from one type to another",
        "a convertible sofa/car",
        "a convertible currency"
      ]
    },
    {
      "headword": "contribute",
      "turkish": "katkıda bulunmak",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["contribute"],
        "noun": ["contribution", "contributor"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "to make a contribution to sth",
        "to contribute to sth",
        "an important/big/major contribution"
      ]
    },
    {
      "headword": "current",
      "turkish": "mevcut, güncel",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["current"],
        "adverb": ["currently"]
      },
      "collocations": ["current condition/situation/population"]
    },
    {
      "headword": "donate",
      "turkish": "bağışlamak",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["donate"],
        "noun": ["donation"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "to donate money/blood",
        "a generous/small/public/private donation",
        "to make a donation"
      ]
    },
    {
      "headword": "economy",
      "turkish": "ekonomi",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["economy", "economics"],
        "adjective": ["economic", "economical"],
        "adverb": ["economically"]
      },
      "collocations": ["economic policies/factors/state/crisis", "economical car/way"]
    },
    {
      "headword": "emphasize",
      "turkish": "vurgulamak",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["emphasize"],
        "noun": ["emphasis"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to place emphasis on"]
    },
    {
      "headword": "ensure",
      "turkish": "sağlamak, garanti etmek",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["ensure"],
        "noun": [],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to ensure sb's safety"]
    },
    {
      "headword": "entire",
      "turkish": "tüm, bütün",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["entirety"],
        "adjective": ["entire"],
        "adverb": ["entirely"]
      },
      "collocations": ["in one's entire life"]
    },
    {
      "headword": "estimate",
      "turkish": "tahmin etmek",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["estimate"],
        "noun": ["estimate", "estimation"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "an estimation of costs",
        "an early/initial/rough/current estimate",
        "to make an estimate"
      ]
    },
    {
      "headword": "inspire",
      "turkish": "ilham vermek",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["inspire"],
        "noun": ["inspiration"],
        "adjective": ["inspired", "inspiring", "inspirational"],
        "adverb": []
      },
      "collocations": ["to inspire sb with sth", "to give sb inspiration", "provide sb with inspiration"]
    },
    {
      "headword": "negotiate",
      "turkish": "müzakere etmek",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["negotiate"],
        "noun": ["negotiation"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to negotiate with sb for/about sth", "to negotiate a deal/ contract"]
    },
    {
      "headword": "quit",
      "turkish": "bırakmak, ayrılmak",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["quit"],
        "noun": [],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to quit doing sth"]
    },
    {
      "headword": "rare",
      "turkish": "nadir",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["rareness"],
        "adjective": ["rare"],
        "adverb": ["rarely"]
      },
      "collocations": ["to become/get rare", "extremely/quite/rather rare"]
    },
    {
      "headword": "regard",
      "turkish": "ilişkin, saygı, olarak görmek",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["regard"],
        "noun": ["regard"],
        "adjective": ["regardless", "regarding (preposition)"],
        "adverb": []
      },
      "collocations": [
        "regardless of sth",
        "to regard sth as sth",
        "regard for",
        "with/in regard to sth"
      ]
    },
    {
      "headword": "resource",
      "turkish": "kaynak",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["resource"],
        "adjective": ["resourceful"],
        "adverb": []
      },
      "collocations": ["the distribution of resources", "financial/natural/limited resources"]
    },
    {
      "headword": "respond",
      "turkish": "yanıtlamak, karşılık vermek",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["respond"],
        "noun": ["response"],
        "adjective": ["responsive"],
        "adverb": []
      },
      "collocations": ["to respond quickly/effectively", "to respond to sth"]
    },
    {
      "headword": "specific",
      "turkish": "belirli, özgü",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["specify"],
        "noun": ["specification"],
        "adjective": ["specific"],
        "adverb": ["specifically"]
      },
      "collocations": ["to be specific (about sth)", "a specific time/place"]
    },
    {
      "headword": "structure",
      "turkish": "yapı, yapılandırmak",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["structure"],
        "noun": ["structure"],
        "adjective": ["structural"],
        "adverb": []
      },
      "collocations": ["social/political/economic structure", "molecular structure"]
    },
    {
      "headword": "survive",
      "turkish": "hayatta kalmak",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["survive"],
        "noun": ["survival", "survivor"],
        "adjective": ["survival"],
        "adverb": []
      },
      "collocations": ["to survive sth", "a survival instinct"]
    },
    {
      "headword": "wealth",
      "turkish": "zenginlik",
      "unit": "6",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["wealth"],
        "adjective": ["wealthy"],
        "adverb": []
      },
      "collocations": [
        "personal wealth",
        "enormous/considerable wealth",
        "to create/accumulate/acquire wealth"
      ]
    },
    // =================================================================
    // UNIT 6: EXTRA WORDS
    // =================================================================
    {
      "headword": "accommodation",
      "turkish": "konaklama",
      "unit": "6",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["accommodate"],
        "noun": ["accommodation"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to reserve accommodations (somewhere)", "to provide/offer accommodation"]
    },
    {
      "headword": "assimilate",
      "turkish": "asimile etmek, uyum sağlamak",
      "unit": "6",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["assimilate"],
        "noun": ["assimilation"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to assimilate sb (into/to sth)"]
    },
    {
      "headword": "blend",
      "turkish": "karışım, karıştırmak",
      "unit": "6",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["blend"],
        "noun": ["blend", "blender"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "to blend with sth",
        "to blend A with B",
        "to blend A and B (together)",
        "a blend of A and B"
      ]
    },
    {
      "headword": "conflict",
      "turkish": "çatışma",
      "unit": "6",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": [],
        "noun": ["conflict"],
        "adjective": ["conflicting"],
        "adverb": []
      },
      "collocations": ["constant conflict", "a conflict of interests", "conflicting information/results"]
    },
    {
      "headword": "hierarchy",
      "turkish": "hiyerarşi",
      "unit": "6",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": [],
        "noun": ["hierarchy"],
        "adjective": ["hierarchical"],
        "adverb": ["hierarchically"]
      },
      "collocations": ["organizational/social/strict hierarchy", "to create/establish/rise in hierarchy"]
    },
    {
      "headword": "livelihood",
      "turkish": "geçim kaynağı",
      "unit": "6",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": [],
        "noun": ["livelihood"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "a means (of)/sources (of) livelihood",
        "to earn/lose a livelihood",
        "to protect livelihoods"
      ]
    },
    {
      "headword": "negate",
      "turkish": "olumsuzlamak, etkisiz hale getirmek",
      "unit": "6",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["negate"],
        "noun": ["negation"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to negate sth"]
    },
    {
      "headword": "physiological",
      "turkish": "fizyolojik",
      "unit": "6",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": [],
        "noun": ["physiology"],
        "adjective": ["physiological"],
        "adverb": ["physiologically"]
      },
      "collocations": [
        "a physiological problem/cause",
        "a physiological reaction",
        "the physiology of the brain"
      ]
    },
    // =================================================================
    // UNIT 7: READING & WRITING
    // =================================================================
    {
      "headword": "arrest",
      "turkish": "tutuklamak, tutuklama",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["arrest"],
        "noun": ["arrest"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to arrest sb", "to be arrested for sth", "to be under arrest"]
    },
    {
      "headword": "basis",
      "turkish": "temel, esas",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["base (on)"],
        "noun": ["basis"],
        "adjective": ["based"],
        "adverb": []
      },
      "collocations": [
        "on a regular/daily/weekly/monthly basis",
        "on a voluntary/part-time/temporary basis",
        "to base sth on sth",
        "to form the basis of sth"
      ]
    },
    {
      "headword": "blame",
      "turkish": "suçlamak, suç",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["blame"],
        "noun": ["blame"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to put the blame on sb", "to blame sb for sth"]
    },
    {
      "headword": "charge",
      "turkish": "suçlamak, ücretlendirmek",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["charge"],
        "noun": ["charge"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "to charge sb with a crime",
        "to charge of/for",
        "in charge (of sth)",
        "free of charge"
      ]
    },
    {
      "headword": "commit",
      "turkish": "işlemek (suç), taahhüt etmek",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["commit"],
        "noun": ["commitment"],
        "adjective": ["committed"],
        "adverb": []
      },
      "collocations": ["to commit suicide/a crime", "to make a commitment", "to show/lack commitment"]
    },
    {
      "headword": "conduct",
      "turkish": "yürütmek, davranış",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["conduct"],
        "noun": ["conduct"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to conduct a survey or experiment"]
    },
    {
      "headword": "controversy",
      "turkish": "tartışma, ihtilaf",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["controversy"],
        "adjective": ["controversial"],
        "adverb": ["controversially"]
      },
      "collocations": [
        "to cause/create controversy",
        "controversy over/about",
        "highly controversial",
        "a controversial plan/proposal/policy/decision/issue"
      ]
    },
    {
      "headword": "corporate",
      "turkish": "kurumsal",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["corporation"],
        "adjective": ["corporate"],
        "adverb": []
      },
      "collocations": ["a corporate trainer/job", "corporate culture/identity/sector/profits"]
    },
    {
      "headword": "credit",
      "turkish": "kredi, itibar",
      "unit": "7",
      "section": "Reading & Writing",
      "senses": [{
        "definition": "to add money to a bank account",
        "unit": "7",
        "section": "Reading & Writing",
        "forms": {
          "verb": ["credit"],
          "noun": ["credit"],
          "adjective": [],
          "adverb": []
        },
        "collocations": [
          "to add money to a bank account",
          "to get/deserve/receive/take/claim the credit",
          "to buy/get sth on credit"
        ]
      }],
      "collocations": [
        "to get/deserve/receive/take/claim the credit",
        "to buy/get sth on credit"
      ]
    },
    {
      "headword": "declare",
      "turkish": "beyan etmek, ilan etmek",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["declare"],
        "noun": ["declaration"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to declare victory/war/bankruptcy"]
    },
    {
      "headword": "document",
      "turkish": "belgelemek, belge",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["document"],
        "noun": ["documentation"],
        "adjective": ["documented"],
        "adverb": []
      },
      "collocations": ["to have documentation of/for sth"]
    },
    {
      "headword": "extent",
      "turkish": "boyut, derece",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["extent"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "to understand/realize the (actual) extent of sth",
        "to some extent/to a certain extent",
        "to a large/great extent"
      ]
    },
    {
      "headword": "illegal",
      "turkish": "yasa dışı",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["legal", "illegal"],
        "adverb": ["legally", "illegally"]
      },
      "collocations": ["legal action/right/advice/profession/system"]
    },
    {
      "headword": "initiative",
      "turkish": "girişim",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["initiate"],
        "noun": ["initiative"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to plan/develop/introduce/launch an initiative", "to have the initiative to do sth"]
    },
    {
      "headword": "institute",
      "turkish": "kurum, enstitü",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["institute"],
        "noun": ["institution"],
        "adjective": ["institutional"],
        "adverb": []
      },
      "collocations": [
        "an institute of higher learning (university)",
        "financial/educational/research etc institution",
        "the institution of marriage/monarchy"
      ]
    },
    {
      "headword": "intention",
      "turkish": "niyet, amaç",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["intend"],
        "noun": ["intention"],
        "adjective": ["intentional", "unintentional"],
        "adverb": ["intentionally", "unintentionally"]
      },
      "collocations": [
        "to intend to do sth",
        "intention to do sth; intention of doing sth",
        "to have no/every intention of doing sth"
      ]
    },
    {
      "headword": "involve",
      "turkish": "içermek, dahil etmek",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["involve"],
        "noun": ["involvement"],
        "adjective": ["involved"],
        "adverb": []
      },
      "collocations": [
        "someone's involvement in a situation",
        "to involve sb (in sth/in doing sth)",
        "to be/get involved in sth"
      ]
    },
    {
      "headword": "justice",
      "turkish": "adalet",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["justify"],
        "noun": ["justice", "justification"],
        "adjective": ["justified", "just", "unjustified", "unjust"],
        "adverb": []
      },
      "collocations": [
        "social justice",
        "to want justice",
        "to justify doing sth",
        "to justify a policy/the means/the effort/the need for"
      ]
    },
    {
      "headword": "launch",
      "turkish": "başlatmak, fırlatmak",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["launch"],
        "noun": ["launch"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "to officially launch sth",
        "a missile/rocket launch",
        "the launch of the campaign/website/service"
      ]
    },
    {
      "headword": "occur",
      "turkish": "meydana gelmek, olmak",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["occur"],
        "noun": ["occurrence"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to occur commonly/frequently", "a common occurrence"]
    },
    {
      "headword": "praise",
      "turkish": "övmek, övgü",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["praise"],
        "noun": ["praise"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["praise sb/sth for (doing) sth"]
    },
    {
      "headword": "perceive",
      "turkish": "algılamak",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["perceive"],
        "noun": ["perception"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to be commonly/generally/widely perceived", "to be perceived as sth"]
    },
    {
      "headword": "pretend",
      "turkish": "gibi yapmak, numara yapmak",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["pretend"],
        "noun": [],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to pretend (that)", "to pretend to do/be something"]
    },
    {
      "headword": "procedure",
      "turkish": "prosedür, yöntem",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["proceed"],
        "noun": ["procedure"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "complex/complicated/simple procedure",
        "procedure for",
        "to follow/establish/adopt a procedure"
      ]
    },
    {
      "headword": "profit",
      "turkish": "kar, kazanç",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["profit"],
        "adjective": ["profitable"],
        "adverb": []
      },
      "collocations": ["to profit from sth", "to make a profit", "to be profitable", "at a profit/for profit"]
    },
    {
      "headword": "progress",
      "turkish": "ilerleme, ilerlemek",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["progress"],
        "noun": ["progress"],
        "adjective": ["progressive"],
        "adverb": []
      },
      "collocations": [
        "to achieve/make progress",
        "economic/scientific progress",
        "considerable/great/impressive progress"
      ]
    },
    {
      "headword": "relevant",
      "turkish": "ilgili, alakalı",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["irrelevance", "relevance"],
        "adjective": ["irrelevant", "relevant"],
        "adverb": []
      },
      "collocations": ["to be relevant to sth", "to seem/become/consider sth relevant/irrelevant"]
    },
    {
      "headword": "remain",
      "turkish": "kalmak, sürdürmek",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["remain"],
        "noun": ["remain"],
        "adjective": ["remaining"],
        "adverb": []
      },
      "collocations": ["to remain in bed", "to remain silent"]
    },
    {
      "headword": "require",
      "turkish": "gerektirmek, istemek",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["require"],
        "noun": ["requirement"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["course/visa/safety/entrance requirements", "to meet the requirements"]
    },
    {
      "headword": "tend",
      "turkish": "eğiliminde olmak",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["tend"],
        "noun": ["tendency"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to tend to do sth", "to have a tendency to do sth"]
    },
    {
      "headword": "witness",
      "turkish": "tanık olmak, tanık",
      "unit": "7",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["witness"],
        "noun": ["witness"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to witness an accident/a murder/an attack", "to have a witness to sth"]
    },
    // =================================================================
    // UNIT 7: LISTENING & SPEAKING
    // =================================================================
    {
      "headword": "acquire",
      "turkish": "edinmek, kazanmak",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["acquire"],
        "noun": ["acquisition"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to acquire knowledge/skills", "to acquire assets or property", "language acquisition"]
    },
    {
      "headword": "appreciate",
      "turkish": "takdir etmek, kıymetini bilmek",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["appreciate"],
        "noun": ["appreciation"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "to really/fully/deeply appreciate",
        "to have/show/express/develop appreciation",
        "deep/great/real appreciation"
      ]
    },
    {
      "headword": "aspect",
      "turkish": "yön, bakış açısı",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["aspect"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["a key/major/fundamental aspect of sth", "in every aspect of sth"]
    },
    {
      "headword": "attempt",
      "turkish": "girişim, denemek",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["attempt"],
        "noun": ["attempt"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to make an attempt", "to succeed in/fail in an attempt"]
    },
    {
      "headword": "care",
      "turkish": "bakım, önemsemek",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["care"],
        "noun": ["care"],
        "adjective": ["careful", "careless", "caring"],
        "adverb": []
      },
      "collocations": [
        "to take care of sb/sth",
        "to provide/receive/need/require care",
        "to care about"
      ]
    },
    {
      "headword": "commission",
      "turkish": "komisyon, görevlendirmek",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["commission"],
        "noun": ["commission"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "human rights commission",
        "to set up/establish/create a commission",
        "a special/independent/international commission"
      ]
    },
    {
      "headword": "define",
      "turkish": "tanımlamak",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["define"],
        "noun": ["definition"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to define sth as sth", "clearly/well defined", "definition of sth"]
    },
    {
      "headword": "deserve",
      "turkish": "hak etmek",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["deserve"],
        "noun": [],
        "adjective": ["well-deserved"],
        "adverb": []
      },
      "collocations": [
        "well-deserved",
        "to deserve to do sth",
        "to deserve respect/credit/support/recognition"
      ]
    },
    {
      "headword": "exploit",
      "turkish": "sömürmek, faydalanmak",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["exploit"],
        "noun": ["exploitation"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to exploit resources (positive)", "to exploit a person (negative)"]
    },
    {
      "headword": "expose",
      "turkish": "maruz bırakmak, ifşa etmek",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["expose"],
        "noun": ["exposure"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to expose someone to sth", "to be exposed to sth"]
    },
    {
      "headword": "finance",
      "turkish": "finanse etmek, finans",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["finance"],
        "noun": ["finance (dealing with money and banking)"],
        "adjective": ["financial"],
        "adverb": ["financially"]
      },
      "collocations": ["to finance a business", "a financial advisor"]
    },
    {
      "headword": "identity",
      "turkish": "kimlik",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["identify"],
        "noun": ["identification", "identity"],
        "adjective": ["identified", "unidentified"],
        "adverb": []
      },
      "collocations": [
        "to identify sb/sth",
        "identity card",
        "national/cultural/social identity",
        "to find out/discover somebody's identity"
      ]
    },
    {
      "headword": "interpret",
      "turkish": "yorumlamak",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["interpret"],
        "noun": ["interpretation"],
        "adjective": ["interpretive"],
        "adverb": []
      },
      "collocations": [
        "to interpret correctly/wrongly/differently",
        "to make an interpretation",
        "to interpret sth as sth",
        "to be open to interpretation"
      ]
    },
    {
      "headword": "motive",
      "turkish": "güdü, neden",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["motivate"],
        "noun": ["motivation", "motive"],
        "adjective": ["motivational"],
        "adverb": ["motivationally"]
      },
      "collocations": [
        "poor/low motivation",
        "to lack/lose motivation",
        "motivation/motive for (doing) sth",
        "motive behind (sth)"
      ]
    },
    {
      "headword": "offense",
      "turkish": "suç, saldırı",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["offend"],
        "noun": ["offense"],
        "adjective": ["offensive"],
        "adverb": []
      },
      "collocations": [
        "criminal/serious/minor offense",
        "to commit an offense",
        "to be offended by/at sth",
        "offensive to (sm)"
      ]
    },
    {
      "headword": "permission",
      "turkish": "izin",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["permit"],
        "noun": ["permission"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "to have/get/receive permission for sth",
        "to give sb permission",
        "residence permit/work permit",
        "without permission"
      ]
    },
    {
      "headword": "phenomenon",
      "turkish": "fenomen, olay",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["phenomenon", "pretension"],
        "adjective": ["phenomenal"],
        "adverb": []
      },
      "collocations": ["phenomenon of sth"]
    },
    {
      "headword": "qualification",
      "turkish": "niteliğe sahip olma, yeterlilik",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["qualify"],
        "noun": ["qualification"],
        "adjective": ["qualified", "unqualified"],
        "adverb": []
      },
      "collocations": [
        "to have/hold/obtain/gain qualification(s)",
        "excellent/good/low/poor quality",
        "to be qualified to do sth",
        "qualification in/for"
      ]
    },
    {
      "headword": "range",
      "turkish": "aralık, menzil",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["range"],
        "noun": ["range"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "wide/broad/full/narrow/limited range of sth",
        "to range from sth to sth",
        "to range between sth to sth",
        "to range in size/price/age, etc."
      ]
    },
    {
      "headword": "recall",
      "turkish": "hatırlamak",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["recall"],
        "noun": ["recall"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to recall doing sth"]
    },
    {
      "headword": "recover",
      "turkish": "iyileşmek, geri almak",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["recover"],
        "noun": ["recovery"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "to recover completely/fully/partially",
        "to make a recovery from sth",
        "amazing/full/fast/slow recovery"
      ]
    },
    {
      "headword": "reliable",
      "turkish": "güvenilir",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["rely on"],
        "noun": ["reliance"],
        "adjective": ["reliable"],
        "adverb": []
      },
      "collocations": ["a reliable source", "reliable data/estimate/evidence/figures"]
    },
    {
      "headword": "remind",
      "turkish": "hatırlatmak",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["remind"],
        "noun": ["reminder"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to remind sb to do sth", "to remind sb of something/someone"]
    },
    {
      "headword": "secure",
      "turkish": "güvenceye almak, güvenli",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["secure"],
        "noun": ["security"],
        "adjective": ["secure", "insecure"],
        "adverb": ["securely"]
      },
      "collocations": ["job security, economically secure", "to secure a deal/contract/place"]
    },
    {
      "headword": "severe",
      "turkish": "şiddetli, ağır",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["severity"],
        "adjective": ["severe"],
        "adverb": ["severely"]
      },
      "collocations": [
        "severe damage",
        "severe problems/difficulties",
        "a severe injury/illness/pain"
      ]
    },
    {
      "headword": "strictly",
      "turkish": "kesinlikle, sıkıca",
      "unit": "7",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["strictness"],
        "adjective": ["strict"],
        "adverb": ["strictly"]
      },
      "collocations": [
        "to be treated strictly or to be strictly controlled",
        "strict about/with"
      ]
    },
    // =================================================================
    // UNIT 7: EXTRA WORDS
    // =================================================================
    {
      "headword": "accuse",
      "turkish": "suçlamak",
      "unit": "7",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["accuse"],
        "noun": ["accusation"],
        "adjective": ["accusing", "accused"],
        "adverb": []
      },
      "collocations": ["to accuse sb of doing sth", "to be accused of sth", "accusation against/of", "to make an accusation"]
    },
    {
      "headword": "administer",
      "turkish": "yönetmek, uygulamak",
      "unit": "7",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["administer"],
        "noun": ["administration"],
        "adjective": ["administrative"],
        "adverb": []
      },
      "collocations": ["to administer tests/first aid/exams", "administrative duties"]
    },
    {
      "headword": "consultant",
      "turkish": "danışman",
      "unit": "7",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["consult"],
        "noun": ["consultant", "consultancy"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to consult sb about sth", "to receive consultancy", "a consultancy firm/business"]
    },
    {
      "headword": "deny",
      "turkish": "inkar etmek, reddetmek",
      "unit": "7",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["deny"],
        "noun": ["denial"],
        "adjective": ["deniable", "denied"],
        "adverb": []
      },
      "collocations": ["to deny (that)", "to deny doing sth"]
    },
    {
      "headword": "dilemma",
      "turkish": "ikilem",
      "unit": "7",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": [],
        "noun": ["dilemma"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["a dilemma about/over sth", "a dilemma between A and B", "in a dilemma"]
    },
    {
      "headword": "innocence",
      "turkish": "masumiyet",
      "unit": "7",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": [],
        "noun": ["innocence"],
        "adjective": ["innocent"],
        "adverb": []
      },
      "collocations": ["innocent intentions/people/questions"]
    },
    {
      "headword": "obey",
      "turkish": "itaat etmek",
      "unit": "7",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["obey"],
        "noun": ["obedience"],
        "adjective": ["obedient", "disobedient"],
        "adverb": ["obediently"]
      },
      "collocations": ["to obey rules"]
    },
    {
      "headword": "wage",
      "turkish": "ücret (saatlik/haftalık)",
      "unit": "7",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": [],
        "noun": ["wage"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["the minimum wage", "to earn/pay wages"]
    },
    // =================================================================
    // UNIT 8: READING & WRITING
    // =================================================================
    {
      "headword": "assessment",
      "turkish": "değerlendirme",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["assess"],
        "noun": ["assessment"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to make/give assessment", "assessment methods"]
    },
    {
      "headword": "award",
      "turkish": "ödül, ödüllendirmek",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["award"],
        "noun": ["award"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to be awarded sth for sth", "to receive/win an award"]
    },
    {
      "headword": "component",
      "turkish": "bileşen, parça",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["component"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["components of sth", "key/major/important component"]
    },
    {
      "headword": "concerned",
      "turkish": "endişeli, ilgili",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["concern"],
        "noun": ["concern"],
        "adjective": ["concerned"],
        "adverb": []
      },
      "collocations": ["to be concerned with"]
    },
    {
      "headword": "decay",
      "turkish": "çürüme, çürümek",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["decay"],
        "noun": ["decay"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to decay slowly/rapidly", "the process/signs of decay"]
    },
    {
      "headword": "dominate",
      "turkish": "hakim olmak, egemen olmak",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["dominate"],
        "noun": ["dominance"],
        "adjective": ["dominant"],
        "adverb": []
      },
      "collocations": [
        "to dominate a person or situation",
        "to achieve dominance over",
        "to seem/become/remain dominant"
      ]
    },
    {
      "headword": "effectively",
      "turkish": "etkili bir şekilde",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["effect"],
        "adjective": ["effective", "ineffective"],
        "adverb": ["effectively", "ineffectively"]
      },
      "collocations": ["partially effective"]
    },
    {
      "headword": "efficiency",
      "turkish": "verimlilik",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["efficiency"],
        "adjective": ["efficient", "inefficient"],
        "adverb": ["efficiently", "inefficiently"]
      },
      "collocations": [
        "to look/ appear efficient",
        "the efficient use of sth",
        "to improve/increase/promote efficiency",
        "energy/fuel-efficient",
        "cost-efficient"
      ]
    },
    {
      "headword": "evaluation",
      "turkish": "değerlendirme",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["evaluate"],
        "noun": ["evaluation"],
        "adjective": ["evaluative"],
        "adverb": []
      },
      "collocations": ["to evaluate performance", "evaluation process", "to carry out an evaluation"]
    },
    {
      "headword": "exhibit",
      "turkish": "sergilemek, göstermek",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["exhibit"],
        "noun": ["exhibition"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to exhibit tendencies/symptoms/signs of", "to exhibit artwork"]
    },
    {
      "headword": "force",
      "turkish": "güç, zorlamak",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["force"],
        "noun": ["force"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "to force sb to do sth",
        "with great/considerable/increasing force",
        "by force",
        "police force/air force/armed forces/workforce"
      ]
    },
    {
      "headword": "fulfillment",
      "turkish": "yerine getirme, tatmin",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["fulfil"],
        "noun": ["fulfillment"],
        "adjective": ["fulfilled"],
        "adverb": []
      },
      "collocations": ["to fulfil your dream/ambition/potential", "to fulfil a duty/promise"]
    },
    {
      "headword": "generate",
      "turkish": "üretmek, oluşturmak",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["generate"],
        "noun": ["generation"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to generate revenue/ideas/electricity"]
    },
    {
      "headword": "incentive",
      "turkish": "teşvik",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["incentive"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "to create/provide/give sb an incentive",
        "to have/lack an incentive to do sth",
        "economic/financial/tax incentives"
      ]
    },
    {
      "headword": "incorporate",
      "turkish": "dahil etmek, bünyesine katmak",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["incorporate"],
        "noun": ["incorporation"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to incorporate sth into sth"]
    },
    {
      "headword": "incredible",
      "turkish": "inanılmaz",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["incredible"],
        "adverb": ["incredibly"]
      },
      "collocations": [
        "pretty/really/truly/ absolutely/quite incredible",
        "to be/look/smell/taste/find sth incredible",
        "at an incredible rate/speed"
      ]
    },
    {
      "headword": "investigation",
      "turkish": "araştırma, soruşturma",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["investigate"],
        "noun": ["investigation", "investigator"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "to investigate carefully/closely",
        "to carry out/conduct an investigation",
        "under criminal investigation"
      ]
    },
    {
      "headword": "manufacture",
      "turkish": "üretmek, imalat",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["manufacture"],
        "noun": ["manufacture", "manufacturing", "manufacturer"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "to manufacture products/goods",
        "large-scale/industrial manufacturing",
        "car/food manufacturing"
      ]
    },
    {
      "headword": "moral",
      "turkish": "ahlaki",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["morality"],
        "adjective": ["moral", "immoral"],
        "adverb": ["morally"]
      },
      "collocations": [
        "to manufacture sth from sth",
        "a moral issue/dilemma",
        "morally right/wrong/justified/unacceptable"
      ]
    },
    {
      "headword": "ongoing",
      "turkish": "devam eden",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["ongoing"],
        "adverb": []
      },
      "collocations": ["an ongoing project/research"]
    },
    {
      "headword": "prior",
      "turkish": "önceki, öncelikli",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["priority"],
        "adjective": ["prior"],
        "adverb": []
      },
      "collocations": [
        "prior to sth",
        "high/major/top/immediate/low priority",
        "prior knowledge/experience"
      ]
    },
    {
      "headword": "poverty",
      "turkish": "yoksulluk",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["poverty"],
        "adjective": [],
        "adverb": []
      },
      "collocations": [
        "extreme/severe poverty",
        "to live in poverty",
        "to fight/address/end/escape poverty"
      ]
    },
    {
      "headword": "register",
      "turkish": "kayıt olmak, sicil",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["register"],
        "noun": ["registration"],
        "adjective": ["registered"],
        "adverb": []
      },
      "collocations": ["to register to vote", "to register for classes"]
    },
    {
      "headword": "regulate",
      "turkish": "düzenlemek",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["regulate"],
        "noun": ["regulation"],
        "adjective": ["regulatory"],
        "adverb": []
      },
      "collocations": ["strict/tight/poor/weak regulation", "to regulate carefully/closely"]
    },
    {
      "headword": "reveal",
      "turkish": "ortaya çıkarmak, ifşa etmek",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["reveal"],
        "noun": ["revelation"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to reveal sb as/to be sth", "revelation of sth"]
    },
    {
      "headword": "revolution",
      "turkish": "devrim",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": ["revolutionize"],
        "noun": ["revolution"],
        "adjective": ["revolutionary"],
        "adverb": []
      },
      "collocations": ["social/cultural revolution"]
    },
    {
      "headword": "source",
      "turkish": "kaynak",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["source"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["source of income/source of pride"]
    },
    {
      "headword": "unique",
      "turkish": "benzersiz, eşsiz",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": ["uniqueness"],
        "adjective": ["unique"],
        "adverb": ["uniquely"]
      },
      "collocations": ["a unique opportunity", "to be unique to sb/sth"]
    },
    {
      "headword": "tough",
      "turkish": "sert, zorlu",
      "unit": "8",
      "section": "Reading & Writing",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["tough"],
        "adverb": []
      },
      "collocations": [
        "to meet a target",
        "achievable/realistic target",
        "to be tough on/with somebody",
        "tough choice/decision/call/question"
      ]
    },
    // =================================================================
    // UNIT 8: LISTENING & SPEAKING
    // =================================================================
    {
      "headword": "actual",
      "turkish": "gerçek, fiili",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["actual"],
        "adverb": ["actually"]
      },
      "collocations": ["in actual fact"]
    },
    {
      "headword": "affect",
      "turkish": "etkilemek",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["affect"],
        "noun": ["effect"],
        "adjective": ["effective", "ineffective"],
        "adverb": ["effectively"]
      },
      "collocations": [
        "to affect sth/sb (greatly)",
        "to have an effect on sth",
        "to be/seem effective",
        "a long-term/short-term/",
        "a positive/beneficial effect/ negative/harmful effect"
      ]
    },
    {
      "headword": "basically",
      "turkish": "temel olarak, aslında",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["basic"],
        "adverb": ["basically"]
      },
      "collocations": [
        "the basic principles of sth",
        "basic needs/rights/life skills"
      ]
    },
    {
      "headword": "bias",
      "turkish": "önyargı, eğilim",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["bias"],
        "adjective": ["biased"],
        "adverb": []
      },
      "collocations": ["to have a bias against sb", "political/gender/racial bias"]
    },
    {
      "headword": "commercial",
      "turkish": "ticari",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["commerce"],
        "adjective": ["commercial"],
        "adverb": ["commercially"]
      },
      "collocations": ["commercial transaction/use/flight", "global commerce"]
    },
    {
      "headword": "competition",
      "turkish": "rekabet",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["compete"],
        "noun": ["competition", "competitor"],
        "adjective": ["competitive"],
        "adverb": ["competitively"]
      },
      "collocations": ["to be in competition with", "to compete with/against", "to compete for/in/at"]
    },
    {
      "headword": "crucial",
      "turkish": "hayati, çok önemli",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["crucial"],
        "adverb": ["crucially"]
      },
      "collocations": ["a crucial piece of information", "crucial for/to sb/sth"]
    },
    {
      "headword": "distribute",
      "turkish": "dağıtmak",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["distribute", "redistribute"],
        "noun": ["distribution", "redistribution"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["redistribution of wealth/resources", "to distribute sth among/to sb", "to distribute fairly/equally"]
    },
    {
      "headword": "essential",
      "turkish": "temel, gerekli",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["essential"],
        "adverb": []
      },
      "collocations": ["essential to/for sth", "it is essential to do sth"]
    },
    {
      "headword": "expense",
      "turkish": "masraf, gider",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["expense"],
        "adjective": ["expensive"],
        "adverb": ["expensively"]
      },
      "collocations": ["monthly/living expense(s)", "the extra/additional expense"]
    },
    {
      "headword": "manual",
      "turkish": "manuel, el kitabı",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["manual"],
        "adverb": ["manually"]
      },
      "collocations": ["manual job/labor/worker"]
    },
    {
      "headword": "modify",
      "turkish": "değiştirmek, tadil etmek",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["modify"],
        "noun": ["modification"],
        "adjective": ["modifiable", "modified"],
        "adverb": []
      },
      "collocations": ["genetically-modified food", "to modify a design/a gene/the behavior"]
    },
    {
      "headword": "occasional",
      "turkish": "ara sıra olan",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["occasion"],
        "adjective": ["occasional"],
        "adverb": ["occasionally"]
      },
      "collocations": ["occasion for sb to do sth/occasion for doing sth", "special occasion"]
    },
    {
      "headword": "persuade",
      "turkish": "ikna etmek",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["persuade"],
        "noun": ["persuasion"],
        "adjective": ["persuasive"],
        "adverb": []
      },
      "collocations": ["persuade so of sth"]
    },
    {
      "headword": "prohibit",
      "turkish": "yasaklamak",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["prohibit"],
        "noun": ["prohibition"],
        "adjective": ["prohibitive"],
        "adverb": []
      },
      "collocations": ["to prohibit from sth", "to impose/lift prohibitions", "prohibition against/of sth"]
    },
    {
      "headword": "rapidly",
      "turkish": "hızla",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": ["rapidity"],
        "adjective": ["rapid"],
        "adverb": ["rapidly"]
      },
      "collocations": [
        "a rapid growth/expansion/development/",
        "increase/rise/decline",
        "at a rapid rate/pace"
      ]
    },
    {
      "headword": "remote",
      "turkish": "uzak",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["remote"],
        "adverb": ["remotely"]
      },
      "collocations": ["remote from", "to get remote access to sth"]
    },
    {
      "headword": "stimulation",
      "turkish": "uyarım, teşvik",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["stimulate"],
        "noun": ["stimulation"],
        "adjective": ["stimulating"],
        "adverb": []
      },
      "collocations": ["to stimulate growth/demand/the economy", "a stimulating effect/environment"]
    },
    {
      "headword": "submit",
      "turkish": "sunmak, teslim etmek",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["submit"],
        "noun": ["submission"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to submit an application/claim/proposal/assignment", "to submit one's resignation"]
    },
    {
      "headword": "vital",
      "turkish": "hayati, çok önemli",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["vital"],
        "adverb": ["vitally"]
      },
      "collocations": ["to be vital for sb/sth", "to play a vital role", "of vital importance in sth"]
    },
    {
      "headword": "target",
      "turkish": "hedef, hedeflemek",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": ["target"],
        "noun": ["target"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to reach/achieve/hit a target"]
    },
    {
      "headword": "tough",
      "turkish": "sert, zorlu",
      "unit": "8",
      "section": "Listening & Speaking",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["tough"],
        "adverb": []
      },
      "collocations": [
        "to meet a target",
        "achievable/realistic target",
        "to be tough on/with somebody",
        "tough choice/decision/call/question"
      ]
    },
    // =================================================================
    // UNIT 8: EXTRA WORDS
    // =================================================================
    {
      "headword": "attach",
      "turkish": "eklemek, bağlamak",
      "unit": "8",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["attach"],
        "noun": ["attachment"],
        "adjective": ["attached"],
        "adverb": []
      },
      "collocations": ["to have/form/develop attachment", "close/deep attachment"]
    },
    {
      "headword": "autonomously",
      "turkish": "otonom olarak, özerk bir şekilde",
      "unit": "8",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": [],
        "noun": ["autonomy"],
        "adjective": ["autonomous"],
        "adverb": ["autonomously"]
      },
      "collocations": ["to gain autonomy from sb", "to increase/reduce autonomy", "autonomous learners/cars"]
    },
    {
      "headword": "civilized",
      "turkish": "uygar",
      "unit": "8",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": [],
        "noun": ["civilization"],
        "adjective": ["civilized", "civil"],
        "adverb": []
      },
      "collocations": [
        "civilized behavior/society/world",
        "ancient/early civilizations",
        "the end/collapse/decline of a civilization"
      ]
    },
    {
      "headword": "impose",
      "turkish": "dayatmak, yüklemek",
      "unit": "8",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["impose"],
        "noun": [],
        "adjective": ["imposing"],
        "adverb": []
      },
      "collocations": ["to impose sth on someone"]
    },
    {
      "headword": "inferior",
      "turkish": "aşağı, düşük",
      "unit": "8",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": [],
        "noun": [],
        "adjective": ["inferior"],
        "adverb": []
      },
      "collocations": ["to make sb feel inferior", "inferior to sb/sth"]
    },
    {
      "headword": "insert",
      "turkish": "eklemek, sokmak",
      "unit": "8",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["insert"],
        "noun": ["insertion"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to insert sth (in/into sth)"]
    },
    {
      "headword": "resolve",
      "turkish": "çözmek, karar vermek",
      "unit": "8",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["resolve"],
        "noun": ["resolution"],
        "adjective": [],
        "adverb": []
      },
      "collocations": ["to resolve a problem/an issue", "to make/keep a resolution"]
    },
    {
      "headword": "upgraded",
      "turkish": "yükseltilmiş, geliştirilmiş",
      "unit": "8",
      "section": "EXTRA WORDS",
      "forms": {
        "verb": ["upgrade"],
        "noun": ["upgrade"],
        "adjective": ["upgraded"],
        "adverb": []
      },
      "collocations": ["an upgraded version of sth"]
    }
  ];