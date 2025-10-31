import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, BooleanColumn, ReferenceColumn, DateTimeColumn } from '@servicenow/sdk/core'

export const x_1599224_servicen_game_moves = Table({
    name: 'x_1599224_servicen_game_moves',
    label: 'Game Moves',
    schema: {
        game_session: ReferenceColumn({
            label: 'Game Session',
            referenceTable: 'x_1599224_servicen_game_sessions',
            mandatory: true
        }),
        player: ReferenceColumn({
            label: 'Player',
            referenceTable: 'x_1599224_servicen_game_players',
            mandatory: true
        }),
        question: ReferenceColumn({
            label: 'Question',
            referenceTable: 'x_1599224_servicen_crossword_questions',
            mandatory: true
        }),
        submitted_answer: StringColumn({
            label: 'Submitted Answer',
            maxLength: 100,
            mandatory: true
        }),
        is_correct: BooleanColumn({
            label: 'Is Correct',
            mandatory: true
        }),
        points_earned: IntegerColumn({
            label: 'Points Earned',
            default: 0
        }),
        coins_earned: IntegerColumn({
            label: 'Coins Earned',
            default: 0
        }),
        experience_earned: IntegerColumn({
            label: 'Experience Earned',
            default: 0
        }),
        move_number: IntegerColumn({
            label: 'Move Number',
            mandatory: true
        }),
        submitted_at: DateTimeColumn({
            label: 'Submitted At',
            default: 'javascript:gs.nowDateTime()'
        }),
        time_taken_seconds: IntegerColumn({
            label: 'Time Taken (Seconds)',
            default: 0
        })
    },
    allow_web_service_access: true,
    actions: ['create', 'read', 'update', 'delete'],
    accessible_from: 'public',
    caller_access: 'tracking'
})