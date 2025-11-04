import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    'achievements-module': {
                        table: 'sys_app_module'
                        id: 'e1eac3ff9c744aca8118707b3c8b41dc'
                    }
                    'admin-separator': {
                        table: 'sys_app_module'
                        id: '459bbc64b66d4f57ab181dcd1c9f15fd'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: 'c33ca34899ed40ea830ac3ff7e97cc2c'
                    }
                    'components/GameBoard.css': {
                        table: 'sys_ux_theme_asset'
                        id: 'c6d9553cbf624274975b8e7a10a6584e'
                    }
                    'crossword-category': {
                        table: 'sys_app_category'
                        id: '1706d159123244f78799d5886a9443e8'
                    }
                    'crossword-challenge': {
                        table: 'sys_ui_page'
                        id: 'e43982d64b284f9fa61f5b989a254429'
                    }
                    'crossword-game-menu': {
                        table: 'sys_app_application'
                        id: 'b4246fdeda224a1782dabe89ec47516c'
                    }
                    'game-operations-api': {
                        table: 'sys_ws_definition'
                        id: 'a49c17b3ad9344ab8f85b065a0736faf'
                    }
                    'game-operations-patch-route': {
                        table: 'sys_ws_operation'
                        id: '567158e3914f4520a2b6eddf574d43bd'
                    }
                    'game-operations-post-route': {
                        table: 'sys_ws_operation'
                        id: 'b1a4e572afde4f28a0f210b8bd417555'
                    }
                    'game-operations-route': {
                        table: 'sys_ws_operation'
                        id: 'd7d61b04ff7c4180adc9a75342a79986'
                    }
                    'level-progression': {
                        table: 'sys_script'
                        id: '5978c942572840f0b6dc4e69d8b33b9e'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '47f5fd1c478a4fedbe782028d05cfe4c'
                    }
                    'play-game-module': {
                        table: 'sys_app_module'
                        id: 'e9fd51c7295e4521b5836ac9c38ee25b'
                    }
                    'players-module': {
                        table: 'sys_app_module'
                        id: '5d40961f06e04c268a8401aef5da7db9'
                    }
                    q1: {
                        table: 'x_1599224_servicen_crossword_questions'
                        id: 'cc30fe4e72d4433abe631049948ba90a'
                    }
                    q10: {
                        table: 'x_1599224_servicen_crossword_questions'
                        id: '7812cb1cdf23483386a03664b266e417'
                    }
                    q2: {
                        table: 'x_1599224_servicen_crossword_questions'
                        id: '06c4ea173b2b434394bb9c2b5587dfc4'
                    }
                    q3: {
                        table: 'x_1599224_servicen_crossword_questions'
                        id: '94c5538546814371afe649c8d0c9af2b'
                    }
                    q4: {
                        table: 'x_1599224_servicen_crossword_questions'
                        id: '4dea9b84d7a64521a9a31efa08f2a6d5'
                    }
                    q5: {
                        table: 'x_1599224_servicen_crossword_questions'
                        id: '5e5fc6e81e754f5fa67394c5f93c45c7'
                    }
                    q6: {
                        table: 'x_1599224_servicen_crossword_questions'
                        id: 'a6eecc428e6d43729a50dd69cef850fa'
                    }
                    q7: {
                        table: 'x_1599224_servicen_crossword_questions'
                        id: 'ac71dd651ec5488a8a3ea463a106e7bd'
                    }
                    q8: {
                        table: 'x_1599224_servicen_crossword_questions'
                        id: 'ef272afb182748ed810829fc8a813d89'
                    }
                    q9: {
                        table: 'x_1599224_servicen_crossword_questions'
                        id: '644117fbe1d644258c5f235fec5b2cb7'
                    }
                    'questions-module': {
                        table: 'sys_app_module'
                        id: '6e730ed561294445a60a4005592f56a5'
                    }
                    'sessions-module': {
                        table: 'sys_app_module'
                        id: '4b64152a7c42434baa061d9790bb66f4'
                    }
                    'src_server_level-progression_js': {
                        table: 'sys_module'
                        id: 'a491635dfac4437d9a4bcd2853b8b148'
                    }
                    'src_server_rest-handlers_game-operations_js': {
                        table: 'sys_module'
                        id: 'f7981afc7924431e8d4627669bebc461'
                    }
                    'x_1599224_servicen/main': {
                        table: 'sys_ux_lib_asset'
                        id: 'f9038572a80e47e1811a1920d762085a'
                    }
                    'x_1599224_servicen/main.js.map': {
                        table: 'sys_ux_lib_asset'
                        id: 'ddbe952a7a724084b4fe8dc098e546f6'
                    }
                }
                composite: [
                    {
                        table: 'sys_dictionary'
                        id: '01e017da8df94891878620f32602fb99'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'started_at'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '031d5a4355f6453aa270633c64be2b1e'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                            element: 'coins_awarded'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '03ed3126e3a64ddab39ea639fdc39438'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'questions_per_player'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '05256d3f9219453c838fa5bf6ef5c39e'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0c8b45c45fff46779c51cb16982cf0f5'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'joined_at'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1091d41daf2b4788964eda567e7b23a3'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '11d384d1c2ab4f118a0c2f53b1dc33f9'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'coins'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '188b6a625fef4b11985d646a96b2aa9d'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'started_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1911bd28adfc452a8c739a7557d1c756'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'points_earned'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '196ccb010f664a0595b79433fd2c3bb6'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'experience_earned'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1c838a4c760a484d8e6ec0dbc7aad748'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'difficulty'
                            value: 'legend'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1d21fb676c1943a3b4490a927793936a'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'score'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1f736c83f9744605a9e11b0aa39a22f4'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'game_session'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1fbe802fd6ac439aaf6ec7d9622a5170'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'question_text'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '24d36b2c386f410a9ccbaff8332649a0'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'active'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '26ec4b77721e4586b521c80223e2cd58'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'player_name'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '27e483ad0f20484aabbdef299fe04983'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2892fe7971f240a28629b30756ad58df'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                            element: 'is_rare'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '28b01ca0d11949b788ceec05635a8612'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'grid_position'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '28c628dfdcb742d4bb022c84f36fe350'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '29208a1dd2624c3e881c310f26c2e9b6'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'avatar'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '29c6d74e1c604bcfa573bae93d20e5e2'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2a6f6139cdfb4a9ca5f5b6f910218452'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'direction'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2b6fa55df4674914aa41fcb890e5d3a6'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                            element: 'earned_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2c2acd35b08b4c12be7df50aaf229010'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'experience_points'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2cc92cd622364f42a5d7c71f09dfa403'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'category'
                            value: 'itsm'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2e8fc8b8662a4829a3f7dff44dfc81a7'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                            element: 'points_awarded'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2f819003554e461782498280e2df57d8'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'questions_per_player'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2f9c059c221142d58f8486cf0c0f86bd'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'game_session'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '305a248e63b548caaf9d60663e4126af'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                            element: 'earned_at'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3163381fd2f44877827bee9833fb5a41'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'category'
                            value: 'itbm'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3249c80726c04d90b74b14bb7062de12'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'category'
                            value: 'scripting'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3366b24b952f445c8b8309859ae0e33f'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                            element: 'player'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '33e9e1ea10734f7ba197162c817c2435'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                            element: 'achievement_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '35dfc1ae5c5b4d738c9e80c89a31723b'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                            element: 'achievement_name'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '376682c9a6a84bde9f12cc536f12e59f'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'num_players'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3948aa6051ad4e328e5d556f52cc84dd'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'experience_earned'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3a3744f5c65b4ac5830433696d260946'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3b77bdda232d4468a08eb2c6496a3b6d'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'difficulty'
                            value: 'easy'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3fa60e4e6e3e423ab44279f08442d0db'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'category'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3fdd68195e364ceb9abbf95b2769dc55'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'submitted_at'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4031dbcd2867451a946602d8db1affe4'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'answer'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '41ea23568a544318ab0e6cb1724d87d0'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                            element: 'coins_awarded'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '42046eceda0d46909b0585968858b3cf'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '424316b3fcad4b3bab37f5a2b850e30a'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'category'
                            value: 'security'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '433ff5d47c7344ff845ac576bfedf9aa'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'correct_answers'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4398ce48cd634c178354e98b48000ed0'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'difficulty'
                            value: 'legend'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4400a81bd1ea438f9f76a91f6d3a6087'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'experience_points'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '48d3b54315534652bf261b933db51185'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'created_by'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '495cfd0379fe42989ba66dd8abeb6d4b'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'question_text'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4aa1eb04e4e9475a9829e6392f885a5b'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'score'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4cedb6e460644097a7be3340152df4f2'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'question'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4f5a0e164b304b40baf4f9f509094b17'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'difficulty'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '527c36471e2843e7b282a522c6eb5b33'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'best_streak'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '54bbd27f67fa40f7bb7449b9b345d194'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'category'
                            value: 'integration'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '55ae419a14584ae2bd447c93682acc49'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'current_player_turn'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '59b84535c80a4ae7b27cd78d4cb99134'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'current_player_turn'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5ae86be4b37149288bf73368e8d31e20'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'category'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5dfeb323f7234057844da7f16a2f5e06'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                            element: 'is_rare'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5f2b036cb1124b84adf2148c5a3a4e09'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                            element: 'points_awarded'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '65cb3eda813342cea61c75a18054c28b'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'submitted_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '66434181ebcf4718b10d3add10a34beb'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'category'
                            value: 'csm'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6924f4e50bc54990b75ccdaac0522d51'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'grid_data'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '6a6224e277194d69a85de20e63204c04'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'category'
                            value: 'itom'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6af611967fdc4c7998d199c482491501'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'session_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6c52815178814674beb8b14b75cab9e5'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'player_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '6f02faf6d09c4c4eb1770fa185eb4ec2'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7075a662eeed4405a7c9ab3611ca6ff9'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'level'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '71c24d687ed74adf9e6f7f6a6d137cda'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'user'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '73bdb0f3590441e58652f06e6300612f'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'current_streak'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '75399d66005843e4b1de5269934fd996'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'difficulty'
                            value: 'hard'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7920dd94d009454eb73533be9713e468'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'difficulty'
                            value: 'mythical'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7a1f75d15eda40358111153589453788'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'direction'
                            value: 'down'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7b4e9e5c0cf44e2fadbbc66c0c10edd7'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'answer'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7bb8c170963b4270990106bfa77cae00'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'winner'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '7cc221ccf4214556a30bbff839dd2221'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7e4269d92dcb492a9559ce3928efcfc1'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'status'
                            value: 'setup'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7e7300371876406e9d28e45a5ffe3db3'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'time_taken_seconds'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '834ed7fa5af14fa98a5539dbb2c7dac8'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'difficulty'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '840ae2ec79974a68a3e996713f643608'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                            element: 'player'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '872fac80d50b4398ad4b0c14bba761d0'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'best_streak'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8a1d0786f7164c2eb93f84b3bc4fe474'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'difficulty'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '8c564491ae3740b886cc427007c4b14b'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'difficulty'
                            value: 'normal'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8f25df6e6ee042ce8cb0fc5e202c1ee7'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9213c8106c3e4a8c8012ceaa746299ab'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'created_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9377e63f5c2c4e06926cdbd640a710af'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'player_order'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '93f7ee7ce5c641d5a8ef45d8a1c1555b'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'difficulty'
                            value: 'normal'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '970610c3130c45a8a654f24af6e945c8'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'joined_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '97a56befa6ab42508c3aa8bba503905c'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                            element: 'achievement_type'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '97ef81726c33482e88db96440619294c'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'difficulty'
                            value: 'hard'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '97f91da3a0a043c88a32df7868d4ad6d'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'points_earned'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '999a7a536b034472973ef796174022fc'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'session_name'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '99d50fab54b542afa0d00b496d6322aa'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'difficulty'
                            value: 'easy'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9b05261670aa43d58039f97ee85f9e38'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'is_active'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9b07342526644576b29b78ddcc42a409'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'coins_earned'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9b7314e6e5a342bf92d88b0da7d5c11d'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'is_active'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a0a23c7599984522866d4e814b9622c7'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'submitted_answer'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a0cd67ad25e143f8b4eec3e327f0da2e'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'question'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a196660f911e401f8770c65f9959a049'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'current_streak'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a20f0a1ec8bd4a5b90cf399b373c6e63'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'grid_position'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a4deca69aebe48d1830fb67c185866e2'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'category'
                            value: 'hr'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a69db1aba1414260b14e05a1b84aa85f'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a7be38f4abee4675aecbdc17c3eb2dbf'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a83e47fc8b3f4cfdaf5306138b126e2a'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'completed_at'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'adf6dedb997949b0bb22f6249caaa81b'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'af11e0fc73d247a1a62b70a7d511181a'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'difficulty'
                            value: 'mythical'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'af2966f8331b429eab3ae00b30db8253'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'game_session'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b12b1418ae3d437c95e5e60d7ddf84fe'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'game_session'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b20271e271ea42e495bf3d1878b330b7'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'status'
                            value: 'cancelled'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b6c6cf2304c24ff9867b7e6def5c0b12'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'num_players'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bb0091bc17014c3ca8e5758e13cfd570'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'move_number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'c0d4063ad65746ac8548ef790a48a1a4'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c36b99e428934f60b44a5cecdd1b754a'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c3788fa0320e41d3b20ad7cdb45626fb'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c5f06fc387124977a4e0639be672e838'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'move_number'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c632e8dc217a4496bae2fa3a1d44e35b'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                            element: 'achievement_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c6f88dfef1c34249811f4e3482b1abca'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'difficulty'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c72a76b338b54afbba89509c5056619f'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'avatar'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c736a660dfdb4be69d2c1a41d1acccd2'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'player_order'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cb54c8b586714ca99f124d1c735f1f41'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ce51cb4541e64ffd875933685811161a'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'clue_number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ce56112da0a64ccaac33bb655a85787e'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'time_taken_seconds'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'ce5937084241422c93844ee2e6341831'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd3618c486eb144a583ed63d603185fda'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'incorrect_answers'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd8d6f98cdb42472fba83100fa0d44d15'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'status'
                            value: 'active'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'dd0c40e8954f4d54a98be06b240ecc1f'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ddb1968bc91c45ff80eccc7dce644af4'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'submitted_answer'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'de0ae5b766c54dc0b4bb833277b8b6f0'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'df2d7f40e17448fb9254e72f7cf97b2c'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'player'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'dfb88a7888c14b3c8ff9d3e3590da3d4'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'winner'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e16e3d43319b421a9f6000935857af02'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'category'
                            value: 'platform_basics'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'e1869c172e3e46a1b4fe7b37d1041876'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e383169d8ca94f49ac18432ec3d8aa72'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e3bd50c6fc1544efb65cd0f0c36956e0'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'status'
                            value: 'completed'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e4e60b4e841f4524872b574ec73470ed'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'clue_number'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e866717fffdf4bcd8b40686b802e5bc3'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'incorrect_answers'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e875a4a6d22a4bb1ac1d33fa74161002'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'is_correct'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e9d06bc3d0d847359d15903191311849'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'completed_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ea685ce28d9f460a9ef774dde9ac9519'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'grid_data'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ecb6daf9b5ca4609be88a0545ffd8af0'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'coins'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ece04ebb6e644b53a850422e7c492280'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'direction'
                            value: 'across'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ed12abb4a5f543b089cdba19bd87f22b'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'active'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ee3cccda249743e885f2a315d95ee6cc'
                        key: {
                            name: 'x_1599224_servicen_crossword_questions'
                            element: 'direction'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ef3320efcca947b282ce04e276d27b96'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'correct_answers'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f2b066b7797349848c2a182920f026ee'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'player'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f8b0ec6c142a438c82b9c753a3e13b81'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'level'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f90ced959c8e4f8b957b3f7f0d37825d'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'user'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f9c5485aa9c54034bfd4c0ad20146194'
                        key: {
                            name: 'x_1599224_servicen_game_sessions'
                            element: 'status'
                            value: 'paused'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fa0caa923ad24fa09874116290c7711f'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'coins_earned'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'faf83b8760904ffcb82056bc3921d803'
                        key: {
                            name: 'x_1599224_servicen_game_players'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'fcdbd921e0ab4396abb8b15c3c6ce53c'
                        key: {
                            name: 'x_1599224_servicen_player_achievements'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ff64518d8d9f48219f16f11db45efda2'
                        key: {
                            name: 'x_1599224_servicen_game_moves'
                            element: 'is_correct'
                            language: 'en'
                        }
                    },
                ]
            }
        }
    }
}
