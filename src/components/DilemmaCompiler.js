import DilemmaList from '../../converted-dilemma-list.json'

var DilemmaCompiler = [
   function () {
      return DilemmaList['T-WELCOME']
   },
   function () {
      return DilemmaList['T-FOUNDER']
   },
   function () {
      return DilemmaList['T-LOCATION']
   },
   function () {
      return DilemmaList['T-FOCUS']
   },
   function (gameState) {
      if (gameState.techHub) {
         return DilemmaList['T-REC-TECH']
      } else {
         return DilemmaList['T-REC-OTHER']
      }
   },
   function () {
      return DilemmaList['T-PRIVACY']
   },
   function () {
      return DilemmaList['A-FUNDING']
   },
   function () {
      return DilemmaList['A-START']
   },
   function () {
      return DilemmaList['A-PATENT']
   },
   function () {
      return DilemmaList['A-NSL']
   },
   function () {
      return DilemmaList['A-COPYRIGHT']
   },
   function () {
      return DilemmaList['A-STATELAW']
   },
   function () {
      return DilemmaList['A-DEFAME']
   },
   function () {
      return DilemmaList['A-DISINFO']
   },
   function () {
      return DilemmaList['A-BACKDOOR']
   },
   function () {
      return DilemmaList['A-NETNEUTRALITY']
   },
   function () {
      return DilemmaList['A-FAIRUSE']
   },
   function () {
      return DilemmaList['A-TBD']
   },
   function () {
      return DilemmaList['C-FUNDING']
   },
   function () {
      return DilemmaList['C-START']
   },
   function () {
      return DilemmaList['C-EUREG']
   },
   function () {
      return DilemmaList['C-BREACH']
   },
   function () {
      return DilemmaList['C-DISINFO-2']
   },
   function () {
      return DilemmaList['C-TROLLS'] // TODO add conditional for C-HOLLYWOOD, C-HEALTHCARE
   },
   function () {
      return DilemmaList['C-INDIA-DATA'] // TODO add conditional for C-BRAZIL-TAKEDOWN
   },
   function () {
      return DilemmaList['C-SWISS-TAX'] // TODO add conditional for C-KOREA-TAX
   },
   function () {
      return DilemmaList['C-TBD']
   },
   function () {
      return DilemmaList['E-END']
   },
   // example dilemma
   // function () {
   //    return {
   //       "dilemmaPrompt": "The dilemma for this round is lorem ipsum... what do you do?",
   //       "dilemmaOptions": [
   //          {
   //             "optionText": "Do nothing",
   //             "optionToolTip": "I'm a tool tip!",
   //             "resultsText": "You lose... click back to choose a different option",
   //             "stateChange": {
   //                "capital": -100
   //             },
   //             "gameOver": true
   //          },
   //          {
   //             "optionText": "Do a little",
   //             "resultsText": "You've bought yourself a little time...",
   //             "stateChange": {
   //                "capital": -10,
   //                "users": -5
   //             },
   //             "addEvent": "New past event"

   //          },
   //          {
   //             "optionText": "Do a lot",
   //             "resultsText": "That was hard, hope it was worth it!",
   //             "stateChange": {
   //                "capital": -15,
   //                "users": 20,
   //                "focus": -1
   //             },
   //             "optionRequirements": {
   //                "capabilities": 20
   //             }
   //          },
   //          {
   //             "optionText": "Magically fix it",
   //             "optionRequirements": {
   //                "hasMagic": true
   //             }
   //          },
   //          {
   //             "optionText": "Invisible Option",
   //             "optionVisibility": {
   //                "noSuchState": true
   //             }
   //          }
   //       ],
   //       "dilemmaNote": "Here's an extra note, clarifying the dilemma..."
   //    }
   // },
   // // second example
   // function () {
   //    return {
   //       "dilemmaPrompt": "Do you want to spend time fundraising or hiring? This will matter for the next dilemma...",
   //       "dilemmaOptions": [
   //          {
   //             "optionText": "Fundraising",
   //             "resultsText": "You chose fundraising, the game will remember this...",
   //             "stateChange": {
   //                "capital": 15,
   //                "choseFundraising": true
   //             },
   //          },
   //          {
   //             "optionText": "Hiring",
   //             "resultsText": "You chose hiring, the game will remember this...",
   //             "stateChange": {
   //                "capabilities": 15,
   //                "choseHiring": true
   //             }
   //          }
   //       ]
   //    }
   // },
   // // third, with conditional logic
   // function (gameState) {
   //    if (gameState.choseFundraising) {
   //       return {
   //          "dilemmaPrompt": "You chose fundraising last round...",
   //          "dilemmaOptions": [
   //             {
   //                "optionText": "Option 1",
   //                "resultsText": "Results 1",
   //                "stateChange": {
   //                   "capital": 0,
   //                },
   //             },
   //             {
   //                "optionText": "Option 2",
   //                "resultsText": "Results 2",
   //                "stateChange": {
   //                   "capital": 0,
   //                },
   //             },
   //             {
   //                "optionText": "Visible because you chose fundraising",
   //                "resultsText": "Results for invisible choice",
   //                "optionVisibility": {
   //                   "choseFundraising": true,
   //                }
   //             }
   //          ]
   //       }
   //    } else {
   //       return {
   //          "dilemmaPrompt": "You chose hiring last round...",
   //          "dilemmaOptions": [
   //             {
   //                "optionText": "Option 1",
   //                "resultsText": "Results 1",
   //                "stateChange": {
   //                   "capital": 0,
   //                },
   //             },
   //             {
   //                "optionText": "Option 2",
   //                "resultsText": "Results 2",
   //                "stateChange": {
   //                   "capital": 0,
   //                },
   //             },
   //          ]
   //       }
   //    }
   // },
   // fourth, the end for now
   function () {
      return {
         "dilemmaPrompt": "That's all for now...",
      }
   },
   // // template
   // function () {
   //    return {
   //       "dilemmaPrompt": "Do you want to spend time fundraising or hiring? This will matter for the next dilemma...",
   //       "dilemmaOptions": [
   //          {
   //             "optionText": "This is a placeholder option",
   //             "resultsText": "This is the placeholder result of an option",
   //             "stateChange": {
   //                "capital": 15,
   //                "choseFundraising": true
   //             },
   //             "optionRequirements": {
   //                "hasMagic": true
   //             },
   //             "optionVisibility": {
   //                "noSuchState": true
   //             },
   //             "gameOver": true
   //          },
   //       ]
   //    }
   // },
]

export default DilemmaCompiler