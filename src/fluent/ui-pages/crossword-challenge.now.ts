import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import crosswordPage from '../../client/index.html';

export const crossword_challenge_page = UiPage({
  $id: Now.ID['crossword-challenge'], 
  endpoint: 'x_1599224_servicen_crossword.do',
  description: 'ServiceNow Crossword Challenge - Interactive multiplayer crossword puzzle game',
  category: 'general',
  html: crosswordPage,
  direct: true
})