import { RESTAPIRequest, RESTAPIResponse, GlideRecord, gs } from '@servicenow/glide';

export function handleGameOperations(request, response) {
    const method = request.getRequestMethod();
    const pathParams = request.getPathParameters();
    const operation = pathParams.operation;
    
    try {
        switch (method) {
            case 'GET':
                return handleGetOperation(operation, request, response);
            case 'POST':
                return handlePostOperation(operation, request, response);
            case 'PATCH':
                return handlePatchOperation(operation, request, response);
            default:
                response.setStatus(405);
                return { error: 'Method not allowed' };
        }
    } catch (error) {
        gs.error('GameAPI Error: ' + error.message);
        response.setStatus(500);
        return { error: 'Internal server error', details: error.message };
    }
}

function handleGetOperation(operation, request, response) {
    const params = request.getQueryParameters();
    
    switch (operation) {
        case 'session-status':
            return getSessionStatus(params.session_id);
        
        case 'leaderboard':
            return getLeaderboard(params.session_id);
        
        case 'next-questions':
            return getNextQuestions(params.difficulty, params.count || 5);
        
        default:
            response.setStatus(404);
            return { error: 'Operation not found' };
    }
}

function handlePostOperation(operation, request, response) {
    const body = request.getRequestBody();
    const data = JSON.parse(body);
    
    switch (operation) {
        case 'validate-answer':
            return validateAnswer(data);
        
        case 'end-turn':
            return endPlayerTurn(data);
        
        case 'use-powerup':
            return usePowerUp(data);
        
        default:
            response.setStatus(404);
            return { error: 'Operation not found' };
    }
}

function handlePatchOperation(operation, request, response) {
    const body = request.getRequestBody();
    const data = JSON.parse(body);
    
    switch (operation) {
        case 'update-score':
            return updatePlayerScore(data);
        
        default:
            response.setStatus(404);
            return { error: 'Operation not found' };
    }
}

function getSessionStatus(sessionId) {
    const session = new GlideRecord('x_1599224_servicen_game_sessions');
    if (!session.get(sessionId)) {
        return { error: 'Session not found' };
    }
    
    const players = new GlideRecord('x_1599224_servicen_game_players');
    players.addQuery('game_session', sessionId);
    players.orderBy('player_order');
    players.query();
    
    const playerList = [];
    while (players.next()) {
        playerList.push({
            sys_id: players.getUniqueValue(),
            player_name: players.getValue('player_name'),
            score: parseInt(players.getValue('score')),
            level: parseInt(players.getValue('level')),
            coins: parseInt(players.getValue('coins')),
            current_streak: parseInt(players.getValue('current_streak')),
            correct_answers: parseInt(players.getValue('correct_answers')),
            incorrect_answers: parseInt(players.getValue('incorrect_answers'))
        });
    }
    
    return {
        session: {
            sys_id: session.getUniqueValue(),
            status: session.getValue('status'),
            current_player_turn: parseInt(session.getValue('current_player_turn')),
            difficulty: session.getValue('difficulty')
        },
        players: playerList
    };
}

function getLeaderboard(sessionId) {
    const players = new GlideRecord('x_1599224_servicen_game_players');
    players.addQuery('game_session', sessionId);
    players.orderByDesc('score');
    players.orderByDesc('correct_answers');
    players.query();
    
    const leaderboard = [];
    let rank = 1;
    while (players.next()) {
        leaderboard.push({
            rank: rank++,
            player_name: players.getValue('player_name'),
            score: parseInt(players.getValue('score')),
            level: parseInt(players.getValue('level')),
            correct_answers: parseInt(players.getValue('correct_answers')),
            current_streak: parseInt(players.getValue('current_streak'))
        });
    }
    
    return { leaderboard };
}

