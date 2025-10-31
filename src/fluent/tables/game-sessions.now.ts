import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, ChoiceColumn, DateTimeColumn, ReferenceColumn } from '@servicenow/sdk/core'

export const x_1599224_servicen_game_sessions = Table({
    name: 'x_1599224_servicen_game_sessions',
    label: 'Game Sessions',
    schema: {
        session_name: StringColumn({
            label: 'Session Name',
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
        num_players: IntegerColumn({
            label: 'Number of Players',
            mandatory: true,
            min: 1,
            max: 8
        }),
        questions_per_player: IntegerColumn({
            label: 'Questions Per Player',
            mandatory: true,
            min: 1,
            max: 50
        }),
        status: ChoiceColumn({
            label: 'Status',
            mandatory: true,
            choices: {
                setup: { label: 'Setup', sequence: 0 },
                active: { label: 'Active', sequence: 1 },
                paused: { label: 'Paused', sequence: 2 },
                completed: { label: 'Completed', sequence: 3 },
                cancelled: { label: 'Cancelled', sequence: 4 }
            },
            dropdown: 'dropdown_with_none',
            default: 'setup'
        }),
        current_player_turn: IntegerColumn({
            label: 'Current Player Turn',
            default: 0
        }),
        created_by: ReferenceColumn({
            label: 'Created By',
            referenceTable: 'sys_user'
        }),
        started_at: DateTimeColumn({
            label: 'Started At'
        }),
        completed_at: DateTimeColumn({
            label: 'Completed At'
        }),
        winner: ReferenceColumn({
            label: 'Winner',
            referenceTable: 'sys_user'
        }),
        grid_data: StringColumn({
            label: 'Grid Data',
            maxLength: 4000
        })
    },
    allow_web_service_access: true,
    actions: ['create', 'read', 'update', 'delete'],
    accessible_from: 'public',
    caller_access: 'tracking'
})