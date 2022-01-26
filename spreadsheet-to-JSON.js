'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('spreadsheet-input.json');
let sheetData = JSON.parse(rawdata);

let colIndex = 0

let chapterCode = colIndex; colIndex++;
colIndex++; // gameRound
let titleCol = colIndex; colIndex++;
let promptCol = colIndex; colIndex++;
let optionCol = colIndex; colIndex++;
let resultsCol = colIndex; colIndex++;
let requirementsCol = colIndex; colIndex++;
let visibilityCol = colIndex; colIndex++;
let capitalCol = colIndex; colIndex++;
let userCol = colIndex; colIndex++;
let capabilitiesCol = colIndex; colIndex++;
let otherStateCol = colIndex; colIndex++;
let specialChapterTypeCol = colIndex; colIndex++;
let engineIssueCol = colIndex; colIndex++;

let validSpecialChapters = ["singleScreen","tutorialPage"]

let dataOutput = {}

for (const dataRow in sheetData) {
  let row = sheetData[dataRow]
  if (!dataOutput[row[chapterCode]]) {
    dataOutput[row[chapterCode]] = {
      dilemmaTitle: row[titleCol],
      dilemmaPrompt: row[promptCol],
      dilemmaOptions: [],
      engineIssue: row[engineIssueCol]
    }

    if (validSpecialChapters.includes(row[specialChapterTypeCol])) {
      dataOutput[row[chapterCode]].specialChapterType = row[specialChapterTypeCol]
    }
  }

  let newOption = {
    optionText: row[optionCol],
    resultsText: row[resultsCol],
    optionRequirements: {},
    optionVisibility: {},
    stateChange: {
      capital: 0,
      users: 0,
      capabilities: 0
    },
  }
  if (row[specialChapterTypeCol] == "gameOver") {
    newOption.gameOver = true;  
  }

  // Option Requirements
  if (row[requirementsCol]) {
    let newRequirements = row[requirementsCol].split(',')
    for (const obj in newRequirements) {
      let newReqObject = newRequirements[obj].split(':')
      let newProp = newReqObject[0]
      let newValue = newReqObject[1]

      if (['capital', 'users', 'capabilities', 'focus'].includes(newProp)) {
        newValue = parseInt(newValue)
      } else {
        if (newValue === 'true') {
          newValue = true
        } else {
          newValue = false;
        }
      }

      newOption.optionRequirements[newProp] = newValue
    }  
  } else {newOption.optionRequirements = null}

  // Option visibility
  if (row[visibilityCol]) {
    let newVisSection = row[visibilityCol].split(',')
    for (const obj in newVisSection) {
      let newVisObject = newVisSection[obj].split(':')
      let newProp = newVisObject[0]
      let newValue = newVisObject[1]

      if (['capital', 'users', 'capabilities', 'focus'].includes(newProp)) {
        newValue = parseInt(newValue)
      } else {
        if (newValue === 'true') {
          newValue = true
        } else {
          newValue = false;
        }
      }
        
      newOption.optionVisibility[newProp] = newValue
    }  
  } else {newOption.optionVisibility = null}

  // State Change
  newOption.stateChange['capital'] = row[capitalCol] ? parseInt(row[capitalCol]) : 0
  newOption.stateChange['users'] = row[userCol] ? parseInt(row[userCol]) : 0
  newOption.stateChange['capabilities'] = row[capabilitiesCol] ? parseInt(row[capabilitiesCol]) : 0

  
  if (row[otherStateCol]) {
    let newStateSection = row[otherStateCol].split(',')
    for (const obj in newStateSection) {
      let newStateObj = newStateSection[obj].split(':')
      newOption.stateChange[newStateObj[0]] = newStateObj[0] == "focus" ? parseInt(newStateObj[1]) : newStateObj[1] === 'true' ? true : false 
    }  
  }

  dataOutput[row[0]].dilemmaOptions.push(newOption)
}

fs.writeFile('converted-dilemma-list.json', JSON.stringify(dataOutput), err => {
  if (err) {
    console.error(err)
    return
  }
})