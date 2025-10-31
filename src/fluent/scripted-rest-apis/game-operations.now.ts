import '@servicenow/sdk/global'
import { RestApi } from '@servicenow/sdk/core'
import { handleGameOperations } from '../../server/rest-handlers/game-operations.js'

export const gameOperationsAPI = RestApi({
    $id: Now.ID['game-operations-api'],
    name: 'Crossword Game Operations API',
    service_id: 'crossword_game_ops',
    active: true,
    short_description: 'API for real-time crossword game operations',
    routes: [
        {
            $id: Now.ID['game-operations-route'],
            name: 'Game Operations',
            path: '/{operation}',
            method: 'GET',
            script: handleGameOperations,
            active: true,
            authorization: true,
            authentication: true
        },
        {
            $id: Now.ID['game-operations-post-route'],
            name: 'Game Operations POST',
            path: '/{operation}',
            method: 'POST',
            script: handleGameOperations,
            active: true,
            authorization: true,
            authentication: true
        },
        {
            $id: Now.ID['game-operations-patch-route'],
            name: 'Game Operations PATCH',
            path: '/{operation}',
            method: 'PATCH',
            script: handleGameOperations,
            active: true,
            authorization: true,
            authentication: true
        }
    ]
})