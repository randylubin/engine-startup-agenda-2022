var DilemmaCompiler = [
   // location
   function () {
      return {            
            "dilemmaPrompt":"Your first decision is to pick a location for your startup. Some areas are more expensive than others, and your choice will impact future access to capital, talent, and internet connectivity.",
            "dilemmaOptions":[
            {
            "optionText":"Tech Hub – expensive but with world class talent and tons of investors",
            "resultsText":"This is the place to be, and even if that co-working space only gives us a desk in the corner for 3x the cost of a full office somewhere else, we’ll be seen as a *real* startup now. ",
            "optionRequirements":null,
            "optionVisibility":null,
            "stateChange":{
            "techHub":" true"
            },
            "gameOver":""
            },
            {
            "optionText":"Other City – an aspiring tech hub with a lower cost of living and a smaller talent pool",
            "resultsText":"Silicon Valley is so last century. Innovation is about newness, and the Crypto Hills is where everyone is heading these days.",
            "optionRequirements":null,
            "optionVisibility":null,
            "stateChange":{
            "otherCity":" true"
            },
            "gameOver":""
            },
            {
            "optionText":"College Town – home of a prestigious university and brimming with talent, though lacking in investors",
            "resultsText":"Startups are kind of like a post-college experience anyway, might as well set up shop in a college town. Plus, so many eager CS students! ",
            "optionRequirements":null,
            "optionVisibility":null,
            "stateChange":{
            "collegeTown":" true"
            },
            "gameOver":""
            },
            {
            "optionText":"Small Town – it’s cheap but there’s not much in the way of local investors and tech talent",
            "resultsText":"The world is remote these days anyway – let’s not waste time and money on expensive offices. Life here is bucolic and we can quickly become the biggest company in town.",
            "optionRequirements":null,
            "optionVisibility":null,
            "stateChange":{
            "smallTown":" true"
            },
            "gameOver":""
            }
            ]
      }

   },
   // First focus
   function () {
      return {
         "dilemmaPrompt": "As a founder, your time is incredibly valuable and there are endless opportunities on which you can focus. Working on your core product is always a good idea, but it might be worth taking some time away from that to strengthen your company in other ways. ",
         "dilemmaOptions": [
            {
               "optionText": "Start networking with investors to prepare for your Series A fundraising later this year [Focus]",
               "resultsText": "Why do I keep getting handed off to Associates?",
               "stateChange": {
                  "investorNetwork": true,
                  "focus": -1,
               },
				"optionRequirements": {
					"focus": 1,
               },
            },
            {
               "optionText": "Focus on recruiting and building an amazing team [Focus]",
               "resultsText": "We've got core values AND a foosball table",
               "stateChange": {
                  "hiringFocus": true,
                  "focus": -1,
               },
				"optionRequirements": {
                  "focus": 1
               },
            },
            {
               "optionText": "Ignore other distractions and stay focused on building the best product",
               "resultsText": "More user interviews!",
               "stateChange": {
                  "productFocus": true,
               },
            },
         ]
      }
   },
   // template
   function (gameState) {
      if (gameState.techHub) {
         return {
            "dilemmaPrompt": "What are you prioritizing in your recruiting?",
            // The best candidates, regardless of their cost or if they need to work remotely
            // [locked unless focusing on recruiting] Tap your local network, you’ve been meeting plenty of great folks here and in-person collaboration is critical
            // We’re going to hire smart but inexperienced people and train them
            // We’ll outsource as much of the work as possible to an inexpensive team overseas
            "dilemmaOptions": [
               {
                  "optionText": "The best candidates, regardless of their cost or if they need to work remotely",
                  "resultsText": "Placeholder",
                  "stateChange": {
                     "capital": -25,
                     "capabilities": 25,
                  }, 
               },
               {
                  "optionText": "Tap your local network, you’ve been meeting plenty of great folks here and in-person collaboration is critical",
                  "resultsText": "Placeholder",
                  "optionRequirements": {
                     "hiringFocus": true
                  },
                  "stateChange": {
                     "capital": -10,
                     "capabilities": 20,
                  }, 
               },
               {
                  "optionText": "We’re going to hire smart but inexperienced people and train them",
                  "resultsText": "Placeholder",
                  "stateChange": {
                     "capital": -10,
                     "capabilities": 10,
                  }, 
               },
               {
                  "optionText": "We’ll outsource as much of the work as possible to an inexpensive team overseas",
                  "resultsText": "Placeholder",
                  "stateChange": {
                     "capital": -5,
                     "capabilities": 5,
                  }, 
               },
            ]
         }
      } else {
         return {
         // You’ve found a brilliant engineer who would be a great fit for your company - but they don’t live anywhere near your headquarters. What do you want to do?
         // Set them up to work remotely
         // Offer to pay for their relocation
         // [locked unless focusing on recruiting] Find someone closer who’s just as good

         "dilemmaPrompt": "You’ve found a brilliant engineer who would be a great fit for your company - but they don’t live anywhere near your headquarters. What do you want to do?",
         "dilemmaOptions": [
            {
               "optionText": "Set them up to work remotely",
               "resultsText": "Placeholder result",
               "stateChange": {
                  "capital": -5,
               },
            },
            {
               "optionText": "Offer to pay for their relocation",
               "resultsText": "Placeholder result",
               "stateChange": {
                  "capital": -15,
               },
            },
            {
               "optionText": "Find someone closer who’s just as good",
               "resultsText": "Placeholder",
               "optionRequirements": {
                  "hiringFocus": true
               },
               "stateChange": {
                  "capital": -5,
               }, 
            },
         ]
         }
      }
   },
   // privacy
   // An engineer comes to you concerned about the large amounts of user data you are collecting and retaining, including sensitive personal information. How do you want to proceed?
   // Invest in higher quality security so that you can safely continue leveraging the user data to make product decisions and deliver targeted ads --💰 +👥
   // Cut down on collected data because user privacy is highly important
   // Let’s dig into the user data to enhance the product and user experience [BadPrivacy] ++👥 -⏱
   // Deprioritize – there are way more important features for us to develop [BadPrivacy]

   function () {
      return {
         "dilemmaPrompt": "An engineer comes to you concerned about the large amounts of user data you are collecting and retaining, including sensitive personal information. How do you want to proceed?",
         "dilemmaOptions": [
            {
               "optionText": "Invest in higher quality security so that you can safely continue leveraging the user data to make product decisions and deliver targeted ads",
               "resultsText": "This is the placeholder result of an option",
               "stateChange": {
                  "capital": -5,
                  "goodSecurity": true
               },
            },
            {
               "optionText": "Cut down on collected data because user privacy is highly important",
               "resultsText": "This is the placeholder result of an option",
               "stateChange": {
                  "capital": -1,
               },
            },
            {
               "optionText": "Let’s dig into the user data to enhance the product and user experience [Focus]",
               "resultsText": "This is the placeholder result of an option",
               "stateChange": {
                  "badPrivacy": true,
                  "users": +5
               },
               "optionRequirements": {
                  "focus": 1
               },
            },
            {
               "optionText": "Deprioritize – there are way more important features for us to develop",
               "resultsText": "This is the placeholder result of an option",
               "stateChange": {
                  "badPrivacy": true
               },
            },
         ]
      }
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