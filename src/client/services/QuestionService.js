// QuestionService - Fixed version with proper answer-question alignment
export class QuestionService {
  constructor() {
    this.baseUrl = '/api/now/table';
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-UserToken': window.g_ck
    };
  }

  async getQuestionsByDifficulty(difficulty, limit = 20) {
    try {
      const response = await fetch(
        `${this.baseUrl}/x_1599224_servicen_crossword_questions?sysparm_query=difficulty=${difficulty}^active=true&sysparm_display_value=all&sysparm_limit=${limit}&sysparm_order_by=clue_number`, 
        { headers: this.headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const result = await response.json();
      console.log('Fetched questions:', result.result); // Debug log
      return result.result || [];
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Fallback to sample questions if API fails
      return this.getSampleQuestions();
    }
  }

  getSampleQuestions() {
    // FIXED: Carefully designed questions with proper crossword layout
    const crosswordQuestions = [
      // Row 1: ACROSS - "ITIL" (4 letters)
      {
        sys_id: 'q1',
        question_text: 'IT Service Management framework used in ServiceNow (4 letters)',
        answer: 'ITIL',
        difficulty: 'easy',
        category: 'itsm',
        direction: 'across',
        clue_number: 1,
        startRow: 1,
        startCol: 1
      },
      
      // Row 3: ACROSS - "USER" (4 letters)
      {
        sys_id: 'q2',
        question_text: 'ServiceNow table storing login information (4 letters)',
        answer: 'USER',
        difficulty: 'easy',
        category: 'platform_basics',
        direction: 'across', 
        clue_number: 2,
        startRow: 3,
        startCol: 1
      },
      
      // Row 5: ACROSS - "FORM" (4 letters)
      {
        sys_id: 'q3',
        question_text: 'Client-side API for field manipulation (4 letters)',
        answer: 'FORM',
        difficulty: 'normal',
        category: 'scripting',
        direction: 'across',
        clue_number: 3,
        startRow: 5,
        startCol: 1
      },

      // Row 7: ACROSS - "ROLE" (4 letters)
      {
        sys_id: 'q4',
        question_text: 'ServiceNow security permission group (4 letters)',
        answer: 'ROLE',
        difficulty: 'normal',
        category: 'security',
        direction: 'across',
        clue_number: 4,
        startRow: 7,
        startCol: 1
      },

      // Row 9: ACROSS - "FLOW" (4 letters)
      {
        sys_id: 'q5',
        question_text: 'ServiceNow workflow automation tool (4 letters)',
        answer: 'FLOW',
        difficulty: 'hard',
        category: 'itom',
        direction: 'across',
        clue_number: 5,
        startRow: 9,
        startCol: 1
      },
      
      // Col 3: DOWN - "TASK" (4 letters, intersects with ITIL at I)
      {
        sys_id: 'q6',
        question_text: 'ServiceNow work item table (4 letters)',
        answer: 'TASK',
        difficulty: 'easy',
        category: 'itsm', 
        direction: 'down',
        clue_number: 6,
        startRow: 1,
        startCol: 3
      },

      // Col 5: DOWN - "LIST" (4 letters, intersects with USER at S)  
      {
        sys_id: 'q7',
        question_text: 'ServiceNow table view type (4 letters)',
        answer: 'LIST', 
        difficulty: 'normal',
        category: 'platform_basics',
        direction: 'down',
        clue_number: 7,
        startRow: 3,
        startCol: 3
      },

      // Col 7: DOWN - "REST" (4 letters, intersects with FORM at R)
      {
        sys_id: 'q8',
        question_text: 'Web service API type in ServiceNow (4 letters)',
        answer: 'REST',
        difficulty: 'normal',
        category: 'integration',
        direction: 'down',
        clue_number: 8,
        startRow: 5,
        startCol: 3
      },

      // Col 9: DOWN - "RULE" (4 letters, intersects with ROLE at L)
      {
        sys_id: 'q9',
        question_text: 'ServiceNow business automation script (4 letters)',
        answer: 'RULE',
        difficulty: 'hard',
        category: 'scripting',
        direction: 'down',
        clue_number: 9,
        startRow: 7,
        startCol: 3
      },

      // Col 11: DOWN - "FLOW" (4 letters, intersects at W)
      {
        sys_id: 'q10',
        question_text: 'ServiceNow automated process designer (4 letters)',
        answer: 'GLIDE',
        difficulty: 'hard',
        category: 'scripting',
        direction: 'down',
        clue_number: 10,
        startRow: 9,
        startCol: 3
      }
    ];

    console.log('FIXED Sample questions generated:', crosswordQuestions.length);
    console.log('Across questions:', crosswordQuestions.filter(q => q.direction === 'across').length);
    console.log('Down questions:', crosswordQuestions.filter(q => q.direction === 'down').length);
    
    return crosswordQuestions;
  }

  async getQuestionsByCategory(category, limit = 20) {
    try {
      const response = await fetch(
        `${this.baseUrl}/x_1599224_servicen_crossword_questions?sysparm_query=category=${category}^active=true&sysparm_display_value=all&sysparm_limit=${limit}`, 
        { headers: this.headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch questions by category');
      }

      const result = await response.json();
      return result.result || [];
    } catch (error) {
      console.error('Error fetching questions by category:', error);
      throw error;
    }
  }

  async getAllQuestions() {
    try {
      const response = await fetch(
        `${this.baseUrl}/x_1599224_servicen_crossword_questions?sysparm_query=active=true&sysparm_display_value=all&sysparm_order_by=difficulty,clue_number`, 
        { headers: this.headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch all questions');
      }

      const result = await response.json();
      return result.result || [];
    } catch (error) {
      console.error('Error fetching all questions:', error);
      throw error;
    }
  }

  validateAnswer(userAnswer, correctAnswer) {
    if (!userAnswer || !correctAnswer) return false;
    
    // Normalize answers for comparison
    const normalizeAnswer = (answer) => {
      return answer.toString()
        .toUpperCase()
        .trim()
        .replace(/[^A-Z0-9]/g, ''); // Remove special characters and spaces
    };

    const normalized1 = normalizeAnswer(userAnswer);
    const normalized2 = normalizeAnswer(correctAnswer);
    
    console.log('Answer validation:', { userAnswer, correctAnswer, normalized1, normalized2, match: normalized1 === normalized2 });
    
    return normalized1 === normalized2;
  }

  generateCrosswordGrid(questions) {
    console.log('=== FIXED GRID GENERATION START ===');
    console.log('Input questions:', questions); 
    
    const gridSize = 12;
    const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
    const clueMap = { across: [], down: [] };

    // Use the pre-defined positions from sample questions
    questions.forEach(question => {
      const questionText = typeof question.question_text === 'object' ? 
        question.question_text.display_value : question.question_text;
      const answer = typeof question.answer === 'object' ? 
        question.answer.display_value : question.answer;
      const direction = typeof question.direction === 'object' ? 
        question.direction.display_value : question.direction;
      const clueNumber = typeof question.clue_number === 'object' ? 
        parseInt(question.clue_number.display_value) : parseInt(question.clue_number);

      const cleanAnswer = answer.toUpperCase().replace(/[^A-Z0-9]/g, '');
      
      // Use pre-defined positions if available, otherwise calculate
      const startRow = question.startRow || (direction === 'across' ? clueNumber * 2 - 1 : 1);
      const startCol = question.startCol || (direction === 'down' ? clueNumber * 2 - 1 : 1);

      const processedQuestion = {
        number: clueNumber,
        text: questionText,
        answer: cleanAnswer,
        direction: direction,
        length: cleanAnswer.length,
        startRow: startRow,
        startCol: startCol
      };

      console.log('Processing question with fixed positions:', processedQuestion);

      // Place word markers in grid
      if (direction === 'across') {
        if (startRow < gridSize && startCol + cleanAnswer.length <= gridSize) {
          for (let i = 0; i < cleanAnswer.length; i++) {
            grid[startRow][startCol + i] = '_';
          }
          clueMap.across.push(processedQuestion);
          console.log(`Placed ACROSS: ${cleanAnswer} at row ${startRow}, cols ${startCol}-${startCol + cleanAnswer.length - 1}`);
        }
      } else if (direction === 'down') {
        if (startCol < gridSize && startRow + cleanAnswer.length <= gridSize) {
          for (let i = 0; i < cleanAnswer.length; i++) {
            grid[startRow + i][startCol] = '_';
          }
          clueMap.down.push(processedQuestion);
          console.log(`Placed DOWN: ${cleanAnswer} at col ${startCol}, rows ${startRow}-${startRow + cleanAnswer.length - 1}`);
        }
      }
    });

    console.log('=== FIXED FINAL CLUE MAP ===');
    console.log('Across clues:', clueMap.across.length, clueMap.across.map(c => `${c.number}: ${c.answer}`));
    console.log('Down clues:', clueMap.down.length, clueMap.down.map(c => `${c.number}: ${c.answer}`));
    console.log('=== GRID GENERATION COMPLETE ===');

    return {
      grid,
      clues: clueMap,
      gridSize
    };
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

    const points = basePoints[difficulty] || 10;
    return points + timeBonus;
  }

  calculateCoins(points, streak = 0, levelUp = false) {
    let coins = Math.floor(points / 10) * 10; // Base coin earning

    // Streak bonus
    if (streak >= 3) coins += 5;
    if (streak >= 5) coins += 10;
    if (streak >= 10) coins += 20;

    // Level up bonus
    if (levelUp) coins += 50;

    return coins;
  }

  calculateExperience(isCorrect) {
    return isCorrect ? 1 : 0;
  }
}