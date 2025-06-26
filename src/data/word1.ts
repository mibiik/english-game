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
    // UNIT 1: READING & WRITING (Skillful 1)
    // =================================================================
    {
      headword: 'ability',
      turkish: 'yetenek',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['ability'],
        adjective: ['able', 'capable'],
        adverb: [],
      },
      collocations: [
        'athletic/musical/artistic/academic ability',
        'to have/lose/develop the ability to do sth',
      ],
    },
    {
      headword: 'achieve',
      turkish: 'başarmak',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['achieve'],
        noun: ['achievement'],
        adjective: [],
        adverb: [],
      },
      collocations: ['achieve a goal/a good result/a target/success'],
    },
    {
      headword: 'application',
      turkish: 'başvuru',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['apply'],
        noun: ['application', 'applicant'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to make/send an application to (a company)',
        '(to fill in) an application form',
        'to get/receive/accept/refuse an application',
        'to apply for sth (a job/course/visa/passport, etc.)',
      ],
    },
    {
      headword: 'behave',
      turkish: 'davranmak',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['behave'],
        noun: ['behavior'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'good/bad/normal/acceptable/unacceptable behavior',
        'to affect/control/influence behavior',
        'to behave well/badly',
      ],
    },
    {
      headword: 'bother',
      turkish: 'rahatsız etmek, zahmet etmek',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['bother'],
        noun: [],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to bother sb (with sth)',
        'to be bothered about sth',
      ],
    },
    {
      headword: 'calm',
      turkish: 'sakinleşmek, sakin',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['calm down'],
        noun: [],
        adjective: ['calm'],
        adverb: ['calmly'],
      },
      collocations: ['to stay/keep calm', 'to calm down'],
    },
    {
      headword: 'challenge',
      turkish: 'zorluk, meydan okumak',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['challenge'],
        adjective: ['challenging'],
        adverb: [],
      },
      collocations: ['a challenging task/job/situation'],
    },
    {
      headword: 'coach',
      turkish: 'antrenör',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['coach'],
        noun: ['coach'],
        adjective: [],
        adverb: [],
      },
      collocations: ['a football/team/professional/national coach'],
    },
    {
      headword: 'communication',
      turkish: 'iletişim',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['communicate'],
        noun: ['communication'],
        adjective: [],
        adverb: [],
      },
      collocations: ['to communicate with sb', 'communication skills'],
    },
    {
      headword: 'company',
      turkish: 'şirket',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['company'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to start/create/set up/own a company',
        'to join/work for/leave a company',
        'a big/large/small/medium-sized company',
      ],
    },
    {
      headword: 'confident',
      turkish: 'kendinden emin',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['confidence', 'self-confidence'],
        adjective: ['confident', 'self-confident'],
        adverb: ['confidently'],
      },
      collocations: [
        'to be/become/look/feel confident',
        'confident about (doing) sth /in sb',
        'act confidently',
      ],
    },
    {
      headword: 'decide',
      turkish: 'karar vermek',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['decide'],
        noun: ['decision'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to make/reach/come to a decision',
        'decision about/on sth',
        'a(n) big/important/right/wrong/easy/hard decision',
        'to decide on sth/ to do sth',
      ],
    },
    {
      headword: 'determined',
      turkish: 'kararlı',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: [],
        adjective: ['determined'],
        adverb: [],
      },
      collocations: ['to be determined to do sth'],
    },
    {
      headword: 'direct',
      turkish: 'doğrudan',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['direct'],
        noun: ['direction'],
        adjective: ['direct', 'indirect'],
        adverb: ['directly', 'indirectly'],
      },
      collocations: [
        'direct contact',
        'a direct link (between sth and sth)',
        'to have direct access (to sth)',
        'a direct route/flight',
        'to sp directly (to sb/about sth)',
        'to give/get directions',
      ],
    },
    {
      headword: 'employee',
      turkish: 'çalışan',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['employ'],
        noun: ['employee', 'employer', 'employment', 'unemployment'],
        adjective: ['employed', 'unemployed'],
        adverb: [],
      },
      collocations: [
        'a part-time/full- full time employee',
        'to employ sb (as sth/in sth)',
        'employment opportunities/options',
      ],
    },
    {
      headword: 'enjoy',
      turkish: 'keyif almak',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['enjoy'],
        noun: ['enjoyment'],
        adjective: ['enjoyable'],
        adverb: [],
      },
      collocations: [
        'to be/become/sound/look enjoyable',
        'to make/find sth enjoyable',
        'to have/get enjoyment from sth',
      ],
    },
    {
      headword: 'friendly',
      turkish: 'arkadaş canlısı',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['friend'],
        adjective: ['friendly', 'unfriendly'],
        adverb: [],
      },
      collocations: ['a friendly person/personality/environment'],
    },
    {
      headword: 'goal',
      turkish: 'hedef',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['goal'],
        adjective: [],
        adverb: [],
      },
      collocations: ['to achieve/reach a goal'],
    },
    {
      headword: 'honest',
      turkish: 'dürüst',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['honesty', 'dishonesty'],
        adjective: ['honest', 'dishonest'],
        adverb: ['honestly'],
      },
      collocations: ['to be honest about sth', 'to be honest with sb'],
    },
    {
      headword: 'hurt',
      turkish: 'incitmek, zarar vermek',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['hurt'],
        noun: ['hurt'],
        adjective: ['hurt'],
        adverb: [],
      },
      collocations: [
        'to hurt sth/ yourself/sb',
        'to be badly/ seriously/ slightly hurt sb',
      ],
    },
    {
      headword: 'individual',
      turkish: 'bireysel, birey',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['individual'],
        adjective: ['individual'],
        adverb: ['individually'],
      },
      collocations: [
        'to work individually',
        'to treat sb (people) as individuals',
      ],
    },
    {
      headword: 'intelligent',
      turkish: 'zeki',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['intelligence'],
        adjective: ['intelligent', 'unintelligent'],
        adverb: ['intelligently'],
      },
      collocations: ['an intelligent person', 'to be highly intelligent'],
    },
    {
      headword: 'leader',
      turkish: 'lider',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['lead'],
        noun: ['leader', 'leadership'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to lead sb/sth to sth',
        'to lead to sth',
        'leadership skills',
      ],
    },
    {
      headword: 'manage',
      turkish: 'yönetmek',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['manage'],
        noun: ['manager', 'management'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'an assistant/general manager',
        'to manage a business/company/organization',
      ],
    },
    {
      headword: 'organized',
      turkish: 'düzenli',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['organize'],
        noun: ['organizer', 'organization'],
        adjective: ['organized'],
        adverb: [],
      },
      collocations: [
        'to be/look/seem organized',
        'to organize a conference/meeting/seminar/an event',
      ],
    },
    {
      headword: 'personality',
      turkish: 'kişilik',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['personality'],
        adjective: ['personal'],
        adverb: ['personally'],
      },
      collocations: [
        'to have a strong/warm/outgoing personality',
        'personality type/characteristics/traits',
        'personal characteristics',
        'a personal question',
        'to take sth personally',
      ],
    },
    {
      headword: 'president',
      turkish: 'başkan',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['president'],
        adjective: [],
        adverb: [],
      },
      collocations: ['(the) president of'],
    },
    {
      headword: 'private',
      turkish: 'özel',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['privacy'],
        adjective: ['private'],
        adverb: ['privately'],
      },
      collocations: ['private room/life/school/hospital/conversation'],
    },
    {
      headword: 'respect',
      turkish: 'saygı',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['respect'],
        noun: ['respect'],
        adjective: ['respectful', 'disrespectful'],
        adverb: [],
      },
      collocations: [
        'to deeply/greatly respect sth/sb',
        'to show respect for sth/to sb',
        'to have deep/great respect for sb/sth',
        'to be respectful/disrespectful to sb',
      ],
    },
    {
      headword: 'responsible',
      turkish: 'sorumlu',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['responsibility'],
        adjective: ['responsible', 'irresponsible'],
        adverb: [],
      },
      collocations: [
        'to have/take/accept responsibility',
        'to have responsibility for doing sth/to do sth',
        'to be responsible for sb/sth',
      ],
    },
    {
      headword: 'research',
      turkish: 'araştırma',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['research'],
        noun: ['research', 'researcher'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to do/conduct research',
        'research on/into sth/sb',
        'scientific/medical/academic research',
      ],
    },
    {
      headword: 'result',
      turkish: 'sonuç',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['result'],
        noun: ['result'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to have/produce/get/achieve a good result',
        'a result of sth',
        'to result in sth',
      ],
    },
    {
      headword: 'rise',
      turkish: 'yükselmek, artmak',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['rise'],
        noun: [],
        adjective: [],
        adverb: [],
      },
      collocations: ['to rise by (an amount/percentage)'],
    },
    {
      headword: 'stress',
      turkish: 'stres, vurgulamak',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['stress'],
        noun: ['stress'],
        adjective: ['stressful', 'stressed'],
        adverb: [],
      },
      collocations: [
        'to be under stress',
        'to feel stressed',
        'to have stress',
        'a stressful experience/job',
      ],
    },
    {
      headword: 'succeed',
      turkish: 'başarmak',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['succeed'],
        noun: ['success'],
        adjective: ['successful', 'unsuccessful'],
        adverb: ['successfully', 'unsuccessfully'],
      },
      collocations: [
        'to have success in sth',
        'the key to success',
        'great/huge success',
        'to succeed in (doing) sth',
      ],
    },
    {
      headword: 'treat',
      turkish: 'davranmak, tedavi etmek',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['treat'],
        noun: ['treatment'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to treat people with respect',
        'to treat sb like a child',
        'to treat the patients',
        'hospital/medical treatment',
      ],
    },
    {
      headword: 'trust',
      turkish: 'güven, güvenmek',
      unit: '1',
      section: 'Reading & Writing',
      forms: {
        verb: ['trust'],
        noun: ['trust'],
        adjective: ['trustworthy', 'untrustworthy'],
        adverb: [],
      },
      collocations: ['to trust sb (to do sth)'],
    },
  
    // =================================================================
    // UNIT 1: LISTENING & SPEAKING (Skillful 1)
    // =================================================================
    {
      headword: 'attention',
      turkish: 'dikkat',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['attention'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'Attention, please!',
        'to pay attention to sb/sth',
        'to attract (sb\'s) attention',
        'to pay/give attention to sth/sb',
      ],
    },
    {
      headword: 'believe',
      turkish: 'inanmak',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['believe'],
        noun: ['belief'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to believe (in) sth/sb',
        'to believe (that) + sentence',
        'a strong belief',
      ],
    },
    {
      headword: 'brilliant',
      turkish: 'harika, zekice',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: [],
        adjective: ['brilliant'],
        adverb: [],
      },
      collocations: ['a brilliant idea/career'],
    },
    {
      headword: 'comfortable',
      turkish: 'rahat',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['comfort'],
        adjective: ['comfortable', 'uncomfortable'],
        adverb: ['comfortably'],
      },
      collocations: ['to feel (un)comfortable'],
    },
    {
      headword: 'common',
      turkish: 'yaygın, ortak',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['common'],
        adjective: ['common', 'uncommon'],
        adverb: ['commonly'],
      },
      collocations: ['it is common for sb to do sth', 'to have sth in common'],
    },
    {
      headword: 'creative',
      turkish: 'yaratıcı',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['create'],
        noun: ['creativity'],
        adjective: ['creative'],
        adverb: ['creatively'],
      },
      collocations: ['to be/become/feel creative', 'to do creative work'],
    },
    {
      headword: 'describe',
      turkish: 'tanımlamak, açıklamak',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['describe'],
        noun: ['description'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to describe sth/sb',
        'a brief/short/full/complete description',
        'description of sth',
      ],
    },
    {
      headword: 'effect',
      turkish: 'etki',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['affect'],
        noun: ['effect'],
        adjective: ['effective', 'ineffective'],
        adverb: ['effectively', 'ineffectively'],
      },
      collocations: [
        'to have an effect on sth/sb',
        'a(n) important/strong/possible/short-term//long-term serious/positive/negative effect',
      ],
    },
    {
      headword: 'emotion',
      turkish: 'duygu',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['emotion'],
        adjective: ['emotional'],
        adverb: ['emotionally'],
      },
      collocations: [
        'to show/express/feel/control/hide emotions',
        'deep/strong/positive/negative emotions',
      ],
    },
    {
      headword: 'form',
      turkish: 'şekil, biçim',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['form'],
        noun: ['form'],
        adjective: [],
        adverb: [],
      },
      collocations: ['form of sth', 'to form sth'],
    },
    {
      headword: 'grade',
      turkish: 'not, sınıf',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['grade'],
        noun: ['grade'],
        adjective: [],
        adverb: [],
      },
      collocations: ['exam grade', 'to get/achieve good/high/low grades'],
    },
    {
      headword: 'hope',
      turkish: 'umut, umut etmek',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['hope'],
        noun: ['hope'],
        adjective: ['hopeful', 'hopeless'],
        adverb: ['hopefully'],
      },
      collocations: [
        'to hope to do sth',
        'to hope for sth',
        'to give up hope',
        'hopeful of/ about sth',
        'a hopeless situation',
      ],
    },
    {
      headword: 'information',
      turkish: 'bilgi',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['inform'],
        noun: ['information'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to inform sb (about/of sth)',
        'correct/false information',
        'to search for/find information',
      ],
    },
    {
      headword: 'informal',
      turkish: 'gayri resmi',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: [],
        adjective: ['formal', 'informal'],
        adverb: ['formally', 'informally'],
      },
      collocations: [
        'an informal meeting/gathering/visit',
        'an informal chat/conversation',
        '(in)formal dress/clothes',
        '(in)formal speaking/writing',
        'a formal/an informal greeting',
      ],
    },
    {
      headword: 'instruction',
      turkish: 'talimat',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['instruction', 'instructor'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to receive/give/follow instruction(s)',
        'detailed/clear/written instruction(s)',
      ],
    },
    {
      headword: 'interview',
      turkish: 'mülakat',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['interview'],
        noun: ['interview', 'interviewer', 'interviewee'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'job interview',
        'face-to-face/telephone/group/one-to-one interview',
        'to have/do/give/conduct/attend an interview with sb',
      ],
    },
    {
      headword: 'interesting',
      turkish: 'ilginç',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['interest'],
        adjective: ['interested', 'interesting'],
        adverb: [],
      },
      collocations: [
        'to be interested in sb/sth',
        'an interesting programme/article/subject/person',
      ],
    },
    {
      headword: 'introduce',
      turkish: 'tanıtmak',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['introduce'],
        noun: ['introduction'],
        adjective: [],
        adverb: [],
      },
      collocations: ['to introduce sth/sb (to sb)'],
    },
    {
      headword: 'laugh',
      turkish: 'gülmek',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['laugh'],
        noun: ['laugh', 'laughter'],
        adjective: [],
        adverb: [],
      },
      collocations: ['to laugh (at/about sth/at sb)'],
    },
    {
      headword: 'noisy',
      turkish: 'gürültülü',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['noise'],
        adjective: ['noisy'],
        adverb: [],
      },
      collocations: [
        'to make a noise',
        'a noisy place (street/neighborhood, apartment, etc).',
      ],
    },
    {
      headword: 'plan',
      turkish: 'plan, planlamak',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['plan'],
        noun: ['plan', 'planner'],
        adjective: ['planned', 'unplanned'],
        adverb: [],
      },
      collocations: [
        'to have/make/prepare/develop a plan',
        'to plan to do sth',
      ],
    },
    {
      headword: 'pleasure',
      turkish: 'zevk',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['pleasure'],
        adjective: [],
        adverb: [],
      },
      collocations: ['to take pleasure in/of (doing) sth'],
    },
    {
      headword: 'prefer',
      turkish: 'tercih etmek',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['prefer'],
        noun: ['preference'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to prefer sth/sb to sth/sb',
        'to have a preference for sth',
      ],
    },
    {
      headword: 'polite',
      turkish: 'nazik',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: [],
        adjective: ['polite', 'impolite'],
        adverb: ['politely', 'impolitely'],
      },
      collocations: [
        'a polite person',
        'polite behavior',
        'to ask sb politely for sth/ to do sth',
      ],
    },
    {
      headword: 'remind',
      turkish: 'hatırlatmak',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['remind'],
        noun: ['reminder'],
        adjective: [],
        adverb: [],
      },
      collocations: ['to remind sb of sth/ about sth'],
    },
    {
      headword: 'reply',
      turkish: 'yanıtlamak, yanıt',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['reply'],
        noun: ['reply'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to reply to sb/sth (with sth)',
        'to have/get a reply',
      ],
    },
    {
      headword: 'return',
      turkish: 'geri dönmek',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['return'],
        noun: [],
        adjective: [],
        adverb: [],
      },
      collocations: ['to return home/to a place'],
    },
    {
      headword: 'serious',
      turkish: 'ciddi',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: [],
        adjective: ['serious'],
        adverb: ['seriously'],
      },
      collocations: [
        'serious illness/problem/injury/damage',
        'a serious person',
        'to take sth/sb seriously',
      ],
    },
    {
      headword: 'share',
      turkish: 'paylaşmak',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['share'],
        noun: [],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to share sth with sb',
        'to share sth between/among sb',
      ],
    },
    {
      headword: 'similar',
      turkish: 'benzer',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['similarity'],
        adjective: ['similar'],
        adverb: ['similarly'],
      },
      collocations: ['similar to sb/sth', 'a close/great/strong similarity'],
    },
    {
      headword: 'social',
      turkish: 'sosyal',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: [],
        adjective: ['social', 'unsocial'],
        adverb: ['socially'],
      },
      collocations: ['social life/class/skills/events/problems/issues'],
    },
    {
      headword: 'solve',
      turkish: 'çözmek',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['solve'],
        noun: ['solution'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to solve a problem/mystery/puzzle',
        'to find/offer/provide a solution to/for sth',
      ],
    },
    {
      headword: 'subject',
      turkish: 'konu, ders',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['subject'],
        adjective: [],
        adverb: [],
      },
      collocations: ['favorite/school/academic/difficult subject'],
    },
    {
      headword: 'talkative',
      turkish: 'konuşkan',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['talk'],
        noun: ['talk'],
        adjective: ['talkative'],
        adverb: [],
      },
      collocations: ['a talkative person', 'to talk about sth; to talk to sb'],
    },
    {
      headword: 'task',
      turkish: 'görev',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['task'],
        adjective: [],
        adverb: [],
      },
      collocations: ['to do/complete/perform a task'],
    },
    {
      headword: 'throw',
      turkish: 'atmak',
      unit: '1',
      section: 'Listening & Speaking',
      forms: {
        verb: ['throw'],
        noun: [],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to throw sth (to sb)',
        'to throw sb sth',
        'to throw sth away/out',
      ],
    },
  
    // =================================================================
    // UNIT 1: EXTRA WORDS (Skillful 1)
    // =================================================================
    {
      headword: 'almost',
      turkish: 'neredeyse',
      unit: '1',
      section: 'Extra Words',
      forms: {
        verb: [],
        noun: [],
        adjective: [],
        adverb: ['almost'],
      },
      collocations: ['almost ready/finished', 'almost all', 'almost certainly'],
    },
    {
      headword: 'appear',
      turkish: 'görünmek, ortaya çıkmak',
      unit: '1',
      section: 'Extra Words',
      forms: {
        verb: ['appear', 'disappear'],
        noun: ['appearance', 'disappearance'],
        adjective: [],
        adverb: [],
      },
      collocations: ['physical appearance'],
    },
    {
      headword: 'basic',
      turkish: 'temel',
      unit: '1',
      section: 'Extra Words',
      forms: {
        verb: [],
        noun: ['basic(s)'],
        adjective: ['basic'],
        adverb: [],
      },
      collocations: ['basic way/method/skills/rules/tools'],
    },
    {
      headword: 'impression',
      turkish: 'izlenim',
      unit: '1',
      section: 'Extra Words',
      forms: {
        verb: [],
        noun: ['impression'],
        adjective: ['impressive', 'unimpressive'],
        adverb: ['impressively'],
      },
      collocations: [
        'a good/bad impression',
        'first impression',
        'to make/give an impression',
      ],
    },
    {
      headword: 'option',
      turkish: 'seçenek',
      unit: '1',
      section: 'Extra Words',
      forms: {
        verb: [],
        noun: ['option'],
        adjective: ['optional'],
        adverb: [],
      },
      collocations: ['one/another option', 'to consider (the) options'],
    },
    {
      headword: 'valuable',
      turkish: 'değerli',
      unit: '1',
      section: 'Extra Words',
      forms: {
        verb: [],
        noun: ['value'],
        adjective: ['valuable'],
        adverb: [],
      },
      collocations: [
        'valuable experience/lesson/information/advice',
        'a valuable item',
        'the value of sth',
      ],
    },
  
    // =================================================================
    // UNIT 2: READING & WRITING (Skillful 1)
    // =================================================================
    {
      headword: 'area',
      turkish: 'alan, bölge',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['area'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'a small/big/rural/urban/industrial area',
        'an area of sth',
      ],
    },
    {
      headword: 'borrow',
      turkish: 'ödünç almak',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: ['borrow'],
        noun: [],
        adjective: [],
        adverb: [],
      },
      collocations: ['to borrow sth from sb'],
    },
    {
      headword: 'complete',
      turkish: 'tamamlamak, tam',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: ['complete'],
        noun: [],
        adjective: ['complete', 'incomplete'],
        adverb: ['completely'],
      },
      collocations: [
        'to complete a course/project/task/survey',
        'to complete education/training',
        'a complete list',
      ],
    },
    {
      headword: 'concentrate',
      turkish: 'yoğunlaşmak',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: ['concentrate'],
        noun: ['concentration'],
        adjective: [],
        adverb: [],
      },
      collocations: ['to concentrate on sth'],
    },
    {
      headword: 'count',
      turkish: 'saymak',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: ['count'],
        noun: ['count'],
        adjective: [],
        adverb: [],
      },
      collocations: ['to count from sth to sth (count from 1 to 10, etc.)'],
    },
    {
      headword: 'culture',
      turkish: 'kültür',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['culture'],
        adjective: ['cultural'],
        adverb: ['culturally'],
      },
      collocations: [
        'different/traditional/modern/local/western/global culture',
      ],
    },
    {
      headword: 'delay',
      turkish: 'gecikme, geciktirmek',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: ['delay'],
        noun: ['delay'],
        adjective: [],
        adverb: [],
      },
      collocations: ['to delay sb/sth', 'to be delayed'],
    },
    {
      headword: 'efficient',
      turkish: 'verimli',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: [],
        adjective: ['efficient', 'inefficient'],
        adverb: ['efficiently'],
      },
      collocations: [
        'efficient worker/management/technology/machine/device',
        'to be/look efficient (in/at sth)',
        'to work/operate efficiently',
      ],
    },
    {
      headword: 'feel',
      turkish: 'hissetmek',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: ['feel'],
        noun: ['feeling'],
        adjective: [],
        adverb: [],
      },
      collocations: ['to feel good/bad/sorry/comfortable/sick'],
    },
    {
      headword: 'happen',
      turkish: 'olmak, meydana gelmek',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: ['happen'],
        noun: [],
        adjective: [],
        adverb: [],
      },
      collocations: ['to feel like sth/sb (to feel like a child, etc.)'],
    },
    {
      headword: 'hurry',
      turkish: 'acele etmek',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: ['hurry'],
        noun: ['hurry'],
        adjective: [],
        adverb: [],
      },
      collocations: ['to be in a hurry (to do sth)'],
    },
    {
      headword: 'idea',
      turkish: 'fikir',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['idea'],
        adjective: [],
        adverb: [],
      },
      collocations: ['to have an idea', 'a great/good/bad idea/an interesting idea'],
    },
    {
      headword: 'ignore',
      turkish: 'göz ardı etmek',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: ['ignore'],
        noun: [],
        adjective: [],
        adverb: [],
      },
      collocations: ['to completely/totally ignore sb/sth'],
    },
    {
      headword: 'interest',
      turkish: 'ilgi',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['interest'],
        adjective: ['interested', 'interesting'],
        adverb: ['interestingly'],
      },
      collocations: [
        'to be interested in sb/sth',
        'a(n) interesting programme/person/article/book',
      ],
    },
    {
      headword: 'item',
      turkish: 'öğe, madde',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['item'],
        adjective: [],
        adverb: [],
      },
      collocations: ['an item of clothing/furniture/jewelry/luggage'],
    },
    {
      headword: 'interrupt',
      turkish: 'kesmek, sözünü kesmek',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: ['interrupt'],
        noun: ['interruption'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to interrupt sb/sth (class/meeting/talk etc.)',
        'to be sorry to interrupt',
      ],
    },
    {
      headword: 'jewelry',
      turkish: 'mücevher',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['jewelry'],
        adjective: [],
        adverb: [],
      },
      collocations: ['silver/gold jewelry'],
    },
    {
      headword: 'match',
      turkish: 'eşleşmek, maç',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: ['match'],
        noun: ['match'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to match well/correctly',
        'to match sth/sb with sth/sb else',
      ],
    },
    {
      headword: 'nature',
      turkish: 'doğa',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['nature'],
        adjective: ['natural', 'unnatural'],
        adverb: [],
      },
      collocations: [
        'natural beauty/ natural resources',
        'to be/feel/look/seem natural',
      ],
    },
    {
      headword: 'power',
      turkish: 'güç',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['power'],
        adjective: ['powerful'],
        adverb: [],
      },
      collocations: [
        'to have power (to do sth)',
        'power over sb/sth',
        'a powerful person/leader/machine/device',
      ],
    },
    {
      headword: 'prepare',
      turkish: 'hazırlamak',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: ['prepare'],
        noun: ['preparation'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to prepare sth/sb for sth/sb',
        'to do preparation for sth',
      ],
    },
    {
      headword: 'quality',
      turkish: 'kalite',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['quality'],
        adjective: [],
        adverb: [],
      },
      collocations: ['good/high/poor/low quality', 'quality of sth'],
    },
    {
      headword: 'quiet',
      turkish: 'sessiz',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: [],
        adjective: ['quiet'],
        adverb: ['quietly'],
      },
      collocations: ['quiet neighborhood/street', 'to be quiet'],
    },
    {
      headword: 'review',
      turkish: 'incelemek, gözden geçirmek',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: ['review'],
        noun: ['review'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'a good/bad/mixed review',
        'to publish/write a review',
        'a performance review',
        'to review books/films/plays, etc.',
        'to review topics for an exam',
      ],
    },
    {
      headword: 'round',
      turkish: 'yuvarlak',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['round'],
        adjective: [],
        adverb: [],
      },
      collocations: ['a round face/table/ball'],
    },
    {
      headword: 'schedule',
      turkish: 'program, zamanlamak',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: ['schedule'],
        noun: ['schedule'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'daily/weekly/busy/heavy/school schedule',
        'to plan/prepare/follow a schedule',
        'to schedule a meeting/an appointment',
      ],
    },
    {
      headword: 'sense',
      turkish: 'duyu, anlam',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['sense'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to have a sense of humor/direction/danger',
        'to make sense',
      ],
    },
    {
      headword: 'soldier',
      turkish: 'asker',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['soldier'],
        adjective: [],
        adverb: [],
      },
      collocations: ['a brave soldier', 'to be/become/serve as a soldier'],
    },
    {
      headword: 'text',
      turkish: 'metin, mesaj atmak',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: ['text'],
        noun: ['text'],
        adjective: [],
        adverb: [],
      },
      collocations: ['to text sb', 'to send a text'],
    },
    {
      headword: 'tip',
      turkish: 'ipucu, bahşiş',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['tip'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to give tip(s) on/for/about (doing) sth',
        'to give/leave sb a tip (money)',
      ],
    },
    {
      headword: 'transport',
      turkish: 'ulaşım, taşımak',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['transport', 'transportation'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to use public transport',
        'public/private transportation',
      ],
    },
    {
      headword: 'unusual',
      turkish: 'olağandışı',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: [],
        adjective: ['usual', 'unusual'],
        adverb: [],
      },
      collocations: ['to be unusual (for sb/sth) to do sth'],
    },
    {
      headword: 'competition',
      turkish: 'rekabet',
      unit: '2',
      section: 'Reading & Writing',
      forms: {
        verb: ['compete'],
        noun: ['competition', 'competitor'],
        adjective: ['competitive'],
        adverb: ['competitively'],
      },
      collocations: [
        'competition for sth',
        'strong/serious competition',
        'a competitive game/sport/profession/sector',
        'to compete in sth/with sb',
      ],
    },
  
    // =================================================================
    // UNIT 2: LISTENING & SPEAKING (Skillful 1)
    // =================================================================
    {
      headword: 'active',
      turkish: 'aktif',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: [],
        adjective: ['active', 'inactive'],
        adverb: ['actively'],
      },
      collocations: ['an active life/lifestyle', 'to be/ stay physically active'],
    },
    {
      headword: 'amount',
      turkish: 'miktar',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['amount'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'amount of sth (money/information/work/time, etc.)',
        'a huge/large/small amount',
        'to increase/reduce the amount of sth',
      ],
    },
    {
      headword: 'appointment',
      turkish: 'randevu',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['appointment'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to make/arrange an appointment',
        'to have a doctor\'s appointment',
        'an appointment to do sth',
        'an appointment with sb',
      ],
    },
    {
      headword: 'awake',
      turkish: 'uyanık',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: [],
        adjective: ['awake'],
        adverb: [],
      },
      collocations: ['to stay/feel/remain awake', 'to keep sb awake'],
    },
    {
      headword: 'choice',
      turkish: 'seçim',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: ['choose'],
        noun: ['choice'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to make/have a choice',
        'to give sb a choice',
        'a choice of sth /between sth and sth',
      ],
    },
    {
      headword: 'daily',
      turkish: 'günlük',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: [],
        adjective: ['daily'],
        adverb: ['daily'],
      },
      collocations: ['daily routine/exercise(s)', 'on a daily basis'],
    },
    {
      headword: 'discover',
      turkish: 'keşfetmek',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: ['discover'],
        noun: ['discovery', 'discoverer'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to discover sth',
        'an amazing/a huge discovery',
        'to make a discovery',
      ],
    },
    {
      headword: 'environment',
      turkish: 'çevre',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['environment'],
        adjective: ['environmental'],
        adverb: ['environmentally'],
      },
      collocations: [
        'working/learning environment',
        'to protect/pollute/harm the environment',
        'environmentally friendly',
      ],
    },
    {
      headword: 'expect',
      turkish: 'beklemek',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: ['expect'],
        noun: ['expectation'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to expect sth from sb/sth (to do sth)',
        'to expect (sb) to do sth',
        'to meet (sb\'s) expectations',
      ],
    },
    {
      headword: 'expert',
      turkish: 'uzman',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['expert'],
        adjective: ['expert'],
        adverb: [],
      },
      collocations: [
        'to be an expert in/on/at sth',
        'to ask/talk to an expert',
      ],
    },
    {
      headword: 'explain',
      turkish: 'açıklamak',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: ['explain'],
        noun: ['explanation'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to explain sth (ideas/opinions, etc.) to sb',
        'to have/give explanation of/for sth',
      ],
    },
    {
      headword: 'healthy',
      turkish: 'sağlıklı',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['health'],
        adjective: ['healthy', 'unhealthy'],
        adverb: [],
      },
      collocations: [
        '(un) healthy lifestyle/diet/food',
        'physical/mental health',
        'healthcare/ (a) health service',
      ],
    },
    {
      headword: 'helpful',
      turkish: 'yardımcı',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: ['help'],
        noun: ['help'],
        adjective: ['helpful'],
        adverb: [],
      },
      collocations: [
        'helpful person/advice',
        'to help sb to do sth',
        'to provide/give sb help with sth',
      ],
    },
    {
      headword: 'medicine',
      turkish: 'ilaç, tıp',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['medicine'],
        adjective: ['medical'],
        adverb: [],
      },
      collocations: ['to take medicine', 'a medical examination'],
    },
    {
      headword: 'necessary',
      turkish: 'gerekli',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: [],
        adjective: ['necessary', 'unnecessary'],
        adverb: ['necessarily', 'unnecessarily'],
      },
      collocations: ['it is necessary (for sb) to do sth'],
    },
    {
      headword: 'permission',
      turkish: 'izin',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['permission'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to get permission from sb',
        'to give permission to sb (to do sth)',
        'permission for sth',
      ],
    },
    {
      headword: 'regular',
      turkish: 'düzenli',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: [],
        adjective: ['regular', 'irregular'],
        adverb: ['regularly', 'irregularly'],
      },
      collocations: ['(ir)regular attendance/meals/sleep'],
    },
    {
      headword: 'rest',
      turkish: 'dinlenmek, kalan',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: ['rest'],
        noun: ['rest (remaining part)', 'rest (sleep/relax)'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'the rest of sth',
        'the rest of the world/day/time/sb\'s life',
        'to have/take a rest',
        'to get some/plenty of rest',
      ],
    },
    {
      headword: 'routine',
      turkish: 'rutin',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['routine'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'fixed/normal/regular/daily routine',
        'to follow/change a routines',
      ],
    },
    {
      headword: 'specific',
      turkish: 'belirli, özel',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: [],
        adjective: ['specific'],
        adverb: ['specifically'],
      },
      collocations: ['to be specific (about sth)', 'a specific example'],
    },
    {
      headword: 'spend',
      turkish: 'harcamak',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: ['spend'],
        noun: [],
        adjective: [],
        adverb: [],
      },
      collocations: ['to spend money/time on sth/doing sth'],
    },
    {
      headword: 'survey',
      turkish: 'anket, araştırma',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: ['survey'],
        noun: ['survey'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to do/complete/take/give/conduct a survey',
        'to participate in a survey',
        'according to the survey, (+ sentence)',
        'the results of the survey',
      ],
    },
    {
      headword: 'tired',
      turkish: 'yorgun',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['tiredness'],
        adjective: ['tired'],
        adverb: [],
      },
      collocations: ['a tiring day/job'],
    },
    {
      headword: 'typical',
      turkish: 'tipik',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: [],
        adjective: ['tiring', 'typical'],
        adverb: [],
      },
      collocations: ['a typical day/meal'],
    },
    {
      headword: 'volunteer',
      turkish: 'gönüllü',
      unit: '2',
      section: 'Listening & Speaking',
      forms: {
        verb: ['volunteer'],
        noun: ['volunteer'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to work/do sth as a volunteer',
        'to be a volunteer to do sth',
      ],
    },
  
    // =================================================================
    // UNIT 2: EXTRA WORDS (Skillful 1)
    // =================================================================
    {
      headword: 'ancient',
      turkish: 'antik, eski',
      unit: '2',
      section: 'Extra Words',
      forms: {
        verb: [],
        noun: [],
        adjective: ['ancient'],
        adverb: [],
      },
      collocations: [
        'ancient history/cities/cultures/sites',
        'ancient Greece/Egypt/Rome',
      ],
    },
    {
      headword: 'bright',
      turkish: 'parlak',
      unit: '2',
      section: 'Extra Words',
      forms: {
        verb: [],
        noun: [],
        adjective: ['bright'],
        adverb: [],
      },
      collocations: ['(a) bright light'],
    },
    {
      headword: 'complaint',
      turkish: 'şikayet',
      unit: '2',
      section: 'Extra Words',
      forms: {
        verb: ['complain'],
        noun: ['complaint'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'make/receive a complaint (about sth/sb)',
        'to complain (to sb) about sth',
      ],
    },
    {
      headword: 'encourage',
      turkish: 'cesaretlendirmek',
      unit: '2',
      section: 'Extra Words',
      forms: {
        verb: ['encourage'],
        noun: [],
        adjective: [],
        adverb: [],
      },
      collocations: ['to encourage sb to do sth'],
    },
    {
      headword: 'lend',
      turkish: 'ödünç vermek',
      unit: '2',
      section: 'Extra Words',
      forms: {
        verb: ['lend'],
        noun: [],
        adjective: [],
        adverb: [],
      },
      collocations: ['to lend sth to sb', 'to lend money to sb'],
    },
    {
      headword: 'narrow',
      turkish: 'dar',
      unit: '2',
      section: 'Extra Words',
      forms: {
        verb: [],
        noun: [],
        adjective: ['narrow'],
        adverb: [],
      },
      collocations: ['a narrow street/road/path/view'],
    },
    {
      headword: 'pause',
      turkish: 'ara vermek, duraklama',
      unit: '2',
      section: 'Extra Words',
      forms: {
        verb: ['pause'],
        noun: ['pause'],
        adjective: [],
        adverb: [],
      },
      collocations: ['to pause for sth', 'to pause to do sth'],
    },
    {
      headword: 'quantity',
      turkish: 'miktar',
      unit: '2',
      section: 'Extra Words',
      forms: {
        verb: [],
        noun: ['quantity'],
        adjective: [],
        adverb: [],
      },
      collocations: ['a large/small quantity of sth', 'in large/small quantities'],
    },
    {
      headword: 'shut',
      turkish: 'kapatmak',
      unit: '2',
      section: 'Extra Words',
      forms: {
        verb: ['shut'],
        noun: [],
        adjective: [],
        adverb: [],
      },
      collocations: ['to shut sth (the door/your eyes, etc.)'],
    },
    {
      headword: 'tie',
      turkish: 'bağlamak, kravat',
      unit: '2',
      section: 'Extra Words',
      forms: {
        verb: ['tie', 'untie'],
        noun: [],
        adjective: [],
        adverb: [],
      },
      collocations: ['to tie sth'],
    },
  
    // =================================================================
    // UNIT 3: READING & WRITING (Skillful 1)
    // =================================================================
    {
      headword: 'access',
      turkish: 'erişim',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: ['access'],
        noun: ['access'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to have access to sth',
        'to have access to information/services/healthcare the Internet',
        'to access sth',
      ],
    },
    {
      headword: 'allow',
      turkish: 'izin vermek',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: ['allow'],
        noun: [],
        adjective: [],
        adverb: [],
      },
      collocations: ['to allow sb to do sth', 'to allow sth'],
    },
    {
      headword: 'architecture',
      turkish: 'mimari',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['architect', 'architecture'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'traditional/local/historical/ancient/modern architecture',
      ],
    },
    {
      headword: 'boring',
      turkish: 'sıkıcı',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: [],
        adjective: ['boring', 'bored'],
        adverb: [],
      },
      collocations: ['a boring/book/article/film/play/lecture/person'],
    },
    {
      headword: 'connect',
      turkish: 'bağlamak',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: ['connect'],
        noun: ['connection'],
        adjective: ['connected'],
        adverb: [],
      },
      collocations: [
        'to connect A to B',
        'to connect A and B',
        'a connection with/to sth/sb',
        'to have a strong connection',
      ],
    },
    {
      headword: 'continue',
      turkish: 'devam etmek',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: ['continue'],
        noun: [],
        adjective: [],
        adverb: [],
      },
      collocations: ['to continue to do sth', 'to continue doing sth'],
    },
    {
      headword: 'decrease',
      turkish: 'azalmak',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: ['decrease'],
        noun: ['decrease'],
        adjective: [],
        adverb: [],
      },
      collocations: ['a decrease in sth'],
    },
    {
      headword: 'definite',
      turkish: 'kesin',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: [],
        adjective: ['definite', 'indefinite'],
        adverb: ['definitely', 'indefinitely'],
      },
      collocations: ['a definite plan/period', 'an indefinite period'],
    },
    {
      headword: 'enormous',
      turkish: 'devasa',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: [],
        adjective: ['enormous'],
        adverb: [],
      },
      collocations: [],
    },
    {
      headword: 'exactly',
      turkish: 'tam olarak',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: [],
        adjective: ['exact'],
        adverb: ['exactly'],
      },
      collocations: ['(the) exact moment/time (of sth)'],
    },
    {
      headword: 'exchange',
      turkish: 'takas etmek, döviz',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: ['exchange'],
        noun: ['exchange'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to exchange sth (cars/ideas/currency).',
        '(the) (currency) exchange rate',
        'an exchange office',
      ],
    },
    {
      headword: 'experience',
      turkish: 'deneyim',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: ['experience'],
        noun: ['experience'],
        adjective: ['experienced', 'inexperienced'],
        adverb: [],
      },
      collocations: [
        'to have/gain experience in (doing) sth',
        'to be experienced in sth',
        '(in)experienced workers/employees',
      ],
    },
    {
      headword: 'flat',
      turkish: 'düz, daire',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: [],
        adjective: ['flat'],
        adverb: [],
      },
      collocations: ['flat land', 'a flat region/surface'],
    },
    {
      headword: 'government',
      turkish: 'hükümet',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['government'],
        adjective: [],
        adverb: [],
      },
      collocations: ['a strong/weak government', 'government policy'],
    },
    {
      headword: 'guess',
      turkish: 'tahmin etmek',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: ['guess'],
        noun: ['guess'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to guess right/correctly/wrong',
        'to make/have/take a guess (at sth)',
      ],
    },
    {
      headword: 'improve',
      turkish: 'geliştirmek',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: ['improve'],
        noun: ['improvement'],
        adjective: [],
        adverb: [],
      },
      collocations: ['to see an improvement'],
    },
    {
      headword: 'independent',
      turkish: 'bağımsız',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: ['depend'],
        noun: ['independence', 'dependence'],
        adjective: ['independent', 'dependent'],
        adverb: ['independently'],
      },
      collocations: [
        'a huge/slight improvement',
        'to be/become/feel independent',
        'to depend on sth/sb',
        'to gain independence',
      ],
    },
    {
      headword: 'join',
      turkish: 'katılmak',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: ['join'],
        noun: [],
        adjective: [],
        adverb: [],
      },
      collocations: ['to join a group/club/team/party'],
    },
    {
      headword: 'journey',
      turkish: 'yolculuk',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['journey'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to go on/begin/continue/complete a journey',
        'a one-way/return journey',
      ],
    },
    {
      headword: 'location',
      turkish: 'konum',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: ['locate'],
        noun: ['location'],
        adjective: [],
        adverb: [],
      },
      collocations: ['a close/near/far/distant location'],
    },
    {
      headword: 'mobile',
      turkish: 'mobil',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['mobile'],
        adjective: ['mobile'],
        adverb: [],
      },
      collocations: ['mobile users/apps/operators/technology/market'],
    },
    {
      headword: 'percent',
      turkish: 'yüzde',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['percentage', 'percent'],
        adjective: [],
        adverb: ['percent'],
      },
      collocations: ['a 15 percent rise in price'],
    },
    {
      headword: 'pleasant',
      turkish: 'hoş, keyifli',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: [],
        adjective: ['pleasant', 'unpleasant'],
        adverb: [],
      },
      collocations: ['a pleasant city/holiday', 'a pleasant/unpleasant person'],
    },
    {
      headword: 'popular',
      turkish: 'popüler',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['popularity'],
        adjective: ['popular', 'unpopular'],
        adverb: [],
      },
      collocations: ['(a) growing popularity (of sth)'],
    },
    {
      headword: 'population',
      turkish: 'nüfus',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['population'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'the adult/student/working/urban population',
        'the population of sth',
        'big/small/large population',
      ],
    },
    {
      headword: 'reduce',
      turkish: 'azaltmak',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: ['reduce'],
        noun: ['reduction'],
        adjective: [],
        adverb: [],
      },
      collocations: ['to reduce sth (stress/prices/costs, etc.)'],
    },
    {
      headword: 'remain',
      turkish: 'kalmak, sürdürmek',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: ['remain'],
        noun: [],
        adjective: [],
        adverb: [],
      },
      collocations: ['to remain + adjective (to remain strong/open, etc.)'],
    },
    {
      headword: 'rent',
      turkish: 'kira, kiralamak',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: ['rent'],
        noun: ['rent'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to pay rent for/on sth',
        'to rent sth (a house/flat/apartment/bike/car)',
      ],
    },
    {
      headword: 'resource',
      turkish: 'kaynak',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['resource'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'water/mineral/energy resources',
        'natural resources',
        'HR (human resources)',
      ],
    },
    {
      headword: 'ride',
      turkish: 'binmek, sürüş',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: ['ride'],
        noun: ['ride'],
        adjective: [],
        adverb: [],
      },
      collocations: ['to ride a bicycle/motorbike/elephant/horse'],
    },
    {
      headword: 'separate',
      turkish: 'ayırmak, ayrı',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: ['separate'],
        noun: [],
        adjective: ['separate'],
        adverb: [],
      },
      collocations: [
        'separate rooms/buildings/locations',
        'separate from sb/sth',
        'to separate A from B',
      ],
    },
    {
      headword: 'skill',
      turkish: 'beceri',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['skill'],
        adjective: ['skilled', 'skillful'],
        adverb: [],
      },
      collocations: [
        'to have/need/develop/learn/practice a skill',
        'skilled workers',
      ],
    },
    {
      headword: 'solution',
      turkish: 'çözüm',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: ['solve'],
        noun: ['solution'],
        adjective: [],
        adverb: [],
      },
      collocations: [
        'to solve a problem/mystery/puzzle',
        'to find/offer/provide a solution to/for sth',
      ],
    },
    {
      headword: 'sudden',
      turkish: 'ani',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: [],
        adjective: ['sudden'],
        adverb: ['suddenly'],
      },
      collocations: ['to stop/start/happen suddenly'],
    },
    {
      headword: 'vehicle',
      turkish: 'araç, taşıt',
      unit: '3',
      section: 'Reading & Writing',
      forms: {
        verb: [],
        noun: ['vehicle'],
        adjective: [],
        adverb: [],
      },
      collocations: ['long vehicle'],
    },
  
    // =================================================================
    // UNIT 3: LISTENING & SPEAKING (Skillful 1)
    // =================================================================
    {
      headword: 'activity',
      turkish: 'aktivite',
      unit: '3',
      section: 'Listening & Speaking',
      forms: {
        verb: [],
        noun: ['activity'],
        adjective: [],
        adverb: [],
      },
      collocations: ['leisure/outdoor/cultural activities', 'to do/perform/enjoy an activity'],
    },
    {
      headword: 'advertising',
      turkish: 'reklamcılık',
      unit: '3',
      section: 'Listening & Speaking',
      forms: {
        verb: ['advertise'],
        noun: ['advertisement', 'ad', 'advertiser', 'advertising'],
        adjective: [],
        adverb: [],
    },
    collocations: [
      'an advertising campaign/company',
      'an advertising leaflet/billboard',
      'to advertise (sth) on television/in a newspaper/',
      'advertising on the Internet/on social media',
    ],
  },
  {
    headword: 'afford',
    turkish: 'karşılayabilmek',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['afford'],
      noun: [],
      adjective: [],
      adverb: [],
    },
    collocations: ['can/could afford sth'],
  },
  {
    headword: 'crowded',
    turkish: 'kalabalık',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'crowd' can be a verb, but not listed
      noun: ['crowd'],
      adjective: ['crowded'],
      adverb: [],
    },
    collocations: [
      'to be in a crowd',
      'to join the crowd',
      'crowded place/street/city',
    ],
  },
  {
    headword: 'define',
    turkish: 'tanımlamak',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['define'],
      noun: ['definition'],
      adjective: [],
      adverb: [],
    },
    collocations: ['the definition of sth'],
  },
  {
    headword: 'discuss',
    turkish: 'tartışmak',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['discuss'],
      noun: ['discussion'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to discuss sth with sb', 'to have a discussion'],
  },
  {
    headword: 'design',
    turkish: 'tasarım, tasarlamak',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['design'],
      noun: ['design', 'designer'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'to design a building/product/website',
      'a graphic/website designer',
    ],
  },
  {
    headword: 'difference',
    turkish: 'fark',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'differ' can be a verb, but not listed
      noun: ['difference'],
      adjective: ['different'],
      adverb: ['differently'],
    },
    collocations: [
      'to make a difference',
      'a big/major/important/small/minor difference',
      'a difference between sth and sth/sb and sb',
    ],
  },
  {
    headword: 'difficulty',
    turkish: 'zorluk',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['difficulty'],
      adjective: ['difficult'],
      adverb: [],
    },
    collocations: [
      'to be difficult for sb',
      'to be difficult to do sth',
      'to find sth difficult',
      'to have difficulty (in) doing sth',
    ],
  },
  {
    headword: 'equipment',
    turkish: 'ekipman',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'equip' can be a verb, but not listed
      noun: ['equipment'],
      adjective: [],
      adverb: [],
    },
    collocations: ['sports/electrical/kitchen equipment'],
  },
  {
    headword: 'grow',
    turkish: 'büyümek',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['grow'],
      noun: ['growth'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'to grow fruit/vegetables/flowers/plants',
      'economic/population growth',
    ],
  },
  {
    headword: 'historical',
    turkish: 'tarihi',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['history', 'historian'],
      adjective: ['historical'],
      adverb: [],
    },
    collocations: ['the history of science/music/philosophy'],
  },
  {
    headword: 'huge',
    turkish: 'çok büyük',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: [],
      adjective: ['huge'],
      adverb: [],
    },
    collocations: ['a huge amount/quantity/success/problem'],
  },
  {
    headword: 'image',
    turkish: 'imaj',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'image' can be a verb, but not listed
      noun: ['image'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'have/give an image (of sth/sb)',
      'a positive/negative image',
      'self-image',
    ],
  },
  {
    headword: 'increase',
    turkish: 'artırmak, artış',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['increase'],
      noun: ['increase'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to increase slightly/rapidly/slowly/greatly', 'increase in sth'],
  },
  {
    headword: 'industry',
    turkish: 'sanayi',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['industry'],
      adjective: [], // 'industrial' can be an adjective but not listed here
      adverb: [],
    },
    collocations: ['(the) development/growth of industry'],
  },
  {
    headword: 'law',
    turkish: 'yasa',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['law'],
      adjective: [], // 'legal' can be an adjective but not listed here
      adverb: [],
    },
    collocations: ['to make/pass a law'],
  },
  {
    headword: 'obvious',
    turkish: 'apaçık',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'obviate' can be a verb, but not listed
      noun: [], // 'obviousness' can be a noun, but not listed
      adjective: ['obvious'],
      adverb: ['obviously'],
    },
    collocations: ['to follow/obey/ break the law', 'an obvious reason (for sth)'],
  },
  {
    headword: 'plant',
    turkish: 'bitki, ekmek',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'plant' can be a verb, but not listed as form
      noun: ['plant'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to grow a plant', 'to plant a tree/seeds'],
  },
  {
    headword: 'produce',
    turkish: 'üretmek',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['produce'],
      noun: ['product', 'production'],
      adjective: [], // 'productive' can be an adjective, but not listed here
      adverb: [],
    },
    collocations: [
      'to produce sth from sth',
      'to buy/sell products',
      '(the) production of sth',
    ],
  },
  {
    headword: 'public',
    turkish: 'kamu, halk',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'publish' can be a verb, but not listed
      noun: ['the public'],
      adjective: ['public'],
      adverb: [],
    },
    collocations: [
      'public buildings/places/transportation',
      'open to the public',
      '(do sth) in public',
    ],
  },
  {
    headword: 'pollution',
    turkish: 'kirlilik',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['pollute'],
      noun: ['pollution'],
      adjective: ['polluted'],
      adverb: [],
    },
    collocations: [
      'environmental pollution',
      'air/river/water/noise/vehicle pollution',
      'to control/reduce/cause/prevent pollution',
    ],
  },
  {
    headword: 'pressure',
    turkish: 'basınç',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['press'],
      noun: ['pressure'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to be/come under pressure to do sth', 'pressure of/on'],
  },
  {
    headword: 'rate',
    turkish: 'oran',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'rate' can be a verb, but not listed
      noun: ['rate'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'crime/success/failure/unemployment/exchange rate',
      'the rate of sth',
    ],
  },
  {
    headword: 'score',
    turkish: 'puan, skor',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['score'],
      noun: ['score'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to have a high/low score', 'to score sth (a goal/point, etc.)'],
  },
  {
    headword: 'space',
    turkish: 'alan, boşluk',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'space' can be a verb, but not listed
      noun: ['space'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      '(not) enough space',
      'green space',
      'personal space',
    ],
  },
  {
    headword: 'store',
    turkish: 'depolamak, mağaza',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['store'],
      noun: ['storage', 'store'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'to store sth (data/information/food/equipment etc.)',
      'large stores',
    ],
  },
  {
    headword: 'trend',
    turkish: 'eğilim',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'trend' can be a verb, but not listed
      noun: ['trend'],
      adjective: ['trendy'],
      adverb: [],
    },
    collocations: ['trendy clothes', 'fashion trends'],
  },
  {
    headword: 'support',
    turkish: 'destek, desteklemek',
    unit: '3',
    section: 'Listening & Speaking',
    forms: {
      verb: ['support'],
      noun: ['support'],
      adjective: [], // 'supportive' can be an adjective, but not listed here
      adverb: [],
    },
    collocations: [
      'to support sb/sth (in sth)',
      'to give/provide support for sth/to sb',
    ],
  },

  // =================================================================
  // UNIT 3: EXTRA WORDS (Skillful 1)
  // =================================================================
  {
    headword: 'accommodation',
    turkish: 'konaklama',
    unit: '3',
    section: 'Extra Words',
    forms: {
      verb: ['accommodate'],
      noun: ['accommodation'],
      adjective: [],
      adverb: [],
    },
    collocations: [],
  },
  {
    headword: 'admire',
    turkish: 'hayran olmak',
    unit: '3',
    section: 'Extra Words',
    forms: {
      verb: ['admire'],
      noun: [], // 'admiration' or 'admirer' can be nouns, but not listed
      adjective: [], // 'admirable' or 'admired' can be adjectives, but not listed
      adverb: [], // 'admirably' can be an adverb, but not listed
    },
    collocations: ['to admire sb/sth'],
  },
  {
    headword: 'awful',
    turkish: 'korkunç',
    unit: '3',
    section: 'Extra Words',
    forms: {
      verb: [],
      noun: [],
      adjective: ['awful'],
      adverb: ['awfully'],
    },
    collocations: ['to feel/look/be/smell/taste awful'],
  },
  {
    headword: 'bone',
    turkish: 'kemik',
    unit: '3',
    section: 'Extra Words',
    forms: {
      verb: [],
      noun: ['bone'],
      adjective: [], // 'bony' can be an adjective, but not listed
      adverb: [],
    },
    collocations: ['broken bones'],
  },
  {
    headword: 'familiar',
    turkish: 'tanıdık',
    unit: '3',
    section: 'Extra Words',
    forms: {
      verb: [], // 'familiarize' can be a verb, but not listed
      noun: [], // 'familiarity' can be a noun, but not listed
      adjective: ['familiar', 'unfamiliar'],
      adverb: [], // 'familiarly' can be an adverb, but not listed
    },
    collocations: ['to be (un)familiar with sth', 'to look/sound familiar'],
  },

  // =================================================================
  // UNIT 4: READING & WRITING (Skillful 1)
  // =================================================================
  {
    headword: 'advice',
    turkish: 'tavsiye',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['advise'],
      noun: ['advice'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'to give/follow/offer/get/receive advice',
      'to take one\'s advice',
      'advice on/about',
      'advise sb to do sth',
    ],
  },
  {
    headword: 'alone',
    turkish: 'yalnız',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: [],
      adjective: ['alone'],
      adverb: ['alone'],
    },
    collocations: ['to spend time/live/work alone'],
  },
  {
    headword: 'available',
    turkish: 'mevcut',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: [], // 'availability' can be a noun, but not listed
      adjective: ['available', 'unavailable'],
      adverb: [],
    },
    collocations: ['to be/become available'],
  },
  {
    headword: 'alive',
    turkish: 'canlı, hayatta',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'live' can be a verb, but not listed
      noun: [], // 'life' can be a noun, but not listed
      adjective: ['alive'],
      adverb: [],
    },
    collocations: ['to be/stay alive'],
  },
  {
    headword: 'asleep',
    turkish: 'uykuda',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['sleep'],
      noun: ['sleep'],
      adjective: ['asleep'],
      adverb: [],
    },
    collocations: ['to fall asleep'],
  },
  {
    headword: 'benefit',
    turkish: 'fayda',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'benefit' can be a verb, but not listed
      noun: ['benefit'],
      adjective: ['beneficial'],
      adverb: [],
    },
    collocations: [
      'benefit(s) of sth/doing sth',
      'to have a lot of benefits',
      'beneficial for sth/sb',
    ],
  },
  {
    headword: 'cause',
    turkish: 'neden olmak, sebep',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['cause'],
      noun: ['cause'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'to cause sth (problems/pollution, etc)',
      '(a) cause of sth',
    ],
  },
  {
    headword: 'climate',
    turkish: 'iklim',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['climate'],
      adjective: [], // 'climatic' can be an adjective, but not listed
      adverb: [],
    },
    collocations: [
      'climate problems/issues',
      'climate change',
      '(an) extreme climate',
    ],
  },
  {
    headword: 'comment',
    turkish: 'yorum, yorum yapmak',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['comment'],
      noun: ['comment'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'to comment on sth',
      'to make a comment',
      'a comment about/on sth',
      'to reply/respond to a comment',
    ],
  },
  {
    headword: 'convince',
    turkish: 'ikna etmek',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['convince'],
      noun: [], // 'conviction' can be a noun, but not listed
      adjective: [], // 'convinced' can be an adjective, but not listed
      adverb: [],
    },
    collocations: ['to convince sb/that...', 'to convince sb to do sth'],
  },
  {
    headword: 'context',
    turkish: 'bağlam',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['context'],
      adjective: [], // 'contextual' can be an adjective, but not listed
      adverb: [], // 'contextually' can be an adverb, but not listed
    },
    collocations: ['to see/show/explain sth in context'],
  },
  {
    headword: 'disease',
    turkish: 'hastalık',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['disease'],
      adjective: [], // 'diseased' can be an adjective, but not listed
      adverb: [],
    },
    collocations: [
      'to have/suffer from/catch/get/die from a disease',
      'to treat/cure a disease',
    ],
  },
  {
    headword: 'embarrassed',
    turkish: 'utanmış',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['embarrass'],
      noun: [], // 'embarrassment' can be a noun, but not listed
      adjective: ['embarrassing', 'embarrassed'],
      adverb: [], // 'embarrassingly' can be an adverb, but not listed
    },
    collocations: [
      'to be/look/feel embarrassed',
      'embarrassed at/about (doing) sth',
      'an embarrassing moment',
    ],
  },
  {
    headword: 'entertain',
    turkish: 'eğlendirmek',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['entertain'],
      noun: ['entertainment', 'entertainer'],
      adjective: ['entertaining'],
      adverb: [], // 'entertainingly' can be an adverb, but not listed
    },
    collocations: ['to entertain sb with sth'],
  },
  {
    headword: 'knowledge',
    turkish: 'bilgi',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['know'],
      noun: ['knowledge'],
      adjective: [], // 'knowledgeable' can be an adjective, but not listed
      adverb: [],
    },
    collocations: [
      'scientific/technical/basic knowledge',
      'to have/gain knowledge about sth',
    ],
  },
  {
    headword: 'last',
    turkish: 'son, sürmek',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['last'],
      noun: [],
      adjective: ['last'],
      adverb: [],
    },
    collocations: ['to come/arrive last', 'to last (about an hour)'],
  },
  {
    headword: 'lonely',
    turkish: 'yalnız',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: [], // 'loneliness' can be a noun, but not listed
      adjective: ['lonely'],
      adverb: [],
    },
    collocations: ['to feel lonely'],
  },
  {
    headword: 'mistake',
    turkish: 'hata',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'mistake' can be a verb, but not listed as form
      noun: ['mistake'],
      adjective: [], // 'mistaken' can be an adjective, but not listed
      adverb: [], // 'mistakenly' can be an adverb, but not listed
    },
    collocations: [
      'to make/repeat a mistake',
      'to learn from a mistake',
      'to do sth by mistake',
    ],
  },
  {
    headword: 'mention',
    turkish: 'bahsetmek',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['mention'],
      noun: [], // 'mention' can be a noun, but not listed as form
      adjective: [], // 'mentioned' can be an adjective, but not listed
      adverb: [],
    },
    collocations: ['to mention sth (to sb)'],
  },
  {
    headword: 'organization',
    turkish: 'organizasyon',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['organize'],
      noun: ['organizer', 'organization'],
      adjective: ['organized'],
      adverb: [],
    },
    collocations: [
      'to be/look/seem organized',
      'to organize a conference/meeting/seminar/an event',
    ],
  },
  {
    headword: 'pain',
    turkish: 'ağrı',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'pain' can be a verb, but not listed
      noun: ['pain'],
      adjective: ['painful', 'painless'],
      adverb: ['painfully'],
    },
    collocations: [
      'stomach/chest/back pains',
      'to be in pain; to live with pain',
      'to feel/experience/suffer pain (in sth (knees, etc.))',
    ],
  },
  {
    headword: 'previous',
    turkish: 'önceki',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: [],
      adjective: ['previous'],
      adverb: ['previously'],
    },
    collocations: [],
  },
  {
    headword: 'save',
    turkish: 'kurtarmak, biriktirmek',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['save'],
      noun: [], // 'saving' or 'saver' can be nouns, but not listed
      adjective: [], // 'saved' can be an adjective, but not listed
      adverb: [],
    },
    collocations: ['to save lives/money/time/energy', 'to save sb from sth'],
  },
  {
    headword: 'security',
    turkish: 'güvenlik',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'secure' can be a verb, but not listed
      noun: ['security'],
      adjective: [], // 'secure' or 'insecure' can be adjectives, but not listed
      adverb: [], // 'securely' can be an adverb, but not listed
    },
    collocations: ['security guard'],
  },
  {
    headword: 'shape',
    turkish: 'şekil',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'shape' can be a verb, but not listed
      noun: ['shape'],
      adjective: [], // 'shaped' or 'shapely' can be adjectives, but not listed
      adverb: [],
    },
    collocations: ['to stay in shape'],
  },
  {
    headword: 'site',
    turkish: 'yer, site',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'site' can be a verb, but not listed
      noun: ['site'],
      adjective: [],
      adverb: [],
    },
    collocations: ['historical/ancient/cultural sites'],
  },
  {
    headword: 'stage',
    turkish: 'sahne, aşama',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'stage' can be a verb, but not listed
      noun: ['stage'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'stage of/in sth',
      'the early/initial/final stages',
      'a new/difficult stage',
    ],
  },
  {
    headword: 'strange',
    turkish: 'garip',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['stranger'],
      adjective: ['strange'],
      adverb: ['strangely'],
    },
    collocations: [
      'to be/feel/seem strange',
      'a stranger to sb/sth',
      'to behave strangely',
      'strange behavior',
    ],
  },
  {
    headword: 'traditional',
    turkish: 'geleneksel',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['tradition'],
      adjective: ['traditional'],
      adverb: ['traditionally'],
    },
    collocations: ['traditional dress/music/art/culture/dance/food'],
  },
  {
    headword: 'trouble',
    turkish: 'sorun',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['trouble'],
      noun: ['trouble'],
      adjective: [], // 'troubled' or 'troublesome' can be adjectives, but not listed
      adverb: [],
    },
    collocations: [
      'to have/make/cause trouble',
      'to have trouble with sb/sth',
      'to have trouble doing sth',
      'to be in trouble',
    ],
  },
  {
    headword: 'worry',
    turkish: 'endişelenmek',
    unit: '4',
    section: 'Reading & Writing',
    forms: {
      verb: ['worry'],
      noun: ['worry'],
      adjective: ['worried', 'worrying'],
      adverb: [], // 'worriedly' or 'worryingly' can be adverbs, but not listed
    },
    collocations: ['to be worried (about sth/sb)', 'to worry about sb/sth'],
  },

  // =================================================================
  // UNIT 4: LISTENING & SPEAKING (Skillful 1)
  // =================================================================
  {
    headword: 'accept',
    turkish: 'kabul etmek',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['accept'],
      noun: [], // 'acceptance' can be a noun, but not listed
      adjective: ['acceptable', 'unacceptable'],
      adverb: [], // 'acceptably' or 'unacceptably' can be adverbs, but not listed
    },
    collocations: [
      'to accept sth (a gift/offer/invitation, etc,) from sb',
    ],
  },
  {
    headword: 'adult',
    turkish: 'yetişkin',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['adult', 'adulthood'],
      adjective: ['adult'],
      adverb: [],
    },
    collocations: [
      'to be/become an adult',
      'to look like/feel/behave like an adult',
      'during/in adulthood',
    ],
  },
  {
    headword: 'arrive',
    turkish: 'varmak',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['arrive'],
      noun: ['arrival'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to arrive in/at', 'to arrive late'],
  },
  {
    headword: 'attitude',
    turkish: 'tutum',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['attitude'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'to have/keep a positive/negative attitude about sth',
      'an attitude to/towards sth/sb',
    ],
  },
  {
    headword: 'celebrate',
    turkish: 'kutlamak',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['celebrate'],
      noun: ['celebration'],
      adjective: [], // 'celebrated' can be an adjective, but not listed
      adverb: [],
    },
    collocations: [
      'to celebrate special events/days (birthday/wedding anniversary, etc.)',
      'a huge/special celebration',
    ],
  },
  {
    headword: 'community',
    turkish: 'topluluk',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['community'],
      adjective: [],
      adverb: [],
    },
    collocations: ['a small/local community'],
  },
  {
    headword: 'consider',
    turkish: 'dikkate almak',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['consider'],
      noun: [], // 'consideration' can be a noun, but not listed
      adjective: [], // 'considerate' can be an adjective, but not listed
      adverb: [], // 'considerably' can be an adverb, but not listed
    },
    collocations: [
      'to consider sth/sb',
      'to consider doing sth',
      'to consider (the) options',
    ],
  },
  {
    headword: 'contact',
    turkish: 'temas, iletişim',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['contact'],
      noun: ['contact'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'to be/get/stay/keep in contact (with sb)',
      'to have close/daily/regular contact (with sb)',
    ],
  },
  {
    headword: 'cover',
    turkish: 'kapatmak, örtmek',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['cover'],
      noun: ['cover'],
      adjective: [], // 'covered' or 'covering' can be adjectives, but not listed
      adverb: [],
    },
    collocations: ['to cover sth (with sth)'],
  },
  {
    headword: 'custom',
    turkish: 'gelenek',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['custom'],
      adjective: [], // 'customary' can be an adjective, but not listed
      adverb: [], // 'customarily' can be an adverb, but not listed
    },
    collocations: ['a local/ancient/traditional custom'],
  },
  {
    headword: 'develop',
    turkish: 'geliştirmek',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['develop'],
      noun: ['development'],
      adjective: ['developed', 'developing', 'undeveloped'],
      adverb: [],
    },
    collocations: [
      'to develop sth (a skill/strategy/method/technology etc.)',
      'a developed/developing country',
    ],
  },
  {
    headword: 'exist',
    turkish: 'var olmak',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['exist'],
      noun: [], // 'existence' can be a noun, but not listed
      adjective: [], // 'existing' can be an adjective, but not listed
      adverb: [],
    },
    collocations: [],
  },
  {
    headword: 'fight',
    turkish: 'kavga etmek, mücadele etmek',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['fight'],
      noun: ['fight'],
      adjective: [], // 'fighting' can be an adjective, but not listed
      adverb: [],
    },
    collocations: [
      'to fight against sth/with sb',
      'to fight about/over/for sth',
      'to have start a fight (with sb)',
    ],
  },
  {
    headword: 'foreign',
    turkish: 'yabancı',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['foreigner'],
      adjective: ['foreign'],
      adverb: [],
    },
    collocations: ['foreign trade/travel'],
  },
  {
    headword: 'greet',
    turkish: 'selamlamak',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['greet'],
      noun: [], // 'greeting' or 'greeter' can be nouns, but not listed
      adjective: [], // 'greeted' or 'greeting' can be adjectives, but not listed
      adverb: [],
    },
    collocations: ['to greet sb formally/informally'],
  },
  {
    headword: 'gift',
    turkish: 'hediye',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'gift' can be a verb, but not listed
      noun: ['gift'],
      adjective: [], // 'gifted' can be an adjective, but not listed
      adverb: [],
    },
    collocations: ['to give a gift to sb', 'to receive/get a gift from sb'],
  },
  {
    headword: 'habit',
    turkish: 'alışkanlık',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['habit'],
      adjective: [], // 'habitual' or 'habituated' can be adjectives, but not listed
      adverb: [], // 'habitually' can be an adverb, but not listed
    },
    collocations: ['good/bad habits', 'to have/develop a habit of (doing) sth'],
  },
  {
    headword: 'hold',
    turkish: 'tutmak',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['hold'],
      noun: [], // 'hold' can be a noun, but not listed as form
      adjective: [], // 'holding' or 'held' can be adjectives, but not listed
      adverb: [],
    },
    collocations: ['to hold sth (in your hand/arms)'],
  },
  {
    headword: 'international',
    turkish: 'uluslararası',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['nation'],
      adjective: ['national', 'international'],
      adverb: [], // 'internationally' can be an adverb, but not listed
    },
    collocations: ['a national airline/museum/theatre'],
  },
  {
    headword: 'invitation',
    turkish: 'davet',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['invite'],
      noun: ['invitation'],
      adjective: [], // 'invited' or 'inviting' can be adjectives, but not listed
      adverb: [],
    },
    collocations: ['to invite sb to sth/to do sth'],
  },
  {
    headword: 'luck',
    turkish: 'şans',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['luck', 'unluck'],
      adjective: ['lucky', 'unlucky'],
      adverb: ['luckily'],
    },
    collocations: ['to have a lucky escape', 'good/bad luck'],
  },
  {
    headword: 'mark',
    turkish: 'işaret, not',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['mark'],
      noun: ['mark'],
      adjective: [], // 'marked' or 'marking' can be adjectives, but not listed
      adverb: [], // 'markedly' can be an adverb, but not listed
    },
    collocations: ['to leave a mark (on sth)', 'to mark an exam/test'],
  },
  {
    headword: 'nervous',
    turkish: 'gergin, sinirli',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'nerve' (noun) but no verb listed
      noun: [], // 'nervousness' can be a noun, but not listed
      adjective: ['nervous'],
      adverb: ['nervously'],
    },
    collocations: ['to be/look/seem/feel/get nervous', 'to be nervous about sb/sth'],
  },
  {
    headword: 'offer',
    turkish: 'teklif',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['offer'],
      noun: ['offer'],
      adjective: [], // 'offered' or 'offering' can be adjectives, but not listed
      adverb: [],
    },
    collocations: [
      'to offer sth (advice/support/help etc.) to sb',
      'to refuse/accept an offer',
    ],
  },
  {
    headword: 'particular',
    turkish: 'belirli, özel',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: [],
      adjective: ['particular'],
      adverb: ['particularly'],
    },
    collocations: ['in particular'],
  },
  {
    headword: 'purpose',
    turkish: 'amaç',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'purpose' can be a verb, but not listed
      noun: ['purpose'],
      adjective: [], // 'purposeful' or 'purposeless' can be adjectives, but not listed
      adverb: [], // 'purposefully' can be an adverb, but not listed
    },
    collocations: ['the main/primary purpose', '(the) purpose of sth'],
  },
  {
    headword: 'receive',
    turkish: 'almak',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['receive'],
      noun: [], // 'receipt' or 'receiver' can be nouns, but not listed
      adjective: [], // 'received' or 'receiving' can be adjectives, but not listed
      adverb: [],
    },
    collocations: [
      'to receive a qualification (degree, diploma, PhD, etc)',
      'to receive a gift/news',
    ],
  },
  {
    headword: 'refuse',
    turkish: 'reddetmek',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['refuse'],
      noun: [], // 'refusal' can be a noun, but not listed
      adjective: [], // 'refused' can be an adjective, but not listed
      adverb: [],
    },
    collocations: ['to refuse to do sth', 'to refuse an offer/request'],
  },
  {
    headword: 'remember',
    turkish: 'hatırlamak',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['remember'],
      noun: [], // 'remembrance' or 'memory' (for remember) can be nouns, but not listed
      adjective: [], // 'remembered' or 'remembering' can be adjectives, but not listed
      adverb: [],
    },
    collocations: [],
  },
  {
    headword: 'rule',
    turkish: 'kural, yönetmek',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'rule' can be a verb, but not listed as form
      noun: ['rule'],
      adjective: [], // 'ruling' or 'ruled' can be adjectives, but not listed
      adverb: [],
    },
    collocations: ['to make/apply/obey/follow/break rules'],
  },
  {
    headword: 'scared',
    turkish: 'korkmuş',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'scare' can be a verb, but not listed as form
      noun: [], // 'scare' (noun) or 'scarecrow' can be nouns, but not listed
      adjective: ['scary', 'scared'],
      adverb: [], // 'scarily' can be an adverb, but not listed
    },
    collocations: [
      'to be/look/seem/sound scary',
      'a scary movie/story/atmosphere/place etc.',
    ],
  },
  {
    headword: 'serve',
    turkish: 'hizmet etmek',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['serve'],
      noun: ['service'],
      adjective: [], // 'served' or 'serving' can be adjectives, but not listed
      adverb: [],
    },
    collocations: [
      'to serve sth to sb',
      'public/emergency services',
      'in service',
      'out of service',
    ],
  },
  {
    headword: 'shake',
    turkish: 'sallamak',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['shake'],
      noun: ['shake'],
      adjective: [], // 'shaken' or 'shaking' can be adjectives, but not listed
      adverb: [],
    },
    collocations: ['to shake sth', 'to shake hands'],
  },
  {
    headword: 'society',
    turkish: 'toplum',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['society'],
      adjective: [], // 'social' (adj) is listed separately but related
      adverb: [],
    },
    collocations: ['in our society', 'a modern/traditional society'],
  },
  {
    headword: 'structure',
    turkish: 'yapı',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'structure' can be a verb, but not listed
      noun: ['structure'],
      adjective: [], // 'structural' or 'structured' can be adjectives, but not listed
      adverb: [], // 'structurally' can be an adverb, but not listed
    },
    collocations: [],
  },
  {
    headword: 'upset',
    turkish: 'üzgün, üzmek',
    unit: '4',
    section: 'Listening & Speaking',
    forms: {
      verb: ['upset'],
      noun: [], // 'upset' can be a noun, but not listed
      adjective: ['upset'],
      adverb: [],
    },
    collocations: [
      'to be upset about sth',
      'to seem/look/get/sound/feel upset',
      'to upset sb',
    ],
  },

  // =================================================================
  // UNIT 4: EXTRA WORDS (Skillful 1)
  // =================================================================
  {
    headword: 'adventure',
    turkish: 'macera',
    unit: '4',
    section: 'Extra Words',
    forms: {
      verb: [], // 'adventure' can be a verb, but not listed
      noun: ['adventure'],
      adjective: ['adventurous'],
      adverb: [], // 'adventurously' can be an adverb, but not listed
    },
    collocations: ['to have/go on an adventure', 'adventure stories/movies'],
  },
  {
    headword: 'announce',
    turkish: 'duyurmak',
    unit: '4',
    section: 'Extra Words',
    forms: {
      verb: ['announce'],
      noun: ['announcement'],
      adjective: [], // 'announced' or 'announcing' can be adjectives, but not listed
      adverb: [],
    },
    collocations: [
      'to announce sth (to sb)',
      'to make an announcement',
      'a formal/an official/a public announcement',
    ],
  },
  {
    headword: 'celebrity',
    turkish: 'ünlü',
    unit: '4',
    section: 'Extra Words',
    forms: {
      verb: [], // 'celebrate' (verb for celebration) but not listed here
      noun: ['celebrity'],
      adjective: [], // 'celebrated' can be an adjective, but not listed
      adverb: [],
    },
    collocations: [
      'a celebrity chef',
      'to have celebrity status',
      'to make sb a celebrity',
    ],
  },
  {
    headword: 'crazy',
    turkish: 'çılgın',
    unit: '4',
    section: 'Extra Words',
    forms: {
      verb: [], // 'crazed' (adj) not listed
      noun: [], // 'craziness' (noun) not listed
      adjective: ['crazy'],
      adverb: ['crazily'],
    },
    collocations: ['to go crazy', 'to be crazy about sth/sb'],
  },
  {
    headword: 'error',
    turkish: 'hata',
    unit: '4',
    section: 'Extra Words',
    forms: {
      verb: [], // 'err' (verb) not listed
      noun: ['error'],
      adjective: [], // 'erroneous' (adj) not listed
      adverb: [], // 'erroneously' (adv) not listed
    },
    collocations: [
      'a basic/minor/serious/common error',
      'to make an error',
      'to have/contain an error',
    ],
  },
  {
    headword: 'financial',
    turkish: 'finansal',
    unit: '4',
    section: 'Extra Words',
    forms: {
      verb: [], // 'finance' (verb) not listed
      noun: [], // 'finance' (noun) not listed
      adjective: ['financial'],
      adverb: ['financially'],
    },
    collocations: [
      'financial markets/institutions/support/crisis',
      'financially dependent',
    ],
  },
  {
    headword: 'loud',
    turkish: 'yüksek sesli',
    unit: '4',
    section: 'Extra Words',
    forms: {
      verb: [], // 'loud' (verb) not listed
      noun: [], // 'loudness' (noun) not listed
      adjective: ['loud'],
      adverb: ['loudly'],
    },
    collocations: ['a loud noise/explosion', 'loud music'],
  },
  {
    headword: 'novel',
    turkish: 'roman',
    unit: '4',
    section: 'Extra Words',
    forms: {
      verb: [],
      noun: ['novel', 'novelist'],
      adjective: [], // 'novel' (adj) not listed
      adverb: [],
    },
    collocations: [
      'a detective/romantic/historical/classic/bestselling novel',
    ],
  },
  {
    headword: 'shout',
    turkish: 'bağırmak',
    unit: '4',
    section: 'Extra Words',
    forms: {
      verb: ['shout'],
      noun: ['shout'],
      adjective: [], // 'shouting' (adj) not listed
      adverb: [],
    },
    collocations: ['to shout at sb', 'to shout for help'],
  },
  {
    headword: 'train',
    turkish: 'eğitim vermek, tren',
    unit: '4',
    section: 'Extra Words',
    forms: {
      verb: ['train'],
      noun: ['training', 'trainer'],
      adjective: [], // 'trained' (adj) not listed
      adverb: [],
    },
    collocations: [
      'a training course/session/programme',
      'a personal trainer',
    ],
  },

  // =================================================================
  // UNIT 5: READING & WRITING (Skillful 1)
  // =================================================================
  {
    headword: 'actually',
    turkish: 'aslında',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: [],
      adjective: ['actual'],
      adverb: ['actually'],
    },
    collocations: [], // No specific collocations provided for 'actual' or 'actually'
  },
  {
    headword: 'aim',
    turkish: 'amaç, hedeflemek',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: ['aim'],
      noun: ['aim'],
      adjective: [], // 'aimless' (adj) not listed
      adverb: [],
    },
    collocations: [
      'the main/primary/principal aim',
      'to have an aim',
      'to achieve an aim',
      'to aim to do sth',
    ],
  },
  {
    headword: 'burn',
    turkish: 'yakmak, yanmak',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: ['burn'],
      noun: ['burn'],
      adjective: [], // 'burnt' or 'burning' (adj) not listed
      adverb: [],
    },
    collocations: ['to burn calories'],
  },
  {
    headword: 'compare',
    turkish: 'karşılaştırmak',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: ['compare'],
      noun: ['comparison'],
      adjective: [], // 'comparable' (adj) not listed
      adverb: [], // 'comparatively' (adv) not listed
    },
    collocations: [
      'to compare A and B',
      'to compare A with B',
      'to compare A to B',
      'to make a comparison of/between things/ people/places',
    ],
  },
  {
    headword: 'contain',
    turkish: 'içermek',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: ['contain'],
      noun: ['container'],
      adjective: [], // 'contained' (adj) not listed
      adverb: [],
    },
    collocations: ['to contain sth', 'a metal/plastic/steel container'],
  },
  {
    headword: 'danger',
    turkish: 'tehlike',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'endanger' (verb) not listed
      noun: ['danger'],
      adjective: ['dangerous'],
      adverb: ['dangerously'],
    },
    collocations: [
      'a dangerous activity/sport//neighborhood/location',
      'to live dangerously',
      'to be in danger (of sth)',
      'to put sb in danger',
    ],
  },
  {
    headword: 'decade',
    turkish: 'onyıl',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['decade'],
      adjective: [],
      adverb: [],
    },
    collocations: [],
  },
  {
    headword: 'delicious',
    turkish: 'lezzetli',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: [], // 'deliciousness' (noun) not listed
      adjective: ['delicious'],
      adverb: [], // 'deliciously' (adv) not listed
    },
    collocations: [
      'a delicious food',
      'a delicious drink/meal/dish',
      'a traditional dessert',
    ],
  },
  {
    headword: 'dessert',
    turkish: 'tatlı',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['dessert'],
      adjective: [],
      adverb: [],
    },
    collocations: [],
  },
  {
    headword: 'destroy',
    turkish: 'yok etmek',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: ['destroy'],
      noun: [], // 'destruction' (noun) not listed
      adjective: [], // 'destroyed' (adj) not listed
      adverb: [],
    },
    collocations: ['to (completely/totally) destroy sth'],
  },
  {
    headword: 'doubt',
    turkish: 'şüphe',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'doubt' can be a verb, but not listed
      noun: ['doubt'],
      adjective: [], // 'doubtful' (adj) not listed
      adverb: [], // 'doubtfully' (adv) not listed
    },
    collocations: ['to have (some serious) doubts about sth'],
  },
  {
    headword: 'effort',
    turkish: 'çaba',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['effort'],
      adjective: [], // 'effortless' (adj) not listed
      adverb: [], // 'effortlessly' (adv) not listed
    },
    collocations: [
      'to make an effort to do sth',
      'to put (a lot of) effort into sth',
      'physical/mental effort',
    ],
  },
  {
    headword: 'empty',
    turkish: 'boş',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'empty' can be a verb, but not listed
      noun: [],
      adjective: ['empty'],
      adverb: [],
    },
    collocations: ['an empty building/room'],
  },
  {
    headword: 'equal',
    turkish: 'eşit',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'equal' can be a verb, but not listed
      noun: [],
      adjective: ['equal'],
      adverb: ['equally'],
    },
    collocations: ['an equal amount/number', 'equal to sb/sth'],
  },
  {
    headword: 'expert',
    turkish: 'uzman',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['expert'],
      adjective: ['expert'],
      adverb: [], // 'expertly' (adv) not listed
    },
    collocations: [
      'to be an expert in/on/at sth',
      'to ask/talk to an expert',
      'to get advice from an expert',
      'According to experts (in...),',
      'expert knowledge/advice',
    ],
  },
  {
    headword: 'fat',
    turkish: 'yağlı, şişman',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'fatten' (verb) not listed
      noun: ['fat'],
      adjective: ['fat', 'fatty'],
      adverb: [], // 'fatty' (adv) not listed
    },
    collocations: [
      'to be high/low in fat',
      'to eat/cut down on fat',
      'animal/vegetable fat',
      'a fatty diet',
      'fatty food',
    ],
  },
  {
    headword: 'hide',
    turkish: 'saklamak',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: ['hide'],
      noun: [], // 'hide' (noun for animal skin) not listed
      adjective: [], // 'hidden' (adj) not listed
      adverb: [],
    },
    collocations: ['to hide sb/sth', 'to hide from sth sb'],
  },
  {
    headword: 'human',
    turkish: 'insan',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['human'],
      adjective: ['human'],
      adverb: [], // 'humanly' (adv) not listed
    },
    collocations: [
      'a human being',
      'the human body/brain',
      'human error/nature',
    ],
  },
  {
    headword: 'ideal',
    turkish: 'ideal',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'idealize' (verb) not listed
      noun: [], // 'ideal' (noun) not listed
      adjective: ['ideal'],
      adverb: ['ideally'],
    },
    collocations: [
      'to be ideal (for sb)',
      'an ideal opportunity/job/home/location',
    ],
  },
  {
    headword: 'local',
    turkish: 'yerel',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: [],
      adjective: ['local'],
      adverb: ['locally'],
    },
    collocations: [
      '(the) local people/community/history/traditions/food/area economy/products',
    ],
  },
  {
    headword: 'movement',
    turkish: 'hareket',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: ['move'],
      noun: ['movement'],
      adjective: [], // 'moving' (adj) not listed
      adverb: [],
    },
    collocations: ['a big/tiny movement (of)', 'to move to/into/from'],
  },
  {
    headword: 'range',
    turkish: 'menzil, aralık',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'range' can be a verb, but not listed
      noun: ['range'],
      adjective: [], // 'ranging' (adj) not listed
      adverb: [],
    },
    collocations: ['a wide/broad/full/limited range of sth'],
  },
  {
    headword: 'region',
    turkish: 'bölge',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['region'],
      adjective: [], // 'regional' (adj) not listed
      adverb: [], // 'regionally' (adv) not listed
    },
    collocations: ['the northern/southern/central, etc. region'],
  },
  {
    headword: 'section',
    turkish: 'bölüm',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'section' can be a verb, but not listed
      noun: ['section'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'to divide sth into sections',
      'biology/history/ biography, etc. section (in a library)',
    ],
  },
  {
    headword: 'sell',
    turkish: 'satmak',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: ['sell'],
      noun: [], // 'sale' (noun) or 'seller' (noun) not listed
      adjective: [], // 'selling' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to sell sth (to sb)',
      'to sell sb sth',
      'sell a product/an item',
    ],
  },
  {
    headword: 'similar',
    turkish: 'benzer',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['similarity'],
      adjective: ['similar'],
      adverb: ['similarly'],
    },
    collocations: [
      'similar to sb/sth',
      'a close/strong similarity',
      'simiarities between (things/people/ideas)',
    ],
  },
  {
    headword: 'speed',
    turkish: 'hız, hız yapmak',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'speed' can be a verb, but not listed
      noun: ['speed'],
      adjective: [], // 'speedy' (adj) not listed
      adverb: [], // 'speedily' (adv) not listed
    },
    collocations: [
      '(the) speed limit',
      'to exceed the speed limit',
      'maximum speed',
    ],
  },
  {
    headword: 'unsafe',
    turkish: 'güvenli olmayan',
    unit: '5',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'endanger' (verb) not listed
      noun: ['safety'],
      adjective: ['unsafe', 'safe'],
      adverb: ['safely'],
    },
    collocations: [
      'safe to drink/eat/use',
      'a safe journey/arrival/return/neighborhood',
      'health and safety',
    ],
  },

  // =================================================================
  // UNIT 5: LISTENING & SPEAKING (Skillful 1)
  // =================================================================
  {
    headword: 'argument',
    turkish: 'tartışma',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: ['argue'],
      noun: ['argument'],
      adjective: [], // 'arguable' (adj) not listed
      adverb: [], // 'arguably' (adv) not listed
    },
    collocations: [
      'to argue about/over sth',
      'to argue with sb',
      'to have an argument about/over sth',
      'to have an argument with sb',
      'to win lose (the) argument',
      '(the) arguments for and against sth',
    ],
  },
  {
    headword: 'attractive',
    turkish: 'çekici',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: ['attract'],
      noun: ['attraction'],
      adjective: ['attractive', 'unattractive'],
      adverb: ['attractively'],
    },
    collocations: [
      'a major tourist attraction',
      'to attract attention/interest',
      'to be/look attractive',
      'to find sth/sb attractive',
    ],
  },
  {
    headword: 'attend',
    turkish: 'katılmak',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: ['attend'],
      noun: ['attendance'],
      adjective: [], // 'attendant' (adj) not listed
      adverb: [],
    },
    collocations: ['to attend sth (class/a concert/meeting, etc.)'],
  },
  {
    headword: 'condition',
    turkish: 'koşul, durum',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'condition' can be a verb, but not listed
      noun: ['condition'],
      adjective: [], // 'conditional' (adj) not listed
      adverb: [], // 'conditionally' (adv) not listed
    },
    collocations: [
      'to be in good/bad/perfect condition',
      'living/working conditions',
    ],
  },
  {
    headword: 'colleague',
    turkish: 'meslektaş',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['colleague'],
      adjective: [],
      adverb: [],
    },
    collocations: ['academic/business/work colleague'],
  },
  {
    headword: 'event',
    turkish: 'olay',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['event'],
      adjective: [], // 'eventual' (adj) not listed
      adverb: [], // 'eventually' (adv) not listed
    },
    collocations: [
      'a(n) huge/great/important/historical event',
      'to organize/take part in/cancel an event',
    ],
  },
  {
    headword: 'experiment',
    turkish: 'deney',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'experiment' can be a verb, but not listed as form
      noun: ['experiment'],
      adjective: [], // 'experimental' (adj) not listed
      adverb: [], // 'experimentally' (adv) not listed
    },
    collocations: [
      'a scientific experiment',
      'to conduct do/perform an experiment',
    ],
  },
  {
    headword: 'explain',
    turkish: 'açıklamak',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: ['explain'],
      noun: ['explanation'],
      adjective: [], // 'explanatory' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to explain sth (ideas/opinions, etc.) to sb',
      'to have/give an explanation of/for sth',
    ],
  },
  {
    headword: 'feed',
    turkish: 'beslemek',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: ['feed'],
      noun: [], // 'food' (noun) not listed here
      adjective: [], // 'fed' (adj) not listed
      adverb: [],
    },
    collocations: ['to feed sb/sth'],
  },
  {
    headword: 'include',
    turkish: 'içermek',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: ['include'],
      noun: [], // 'inclusion' (noun) not listed
      adjective: [], // 'inclusive' (adj) not listed
      adverb: [],
    },
    collocations: ['to include sth in/on sth'],
  },
  {
    headword: 'insect',
    turkish: 'böcek',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['insect'],
      adjective: [], // 'insectivorous' (adj) not listed
      adverb: [],
    },
    collocations: [],
  },
  {
    headword: 'issue',
    turkish: 'konu',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'issue' can be a verb, but not listed
      noun: ['issue'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'a key/major/serious issue',
      'to discuss/analyze/solve an issue',
    ],
  },
  {
    headword: 'language',
    turkish: 'dil',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['language'],
      adjective: [], // 'linguistic' (adj) not listed
      adverb: [], // 'linguistically' (adv) not listed
    },
    collocations: ['to learn/know a foreign language'],
  },
  {
    headword: 'lecture',
    turkish: 'ders, konferans',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'lecture' can be a verb, but not listed
      noun: ['lecture', 'lecturer'],
      adjective: [],
      adverb: [],
    },
    collocations: ['attend/have/give a lecture', 'a lecture hall'],
  },
  {
    headword: 'muscle',
    turkish: 'kas',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['muscle'],
      adjective: [], // 'muscular' (adj) not listed
      adverb: [],
    },
    collocations: ['to build/relax muscle(s)', 'strong/weak muscles'],
  },
  {
    headword: 'opinion',
    turkish: 'fikir',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['opinion'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'In my (sb\'s) opinion,',
      'a general/popular opinion',
      'to have/express an opinion about/on sb/sth',
      'to agree/disagree with an opinion',
    ],
  },
  {
    headword: 'planet',
    turkish: 'gezegen',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['planet'],
      adjective: [], // 'planetary' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to discover (a) planet',
      'the planets of the solar system',
    ],
  },
  {
    headword: 'professional',
    turkish: 'profesyonel',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['profession', 'professional'],
      adjective: ['professional'],
      adverb: ['professionally'],
    },
    collocations: [
      'to be/become/look/seem professional',
      'a professional job/career',
      'professional advice',
    ],
  },
  {
    headword: 'predict',
    turkish: 'tahmin etmek',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: ['predict'],
      noun: ['prediction'],
      adjective: [], // 'predictable' (adj) not listed
      adverb: [], // 'predictably' (adv) not listed
    },
    collocations: [
      'to predict correctly',
      'to make a prediction about sth',
    ],
  },
  {
    headword: 'protect',
    turkish: 'korumak',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: ['protect'],
      noun: ['protection'],
      adjective: [], // 'protective' (adj) not listed
      adverb: [], // 'protectively' (adv) not listed
    },
    collocations: [
      'to protect sb/sthn(from/against sth)',
      'to give protection to sb/sth',
      'to give/provide protection to/for sth/sb',
    ],
  },
  {
    headword: 'recent',
    turkish: 'son, yeni',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: [],
      adjective: ['recent'],
      adverb: ['recently'],
    },
    collocations: [
      'a recent study/report/survey',
      'in recent times/years/ months/weeks/days',
    ],
  },
  {
    headword: 'reduce',
    turkish: 'azaltmak',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: ['reduce'],
      noun: ['reduction'],
      adjective: [], // 'reduced' (adj) not listed
      adverb: [], // 'reducibly' (adv) not listed
    },
    collocations: [
      'to reduce sth (stress/prices/costs, etc.)',
      'a x% reduction (in the price of sth)',
    ],
  },
  {
    headword: 'remove',
    turkish: 'kaldırmak',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: ['remove'],
      noun: [], // 'removal' (noun) not listed
      adjective: [], // 'removable' (adj) not listed
      adverb: [],
    },
    collocations: ['remove sb/sth (from sth)'],
  },
  {
    headword: 'science',
    turkish: 'bilim',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['science', 'scientist'],
      adjective: ['scientific'],
      adverb: ['scientifically'],
    },
    collocations: [
      'modern/social/computer/natural science',
      'scientific research/evidence',
    ],
  },
  {
    headword: 'step',
    turkish: 'adım',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'step' can be a verb, but not listed
      noun: ['step'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'a necessary/an important/a positive step (towards sth)',
      'to make/follow/take steps',
    ],
  },
  {
    headword: 'strong',
    turkish: 'güçlü',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'strengthen' (verb) not listed
      noun: [], // 'strength' (noun) not listed
      adjective: ['strong'],
      adverb: ['strongly'],
    },
    collocations: [],
  },
  {
    headword: 'source',
    turkish: 'kaynak',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'source' can be a verb, but not listed
      noun: ['source'],
      adjective: [], // 'sourced' (adj) not listed
      adverb: [],
    },
    collocations: ['a source of income/information/energy'],
  },
  {
    headword: 'tasty',
    turkish: 'lezzetli',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['taste'],
      adjective: ['tasty'],
      adverb: [], // 'tastily' (adv) not listed
    },
    collocations: [
      'a sweet/salty/bitter/sour taste',
      'to taste good/delicious/sweet',
    ],
  },
  {
    headword: 'technology',
    turkish: 'teknoloji',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'technologize' (verb) not listed
      noun: ['technology'],
      adjective: ['technological'],
      adverb: [], // 'technologically' (adv) not listed
    },
    collocations: [
      'modern/developed/new/obsolete technology',
      'to have/use/introduce/develop/improve technology',
      'a technological development',
      'the development of technology',
    ],
  },
  {
    headword: 'thick',
    turkish: 'kalın',
    unit: '5',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'thicken' (verb) not listed
      noun: [], // 'thickness' (noun) not listed
      adjective: ['thick'],
      adverb: [], // 'thickly' (adv) not listed
    },
    collocations: [
      'a thick slice of bread',
      'thick soup',
      'a thick book/coat',
      'x feet/cm/inches thick',
    ],
  },

  // =================================================================
  // UNIT 5: EXTRA WORDS (Skillful 1)
  // =================================================================
  {
    headword: 'apologize',
    turkish: 'özür dilemek',
    unit: '5',
    section: 'Extra Words',
    forms: {
      verb: ['apologize'],
      noun: [], // 'apology' (noun) not listed
      adjective: [], // 'apologetic' (adj) not listed
      adverb: [], // 'apologetically' (adv) not listed
    },
    collocations: ['to apologize for sth', 'to apologize to sb'],
  },
  {
    headword: 'appreciate',
    turkish: 'takdir etmek',
    unit: '5',
    section: 'Extra Words',
    forms: {
      verb: ['appreciate'],
      noun: [], // 'appreciation' (noun) not listed
      adjective: [], // 'appreciative' (adj) not listed
      adverb: [], // 'appreciatively' (adv) not listed
    },
    collocations: ['to appreciate sb/sth'],
  },
  {
    headword: 'charity',
    turkish: 'hayır kurumu',
    unit: '5',
    section: 'Extra Words',
    forms: {
      verb: [], // 'charitable' (adj) not listed
      noun: ['charity'],
      adjective: [],
      adverb: [], // 'charitably' (adv) not listed
    },
    collocations: ['to support a charity', 'to give/donate (money) to (a) charity'],
  },
  {
    headword: 'consumer',
    turkish: 'tüketici',
    unit: '5',
    section: 'Extra Words',
    forms: {
      verb: ['consume'],
      noun: ['consumer'],
      adjective: [], // 'consuming' (adj) not listed
      adverb: [],
    },
    collocations: ['to consume sth'],
  },
  {
    headword: 'escape',
    turkish: 'kaçmak',
    unit: '5',
    section: 'Extra Words',
    forms: {
      verb: ['escape'],
      noun: ['escape'],
      adjective: [], // 'escaped' (adj) not listed
      adverb: [],
    },
    collocations: ['to escape from sth'],
  },
  {
    headword: 'flu',
    turkish: 'grip',
    unit: '5',
    section: 'Extra Words',
    forms: {
      verb: [],
      noun: ['flu'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to have/catch/get/suffer from flu', 'a flu/vaccine/jab'],
  },
  {
    headword: 'incredible',
    turkish: 'inanılmaz',
    unit: '5',
    section: 'Extra Words',
    forms: {
      verb: [],
      noun: [], // 'incredibility' (noun) not listed
      adjective: ['incredible'],
      adverb: ['incredibly'],
    },
    collocations: [],
  },
  {
    headword: 'lock',
    turkish: 'kilitlemek, kilit',
    unit: '5',
    section: 'Extra Words',
    forms: {
      verb: ['lock'],
      noun: ['lock'],
      adjective: [], // 'locked' (adj) not listed
      adverb: [],
    },
    collocations: ['to lock the door/room', 'safety locks'],
  },
  {
    headword: 'search',
    turkish: 'aramak, arama',
    unit: '5',
    section: 'Extra Words',
    forms: {
      verb: ['search'],
      noun: ['search'],
      adjective: [], // 'searching' (adj) not listed
      adverb: [],
    },
    collocations: ['to search for sth/sb', 'to conduct a search'],
  },
  {
    headword: 'speech',
    turkish: 'konuşma',
    unit: '5',
    section: 'Extra Words',
    forms: {
      verb: [], // 'speak' (verb) but not listed here
      noun: ['speech'],
      adjective: [], // 'speechless' (adj) not listed
      adverb: [], // 'speechlessly' (adv) not listed
    },
    collocations: ['a long/short/interesting/boring speech'],
  },

  // =================================================================
  // UNIT 6: READING & WRITING (Skillful 1)
  // =================================================================
  {
    headword: 'allow',
    turkish: 'izin vermek',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['allow'],
      noun: [], // 'allowance' (noun) not listed
      adjective: [],
      adverb: [],
    },
    collocations: ['to allow sb to do sth'],
  },
  {
    headword: 'annual',
    turkish: 'yıllık',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['annual'],
      adjective: ['annual'],
      adverb: [], // 'annually' (adv) not listed
    },
    collocations: ['an annual meeting/event/report/conference'],
  },
  {
    headword: 'breathe',
    turkish: 'nefes almak',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['breathe'],
      noun: ['breath'],
      adjective: [], // 'breathless' (adj) not listed
      adverb: [], // 'breathlessly' (adv) not listed
    },
    collocations: [
      'to breathe fast/quickly/slowly/hard/normally',
      'to breathe in/out',
      'to breathe through (your nose)',
    ],
  },
  {
    headword: 'copy',
    turkish: 'kopya, kopyalamak',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['copy'],
      noun: ['copy'],
      adjective: [], // 'copied' (adj) not listed
      adverb: [],
    },
    collocations: ['a copy of sth', 'to copy sth/sb', 'to copy (sth) from sth'],
  },
  {
    headword: 'cost',
    turkish: 'maliyet, mal olmak',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['cost'],
      noun: ['cost'],
      adjective: [], // 'costly' (adj) not listed
      adverb: [],
    },
    collocations: ['high/low cost(s)', 'How much does it cost?', 'the cost of living'],
  },
  {
    headword: 'cross',
    turkish: 'geçmek, çapraz',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['cross'],
      noun: ['cross'],
      adjective: [], // 'crossed' (adj) not listed
      adverb: [],
    },
    collocations: ['to cross (over) the road/street/river'],
  },
  {
    headword: 'death',
    turkish: 'ölüm',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['die'],
      noun: ['death'],
      adjective: ['dead'],
      adverb: [], // 'deadly' (adv) not listed
    },
    collocations: [],
  },
  {
    headword: 'depth',
    turkish: 'derinlik',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'deepen' (verb) not listed
      noun: ['depth'],
      adjective: ['deep'],
      adverb: [], // 'deeply' (adv) not listed
    },
    collocations: ['deep water'],
  },
  {
    headword: 'develop',
    turkish: 'geliştirmek',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['develop'],
      noun: ['development'],
      adjective: ['developed', 'developing'],
      adverb: [],
    },
    collocations: [
      'to develop sth (a skill/strategy/method/technology etc.)',
      'a developed/developing country',
      'economic/technological/social development',
      'child development',
    ],
  },
  {
    headword: 'dive',
    turkish: 'dalmak',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['dive'],
      noun: [], // 'dive' (noun) or 'diver' (noun) not listed
      adjective: [], // 'diving' (adj) not listed
      adverb: [],
    },
    collocations: [],
  },
  {
    headword: 'dry',
    turkish: 'kuru',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['dry'],
      noun: [],
      adjective: ['dry'],
      adverb: [], // 'dryly' (adv) not listed
    },
    collocations: ['a dry region/climate'],
  },
  {
    headword: 'evidence',
    turkish: 'kanıt',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'evidence' can be a verb, but not listed
      noun: ['evidence'],
      adjective: [], // 'evident' (adj) not listed
      adverb: [], // 'evidently' (adv) not listed
    },
    collocations: [
      'to give/provide find evidence (of sth)',
      'scientific evidence',
    ],
  },
  {
    headword: 'except',
    turkish: 'hariç',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'except' (verb) not listed
      noun: [], // 'exception' (noun) not listed
      adjective: [], // 'exceptional' (adj) not listed
      adverb: [], // 'exceptionally' (adv) not listed
    },
    collocations: ['except (for) sb/sth'],
  },
  {
    headword: 'explore',
    turkish: 'keşfetmek',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['explore'],
      noun: ['explorer', 'exploration'],
      adjective: [], // 'exploratory' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to explore sth (for sth)',
      'underwater/space exploration',
    ],
  },
  {
    headword: 'express',
    turkish: 'ifade etmek',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['express'],
      noun: ['expression'],
      adjective: [], // 'expressive' (adj) not listed
      adverb: [], // 'expressly' (adv) not listed
    },
    collocations: [
      'to express sth (an opinion/a view/emotions, etc.)',
      '(a) facial expression',
    ],
  },
  {
    headword: 'fit',
    turkish: 'uygun, formda',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['fit'],
      noun: [], // 'fit' (noun) not listed
      adjective: ['fit'],
      adverb: [], // 'fitly' (adv) not listed
    },
    collocations: ['to fit sth/sb', 'physically fit'],
  },
  {
    headword: 'freezing',
    turkish: 'dondurucu',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['freeze'],
      noun: ['freeze', 'freezer'],
      adjective: ['frozen', 'freezing'],
      adverb: [], // 'freezingly' (adv) not listed
    },
    collocations: ['to freeze sth', 'frozen food', 'freezing cold'],
  },
  {
    headword: 'guide',
    turkish: 'rehber, rehberlik etmek',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['guide'],
      noun: ['guide'],
      adjective: [], // 'guided' (adj) not listed
      adverb: [],
    },
    collocations: ['to guide sb', 'a tour guide'],
  },
  {
    headword: 'hunt',
    turkish: 'avlamak',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['hunt'],
      noun: ['hunter'],
      adjective: [], // 'hunting' (adj) not listed
      adverb: [],
    },
    collocations: ['to hunt sth (for sth)'],
  },
  {
    headword: 'lack',
    turkish: 'eksiklik',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['lack'],
      noun: ['lack'],
      adjective: [], // 'lacking' (adj) not listed
      adverb: [],
    },
    collocations: ['(a) lack of sth', 'to lack sth'],
  },
  {
    headword: 'lie',
    turkish: 'yalan söylemek',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['lie'],
      noun: ['lie', 'liar'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to tell a lie', 'to lie to sb', 'to lie about sth', 'a white lie'],
  },
  {
    headword: 'matter',
    turkish: 'mesele, önemli olmak',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['matter'],
      noun: ['matter'],
      adjective: [],
      adverb: [],
    },
    collocations: ["What's the matter?", "It doesn't matter.", 'a serious matter'],
  },
  {
    headword: 'payment',
    turkish: 'ödeme',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['pay'],
      noun: ['payment'],
      adjective: [], // 'paid' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to make a payment',
      'to pay for sth',
      'to pay by cash /credit card',
      'a payment in x currency ( dollars, euros, TL, etc.)',
    ],
  },
  {
    headword: 'possibility',
    turkish: 'olasılık',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['possibility'],
      adjective: ['possible', 'impossible'],
      adverb: ['possibly'],
    },
    collocations: [
      'a strong/real/distinct/high/low possibility',
      'a x% possibility (of sth)',
      'it is (im)possible (for sb) to do sth',
      'to make sth (im)possible',
    ],
  },
  {
    headword: 'pretty',
    turkish: 'oldukça, güzel',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: [],
      adjective: ['pretty'],
      adverb: ['pretty'],
    },
    collocations: ['pretty good/sure/soon', 'to be/look pretty'],
  },
  {
    headword: 'reach',
    turkish: 'ulaşmak',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['reach'],
      noun: [], // 'reach' (noun) not listed
      adjective: [], // 'reachable' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to reach sb/sth',
      'to reach (sb\'s) goals',
      'to reach an agreement',
    ],
  },
  {
    headword: 'reason',
    turkish: 'neden',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['reason'],
      adjective: [], // 'reasonable' (adj) not listed
      adverb: [], // 'reasonably' (adv) not listed
    },
    collocations: ['a reason for (doing) sth'],
  },
  {
    headword: 'recognize',
    turkish: 'tanımak',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['recognize'],
      noun: [], // 'recognition' (noun) not listed
      adjective: [], // 'recognizable' (adj) not listed
      adverb: [],
    },
    collocations: ['to recognize sb/sth (by/from sth)'],
  },
  {
    headword: 'recommend',
    turkish: 'tavsiye etmek',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['recommend'],
      noun: ['recommendation'],
      adjective: [], // 'recommended' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to recommend sth to sb',
      'to recommend sth for sth',
      'to make a recommendation about/on sth (to sb)',
    ],
  },
  {
    headword: 'require',
    turkish: 'gerektirmek',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['require'],
      noun: ['requirement'],
      adjective: [], // 'required' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to require sth',
      'to require sb/sth to do sth',
      'a requirement for sth',
      'a requirement for a job/course',
      'a legal requirement',
    ],
  },
  {
    headword: 'select',
    turkish: 'seçmek',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['select'],
      noun: ['selection'],
      adjective: [], // 'selected' (adj) not listed
      adverb: [],
    },
    collocations: ['to select sb/sth for sth', '(the) selection process'],
  },
  {
    headword: 'suggest',
    turkish: 'önermek',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: ['suggest'],
      noun: ['suggestion'],
      adjective: [], // 'suggestive' (adj) not listed
      adverb: [], // 'suggestively' (adv) not listed
    },
    collocations: [
      'to suggest (doing) sth',
      'to make/come up with a suggestion',
      'to give sb a suggestion',
    ],
  },
  {
    headword: 'state',
    turkish: 'durum, eyalet',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'state' can be a verb, but not listed
      noun: ['state'],
      adjective: [], // 'stated' (adj) not listed
      adverb: [],
    },
    collocations: ['an independent state', 'sb\'s state of mind'],
  },
  {
    headword: 'vacation',
    turkish: 'tatil',
    unit: '6',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'vacation' can be a verb, but not listed
      noun: ['vacation'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'to be in a good/bad state',
      'the state of sth/sb',
      'to be on vacation',
      'to go on vacation',
      'to take a vacation',
      'summer/winter vacation',
      'an annual vacation',
    ],
  },

  // =================================================================
  // UNIT 6: LISTENING & SPEAKING (Skillful 1)
  // =================================================================
  {
    headword: 'amazing',
    turkish: 'şaşırtıcı',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'amaze' (verb) not listed
      noun: [], // 'amazement' (noun) not listed
      adjective: ['amazing', 'amazed'],
      adverb: [], // 'amazingly' (adv) not listed
    },
    collocations: ['amazed at sb/sth', 'an amazing view/achievement'],
  },
  {
    headword: 'arrange',
    turkish: 'düzenlemek',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: ['arrange'],
      noun: ['arrangement'],
      adjective: [], // 'arranged' (adj) not listed
      adverb: [],
    },
    collocations: [
      'a(n) alternative/better/final arrangement',
      'to make (an) arrangement',
    ],
  },
  {
    headword: 'average',
    turkish: 'ortalama',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'average' can be a verb, but not listed
      noun: ['average'],
      adjective: ['average'],
      adverb: [],
    },
    collocations: [
      'an average of sth',
      'below/above/on average',
      '(the) average number/temperature/results/age',
      '(the) average person/cost/price',
    ],
  },
  {
    headword: 'belong (to)',
    turkish: 'ait olmak',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: ['belong (to)'],
      noun: [], // 'belongings' (noun) not listed
      adjective: [],
      adverb: [],
    },
    collocations: [
      'belong to sth (a club/gym/band, etc.)',
      'to belong to sb',
    ],
  },
  {
    headword: 'boil',
    turkish: 'kaynamak, kaynatmak',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: ['boil'],
      noun: ['boil'],
      adjective: ['boiling'],
      adverb: [],
    },
    collocations: ['to boil (sth)'],
  },
  {
    headword: 'collect',
    turkish: 'toplamak',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: ['collect'],
      noun: ['collection'],
      adjective: [], // 'collected' (adj) not listed
      adverb: [], // 'collectively' (adv) not listed
    },
    collocations: ['to collect sth', 'to collect for (a) charity'],
  },
  {
    headword: 'complex',
    turkish: 'karmaşık',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'complicate' (verb) not listed
      noun: [], // 'complexity' (noun) not listed
      adjective: ['complex'],
      adverb: [], // 'complexly' (adv) not listed
    },
    collocations: ['a complex problem/system/issue'],
  },
  {
    headword: 'distance',
    turkish: 'mesafe',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'distance' can be a verb, but not listed
      noun: ['distance'],
      adjective: [], // 'distant' (adj) not listed
      adverb: [],
    },
    collocations: ['a long/short distance', 'to keep sb\'s distance from sth/sb'],
  },
  {
    headword: 'exciting',
    turkish: 'heyecan verici',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'excite' (verb) not listed
      noun: ['excitement'],
      adjective: ['exciting', 'excited'],
      adverb: [], // 'excitingly' (adv) not listed
    },
    collocations: [
      'exciting for sb',
      'be excited about sth',
      'excitement about sth',
    ],
  },
  {
    headword: 'extreme',
    turkish: 'aşırı',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'extremize' (verb) not listed
      noun: [], // 'extremity' (noun) not listed
      adjective: ['extreme'],
      adverb: ['extremely'],
    },
    collocations: ['extreme weather/climate/sports'],
  },
  {
    headword: 'fascinating',
    turkish: 'büyüleyici',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'fascinate' (verb) not listed
      noun: [], // 'fascination' (noun) not listed
      adjective: ['fascinating', 'fascinated'],
      adverb: [], // 'fascinatingly' (adv) not listed
    },
    collocations: [
      'a fascinating book/article/documentary/theory',
    ],
  },
  {
    headword: 'frightened',
    turkish: 'korkmuş',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: ['frighten'],
      noun: [], // 'fright' (noun) not listed
      adjective: ['frightening', 'frightened'],
      adverb: [], // 'frighteningly' (adv) not listed
    },
    collocations: ['to be frightened of sth', 'to be frightened to do sth'],
  },
  {
    headword: 'height',
    turkish: 'yükseklik',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'heighten' (verb) not listed
      noun: ['height'],
      adjective: ['high'],
      adverb: [], // 'highly' (adv) not listed
    },
    collocations: ['(the) average height'],
  },
  {
    headword: 'identify',
    turkish: 'tanımlamak',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: ['identify'],
      noun: [], // 'identity' (noun) not listed
      adjective: [], // 'identified' (adj) not listed
      adverb: [],
    },
    collocations: ['to identify sb/sth'],
  },
  {
    headword: 'instrument',
    turkish: 'enstrüman',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['instrument'],
      adjective: [], // 'instrumental' (adj) not listed
      adverb: [], // 'instrumentally' (adv) not listed
    },
    collocations: ['a musical/scientific instrument'],
  },
  {
    headword: 'lift',
    turkish: 'kaldırmak, asansör',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: ['lift'],
      noun: ['lift (elevator)'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to use/take the lift', 'to lift sth'],
  },
  {
    headword: 'major',
    turkish: 'ana, büyük',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['major'],
      adjective: ['major'],
      adverb: [], // 'majorly' (adv) not listed
    },
    collocations: [
      'to have a major in a subject (language/science/medicine etc.)',
      'a major issue',
    ],
  },
  {
    headword: 'memory',
    turkish: 'hafıza',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: ['memorize'],
      noun: ['memory'],
      adjective: ['memorable'],
      adverb: [], // 'memorably' (adv) not listed
    },
    collocations: [
      'a good/bad/excellent/long/short memory',
      '(the) long-term/short-term memory',
      'to memorize sth (information/list/names/numbers etc)',
      'a memorable event/performance/evening',
    ],
  },
  {
    headword: 'mind',
    turkish: 'zihin',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'mind' can be a verb, but not listed as form
      noun: ['mind'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'a brilliant mind',
      'to change one\'s mind',
      'to (not) mind doing sth',
    ],
  },
  {
    headword: 'nearly',
    turkish: 'neredeyse',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: [],
      adjective: [], // 'near' (adj) not listed
      adverb: ['nearly'],
    },
    collocations: ['nearly ready/finished', 'nearly all'],
  },
  {
    headword: 'ordinary',
    turkish: 'sıradan',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: [], // 'ordinariness' (noun) not listed
      adjective: ['ordinary'],
      adverb: [], // 'ordinarily' (adv) not listed
    },
    collocations: ['ordinary people', 'an ordinary life/day'],
  },
  {
    headword: 'race',
    turkish: 'yarış, ırk',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: ['race'],
      noun: ['race'],
      adjective: [], // 'racing' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to take part in/win/lose a race',
      'to race against sb',
    ],
  },
  {
    headword: 'report',
    turkish: 'rapor, rapor etmek',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: ['report'],
      noun: ['report', 'reporter'],
      adjective: [], // 'reported' (adj) not listed
      adverb: [],
    },
    collocations: ['to report sth to sb'],
  },
  {
    headword: 'seem',
    turkish: 'görünmek',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: ['seem'],
      noun: [],
      adjective: [],
      adverb: [],
    },
    collocations: ['to seem happy/nice/clear', 'it seems that + sentence'],
  },
  {
    headword: 'terrible',
    turkish: 'korkunç',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: [], // 'terribleness' (noun) not listed
      adjective: ['terrible'],
      adverb: ['terribly'],
    },
    collocations: [],
  },
  {
    headword: 'weigh',
    turkish: 'tartmak',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: ['weigh'],
      noun: ['weight'],
      adjective: ['overweight', 'underweight'],
      adverb: [],
    },
    collocations: [
      'to put on/gain/lose weight',
      'to weigh sb/sth/yourself',
      'an overweight person',
    ],
  },
  {
    headword: 'whole',
    turkish: 'tüm, bütün',
    unit: '6',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: [],
      adjective: ['whole'],
      adverb: [], // 'wholly' (adv) not listed
    },
    collocations: ['the whole class/school/country/village/family/world'],
  },

  // =================================================================
  // UNIT 6: EXTRA WORDS (Skillful 1)
  // =================================================================
  {
    headword: 'award',
    turkish: 'ödül, ödüllendirmek',
    unit: '6',
    section: 'Extra Words',
    forms: {
      verb: [], // 'award' can be a verb, but not listed
      noun: ['award'],
      adjective: [], // 'awarded' (adj) not listed
      adverb: [],
    },
    collocations: ['award for sth', 'to receive/win/give an award'],
  },
  {
    headword: 'blow',
    turkish: 'esmek, üflemek',
    unit: '6',
    section: 'Extra Words',
    forms: {
      verb: ['blow'],
      noun: [], // 'blow' (noun) not listed
      adjective: [], // 'blown' (adj) not listed
      adverb: [],
    },
    collocations: ['to blow strongly'],
  },
  {
    headword: 'disaster',
    turkish: 'felaket',
    unit: '6',
    section: 'Extra Words',
    forms: {
      verb: [], // 'disaster' no verb form listed
      noun: ['disaster'],
      adjective: [], // 'disastrous' (adj) not listed
      adverb: [], // 'disastrously' (adv) not listed
    },
    collocations: [
      'to bring/cause disaster (to sth)',
      'a terrible disaster',
      'a natural disaster',
    ],
  },
  {
    headword: 'factor',
    turkish: 'faktör',
    unit: '6',
    section: 'Extra Words',
    forms: {
      verb: [], // 'factor' no verb form listed
      noun: ['factor'],
      adjective: [], // 'factored' (adj) not listed
      adverb: [],
    },
    collocations: ['the main factor', 'a(n) important/major/significant'],
  },
  {
    headword: 'furniture',
    turkish: 'mobilya',
    unit: '6',
    section: 'Extra Words',
    forms: {
      verb: [], // 'furnish' (verb) not listed
      noun: ['furniture'],
      adjective: [], // 'furnished' (adj) not listed
      adverb: [],
    },
    collocations: [
      'modern/antique furniture',
      'an item of furniture',
    ],
  },
  {
    headword: 'global',
    turkish: 'küresel',
    unit: '6',
    section: 'Extra Words',
    forms: {
      verb: [], // 'globalize' (verb) not listed
      noun: [], // 'globality' (noun) not listed
      adjective: ['global'],
      adverb: ['globally'],
    },
    collocations: ['a global problem/issue', 'global warming'],
  },
  {
    headword: 'possession',
    turkish: 'mülkiyet, sahip olunan şey',
    unit: '6',
    section: 'Extra Words',
    forms: {
      verb: [], // 'possess' (verb) not listed
      noun: ['possession'],
      adjective: [], // 'possessive' (adj) not listed
      adverb: [], // 'possessively' (adv) not listed
    },
    collocations: ['personal possessions'],
  },
  {
    headword: 'steal',
    turkish: 'çalmak',
    unit: '6',
    section: 'Extra Words',
    forms: {
      verb: ['steal'],
      noun: [], // 'theft' (noun) or 'stealer' (noun) not listed
      adjective: [], // 'stolen' (adj) not listed
      adverb: [],
    },
    collocations: ['to steal sth from sb'],
  },

  // =================================================================
  // UNIT 7: READING & WRITING (Skillful 1)
  // =================================================================
  {
    headword: 'attack',
    turkish: 'saldırmak, saldırı',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: ['attack'],
      noun: ['attack'],
      adjective: [], // 'attacking' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to attack sb/sth',
      'an attack on sb/sth',
      'to be/come under attack',
    ],
  },
  {
    headword: 'beat',
    turkish: 'yenmek, dövmek',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: ['beat'],
      noun: [], // 'beat' (noun for rhythm) not listed
      adjective: [], // 'beaten' (adj) not listed
      adverb: [],
    },
    collocations: ['to beat sb (at sth/a game)'],
  },
  {
    headword: 'careful',
    turkish: 'dikkatli',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: ['care'],
      noun: ['care'],
      adjective: ['careful', 'careless'],
      adverb: ['carefully'],
    },
    collocations: [
      'to care about sth/sb',
      'be careful!',
      'to drive carefully',
      'to do sth/a job carefully',
    ],
  },
  {
    headword: 'cover',
    turkish: 'örtmek, kaplamak',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: ['cover'],
      noun: ['cover'],
      adjective: [], // 'covered' (adj) not listed
      adverb: [],
    },
    collocations: ['to cover sth (with sth)'],
  },
  {
    headword: 'client',
    turkish: 'müşteri',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['client'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'a potential/regular/business client',
      'to meet/represent/advise a client',
    ],
  },
  {
    headword: 'confused',
    turkish: 'şaşkın, kafası karışmış',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: ['confuse'],
      noun: [], // 'confusion' (noun) not listed
      adjective: ['confused', 'confusing'],
      adverb: [], // 'confusingly' (adv) not listed
    },
    collocations: [
      'to be/feel/seem/look/get confused',
      'to be confused about/by sth/sb',
      'confusing information/directions',
    ],
  },
  {
    headword: 'control',
    turkish: 'kontrol, kontrol etmek',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: ['control'],
      noun: ['control'],
      adjective: [], // 'controlled' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to control the company/process/events',
      'to control sb\'s life',
    ],
  },
  {
    headword: 'deal',
    turkish: 'ilgilenmek, anlaşma',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: ['deal with'],
      noun: [], // 'deal' (noun) not listed as a form of the verb 'deal with'
      adjective: [],
      adverb: [],
    },
    collocations: ['to deal with sth/sb', 'to deal with an issue'],
  },
  {
    headword: 'drop',
    turkish: 'düşmek, damla',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: ['drop'],
      noun: ['drop'],
      adjective: [], // 'dropped' (adj) not listed
      adverb: [],
    },
    collocations: ['to drop sth', 'a drop of water'],
  },
  {
    headword: 'drug',
    turkish: 'ilaç, uyuşturucu',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'drug' (verb) not listed
      noun: ['drug'],
      adjective: [], // 'drugged' (adj) not listed
      adverb: [],
    },
    collocations: ['a powerful/strong/effective drug', 'to be on/take drugs'],
  },
  {
    headword: 'education',
    turkish: 'eğitim',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: ['educate'],
      noun: ['education'],
      adjective: [], // 'educational' (adj) not listed
      adverb: [],
    },
    collocations: ['to have/get/give education'],
  },
  {
    headword: 'field',
    turkish: 'alan, saha',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'field' can be a verb, but not listed
      noun: ['field'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'a football/soccer/sports field',
      'a rice/wheat/corn field',
      'a field of crops',
    ],
  },
  {
    headword: 'generation',
    turkish: 'nesil',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'generate' (verb) not listed
      noun: ['generation'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'future generations',
      'the younger/older generation',
      'the generation gap',
    ],
  },
  {
    headword: 'illness',
    turkish: 'hastalık',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'ill' (adj)
      noun: ['illness'],
      adjective: ['ill'],
      adverb: [], // 'illy' (adv) not listed
    },
    collocations: [
      'to have/suffer from/fight an illness',
      'to get over/recover from an illness',
      'to be/become/feel/look ill',
      'to be seriously ill',
    ],
  },
  {
    headword: 'instead',
    turkish: 'yerine',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: [],
      adjective: [],
      adverb: ['instead'],
    },
    collocations: ['instead of sb/sth'],
  },
  {
    headword: 'invent',
    turkish: 'icat etmek',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: ['invent'],
      noun: ['invention', 'inventor'],
      adjective: [], // 'invented' (adj) not listed
      adverb: [],
    },
    collocations: ['to invent sth', 'a great invention'],
  },
  {
    headword: 'patient',
    turkish: 'sabırlı, hasta',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['patient'],
      adjective: ['patient'],
      adverb: ['patiently'],
    },
    collocations: [
      'to be patient about sth',
      'to be patient with sb',
      'to treat a patient',
      'to wait patiently',
    ],
  },
  {
    headword: 'prize',
    turkish: 'ödül',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'prize' can be a verb, but not listed
      noun: ['prize'],
      adjective: [], // 'prized' (adj) not listed
      adverb: [],
    },
    collocations: ['to get/win/receive a prize (for sth)'],
  },
  {
    headword: 'process',
    turkish: 'süreç, işlemek',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'process' can be a verb, but not listed
      noun: ['process'],
      adjective: [], // 'processed' or 'processing' (adj) not listed
      adverb: [],
    },
    collocations: ['a long/short/slow/complex process'],
  },
  {
    headword: 'provide',
    turkish: 'sağlamak',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: ['provide'],
      noun: [], // 'provision' (noun) not listed
      adjective: [], // 'provided' (adj) not listed
      adverb: [],
    },
    collocations: ['to provide sth for sb/sth', 'to provide sth/sb with sth'],
  },
  {
    headword: 'publish',
    turkish: 'yayınlamak',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: ['publish'],
      noun: ['publisher'],
      adjective: [], // 'published' (adj) not listed
      adverb: [],
    },
    collocations: ['to publish a book/a research paper an article'],
  },
  {
    headword: 'react',
    turkish: 'tepki vermek',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: ['react'],
      noun: ['reaction'],
      adjective: [], // 'reactive' (adj) not listed
      adverb: [], // 'reactively' (adv) not listed
    },
    collocations: ['to react to sth', 'to give a reaction to sth', '(an) initial reaction (to sth)'],
  },
  {
    headword: 'reality',
    turkish: 'gerçeklik',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'realize' (verb) is related but listed separately
      noun: ['reality'],
      adjective: ['real', 'unreal'],
      adverb: [], // 'really' (adv) not listed
    },
    collocations: ['virtual reality'],
  },
  {
    headword: 'relaxed',
    turkish: 'rahatlamış',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: ['relax'],
      noun: [], // 'relaxation' (noun) not listed
      adjective: ['relaxing', 'relaxed'],
      adverb: [], // 'relaxingly' (adv) not listed
    },
    collocations: [
      'a relaxing weekend/afternoon/holiday',
      'a relaxing atmosphere',
    ],
  },
  {
    headword: 'staff',
    turkish: 'personel',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'staff' can be a verb, but not listed
      noun: ['staff'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'medical/academic staff',
      'a member of staff',
      '(the) staffroom',
    ],
  },
  {
    headword: 'symptom',
    turkish: 'belirti',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['symptom'],
      adjective: [], // 'symptomatic' (adj) not listed
      adverb: [], // 'symptomatically' (adv) not listed
    },
    collocations: ['a symptom of an illness/medical problem'],
  },
  {
    headword: 'talent',
    turkish: 'yetenek',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['talent'],
      adjective: ['talented'],
      adverb: [], // 'talentedly' (adv) not listed
    },
    collocations: [
      'to be talented',
      'to have (a) talent for sth',
      'artistic talent',
    ],
  },
  {
    headword: 'tool',
    turkish: 'araç, alet',
    unit: '7',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'tool' can be a verb, but not listed
      noun: ['tool'],
      adjective: [], // 'tooled' (adj) not listed
      adverb: [],
    },
    collocations: ['to use tools'],
  },

  // =================================================================
  // UNIT 7: LISTENING & SPEAKING (Skillful 1)
  // =================================================================
  {
    headword: 'accept',
    turkish: 'kabul etmek',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: ['accept'],
      noun: [], // 'acceptance' (noun) not listed
      adjective: ['acceptable', 'unacceptable'],
      adverb: [], // 'acceptably' (adv) not listed
    },
    collocations: [
      'to accept sth (a gift/offer/invitation, etc,)',
      '(un)acceptable behavior/performance/standards',
    ],
  },
  {
    headword: 'accident',
    turkish: 'kaza',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'accident' can be a verb, but not listed
      noun: ['accident'],
      adjective: [], // 'accidental' (adj) not listed
      adverb: [], // 'accidentally' (adv) not listed
    },
    collocations: [
      'a road/car/traffic accident',
      'to have an accident',
      'to do sth/happen by accident',
      'to meet sb by accident',
    ],
  },
  {
    headword: 'audience',
    turkish: 'izleyici kitlesi',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['audience'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to get/keep the attention of the audience'],
  },
  {
    headword: 'change',
    turkish: 'değişmek, değişiklik',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: ['change'],
      noun: ['change'],
      adjective: [], // 'changed' or 'changing' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to make a change',
      'to change sb\'s life',
      'to change (from sth) to sth',
      'to adapt to change',
    ],
  },
  {
    headword: 'deliver',
    turkish: 'teslim etmek',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: ['deliver'],
      noun: [], // 'delivery' (noun) not listed
      adjective: [], // 'delivered' (adj) not listed
      adverb: [],
    },
    collocations: ['to deliver sth (to sb)'],
  },
  {
    headword: 'different',
    turkish: 'farklı',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'differ' (verb) not listed
      noun: ['difference'],
      adjective: ['different'],
      adverb: ['differently'],
    },
    collocations: [
      'to make a difference',
      'a big/major/important/significant/small/minor difference',
      '(a) difference between A and B',
    ],
  },
  {
    headword: 'digital',
    turkish: 'dijital',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'digitize' (verb) not listed
      noun: [], // 'digit' (noun) or 'digitalization' (noun) not listed
      adjective: ['digital'],
      adverb: [], // 'digitally' (adv) not listed
    },
    collocations: ['digital technology/media/content/platforms'],
  },
  {
    headword: 'graduate',
    turkish: 'mezun olmak, mezun',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: ['graduate'],
      noun: ['graduate', 'graduation'],
      adjective: [], // 'graduated' or 'graduating' (adj) not listed
      adverb: [],
    },
    collocations: [
      'a college/university graduate',
      'a graduate diploma/student',
      'to graduate in (subject/major)',
      'to graduate from (college university)',
    ],
  },
  {
    headword: 'imagine',
    turkish: 'hayal etmek',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: ['imagine'],
      noun: ['imagination'],
      adjective: [], // 'imaginary' or 'imaginative' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to imagine sth',
      'to imagine doing sth',
      'it is difficult/easy/possible to imagine',
      'to use sb\'s imagination',
    ],
  },
  {
    headword: 'injury',
    turkish: 'yaralanma',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: ['injure'],
      noun: ['injury'],
      adjective: ['injured'],
      adverb: [], // 'injuriously' (adv) not listed
    },
    collocations: [
      'to be/get/become injured',
      'to be seriously injured',
      'a serious injury',
    ],
  },
  {
    headword: 'network',
    turkish: 'ağ',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'network' can be a verb, but not listed
      noun: ['network'],
      adjective: [], // 'networked' or 'networking' (adj) not listed
      adverb: [],
    },
    collocations: [
      'a rail/road network',
      'a large network of friends',
      'a computer network',
      'to build up/create/form network(s)',
    ],
  },
  {
    headword: 'notice',
    turkish: 'fark etmek',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: ['notice'],
      noun: ['notice'],
      adjective: [], // 'noticeable' (adj) not listed
      adverb: [], // 'noticeably' (adv) not listed
    },
    collocations: ['to notice sth', 'to notice that + sentence', 'to take notice of sth'],
  },
  {
    headword: 'online',
    turkish: 'çevrimiçi',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: [],
      adjective: ['online'],
      adverb: ['online'],
    },
    collocations: [
      'online shopping/banking/education',
      'to go online/to buy sth online',
    ],
  },
  {
    headword: 'presentation',
    turkish: 'sunum',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: ['present'],
      noun: ['presentation'],
      adjective: [], // 'presented' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to give/deliver/listen to (a) presentation',
      'to present sth',
      'to present results of research/a new product/idea',
    ],
  },
  {
    headword: 'prevent',
    turkish: 'önlemek',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: ['prevent'],
      noun: [], // 'prevention' (noun) not listed
      adjective: [], // 'preventable' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to prevent sth (from happening)',
      'to prevent a(n) accident/crime/danger/health problems',
      'to prevent sb from doing sth',
    ],
  },
  {
    headword: 'progress',
    turkish: 'ilerleme',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'progress' can be a verb, but not listed
      noun: ['progress'],
      adjective: [], // 'progressive' (adj) not listed
      adverb: [], // 'progressively' (adv) not listed
    },
    collocations: [
      'to make/achieve/stop progress (in sth)',
      'fast/good/slow/steady progress',
    ],
  },
  {
    headword: 'research',
    turkish: 'araştırma',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: ['research'],
      noun: ['research', 'researcher'],
      adjective: [], // 'researched' (adj) not listed
      adverb: [],
    },
    collocations: ['to do research', 'research on sth/sb', 'scientific/medical/academic research'],
  },
  {
    headword: 'secret',
    turkish: 'sır',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['secret'],
      adjective: ['secret'],
      adverb: ['secretly'],
    },
    collocations: [
      'secret information',
      'a secret ingredient/recipe',
      'to tell sb a secret',
      'to keep a secret',
      'to share a secret (with sb)',
    ],
  },
  {
    headword: 'sign',
    turkish: 'imzalamak, işaret',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: ['sign'],
      noun: ['sign', 'signature'],
      adjective: [], // 'signed' (adj) not listed
      adverb: [],
    },
    collocations: ['to sign sb\'s name', 'to sign a contract/an agreement'],
  },
  {
    headword: 'solution',
    turkish: 'çözüm',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: ['solve'],
      noun: ['solution'],
      adjective: [], // 'solvable' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to solve a problem/mystery/puzzle',
      'to find/offer/provide a solution to/for sth',
    ],
  },
  {
    headword: 'suffer',
    turkish: 'acı çekmek',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: ['suffer'],
      noun: [], // 'suffering' (noun) not listed
      adjective: [], // 'suffering' (adj) not listed
      adverb: [],
    },
    collocations: ['to suffer from sth', 'to suffer badly/a lot'],
  },
  {
    headword: 'surprised',
    turkish: 'şaşırmış',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: ['surprise'],
      noun: ['surprise'],
      adjective: ['surprised', 'surprising'],
      adverb: ['surprisingly'],
    },
    collocations: ['surprised (at sth/sb)'],
  },
  {
    headword: 'teenager',
    turkish: 'genç',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['teenager'],
      adjective: ['teenage'],
      adverb: [],
    },
    collocations: ['teenage problems/issues', 'a teenage son/daughter'],
  },
  {
    headword: 'touch',
    turkish: 'dokunmak, temas',
    unit: '7',
    section: 'Listening & Speaking',
    forms: {
      verb: ['touch'],
      noun: [], // 'touch' (noun) not listed as form
      adjective: [], // 'touching' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to stay/keep/get in touch with sb',
      'to lose touch with sb',
      'to touch sb/sth',
    ],
  },

  // =================================================================
  // UNIT 7: EXTRA WORDS (Skillful 1)
  // =================================================================
  {
    headword: 'fortunately',
    turkish: 'neyse ki',
    unit: '7',
    section: 'Extra Words',
    forms: {
      verb: [],
      noun: [], // 'fortune' (noun) not listed
      adjective: ['fortunate', 'unfortunate'],
      adverb: ['fortunately', 'unfortunately'],
    },
    collocations: [],
  },
  {
    headword: 'influence',
    turkish: 'etki, etkilemek',
    unit: '7',
    section: 'Extra Words',
    forms: {
      verb: ['influence'],
      noun: ['influence'],
      adjective: [], // 'influential' (adj) not listed
      adverb: [], // 'influentially' (adv) not listed
    },
    collocations: [
      'to influence greatly',
      'to have a good/bad influence on sb',
    ],
  },
  {
    headword: 'manner',
    turkish: 'tavır, davranış',
    unit: '7',
    section: 'Extra Words',
    forms: {
      verb: [],
      noun: ['manner'],
      adjective: [], // 'mannered' (adj) not listed
      adverb: [],
    },
    collocations: ['to have good/bad/polite/ rude manners'],
  },
  {
    headword: 'peace',
    turkish: 'barış',
    unit: '7',
    section: 'Extra Words',
    forms: {
      verb: [], // 'pacify' (verb) not listed
      noun: ['peace'],
      adjective: ['peaceful'],
      adverb: ['peacefully'],
    },
    collocations: ['a peaceful atmosphere/place/life', 'to make peace'],
  },
  {
    headword: 'realize',
    turkish: 'farkına varmak',
    unit: '7',
    section: 'Extra Words',
    forms: {
      verb: ['realize'],
      noun: [], // 'realization' (noun) not listed
      adjective: [], // 'realized' (adj) not listed
      adverb: [],
    },
    collocations: ['to realize sth', 'to realize that + sentence'],
  },
  {
    headword: 'scene',
    turkish: 'sahne',
    unit: '7',
    section: 'Extra Words',
    forms: {
      verb: [], // 'scene' can be a verb, but not listed
      noun: ['scene'],
      adjective: [], // 'scenic' (adj) not listed
      adverb: [],
    },
    collocations: [],
  },
  {
    headword: 'excellent',
    turkish: 'mükemmel',
    unit: '7',
    section: 'Extra Words',
    forms: {
      verb: [],
      noun: [], // 'excellence' (noun) not listed
      adjective: ['excellent'],
      adverb: ['excellently'],
    },
    collocations: [
      'an excellent achievement/result/performance/standard',
    ],
  },
  {
    headword: 'fair',
    turkish: 'adil',
    unit: '7',
    section: 'Extra Words',
    forms: {
      verb: [],
      noun: [], // 'fairness' (noun) not listed
      adjective: ['fair', 'unfair'],
      adverb: [], // 'fairly' (adv) not listed
    },
    collocations: ['to be (un)fair to sb', '(un)fair treatment (of sb)'],
  },

  // =================================================================
  // UNIT 8: READING & WRITING (Skillful 1)
  // =================================================================
  {
    headword: 'avoid',
    turkish: 'kaçınmak',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: ['avoid'],
      noun: [], // 'avoidance' (noun) not listed
      adjective: [], // 'avoidable' (adj) not listed
      adverb: [],
    },
    collocations: ['to avoid (doing) sth', 'to avoid sb'],
  },
  {
    headword: 'certainly',
    turkish: 'kesinlikle',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: [], // 'certainty' (noun) not listed
      adjective: ['certain', 'uncertain'],
      adverb: ['certainly'],
    },
    collocations: ['to be certain about/of sth'],
  },
  {
    headword: 'charge',
    turkish: 'şarj etmek, ücret',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: ['charge'],
      noun: ['charge'],
      adjective: [], // 'charged' (adj) not listed
      adverb: [],
    },
    collocations: [],
  },
  {
    headword: 'contact',
    turkish: 'iletişim, temas',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: ['contact'],
      noun: ['contact'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'to be/get/stay/keep in contact (with sb)',
      'to have close/regular contact (with sb)',
    ],
  },
  {
    headword: 'continent',
    turkish: 'kıta',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['continent'],
      adjective: [], // 'continental' (adj) not listed
      adverb: [],
    },
    collocations: [],
  },
  {
    headword: 'device',
    turkish: 'cihaz',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'devise' (verb) not listed
      noun: ['device'],
      adjective: [], // 'devised' (adj) not listed
      adverb: [],
    },
    collocations: ['a useful/electronic/hi-tech device'],
  },
  {
    headword: 'fail',
    turkish: 'başarısız olmak',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: ['fail'],
      noun: ['failure'],
      adjective: [], // 'failing' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to fail (in) sth',
      'to fail to do sth',
      '(the) failure of sth/sb',
      'a sense of failure',
      'to be/feel like a failure',
    ],
  },
  {
    headword: 'fear',
    turkish: 'korku',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'fear' can be a verb, but not listed
      noun: ['fear'],
      adjective: [], // 'fearful' (adj) not listed
      adverb: [], // 'fearfully' (adv) not listed
    },
    collocations: ['a fear of sth'],
  },
  {
    headword: 'ground',
    turkish: 'yer, zemin',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'ground' can be a verb, but not listed
      noun: ['ground'],
      adjective: [], // 'grounded' (adj) not listed
      adverb: [],
    },
    collocations: ['above/below/under the ground'],
  },
  {
    headword: 'mood',
    turkish: 'ruh hali',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['mood'],
      adjective: [], // 'moody' (adj) not listed
      adverb: [], // 'moodily' (adv) not listed
    },
    collocations: ['to be in a good/bad/perfect/strange mood'],
  },
  {
    headword: 'passenger',
    turkish: 'yolcu',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['passenger'],
      adjective: [],
      adverb: [],
    },
    collocations: [],
  },
  {
    headword: 'promise',
    turkish: 'söz, söz vermek',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: ['promise'],
      noun: ['promise'],
      adjective: [], // 'promised' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to promise to do sth,',
      'to promise sb sth',
      'to make/keep/break a promise',
    ],
  },
  {
    headword: 'promote',
    turkish: 'terfi ettirmek, desteklemek',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: ['promote'],
      noun: [], // 'promotion' (noun) not listed
      adjective: [], // 'promoted' (adj) not listed
      adverb: [],
    },
    collocations: ['to promote sth'],
  },
  {
    headword: 'position',
    turkish: 'konum, pozisyon',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: [], // 'position' can be a verb, but not listed
      noun: ['position'],
      adjective: [], // 'positioned' (adj) not listed
      adverb: [],
    },
    collocations: [
      'a part-time/full-time/key position',
      'an official position',
      'to have/apply for a position',
    ],
  },
  {
    headword: 'raise',
    turkish: 'yükseltmek, zam',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: ['raise'],
      noun: [], // 'raise' (noun) not listed as form
      adjective: [], // 'raised' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to raise sth',
      'to raise sb\'s hand/arm/eyes',
      'to raise sb (a child)',
      'to raise the price of sth',
      'to raise taxes',
    ],
  },
  {
    headword: 'refer',
    turkish: 'bahsetmek, atıfta bulunmak',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: ['refer'],
      noun: [], // 'reference' (noun) not listed
      adjective: [], // 'referred' (adj) not listed
      adverb: [],
    },
    collocations: ['to refer to sth/sb'],
  },
  {
    headword: 'repeat',
    turkish: 'tekrarlamak',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: ['repeat'],
      noun: ['repetition'],
      adjective: ['repetitive'],
      adverb: [], // 'repetitively' (adv) not listed
    },
    collocations: ['to repeat sth'],
  },
  {
    headword: 'replace',
    turkish: 'yerine koymak',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: ['replace'],
      noun: [], // 'replacement' (noun) not listed
      adjective: [], // 'replaced' (adj) not listed
      adverb: [],
    },
    collocations: ['replace sth (with sth)'],
  },
  {
    headword: 'respond',
    turkish: 'yanıt vermek',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: ['respond'],
      noun: ['response'],
      adjective: [], // 'responsive' (adj) not listed
      adverb: [], // 'responsively' (adv) not listed
    },
    collocations: [
      'to respond to sth/sb',
      'to respond immediately/positively',
      'to give/receive a positive/negative/an immediate response',
    ],
  },
  {
    headword: 'situation',
    turkish: 'durum',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: [],
      noun: ['situation'],
      adjective: [], // 'situational' (adj) not listed
      adverb: [], // 'situationally' (adv) not listed
    },
    collocations: [
      '(the) economic/financial/political situation',
      'to be in/face a difficult/dangerous/challenging situation',
    ],
  },
  {
    headword: 'wave',
    turkish: 'dalga, sallamak',
    unit: '8',
    section: 'Reading & Writing',
    forms: {
      verb: ['wave'],
      noun: ['wave'],
      adjective: [], // 'wavy' (adj) not listed
      adverb: [],
    },
    collocations: ['to wave at sb'],
  },

  // =================================================================
  // UNIT 8: LISTENING & SPEAKING (Skillful 1)
  // =================================================================
  {
    headword: 'art',
    turkish: 'sanat',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'art' (verb) not listed
      noun: ['artist', 'art'],
      adjective: ['artistic'],
      adverb: [], // 'artistically' (adv) not listed
    },
    collocations: ['an art exhibition'],
  },
  {
    headword: 'book',
    turkish: 'kitap, rezervasyon yapmak',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: ['book'],
      noun: ['book', 'booking'],
      adjective: [], // 'booked' (adj) not listed
      adverb: [],
    },
    collocations: ['to book early/in advance', 'to book a room'],
  },
  {
    headword: 'career',
    turkish: 'kariyer',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['career'],
      adjective: [], // 'career-oriented' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to have/make a career',
      'a career in sth',
      'academic/diplomatic/scientific/musical career',
      'a career opportunity',
    ],
  },
  {
    headword: 'decrease',
    turkish: 'azalmak',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: ['decrease'],
      noun: ['decrease'],
      adjective: [], // 'decreased' (adj) not listed
      adverb: [],
    },
    collocations: ['a decrease in sth'],
  },
  {
    headword: 'degree',
    turkish: 'derece, lisans',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['degree'],
      adjective: [], // 'graduated' (adj) not listed (but listed for graduate)
      adverb: [],
    },
    collocations: [
      'a dramatic/sudden/steady/slow decrease',
      'to have/do/take/get a degree in sth',
      'college/university/master\'s degree',
    ],
  },
  {
    headword: 'designer',
    turkish: 'tasarımcı',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: ['design'],
      noun: ['design', 'designer'],
      adjective: [], // 'designed' (adj) not listed
      adverb: [],
    },
    collocations: ['to design a building/product/website'],
  },
  {
    headword: 'dream',
    turkish: 'rüya, hayal etmek',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: ['dream'],
      noun: ['dream'],
      adjective: [], // 'dreamy' (adj) not listed
      adverb: [],
    },
    collocations: ['to dream about sth/sb'],
  },
  {
    headword: 'earn',
    turkish: 'kazanmak',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: ['earn'],
      noun: [], // 'earnings' (noun) not listed
      adjective: [], // 'earned' (adj) not listed
      adverb: [],
    },
    collocations: ['to earn money/ a salary/an income'],
  },
  {
    headword: 'fix',
    turkish: 'tamir etmek, düzeltmek',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: ['fix'],
      noun: [], // 'fix' (noun) not listed
      adjective: [], // 'fixed' (adj) not listed
      adverb: [],
    },
    collocations: ['to fix sth (a car/a problem, etc.)'],
  },
  {
    headword: 'focus',
    turkish: 'odak, odaklanmak',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: ['focus'],
      noun: ['focus'],
      adjective: [], // 'focused' (adj) not listed
      adverb: [],
    },
    collocations: ['(the) central/main focus of sth', 'to focus on sth'],
  },
  {
    headword: 'light',
    turkish: 'ışık',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'light' can be a verb, but not listed
      noun: ['light'],
      adjective: ['light'],
      adverb: [], // 'lightly' (adv) not listed
    },
    collocations: [
      '(a) bright light',
      'natural light',
      'to light sth (a fire/a candle)',
    ],
  },
  {
    headword: 'opportunity',
    turkish: 'fırsat',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['opportunity'],
      adjective: [],
      adverb: [],
    },
    collocations: [
      'to have/miss/find an opportunity',
      'to provide an opportunity (for sb) (to do sth)',
      'an opportunity for (doing) sth',
      'an opportunity for sb to do sth',
    ],
  },
  {
    headword: 'profession',
    turkish: 'meslek',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'professionalize' (verb) not listed
      noun: ['profession'],
      adjective: ['professional', 'unprofessional'],
      adverb: ['professionally'],
    },
    collocations: [
      'to be/become/look/seem professional',
      'unprofessional behavior',
    ],
  },
  {
    headword: 'relationship',
    turkish: 'ilişki',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'relate' (verb) not listed
      noun: ['relationship'],
      adjective: [], // 'related' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to have/begin/continue/build a relationship (with sb)',
      'a personal/professional/special/family relationship',
    ],
  },
  {
    headword: 'repair',
    turkish: 'tamir etmek',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: ['repair'],
      noun: ['repair', 'repairman'],
      adjective: [], // 'repaired' (adj) not listed
      adverb: [],
    },
    collocations: ['to repair sth'],
  },
  {
    headword: 'safe',
    turkish: 'güvenli',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'save' (verb) but not listed here
      noun: ['safety'],
      adjective: ['safe', 'unsafe'],
      adverb: ['safely'],
    },
    collocations: ['a safe neighborhood'],
  },
  {
    headword: 'salary',
    turkish: 'maaş',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'salary' can be a verb, but not listed
      noun: ['salary'],
      adjective: [],
      adverb: [],
    },
    collocations: ['to pay/earn a salary', 'a good/high/low salary'],
  },
  {
    headword: 'temperature',
    turkish: 'sıcaklık',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: ['temperature'],
      adjective: [],
      adverb: [],
    },
    collocations: ['a high/low temperature'],
  },
  {
    headword: 'transportation',
    turkish: 'ulaşım',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'transport' (verb) not listed here
      noun: ['transport', 'transportation'],
      adjective: [],
      adverb: [],
    },
    collocations: ['(to use) public/private transport'],
  },
  {
    headword: 'unusual',
    turkish: 'olağandışı',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: [],
      noun: [], // 'unusualness' (noun) not listed
      adjective: ['usual', 'unusual'],
      adverb: [], // 'unusually' (adv) not listed
    },
    collocations: ['to be unusual (for sb/sth) to do sth', 'an unusual event'],
  },
  {
    headword: 'variety',
    turkish: 'çeşitlilik',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'vary' (verb) not listed
      noun: ['variety'],
      adjective: ['various'],
      adverb: [], // 'variously' (adv) not listed
    },
    collocations: ['a variety of sth'],
  },
  {
    headword: 'author',
    turkish: 'yazar',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: [], // 'author' (verb) not listed
      noun: ['author'],
      adjective: [], // 'authored' (adj) not listed
      adverb: [],
    },
    collocations: ['(the) author of sth'],
  },
  {
    headword: 'involve',
    turkish: 'içermek, dahil etmek',
    unit: '8',
    section: 'Listening & Speaking',
    forms: {
      verb: ['involve'],
      noun: [], // 'involvement' (noun) not listed
      adjective: [], // 'involved' (adj) not listed
      adverb: [],
    },
    collocations: ['to involve doing sth'],
  },

  // =================================================================
  // UNIT 8: EXTRA WORDS (Skillful 1)
  // =================================================================
  {
    headword: 'wood',
    turkish: 'odun, ahşap',
    unit: '8',
    section: 'Extra Words',
    forms: {
      verb: [], // 'wood' no verb form listed
      noun: ['wood'],
      adjective: ['wooden'],
      adverb: [],
    },
    collocations: ['a piece of wood', 'a wooden box/door/floor'],
  },
  {
    headword: 'worth',
    turkish: 'değer',
    unit: '8',
    section: 'Extra Words',
    forms: {
      verb: [],
      noun: ['worth'],
      adjective: [], // 'worthwhile' (adj) or 'worthless' (adj) not listed
      adverb: [],
    },
    collocations: ['to be worth sth', 'to be worth doing sth'],
  },
  {
    headword: 'crime',
    turkish: 'suç',
    unit: '8',
    section: 'Extra Words',
    forms: {
      verb: [], // 'criminalize' (verb) not listed
      noun: ['crime'],
      adjective: ['criminal'],
      adverb: [],
    },
    collocations: [
      'to commit (a) crime',
      'to fight/stop/report/investigate/ punish crime',
      '(the) crime rate',
      'crime statistics',
      'a crime scene/novel',
    ],
  },
  {
    headword: 'emergency',
    turkish: 'acil durum',
    unit: '8',
    section: 'Extra Words',
    forms: {
      verb: [],
      noun: ['emergency'],
      adjective: [], // 'emergent' (adj) or 'emergency' (adj) not listed
      adverb: [],
    },
    collocations: ['medical emergency'],
  },
  {
    headword: 'feature',
    turkish: 'özellik',
    unit: '8',
    section: 'Extra Words',
    forms: {
      verb: [], // 'feature' can be a verb, but not listed
      noun: ['feature'],
      adjective: [], // 'featured' (adj) not listed
      adverb: [],
    },
    collocations: ['(the) feature(s) of sth', '(the) feature(s) of sth a device'],
  },
  {
    headword: 'invest',
    turkish: 'yatırım yapmak',
    unit: '8',
    section: 'Extra Words',
    forms: {
      verb: ['invest'],
      noun: ['investment'],
      adjective: [], // 'invested' (adj) or 'investable' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to invest (money) in sth',
      'to invest in a company',
      'to invest in business/property/shares',
      'to make an investment',
      'a huge investment',
    ],
  },
  {
    headword: 'request',
    turkish: 'talep, talep etmek',
    unit: '8',
    section: 'Extra Words',
    forms: {
      verb: ['request'],
      noun: ['request'],
      adjective: [], // 'requested' (adj) not listed
      adverb: [],
    },
    collocations: [
      'to make a request',
      'request for sth',
      'to request sth from sb',
    ],
  },
  {
    headword: 'straight',
    turkish: 'düz',
    unit: '8',
    section: 'Extra Words',
    forms: {
      verb: [], // 'straighten' (verb) not listed
      noun: [], // 'straightness' (noun) not listed
      adjective: ['straight'],
      adverb: ['straight'], // 'straight' can also be an adverb
    },
    collocations: ['a straight road'],
  },
  {
    headword: 'thought',
    turkish: 'düşünce',
    unit: '8',
    section: 'Extra Words',
    forms: {
      verb: [], // 'think' (verb) not listed
      noun: ['thought'],
      adjective: [], // 'thoughtful' (adj) or 'thoughtless' (adj) not listed
      adverb: [], // 'thoughtfully' (adv) or 'thoughtlessly' (adv) not listed
    },
    collocations: ['an interesting/original thought'],
  },
  {
    headword: 'warn',
    turkish: 'uyarmak',
    unit: '8',
    section: 'Extra Words',
    forms: {
      verb: ['warn'],
      noun: ['warning'],
      adjective: [], // 'warned' (adj) or 'warning' (adj) not listed
      adverb: [],
    },
    collocations: ['to warn sb about sth', 'to give sb a warning'],
  },
];