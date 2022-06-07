const fs = require("fs");
const path = require("path");
const _ = require("lodash");

// use these 3 vars as inputs
const notPresentLetters = _.uniq(["sem", "ic"].join("").split(""));
const confirmedLettersNotInPositions = [
  [""], // 1st
  [""], // 2nd
  [""], // 3rd
  ["a"], // 4th
  [""], // 5h
];
const confirmedLettersInPositions = [
  "a", // 1st
  "t", // 2nd
  "", // 3rd
  "", // 4th
  "", // 5h
];

const confirmedLetters = _.uniq(
  confirmedLettersInPositions
    .join("")
    .concat(_.flatten(confirmedLettersNotInPositions).join(""))
    .split("")
);
const arraySize = [];
const intersection = [...notPresentLetters].filter((x) =>
  new Set(confirmedLettersInPositions).has(x)
);
if (intersection.length) {
  throw Error(
    `Letter in confirmedLettersInPositions is also in notPresentLetters: ${intersection.join(
      ""
    )}`
  );
}
function round(n, d = 2) {
  return Math.round(n * Math.pow(10, d)) / Math.pow(10, d);
}

const data = fs
  .readFileSync(path.join(__dirname, "text.txt"), "utf8")
  .split("\n");
arraySize.push({
  step: 0,
  name: "",
  size: data.length,
});

const answers = data
  .filter((word) => {
    // check that confirmed letters ARE in positions
    let correct = true;
    confirmedLettersInPositions.forEach((letter, letterIndex) => {
      if (letter !== "") {
        if (word[letterIndex] !== letter) {
          correct = false;
        }
      }
    });
    return correct;
  })
  .filter((word, index, array) => {
    if (index === 0) {
      arraySize.push({
        step: 3,
        name: "confirmed letters ARE in positions",
        size: array.length,
      });
    }
    return true;
  })
  .filter((word) => {
    // check that not present letters are not in word
    return !_.some(notPresentLetters, (notPresentLetter) =>
      word.includes(notPresentLetter)
    );
  })
  .filter((word, index, array) => {
    if (index === 0) {
      arraySize.push({
        step: 1,
        name: "not present letters are not in word",
        size: array.length,
      });
    }
    return true;
  })
  .filter((word) => {
    // check that all confirmed letters are in word
    return _.every(confirmedLetters, (confirmedLetter) =>
      word.includes(confirmedLetter)
    );
  })
  .filter((word, index, array) => {
    if (index === 0) {
      arraySize.push({
        step: 2,
        name: "all confirmed letters are in word",
        size: array.length,
      });
    }
    return true;
  })
  .filter((word) => {
    // check that confirmed letters are NOT in positions
    for (let i = 0; i < confirmedLettersNotInPositions.length; i++) {
      if (confirmedLettersNotInPositions[i].includes(word[i])) {
        return false;
      }
    }
    return true;
  })
  .filter((word, index, array) => {
    if (index === 0) {
      arraySize.push({
        step: 4,
        name: "confirmed letters are NOT in positions",
        size: array.length,
      });
    }
    return true;
  });

console.log(arraySize, answers);
