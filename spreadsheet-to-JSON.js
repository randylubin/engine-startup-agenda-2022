'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('spreadsheet-input.json');
let sheetData = JSON.parse(rawdata);

let titleCol = 1
let promptCol = 2
let optionCol = 3
let resultsCol = 4
let requirementsCol = 5
let visibilityCol = 6
let capitalCol = 7
let userCol = 8
let capabilitiesCol = 9
let otherStateCol = 10
let gameOverCol = 11
let engineIssueCol = 12

let dataOutput = {}

for (const dataRow in sheetData) {
  let row = sheetData[dataRow]
  if (!dataOutput[row[0]]) {
    dataOutput[row[0]] = {
      dilemmaTitle: row[titleCol],
      dilemmaPrompt: row[promptCol],
      dilemmaOptions: [],
      engineIssue: row[engineIssueCol]
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
    gameOver: row[gameOverCol] ?? null,  
  }

  // Option Requirements
  if (row[requirementsCol]) {
    let newRequirements = row[requirementsCol].split(',')
    for (const obj in newRequirements) {
      let newReqObject = newRequirements[obj].split(':')
      newOption.optionRequirements[newReqObject[0]] = newReqObject[1]
    }  
  } else {newOption.optionRequirements = null}

  // Option visibility
  if (row[visibilityCol]) {
    let newVisSection = row[visibilityCol].split(',')
    for (const obj in newVisSection) {
      let newVisObject = newVisSection[obj].split(':')
      newOption.optionVisibility[newVisObject[0]] = newVisObject[1]
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
      newOption.stateChange[newStateObj[0]] = newStateObj[0] == "focus" ? parseInt(newStateObj[1]) : newStateObj[1]
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