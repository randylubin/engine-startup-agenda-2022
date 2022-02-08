import DilemmaList from '../../converted-dilemma-list.json'

var DilemmaCompiler = [
   { // Example dilemma with optional structure for extra flags
      compile: () => DilemmaList['T-WELCOME'],
      flags: ['hidden']
   },
   () => DilemmaList['T-FOUNDER'], // Creating the object with "compile" and "flags" is not required - just a function still works (see handler at bottom)
   () => DilemmaList['T-LOCATION'],
   () => DilemmaList['T-FOCUS'],
   () => DilemmaList['T-REC'],
   () => DilemmaList['T-BETA'],
   () => DilemmaList['T-PRIVACY'],
   (gameState) => gameState.badPrivacy==true?DilemmaList['T-BAD-SECURITY'] : gameState.focus>=2?DilemmaList['T-FOCUS-PAYOFF']:DilemmaList['T-COMPETITION'],
   {
      compile: () => DilemmaList['A-FUNDING'],
      flags: ['milestone']
   },
   () => DilemmaList['A-START'],
   () => DilemmaList['A-PATENT'],
   () => DilemmaList['A-NSL'],
   (gameState) => gameState.whiteMaleFounder?DilemmaList['A-BURNING-MAN']:DilemmaList['A-MENTOR'],
   () => DilemmaList['A-COPYRIGHT'],
   () => DilemmaList['A-STATELAW'],
   (gameState) => gameState.paidTroll?DilemmaList['A-PATENT-PAID']: gameState.foughtTroll?DilemmaList['A-PATENT-FOUGHT']:DilemmaList['A-PATENT-IGNORED'],
   () => DilemmaList['A-NEWS'],
   {
      compile: () => DilemmaList['B-FUNDING'],
      flags: ['milestone']
   },
   () => DilemmaList['B-FAIRUSE'],
   (gameState) => gameState.NSLHelp?DilemmaList['B-NSL-HELP']:DilemmaList['B-NSL-FIGHT'],
   () => DilemmaList['B-DEFAME'],
   () => DilemmaList['B-PRIORITIES'],
   () => DilemmaList['B-DISINFO'],
   () => DilemmaList['B-BACKDOOR'],
   () => DilemmaList['B-EUREG'],
   () => DilemmaList['B-TBD'],
   {
      compile: () => DilemmaList['C-FUNDING'],
      flags: ['milestone']
   },
   () => DilemmaList['C-START'],
   () => DilemmaList['C-BREACH'],
   (gameState) => gameState.banDisinfo?DilemmaList['C-DISINFO-2'] : gameState.piracy?DilemmaList['C-HOLLYWOOD'] : DilemmaList['C-TROLLS'],
   () => DilemmaList['C-MID-ROUND-UPDATE'],
   () => Math.random()>0.5?DilemmaList['C-INDIA-DATA']:DilemmaList['C-BRAZIL-TAKEDOWN'], //TODO better approach than coinflip?
   () => DilemmaList['C-TBD'],
   () => DilemmaList['E-END'],
   {
      compile: () => ({"dilemmaPrompt": "That's all for now..."}),
      flags: ['milestone']
   }
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

// Normalize all items to an object with "compile" and "flags"
DilemmaCompiler = DilemmaCompiler.map(item => (typeof item === 'function')?{compile:item,flags:[]}:item)

export default DilemmaCompiler