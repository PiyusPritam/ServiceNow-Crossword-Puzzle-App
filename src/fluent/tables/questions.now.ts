import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, ChoiceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_1599224_servicen_crossword_questions = Table({
    name: 'x_1599224_servicen_crossword_questions',
    label: 'Crossword Questions',
    schema: {
        question_text: StringColumn({ 
            label: 'Question Text', 
            maxLength: 500,
            mandatory: true 
        }),
        answer: StringColumn({ 
            label: 'Answer', 
            maxLength: 100,
            mandatory: true 
        }),
        difficulty: ChoiceColumn({
            label: 'Difficulty Level',
            mandatory: true,
            choices: {
                easy: { label: 'Easy', sequence: 0 },
                normal: { label: 'Normal', sequence: 1 },
                hard: { label: 'Hard', sequence: 2 },
                legend: { label: 'Legend', sequence: 3 },
                mythical: { label: 'Mythical', sequence: 4 }
            },
            dropdown: 'dropdown_with_none'
        }),
        category: ChoiceColumn({
            label: 'Category',
            mandatory: true,
            choices: {
                platform_basics: { label: 'Platform Basics', sequence: 0 },
                itsm: { label: 'ITSM', sequence: 1 },
                itom: { label: 'ITOM', sequence: 2 },
                itbm: { label: 'ITBM', sequence: 3 },
                csm: { label: 'CSM', sequence: 4 },
                hr: { label: 'HR', sequence: 5 },
                security: { label: 'Security', sequence: 6 },
                scripting: { label: 'Scripting', sequence: 7 },
                integration: { label: 'Integration', sequence: 8 }
            },
            dropdown: 'dropdown_with_none'
        }),
        grid_position: StringColumn({ 
            label: 'Grid Position', 
            maxLength: 20,
            mandatory: true
        }),
        direction: ChoiceColumn({
            label: 'Direction',
            mandatory: true,
            choices: {
                across: { label: 'Across', sequence: 0 },
                down: { label: 'Down', sequence: 1 }
            },
            dropdown: 'dropdown_with_none'
        }),
        clue_number: IntegerColumn({
            label: 'Clue Number',
            mandatory: true
        }),
        active: BooleanColumn({
            label: 'Active',
            default: true
        })
    },
    allow_web_service_access: true,
    actions: ['create', 'read', 'update', 'delete'],
    accessible_from: 'public',
    caller_access: 'tracking'
})