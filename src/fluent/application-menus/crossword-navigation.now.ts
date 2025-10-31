import '@servicenow/sdk/global'
import { ApplicationMenu, Record } from '@servicenow/sdk/core'

// Create the main application menu category
export const crosswordGameCategory = Record({
    $id: Now.ID['crossword-category'],
    table: 'sys_app_category',
    data: {
        name: 'crossword_games',
        style: 'border-color: #81B5A1; background-color: #F7F9FA; color: #293E40;'
    }
})

// Create the main application menu
export const crosswordGameMenu = ApplicationMenu({
    $id: Now.ID['crossword-game-menu'],
    title: 'ServiceNow Crossword Challenge',
    active: true,
    category: crosswordGameCategory,
    hint: 'Interactive multiplayer crossword puzzle game with ServiceNow questions',
    description: 'Play challenging crossword puzzles with ServiceNow-themed questions',
    order: 100
})

// Create the main game module (direct link to UI Page)
export const playGameModule = Record({
    $id: Now.ID['play-game-module'],
    table: 'sys_app_module',
    data: {
        title: 'Play Crossword Challenge',
        application: crosswordGameMenu.$id,
        link_type: 'DIRECT',
        query: 'x_1599224_servicen_crossword.do',
        hint: 'Start a new crossword game or continue playing',
        active: true,
        order: 100
    }
})

// Create a separator for administration
export const adminSeparator = Record({
    $id: Now.ID['admin-separator'],
    table: 'sys_app_module',
    data: {
        title: 'Administration',
        application: crosswordGameMenu.$id,
        link_type: 'SEPARATOR',
        active: true,
        order: 200
    }
})

// Create module for managing questions
export const questionsModule = Record({
    $id: Now.ID['questions-module'],
    table: 'sys_app_module',
    data: {
        title: 'Manage Questions',
        application: crosswordGameMenu.$id,
        link_type: 'LIST',
        name: 'x_1599224_servicen_crossword_questions',
        hint: 'Add, edit, or remove crossword questions',
        active: true,
        order: 210
    }
})

// Create module for viewing game sessions
export const gameSessionsModule = Record({
    $id: Now.ID['sessions-module'],
    table: 'sys_app_module',
    data: {
        title: 'Game Sessions',
        application: crosswordGameMenu.$id,
        link_type: 'LIST',
        name: 'x_1599224_servicen_game_sessions',
        hint: 'View and manage game sessions',
        active: true,
        order: 220
    }
})

// Create module for player statistics
export const playersModule = Record({
    $id: Now.ID['players-module'],
    table: 'sys_app_module',
    data: {
        title: 'Player Statistics',
        application: crosswordGameMenu.$id,
        link_type: 'LIST',
        name: 'x_1599224_servicen_game_players',
        hint: 'View player profiles and game statistics',
        active: true,
        order: 230
    }
})

// Create module for achievements
export const achievementsModule = Record({
    $id: Now.ID['achievements-module'],
    table: 'sys_app_module',
    data: {
        title: 'Player Achievements',
        application: crosswordGameMenu.$id,
        link_type: 'LIST',
        name: 'x_1599224_servicen_player_achievements',
        hint: 'View player achievements and rewards',
        active: true,
        order: 240
    }
})