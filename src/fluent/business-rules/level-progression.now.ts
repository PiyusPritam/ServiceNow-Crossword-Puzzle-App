import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { calculatePlayerLevelUp } from '../../server/level-progression.js'

export const levelProgressionRule = BusinessRule({
    $id: Now.ID['level-progression'],
    name: 'Player Level Progression',
    table: 'x_1599224_servicen_game_players',
    when: 'before',
    action: ['update'],
    script: calculatePlayerLevelUp,
    order: 100,
    active: true,
    condition: "current.experience_points.changes()"
})