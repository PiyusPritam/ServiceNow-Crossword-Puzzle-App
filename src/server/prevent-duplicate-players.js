import { GlideRecord, gs } from '@servicenow/glide'

export function preventDuplicatePlayer(current) {
    // Check if a player with the same name and order already exists in this session
    const existingPlayer = new GlideRecord('x_1599224_servicen_game_players');
    existingPlayer.addQuery('game_session', current.getValue('game_session'));
    existingPlayer.addQuery('player_name', current.getValue('player_name'));
    existingPlayer.addQuery('player_order', current.getValue('player_order'));
    existingPlayer.query();
    
    if (existingPlayer.hasNext()) {
        gs.addErrorMessage('A player with this name and order already exists in this game session');
        current.setAbortAction(true);
    }
}