import { Difficulty } from '../../types';

export type IndicatorColor = 'none' | 'orange' | 'blue' | 'green' | 'gray';

export interface ColorGridTable {
  id: number;
  cells: string[][]; // 3x3 diamond matrix of letters and digits
  topColor: IndicatorColor;
  bottomColor: IndicatorColor;
}

export interface ColorGridTask {
  id: string;
  level: number;
  difficulty: Difficulty;
  prompt: string;
  subRuleLabel: string;
  referenceGrids: ColorGridTable[]; // 6 observation tables
  queryGrids: ColorGridTable[];     // 4 target tables to solve
  correctQueryAnswers: { topColor: IndicatorColor; bottomColor: IndicatorColor }[];
  availableColors: IndicatorColor[];
  ruleExplanation: string;
  timeLimitSec: number;
}

const CONSONANTS = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Z'];
const VOWELS = ['A', 'E', 'I', 'O', 'U'];
const ODD_DIGITS = ['1', '3', '5', '7', '9'];
const EVEN_DIGITS = ['2', '4', '6', '8'];

function randOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateColorGridTask(difficulty: Difficulty = 'medium', level: number = 1): ColorGridTask {
  const qId = 'cg_' + Math.random().toString(36).substring(2, 9);
  const modelType = Math.floor(Math.random() * 2); // 0: Target letter count (Image 3), 1: Parity & Vowels (Image 4)

  if (modelType === 0) {
    // Model 0: Target 'Z' count (Image 3 Model)
    // Grids with exactly 4 'Z's -> top circle = orange, bottom = none
    // Other grids -> bottom circle = blue, top = none
    const makeTable = (id: number, forceHas4Z: boolean): ColorGridTable => {
      const cells: string[][] = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ];

      const poolChars = ['L', 'V', 'S', 'P', 'G', 'U', '4', '7', 'E', 'F', 'B', '3', '8', 'R', '1', '2', '6', '9'];

      if (forceHas4Z) {
        // Place 4 'Z's in random distinct positions
        const positions = [
          [0, 0], [0, 1], [0, 2],
          [1, 0], [1, 1], [1, 2],
          [2, 0], [2, 1], [2, 2]
        ].sort(() => Math.random() - 0.5);

        for (let i = 0; i < 4; i++) {
          cells[positions[i][0]][positions[i][1]] = 'Z';
        }
        for (let i = 4; i < 9; i++) {
          cells[positions[i][0]][positions[i][1]] = randOf(poolChars);
        }
      } else {
        // Fill without having 4 'Z's (at most 0 or 1 Z)
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            cells[r][c] = randOf(poolChars);
          }
        }
      }

      return {
        id,
        cells,
        topColor: forceHas4Z ? 'orange' : 'none',
        bottomColor: forceHas4Z ? 'none' : 'blue'
      };
    };

    // 6 reference grids (3 with 4 Z's, 3 without)
    const refConditions = [false, true, true, false, false, true].sort(() => Math.random() - 0.5);
    const referenceGrids = refConditions.map((has4Z, idx) => makeTable(idx + 1, has4Z));

    // 4 query grids
    const queryConditions = [false, true, true, false];
    const queryGrids = queryConditions.map((has4Z, idx) => {
      const t = makeTable(idx + 7, has4Z);
      return {
        ...t,
        topColor: 'none' as IndicatorColor,
        bottomColor: 'none' as IndicatorColor
      };
    });

    const correctQueryAnswers = queryConditions.map(has4Z => ({
      topColor: (has4Z ? 'orange' : 'none') as IndicatorColor,
      bottomColor: (has4Z ? 'none' : 'blue') as IndicatorColor
    }));

    const ruleExplanation = "Rule: Grids that contain totally 4 'Z's have an ORANGE indicator at the TOP. All other grids have a BLUE-BLACK indicator at the BOTTOM.";

    return {
      id: qId,
      level,
      difficulty,
      prompt: "Based on the 6 observation tables above, determine the latent rule and color the 4 target tables below:",
      subRuleLabel: "Color the Grid Challenge",
      referenceGrids,
      queryGrids,
      correctQueryAnswers,
      availableColors: ['none', 'orange', 'blue'],
      ruleExplanation,
      timeLimitSec: 360 // 6 mins
    };
  }

  // Model 1: Number Parity & Letter Type (Image 4 Model)
  // Top Circle: All Odd -> green, All Even -> gray, Mixed -> none
  // Bottom Circle: All Consonants -> green, All Vowels -> gray, Mixed -> none
  const makeTable2 = (id: number, numMode: 'odd' | 'even' | 'mixed', letterMode: 'consonant' | 'vowel' | 'mixed'): ColorGridTable => {
    const cells: string[][] = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];

    const isNumGrid = [
      [true, true, true],
      [false, true, true],
      [false, false, false]
    ];

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (isNumGrid[r][c]) {
          if (numMode === 'odd') cells[r][c] = randOf(ODD_DIGITS);
          else if (numMode === 'even') cells[r][c] = randOf(EVEN_DIGITS);
          else cells[r][c] = randOf([...ODD_DIGITS, ...EVEN_DIGITS]);
        } else {
          if (letterMode === 'consonant') cells[r][c] = randOf(CONSONANTS);
          else if (letterMode === 'vowel') cells[r][c] = randOf(VOWELS);
          else cells[r][c] = randOf([...CONSONANTS, ...VOWELS]);
        }
      }
    }

    const topColor: IndicatorColor = numMode === 'odd' ? 'green' : numMode === 'even' ? 'gray' : 'none';
    const bottomColor: IndicatorColor = letterMode === 'consonant' ? 'green' : letterMode === 'vowel' ? 'gray' : 'none';

    return { id, cells, topColor, bottomColor };
  };

  const refPresets: [ 'odd' | 'even' | 'mixed', 'consonant' | 'vowel' | 'mixed' ][] = [
    ['odd', 'mixed'],
    ['mixed', 'consonant'],
    ['even', 'mixed'],
    ['odd', 'consonant'],
    ['mixed', 'mixed'],
    ['even', 'consonant']
  ];

  const referenceGrids = refPresets.map(([n, l], idx) => makeTable2(idx + 1, n, l));

  const queryPresets: [ 'odd' | 'even' | 'mixed', 'consonant' | 'vowel' | 'mixed' ][] = [
    ['odd', 'vowel'],
    ['even', 'consonant'],
    ['odd', 'mixed'],
    ['even', 'mixed']
  ];

  const queryGrids = queryPresets.map(([n, l], idx) => {
    const t = makeTable2(idx + 7, n, l);
    return {
      ...t,
      topColor: 'none' as IndicatorColor,
      bottomColor: 'none' as IndicatorColor
    };
  });

  const correctQueryAnswers = queryPresets.map(([n, l]) => ({
    topColor: (n === 'odd' ? 'green' : n === 'even' ? 'gray' : 'none') as IndicatorColor,
    bottomColor: (l === 'consonant' ? 'green' : l === 'vowel' ? 'gray' : 'none') as IndicatorColor
  }));

  const ruleExplanation = "Rule: Top Circle is GREEN if all digits are ODD, GRAY if all digits are EVEN, or UNMARKED if mixed. Bottom Circle is GREEN if all letters are CONSONANTS, GRAY if all letters are VOWELS, or UNMARKED if mixed.";

  return {
    id: qId,
    level,
    difficulty,
    prompt: "Based on the 6 observation tables above, determine the latent rule and color the 4 target tables below:",
    subRuleLabel: "Color the Grid Challenge (Alphanumeric Parity)",
    referenceGrids,
    queryGrids,
    correctQueryAnswers,
    availableColors: ['none', 'green', 'gray'],
    ruleExplanation,
    timeLimitSec: 360 // 6 mins
  };
}
