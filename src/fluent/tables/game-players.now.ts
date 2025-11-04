import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, BooleanColumn, ReferenceColumn, DateTimeColumn } from '@servicenow/sdk/core'

export const x_1599224_servicen_game_players = Table({
    name: 'x_1599224_servicen_game_players',
    label: 'Game Players',
    schema: {
        game_session: ReferenceColumn({
            label: 'Game Session',
            referenceTable: 'x_1599224_servicen_game_sessions',
            mandatory: true
        }),
        user: ReferenceColumn({
            label: 'User',
            referenceTable: 'sys_user',
            mandatory: true
        }),
        player_name: StringColumn({
            label: 'Player Name',
            maxLength: 100,
            mandatory: true
        }),
        avatar: StringColumn({
            label: 'Avatar',
            maxLength: 200
        }),
        avatar_icon: StringColumn({
            label: 'Avatar Icon',
            maxLength: 10
        }),
        score: IntegerColumn({
            label: 'Score',
            default: 0
        }),
        level: IntegerColumn({
            label: 'Level',
            default: 1
        }),
        experience_points: IntegerColumn({
            label: 'Experience Points',
            default: 0
        }),
        coins: IntegerColumn({
            label: 'Coins',
            default: 0
        }),
        correct_answers: IntegerColumn({
            label: 'Correct Answers',
            default: 0
        }),
        incorrect_answers: IntegerColumn({
            label: 'Incorrect Answers',
            default: 0
        }),
        current_streak: IntegerColumn({
            label: 'Current Streak',
            default: 0
        }),
        best_streak: IntegerColumn({
            label: 'Best Streak',
            default: 0
        }),
        is_active: BooleanColumn({
            label: 'Is Active',
            default: true
        }),
        joined_at: DateTimeColumn({
            label: 'Joined At',
            default: 'javascript:gs.nowDateTime()'
        }),
        player_order: IntegerColumn({
            label: 'Player Order',
            mandatory: true
        })
    },
    allow_web_service_access: true,
    actions: ['create', 'read', 'update', 'delete'],
    accessible_from: 'public',
    caller_access: 'tracking'
})