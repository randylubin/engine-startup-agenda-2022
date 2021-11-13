var DilemmaCompiler = [
   // first dilemma
   function () {
      return {
         "dilemmaPrompt": "The dilemma for this round is lorem ipsum... what do you do?",
         "dilemmaOptions": [
            {
               "optionText": "Do nothing",
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
   function () {
      return {
         "dilemmaPrompt": "The dilemma for this round is lorem ipsum... what do you do?",
         "dilemmaOptions": [
            {
               "optionText": "Do nothing",
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
   }
]

export default DilemmaCompiler