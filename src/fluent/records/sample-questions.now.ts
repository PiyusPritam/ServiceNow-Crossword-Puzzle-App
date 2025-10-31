import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Easy difficulty questions
export const question1 = Record({
    $id: Now.ID['q1'],
    table: 'x_1599224_servicen_crossword_questions',
    data: {
        question_text: 'Popular IT Service Management framework used in ServiceNow',
        answer: 'ITIL',
        difficulty: 'easy',
        category: 'itsm',
        grid_position: '1,1',
        direction: 'across',
        clue_number: 1,
        active: true
    }
})

export const question2 = Record({
    $id: Now.ID['q2'],
    table: 'x_1599224_servicen_crossword_questions',
    data: {
        question_text: 'Request for a new service or change to existing service',
        answer: 'RITM',
        difficulty: 'easy',
        category: 'itsm',
        grid_position: '1,1',
        direction: 'down',
        clue_number: 2,
        active: true
    }
})

export const question3 = Record({
    $id: Now.ID['q3'],
    table: 'x_1599224_servicen_crossword_questions',
    data: {
        question_text: 'ServiceNow table that stores user information',
        answer: 'SYS_USER',
        difficulty: 'easy',
        category: 'platform_basics',
        grid_position: '3,1',
        direction: 'across',
        clue_number: 3,
        active: true
    }
})

export const question4 = Record({
    $id: Now.ID['q4'],
    table: 'x_1599224_servicen_crossword_questions',
    data: {
        question_text: 'What ACL stands for in ServiceNow security',
        answer: 'ACCESS_CONTROL_LIST',
        difficulty: 'normal',
        category: 'security',
        grid_position: '5,1',
        direction: 'across',
        clue_number: 4,
        active: true
    }
})

export const question5 = Record({
    $id: Now.ID['q5'],
    table: 'x_1599224_servicen_crossword_questions',
    data: {
        question_text: 'Server-side API for database operations in ServiceNow',
        answer: 'GLIDERECORD',
        difficulty: 'normal',
        category: 'scripting',
        grid_position: '2,3',
        direction: 'down',
        clue_number: 5,
        active: true
    }
})

export const question6 = Record({
    $id: Now.ID['q6'],
    table: 'x_1599224_servicen_crossword_questions',
    data: {
        question_text: 'Client-side API for form manipulation',
        answer: 'G_FORM',
        difficulty: 'normal',
        category: 'scripting',
        grid_position: '7,2',
        direction: 'across',
        clue_number: 6,
        active: true
    }
})

// Hard difficulty questions
export const question7 = Record({
    $id: Now.ID['q7'],
    table: 'x_1599224_servicen_crossword_questions',
    data: {
        question_text: 'ServiceNow workflow engine for automated processes',
        answer: 'FLOW_DESIGNER',
        difficulty: 'hard',
        category: 'itom',
        grid_position: '1,5',
        direction: 'across',
        clue_number: 7,
        active: true
    }
})

export const question8 = Record({
    $id: Now.ID['q8'],
    table: 'x_1599224_servicen_crossword_questions',
    data: {
        question_text: 'Advanced scripting language used in ServiceNow business rules',
        answer: 'JAVASCRIPT',
        difficulty: 'hard',
        category: 'scripting',
        grid_position: '4,7',
        direction: 'down',
        clue_number: 8,
        active: true
    }
})

// Legend difficulty questions
export const question9 = Record({
    $id: Now.ID['q9'],
    table: 'x_1599224_servicen_crossword_questions',
    data: {
        question_text: 'ServiceNow method for cross-scope access control',
        answer: 'SCRIPT_INCLUDE',
        difficulty: 'legend',
        category: 'integration',
        grid_position: '6,4',
        direction: 'across',
        clue_number: 9,
        active: true
    }
})

// Mythical difficulty questions
export const question10 = Record({
    $id: Now.ID['q10'],
    table: 'x_1599224_servicen_crossword_questions',
    data: {
        question_text: 'Advanced ServiceNow feature for real-time data synchronization',
        answer: 'TRANSFORM_MAP',
        difficulty: 'mythical',
        category: 'integration',
        grid_position: '8,6',
        direction: 'down',
        clue_number: 10,
        active: true
    }
})