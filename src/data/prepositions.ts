export interface Preposition {
  prep: string;
  type: 'time' | 'place' | 'movement' | 'phrasal' | 'dependent' | 'other';
  example: string;
}

export const prepositionsByLevel: Record<'easy' | 'medium' | 'hard', Preposition[]> = {
  easy: [
    { prep: 'in', type: 'place', example: 'in the box' },
    { prep: 'on', type: 'place', example: 'on the table' },
    { prep: 'at', type: 'place', example: 'at the school' },
    { prep: 'in', type: 'time', example: 'in December' },
    { prep: 'on', type: 'time', example: 'on Monday' },
    { prep: 'at', type: 'time', example: 'at 9 PM' },
    { prep: 'for', type: 'other', example: 'a gift for you' },
    { prep: 'with', type: 'other', example: 'with my friends' },
    { prep: 'to', type: 'movement', example: 'go to the store' },
    { prep: 'from', type: 'movement', example: 'a letter from John' },
    { prep: 'about', type: 'other', example: 'a book about history' },
    { prep: 'under', type: 'place', example: 'under the bed' },
  ],
  medium: [
    { prep: 'across', type: 'movement', example: 'walk across the street' },
    { prep: 'through', type: 'movement', example: 'go through the tunnel' },
    { prep: 'between', type: 'place', example: 'between the two trees' },
    { prep: 'among', type: 'place', example: 'among the crowd' },
    { prep: 'against', type: 'other', example: 'lean against the wall' },
    { prep: 'during', type: 'time', example: 'during the movie' },
    { prep: 'without', type: 'other', example: 'without sugar' },
    { prep: 'look for', type: 'phrasal', example: 'I need to look for my keys.' },
    { prep: 'depend on', type: 'phrasal', example: 'It depends on the weather.' },
    { prep: 'turn on', type: 'phrasal', example: 'Please turn on the light.' },
    { prep: 'interested in', type: 'dependent', example: 'She is interested in art.' },
    { prep: 'good at', type: 'dependent', example: 'He is good at playing chess.' },
  ],
  hard: [
    { prep: 'despite', type: 'other', example: 'He went out despite the rain.' },
    { prep: 'throughout', type: 'time', example: 'It rained throughout the night.' },
    { prep: 'beneath', type: 'place', example: 'The treasure was hidden beneath the floor.' },
    { prep: 'by means of', type: 'other', example: 'She contacted him by means of a letter.' },
    { prep: 'in spite of', type: 'other', example: 'He succeeded in spite of the difficulties.' },
    { prep: 'due to', type: 'other', example: 'The game was cancelled due to the storm.' },
    { prep: 'accustomed to', type: 'dependent', example: 'I am not accustomed to this weather.' },
    { prep: 'capable of', type: 'dependent', example: 'She is capable of solving the problem.' },
    { prep: 'consist of', type: 'phrasal', example: 'The team consist of five members.' },
    { prep: 'result in', type: 'phrasal', example: 'The changes will result in a better system.' },
    { prep: 'comply with', type: 'phrasal', example: 'You must comply with the regulations.' },
    { prep: 'fond of', type: 'dependent', example: 'She is very fond of her grandfather.' },
  ],
}; 