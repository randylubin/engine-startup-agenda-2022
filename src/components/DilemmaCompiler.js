import DilemmaList from '../../converted-dilemma-list.json'

var DilemmaCompiler = [
   function () {
      return DilemmaList['0.1']
   },
   function () {
      return DilemmaList['0.2']
   },
   // location
   function () {
      return DilemmaList['1']
   },
   // First focus
   function () {
      return DilemmaList['2']
   },
   // template
   function (gameState) {
      if (gameState.techHub) {
         return DilemmaList['3.1']
      } else {
         return DilemmaList['3.2']
      }
   },
   function () {
      return DilemmaList['4']
   },
   function () {
      return DilemmaList['5']
   },
   function () {
      return DilemmaList['6']
   },
   function () {
      return DilemmaList['7']
   },
   function () {
      return DilemmaList['8']
   },
   function () {
      return DilemmaList['9']
   },
   function () {
      return DilemmaList['10']
   },
   function () {
      return DilemmaList['11']
   },
   function () {
      return DilemmaList['12']
   },
   function () {
      return DilemmaList['13']
   },
   function () {
      return DilemmaList['14']
   },
   function () {
      return DilemmaList['15']
   },
   function () {
      return DilemmaList['16']
   },
   function () {
      return DilemmaList['18']
   },
   function () {
      return DilemmaList['19']
   },
   function () {
      return DilemmaList['20']
   },
   function () {
      return DilemmaList['22.1'] // TODO add conditional
   },
   function () {
      return DilemmaList['23.1'] // TODO add conditional
   },
   function () {
      return DilemmaList['24']
   },
   function () {
      return DilemmaList['25']
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
   // template
   function () {
      return {
         "dilemmaPrompt": "Do you want to spend time fundraising or hiring? This will matter for the next dilemma...",
         "dilemmaOptions": [
            {
               "optionText": "This is a placeholder option",
               "resultsText": "This is the placeholder result of an option",
               "stateChange": {
                  "capital": 15,
                  "choseFundraising": true
               },
               "optionRequirements": {
                  "hasMagic": true
               },
               "optionVisibility": {
                  "noSuchState": true
               },
               "gameOver": true
            },
         ]
      }
   },
]

export default DilemmaCompiler