import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { preventDuplicatePlayer } from '../../server/prevent-duplicate-players.js'

// Business rule to prevent duplicate players in the same game session
BusinessRule({
    $id: Now.ID['br_prevent_duplicate_players'],
    name: 'Prevent Duplicate Game Players',
    table: 'x_1599224_servicen_game_players',
    when: 'before',
    action: ['insert'],
    active: true,
    order: 100,
    script: preventDuplicatePlayer
})