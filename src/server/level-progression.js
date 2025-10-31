import { gs, GlideRecord } from '@servicenow/glide';

export function calculatePlayerLevelUp(current, previous) {
    // Only process if experience points changed
    const newExp = parseInt(current.getValue('experience_points'));
    const oldExp = previous ? parseInt(previous.getValue('experience_points')) : 0;
    
    if (newExp <= oldExp) return;
    
    const currentLevel = parseInt(current.getValue('level'));
    
    // Level progression formula: Level = floor(sqrt(experience_points / 10)) + 1
    const newLevel = Math.floor(Math.sqrt(newExp / 10)) + 1;
    
    if (newLevel > currentLevel) {
        // Level up!
        current.setValue('level', newLevel);
        
        // Award level up bonus coins
        const currentCoins = parseInt(current.getValue('coins'));
        const bonusCoins = 50;
        current.setValue('coins', currentCoins + bonusCoins);
        
        // Log the level up
        gs.addInfoMessage(`🎉 Level Up! ${current.getValue('player_name')} reached Level ${newLevel}! +${bonusCoins} bonus coins!`);
        
        // You could add more level-up rewards here
        if (newLevel === 5) {
            gs.addInfoMessage('🏆 Achievement Unlocked: Crossword Apprentice!');
        } else if (newLevel === 10) {
            gs.addInfoMessage('🏆 Achievement Unlocked: ServiceNow Expert!');
        } else if (newLevel === 20) {
            gs.addInfoMessage('🏆 Achievement Unlocked: Platform Master!');
        }
    }
}