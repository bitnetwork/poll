#!/usr/bin/node

const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");

let data = {};
try {
  data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));
} catch (error) {}

let input = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function createNew() {
  data = {question: null, answers: {}, voted: []};
  console.log("Poll question?");
  input.question("> ", function(answer) {
    data.question = answer;
    console.log("Default answers?\n(Enter after each, empty response to end)");
    function defaultAnswer() {
      input.question("> ", function(answer) {
        if (answer === "") {
          fs.writeFileSync(path.join(__dirname, "data.json"), JSON.stringify(data));
          console.log("Poll setup!");
          process.exit(0);
        }
        data.answers[answer] = 0;
        defaultAnswer();
      });
    }
    defaultAnswer();
  });
}

if (data.question === undefined || data.question === null) {
  console.log("No poll is active.\nCreate one?");
  input.question("y/n> ", function(answer) {
    if (answer.toLowerCase() !== "y") {
      process.exit(0);
    }
    createNew();
      
  });
} else {
  console.log(`The current poll is:\n${data.question}\nStop this and create a new one?`);
  input.question("y/n> ", function(answer) {
    if (answer.toLowerCase() !== "y") {
      process.exit(0);
    }
    createNew();
  });
}
