// QuestionService - Cumulative XP system with automatic level progression
export class QuestionService {
  constructor() {
    this.baseUrl = '/api/now/table';
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-UserToken': window.g_ck
    };
  }

  // Level progression system with cumulative XP
  getLevelRequirements() {
    return {
      1: { xpRequired: 0, difficulty: 'easy' },
      2: { xpRequired: 15, difficulty: 'easy' },
      3: { xpRequired: 35, difficulty: 'normal' },
      4: { xpRequired: 60, difficulty: 'normal' },
      5: { xpRequired: 90, difficulty: 'hard' },
      6: { xpRequired: 125, difficulty: 'hard' },
      7: { xpRequired: 165, difficulty: 'legend' },
      8: { xpRequired: 210, difficulty: 'legend' },
      9: { xpRequired: 260, difficulty: 'mythical' },
      10: { xpRequired: 320, difficulty: 'mythical' }
    };
  }

  calculateLevel(totalXP) {
    const levels = this.getLevelRequirements();
    let currentLevel = 1;
    let nextLevelXP = levels[2]?.xpRequired || 999999;
    
    // Find current level based on total XP
    for (let level = 10; level >= 1; level--) {
      if (totalXP >= levels[level].xpRequired) {
        currentLevel = level;
        nextLevelXP = levels[level + 1]?.xpRequired || levels[10].xpRequired;
        break;
      }
    }
    
    const currentLevelXP = levels[currentLevel].xpRequired;
    const xpProgress = totalXP - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;
    
    return {
      level: currentLevel,
      currentXP: totalXP,
      xpForNextLevel: nextLevelXP,
      xpProgress: xpProgress,
      xpNeeded: xpNeeded,
      canLevelUp: totalXP >= nextLevelXP && currentLevel < 10
    };
  }

  getDifficultyForLevel(level, withRandomBoost = false) {
    const levels = this.getLevelRequirements();
    let baseDifficulty = levels[level]?.difficulty || 'easy';
    
    // Random difficulty boost (8% chance for variety)
    if (withRandomBoost && Math.random() < 0.08) {
      const difficulties = ['easy', 'normal', 'hard', 'legend', 'mythical'];
      const currentIndex = difficulties.indexOf(baseDifficulty);
      const boostIndex = Math.min(currentIndex + 1, difficulties.length - 1);
      console.log(`🔥 DIFFICULTY BOOST! ${baseDifficulty} -> ${difficulties[boostIndex]}`);
      return difficulties[boostIndex];
    }
    
    return baseDifficulty;
  }

  getSampleQuestions() {
    const questionPool = {
      easy: [
        {
          sys_id: 'easy1',
          question_text: 'ServiceNow work record (4 letters)',
          answer: 'TASK',
          difficulty: 'easy',
          category: 'itsm'
        },
        {
          sys_id: 'easy2',
          question_text: 'ServiceNow user login (4 letters)',
          answer: 'USER',
          difficulty: 'easy',
          category: 'platform'
        },
        {
          sys_id: 'easy3',
          question_text: 'Security permission group (4 letters)',
          answer: 'ROLE',
          difficulty: 'easy',
          category: 'security'
        },
        {
          sys_id: 'easy4',
          question_text: 'Access Control List (3 letters)',
          answer: 'ACL',
          difficulty: 'easy',
          category: 'security'
        },
        {
          sys_id: 'easy5',
          question_text: 'Application Programming Interface (3 letters)',
          answer: 'API',
          difficulty: 'easy',
          category: 'integration'
        },
        {
          sys_id: 'easy6',
          question_text: 'System identifier (3 letters)',
          answer: 'SYS',
          difficulty: 'easy',
          category: 'platform'
        },
        {
          sys_id: 'easy7',
          question_text: 'Table record display (4 letters)',
          answer: 'LIST',
          difficulty: 'easy',
          category: 'platform'
        },
        {
          sys_id: 'easy8',
          question_text: 'Data storage table (4 letters)',
          answer: 'DATA',
          difficulty: 'easy',
          category: 'platform'
        }
      ],
      normal: [
        {
          sys_id: 'norm1',
          question_text: 'Client-side form manipulation (4 letters)',
          answer: 'FORM',
          difficulty: 'normal',
          category: 'scripting'
        },
        {
          sys_id: 'norm2',
          question_text: 'Web service type in ServiceNow (4 letters)',
          answer: 'REST',
          difficulty: 'normal',
          category: 'integration'
        },
        {
          sys_id: 'norm3',
          question_text: 'ServiceNow workflow automation (4 letters)',
          answer: 'FLOW',
          difficulty: 'normal',
          category: 'automation'
        },
        {
          sys_id: 'norm4',
          question_text: 'Database record identifier (4 letters)',
          answer: 'GUID',
          difficulty: 'normal',
          category: 'platform'
        },
        {
          sys_id: 'norm5',
          question_text: 'Business automation script (4 letters)',
          answer: 'RULE',
          difficulty: 'normal',
          category: 'scripting'
        },
        {
          sys_id: 'norm6',
          question_text: 'ServiceNow menu navigation (4 letters)',
          answer: 'MENU',
          difficulty: 'normal',
          category: 'platform'
        },
        {
          sys_id: 'norm7',
          question_text: 'Record state management (5 letters)',
          answer: 'STATE',
          difficulty: 'normal',
          category: 'platform'
        },
        {
          sys_id: 'norm8',
          question_text: 'Application configuration (6 letters)',
          answer: 'CONFIG',
          difficulty: 'normal',
          category: 'platform'
        }
      ],
      hard: [
        {
          sys_id: 'hard1',
          question_text: 'ServiceNow scripting framework (5 letters)',
          answer: 'GLIDE',
          difficulty: 'hard',
          category: 'scripting'
        },
        {
          sys_id: 'hard2',
          question_text: 'Application scope namespace (5 letters)',
          answer: 'SCOPE',
          difficulty: 'hard',
          category: 'platform'
        },
        {
          sys_id: 'hard3',
          question_text: 'Configuration Management Database (4 letters)',
          answer: 'CMDB',
          difficulty: 'hard',
          category: 'itsm'
        },
        {
          sys_id: 'hard4',
          question_text: 'JavaScript Object Notation (4 letters)',
          answer: 'JSON',
          difficulty: 'hard',
          category: 'integration'
        },
        {
          sys_id: 'hard5',
          question_text: 'Service catalog management (4 letters)',
          answer: 'CATS',
          difficulty: 'hard',
          category: 'itsm'
        },
        {
          sys_id: 'hard6',
          question_text: 'Data transformation process (3 letters)',
          answer: 'ETL',
          difficulty: 'hard',
          category: 'integration'
        },
        {
          sys_id: 'hard7',
          question_text: 'Advanced workflow designer (6 letters)',
          answer: 'DESIGN',
          difficulty: 'hard',
          category: 'automation'
        },
        {
          sys_id: 'hard8',
          question_text: 'Performance analytics metrics (7 letters)',
          answer: 'METRICS',
          difficulty: 'hard',
          category: 'analytics'
        }
      ],
      legend: [
        {
          sys_id: 'leg1',
          question_text: 'Enterprise service management (3 letters)',
          answer: 'ESM',
          difficulty: 'legend',
          category: 'itsm'
        },
        {
          sys_id: 'leg2',
          question_text: 'Service Level Agreement (3 letters)',
          answer: 'SLA',
          difficulty: 'legend',
          category: 'itsm'
        },
        {
          sys_id: 'leg3',
          question_text: 'Configuration item relationship (5 letters)',
          answer: 'RELCI',
          difficulty: 'legend',
          category: 'cmdb'
        },
        {
          sys_id: 'leg4',
          question_text: 'Advanced integration framework (6 letters)',
          answer: 'INTGRT',
          difficulty: 'legend',
          category: 'integration'
        },
        {
          sys_id: 'leg5',
          question_text: 'Orchestration workflow engine (5 letters)',
          answer: 'ORCH',
          difficulty: 'legend',
          category: 'automation'  
        },
        {
          sys_id: 'leg6',
          question_text: 'Discovery and service mapping (4 letters)',
          answer: 'DISCO',
          difficulty: 'legend',
          category: 'itom'
        },
        {
          sys_id: 'leg7',
          question_text: 'Advanced scripting engine (7 letters)',
          answer: 'SCRIPTS',
          difficulty: 'legend',
          category: 'scripting'
        },
        {
          sys_id: 'leg8',
          question_text: 'Enterprise architecture (8 letters)',
          answer: 'ARCHTECH',
          difficulty: 'legend',
          category: 'architecture'
        }
      ],
      mythical: [
        {
          sys_id: 'myth1',
          question_text: 'Multi-instance management hub (5 letters)',
          answer: 'MULTI',
          difficulty: 'mythical',
          category: 'platform'
        },
        {
          sys_id: 'myth2',
          question_text: 'Advanced development framework (6 letters)',
          answer: 'DEVFRM',
          difficulty: 'mythical',
          category: 'development'
        },
        {
          sys_id: 'myth3',
          question_text: 'Enterprise security framework (6 letters)',
          answer: 'SECURE',
          difficulty: 'mythical',
          category: 'security'
        },
        {
          sys_id: 'myth4',
          question_text: 'Performance optimization engine (4 letters)',
          answer: 'PERF',
          difficulty: 'mythical',
          category: 'analytics'
        },
        {
          sys_id: 'myth5',
          question_text: 'Custom application patterns (7 letters)',
          answer: 'PATTERN',
          difficulty: 'mythical',
          category: 'development'
        },
        {
          sys_id: 'myth6',
          question_text: 'Advanced AI/ML integration (5 letters)',
          answer: 'AIML',
          difficulty: 'mythical',
          category: 'analytics'
        },
        {
          sys_id: 'myth7',
          question_text: 'Cloud native architecture (5 letters)',
          answer: 'CLOUD',
          difficulty: 'mythical',
          category: 'architecture'
        },
        {
          sys_id: 'myth8',
          question_text: 'Master level platform expertise (6 letters)',
          answer: 'MASTER',
          difficulty: 'mythical',
          category: 'platform'
        }
      ]
    };

    return questionPool;
  }

  getQuestionsForLevel(level) {
    const questionPool = this.getSampleQuestions();
    const difficulty = this.getDifficultyForLevel(level, true); // Include random boost
    
    console.log(`Getting questions for Level ${level}, Difficulty: ${difficulty}`);
    
    const difficultyQuestions = questionPool[difficulty] || questionPool['easy'];
    
    // Shuffle and return questions for the difficulty
    return this.shuffleArray([...difficultyQuestions]);
  }

  // Generate crossword for specific level (difficulty stays same for same level)
  generateCrosswordGrid(level = 1) {
    console.log('=== GENERATING CROSSWORD FOR LEVEL', level, '===');
    
    const questions = this.getQuestionsForLevel(level);
    const difficulty = this.getDifficultyForLevel(level, true);
    
    const gridSize = 12;
    const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
    const clueMap = { across: [], down: [] };
    
    // Use first 6 questions, ensuring variety in word lengths
    const shortWords = questions.filter(q => q.answer.length <= 4);
    const longWords = questions.filter(q => q.answer.length > 4);
    
    // Mix of words for layout
    const selectedWords = [
      ...shortWords.slice(0, 4),
      ...longWords.slice(0, 2)
    ].slice(0, 6);
    
    // Ensure we have enough words
    while (selectedWords.length < 6 && questions.length > selectedWords.length) {
      selectedWords.push(questions[selectedWords.length]);
    }
    
    // SIMPLE LAYOUT - All words completely separate (no overlapping cells)
    const separateWords = [
      // ACROSS WORDS (completely separate rows)
      {
        question: selectedWords[0] || questions[0],
        direction: 'across',
        row: 2,
        col: 1,
        number: 1
      },
      {
        question: selectedWords[1] || questions[1],
        direction: 'across',
        row: 4,
        col: 1,
        number: 3
      },
      {
        question: selectedWords[2] || questions[2],
        direction: 'across',
        row: 6,
        col: 1,
        number: 5
      },
      
      // DOWN WORDS (completely separate columns) 
      {
        question: selectedWords[3] || questions[3],
        direction: 'down',
        row: 8,
        col: 6,
        number: 2
      },
      {
        question: selectedWords[4] || questions[4],
        direction: 'down', 
        row: 8,
        col: 8,
        number: 4
      },
      {
        question: selectedWords[5] || questions[5],
        direction: 'down',
        row: 8,
        col: 10,
        number: 6
      }
    ];
    
    // Place each word in completely separate areas
    separateWords.forEach((wordInfo) => {
      if (!wordInfo.question) return;
      
      const clueData = {
        number: wordInfo.number,
        text: wordInfo.question.question_text,
        answer: wordInfo.question.answer,
        direction: wordInfo.direction,
        length: wordInfo.question.answer.length,
        startRow: wordInfo.row,
        startCol: wordInfo.col,
        difficulty: wordInfo.question.difficulty
      };

      // Place word markers in grid (no overlaps possible)
      if (wordInfo.direction === 'across') {
        if (wordInfo.row < gridSize && wordInfo.col + wordInfo.question.answer.length <= gridSize) {
          for (let i = 0; i < wordInfo.question.answer.length; i++) {
            grid[wordInfo.row][wordInfo.col + i] = '_';
          }
          clueMap.across.push(clueData);
        }
      } else {
        if (wordInfo.col < gridSize && wordInfo.row + wordInfo.question.answer.length <= gridSize) {
          for (let i = 0; i < wordInfo.question.answer.length; i++) {
            grid[wordInfo.row + i][wordInfo.col] = '_';
          }
          clueMap.down.push(clueData);
        }
      }
    });

    // Sort clues by number
    clueMap.across.sort((a, b) => a.number - b.number);
    clueMap.down.sort((a, b) => a.number - b.number);

    console.log(`Generated Level ${level} crossword (${difficulty} difficulty):`, {
      across: clueMap.across.length,
      down: clueMap.down.length,
      difficulty
    });

    return {
      grid,
      clues: clueMap,
      gridSize,
      difficulty,
      level
    };
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  validateAnswer(userAnswer, correctAnswer) {
    if (!userAnswer || !correctAnswer) return false;
    
    const normalizeAnswer = (answer) => {
      return answer.toString()
        .toUpperCase()
        .trim()
        .replace(/[^A-Z0-9]/g, '');
    };

    const normalized1 = normalizeAnswer(userAnswer);
    const normalized2 = normalizeAnswer(correctAnswer);
    
    return normalized1 === normalized2;
  }

  calculatePoints(difficulty, isCorrect, timeBonus = 0) {
    if (!isCorrect) return 0;

    const basePoints = {
      easy: 10,
      normal: 20,
      hard: 35,
      legend: 50,
      mythical: 75
    };

    return (basePoints[difficulty] || 10) + timeBonus;
  }

  calculateExperience(isCorrect, difficulty = 'easy') {
    if (!isCorrect) return 0;
    
    const xpValues = {
      easy: 2,
      normal: 3,
      hard: 5,
      legend: 7,
      mythical: 10
    };
    
    return xpValues[difficulty] || 2;
  }

  calculateCoins(points, streak = 0, levelUp = false) {
    let coins = Math.floor(points / 10) * 5;

    // Streak bonus
    if (streak >= 3) coins += 5;
    if (streak >= 5) coins += 10;
    if (streak >= 10) coins += 20;

    // Level up bonus
    if (levelUp) coins += 100; // Increased level up bonus

    return coins;
  }

  // Check if all crossword questions are answered correctly
  isGameComplete(userAnswers, crosswordClues) {
    if (!crosswordClues || !userAnswers) return false;
    
    const allClues = [...(crosswordClues.across || []), ...(crosswordClues.down || [])];
    
    for (const clue of allClues) {
      const wordKey = `${clue.number}-${clue.direction}`;
      const userAnswer = userAnswers[wordKey] || '';
      
      if (!this.validateAnswer(userAnswer, clue.answer)) {
        return false;
      }
    }
    
    return allClues.length > 0;
  }
}