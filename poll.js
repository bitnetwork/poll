#!/usr/bin/node

const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");

let user = os.userInfo();

console.log(`Welcome ${user.username}!`);

let data = {};
try {
  data = JSON.parse(fs.readFileSync(path.join(__dirname, "data.json")));
} catch (error) {}

if (data.question === undefined || data.question === null) {
  console.log(`No poll is active. Ask the owner to run ${path.join(__dirname, "admin.js")}.`);
  process.exit(0);
}

console.log(`Todays poll:\n${data.question}`);

for (let answer in data.answers) {
  console.log(`(${data.answers[answer]}) ${answer}`);
}

if (data.voted.find(function(uid) { return uid === user.uid; }) !== undefined) { // hasn't voted yet
  console.log("You've already voted!");
  process.exit(0);
}
console.log("You haven't voted yet.\nType your response to the poll.\n(Your vote will remain anonymous)");

let input = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

input.question("> ", function(answer) {
  data.voted.push(user.uid);
  if (data.answers[answer] === undefined) {
    data.answers[answer] = 1;
  } else {
    data.answers[answer]++;
  }
  fs.writeFileSync(path.join(__dirname, "data.json"), JSON.stringify(data));
  console.log("Vote cast!");
  process.exit(0);
});