function validateAnswer(data) {
    const { questionId, userAnswer, playerId, sessionId } = data;
    
    // Get the correct answer
    const question = new GlideRecord('x_1599224_servicen_crossword_questions');
    if (!question.get(questionId)) {
        return { error: 'Question not found' };
    }
    
    const correctAnswer = question.getValue('answer');
    const difficulty = question.getValue('difficulty');
    
    // Normalize answers for comparison
    const normalize = (answer) => answer.toString().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const isCorrect = normalize(userAnswer) === normalize(correctAnswer);
    
    // Calculate points and rewards
    const basePoints = {
        easy: 10, normal: 20, hard: 35, legend: 50, mythical: 75
    };
    
    const points = isCorrect ? (basePoints[difficulty] || 10) : 0;
    const experience = isCorrect ? 1 : 0;
    const coins = isCorrect ? Math.floor(points / 10) * 10 : 0;
    
    // Record the move
    const move = new GlideRecord('x_1599224_servicen_game_moves');
    move.initialize();
    move.setValue('game_session', sessionId);
    move.setValue('player', playerId);
    move.setValue('question', questionId);
    move.setValue('submitted_answer', userAnswer);
    move.setValue('is_correct', isCorrect);
    move.setValue('points_earned', points);
    move.setValue('coins_earned', coins);
    move.setValue('experience_earned', experience);
    
    // Get move number
    const moveCount = new GlideRecord('x_1599224_servicen_game_moves');
    moveCount.addQuery('game_session', sessionId);
    moveCount.query();
    move.setValue('move_number', moveCount.getRowCount() + 1);
    
    move.insert();
    
    return {
        isCorrect,
        points,
        coins,
        experience,
        correctAnswer: correctAnswer,
        moveId: move.getUniqueValue()
    };
}

function endPlayerTurn(data) {
    const { sessionId, nextPlayerId } = data;
    
    const session = new GlideRecord('x_1599224_servicen_game_sessions');
    if (!session.get(sessionId)) {
        return { error: 'Session not found' };
    }
    
    // Get next player order
    const nextPlayer = new GlideRecord('x_1599224_servicen_game_players');
    if (nextPlayer.get(nextPlayerId)) {
        session.setValue('current_player_turn', nextPlayer.getValue('player_order'));
        session.update();
        
        return {
            success: true,
            nextPlayer: {
                sys_id: nextPlayer.getUniqueValue(),
                player_name: nextPlayer.getValue('player_name'),
                player_order: parseInt(nextPlayer.getValue('player_order'))
            }
        };
    }
    
    return { error: 'Next player not found' };
}

function usePowerUp(data) {
    const { playerId, powerUpType, sessionId } = data;
    
    const powerUpCosts = {
        hint: 20,
        change_question: 30,
        retry: 40,
        reveal_letter: 25,
        skip_question: 35
    };
    
    const cost = powerUpCosts[powerUpType];
    if (!cost) {
        return { error: 'Invalid power-up type' };
    }
    
    const player = new GlideRecord('x_1599224_servicen_game_players');
    if (!player.get(playerId)) {
        return { error: 'Player not found' };
    }
    
    const currentCoins = parseInt(player.getValue('coins'));
    if (currentCoins < cost) {
        return { error: 'Insufficient coins', required: cost, available: currentCoins };
    }
    
    // Deduct coins
    player.setValue('coins', currentCoins - cost);
    player.update();
    
    return {
        success: true,
        powerUpType,
        costPaid: cost,
        remainingCoins: currentCoins - cost
    };
}

function getNextQuestions(difficulty, count) {
    const questions = new GlideRecord('x_1599224_servicen_crossword_questions');
    questions.addQuery('difficulty', difficulty);
    questions.addQuery('active', true);
    questions.orderBy('clue_number');
    questions.setLimit(count);
    questions.query();
    
    const questionList = [];
    while (questions.next()) {
        questionList.push({
            sys_id: questions.getUniqueValue(),
            question_text: questions.getValue('question_text'),
            answer: questions.getValue('answer'),
            difficulty: questions.getValue('difficulty'),
            category: questions.getValue('category'),
            clue_number: parseInt(questions.getValue('clue_number')),
            direction: questions.getValue('direction')
        });
    }
    
    return { questions: questionList };
}