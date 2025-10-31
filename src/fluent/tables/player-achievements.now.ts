import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, BooleanColumn, ReferenceColumn, DateTimeColumn } from '@servicenow/sdk/core'

export const x_1599224_servicen_player_achievements = Table({
    name: 'x_1599224_servicen_player_achievements',
    label: 'Player Achievements',
    schema: {
        player: ReferenceColumn({
            label: 'Player',
            referenceTable: 'x_1599224_servicen_game_players',
            mandatory: true
        }),
        achievement_type: StringColumn({
            label: 'Achievement Type',
            maxLength: 50,
            mandatory: true
        }),
        achievement_name: StringColumn({
            label: 'Achievement Name',
            maxLength: 100,
            mandatory: true
        }),
        description: StringColumn({
            label: 'Description',
            maxLength: 250
        }),
        earned_at: DateTimeColumn({
            label: 'Earned At',
            default: 'javascript:gs.nowDateTime()'
        }),
        points_awarded: IntegerColumn({
            label: 'Points Awarded',
            default: 0
        }),
        coins_awarded: IntegerColumn({
            label: 'Coins Awarded',
            default: 0
        }),
        is_rare: BooleanColumn({
            label: 'Is Rare Achievement',
            default: false
        })
    },
    allow_web_service_access: true,
    actions: ['create', 'read', 'update'],
    accessible_from: 'public',
    caller_access: 'tracking'
})