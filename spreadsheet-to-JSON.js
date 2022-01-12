'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('spreadsheet-input.json');
let sheetData = JSON.parse(rawdata);

let dataOutput = []

for (const dataRow in sheetData) {
  let row = sheetData[dataRow]
  if (!dataOutput[row[0]]) {
    dataOutput[row[0]] = {
      dilemmaPrompt: row[1],
      dilemmaOptions: [],
    }
  }

  let newOption = {
    optionText: row[2],
    resultsText: row[3],
    optionRequirements: {},
    optionVisibility: {},
    stateChange: {},
    gameOver: row[7] ?? null,  
  }

  // Option Requirements
  if (row[4]) {
    let newRequirements = row[4].split(',')
    for (const req in newRequirements) {
      let newReqObject = newRequirements[req].split(':')
      console.log('newReqObject', newReqObject)
      newOption.optionRequirements[newReqObject[0]] = newReqObject[1]
    }  
  } else {newOption.optionRequirements = null}

  // Option visibility
  if (row[5]) {
    let newRequirements = row[5].split(',')
    for (const req in newRequirements) {
      let newReqObject = newRequirements[req].split(':')
      console.log('newReqObject', newReqObject)
      newOption.optionVisibility[newReqObject[0]] = newReqObject[1]
    }  
  } else {newOption.optionVisibility = null}

  // State Change
  if (row[6]) {
    let newRequirements = row[6].split(',')
    for (const req in newRequirements) {
      let newReqObject = newRequirements[req].split(':')
      console.log('newReqObject', newReqObject)
      newOption.stateChange[newReqObject[0]] = newReqObject[1]
    }  
  } else {newOption.stateChange = null}


  dataOutput[row[0]].dilemmaOptions.push(newOption)
}

fs.writeFile('spreadsheet-output.json', JSON.stringify(dataOutput), err => {
  if (err) {
    console.error(err)
    return
  }
})