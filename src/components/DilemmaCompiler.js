var DilemmaCompiler = [
   // first dilemma
   function () {
      return {
         "dilemmaPrompt": "The dilemma for this round is lorem ipsum... what do you do?",
         "dilemmaOptions": [
            {
               "optionText": "Do nothing",
               "optionToolTip": "I'm a tool tip!",
               "resultsText": "You lose... click back to choose a different option",
               "stateChange": {
                  "capital": -100
               },
               "gameOver": true
            },
            {
               "optionText": "Do a little",
               "resultsText": "You've bought yourself a little time...",
               "stateChange": {
                  "capital": -10,
                  "users": -5
               }
            },
            {
               "optionText": "Do a lot",
               "resultsText": "That was hard, hope it was worth it!",
               "stateChange": {
                  "capital": -15,
                  "users": 20,
                  "focus": -1
               },
               "optionRequirements": {
                  "capabilities": 20
               }
            },
            {
               "optionText": "Magically fix it",
               "optionRequirements": {
                  "hasMagic": true
               }
            }
         ]
      }
   },
   // second
   function () {
      return {
         "dilemmaPrompt": "Do you want to spend time fundraising or hiring? This will matter for the next dilemma...",
         "dilemmaOptions": [
            {
               "optionText": "Fundraising",
               "resultsText": "You chose fundraising, the game will remember this...",
               "stateChange": {
                  "capital": 15,
                  "choseFundraising": true
               },
            },
            {
               "optionText": "Hiring",
               "resultsText": "You chose hiring, the game will remember this...",
               "stateChange": {
                  "capabilities": 15,
                  "choseHiring": true
               }
            }
         ]
      }
   },
   // third, with conditional logic
   function (gameState) {
      if (gameState.choseFundraising) {
         return {
            "dilemmaPrompt": "You chose fundraising last round...",
            "dilemmaOptions": [
               {
                  "optionText": "Option 1",
                  "resultsText": "Results 1",
                  "stateChange": {
                     "capital": 0,
                  },
               },
               {
                  "optionText": "Option 2",
                  "resultsText": "Results 2",
                  "stateChange": {
                     "capital": 0,
                  },
               },
            ]
         }
      } else {
         return {
            "dilemmaPrompt": "You chose hiring last round...",
            "dilemmaOptions": [
               {
                  "optionText": "Option 1",
                  "resultsText": "Results 1",
                  "stateChange": {
                     "capital": 0,
                  },
               },
               {
                  "optionText": "Option 2",
                  "resultsText": "Results 2",
                  "stateChange": {
                     "capital": 0,
                  },
               },
            ]
         }
      }
   },
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
               "optionText": "Fundraising",
               "resultsText": "You chose fundraising, the game will remember this...",
               "stateChange": {
                  "capital": 15,
                  "choseFundraising": true
               },
               "optionRequirements": {
                  "hasMagic": true
               },
               "gameOver": true
            },
         ]
      }
   },
]

export default DilemmaCompiler