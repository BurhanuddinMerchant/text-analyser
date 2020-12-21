const punctuations = [
  ";",
  ":",
  "?",
  "/",
  ",",
  ".",
  "<",
  ">",
  "+",
  "-",
  "=",
  "_",
  ")",
  "(",
  "*",
  "&",
  "^",
  "%",
  "$",
  "#",
  "@",
  "!",
  "~",
  "`",
  '"',
  "'",
];
const propsList = [
  "spaces",
  "line_break",
  "characters",
  "words",
  "raw_characters",
  "alphabets",
  "digits",
  "capitalAlphabets",
  "smallAlphabets",
  "specialCharacters",
  "word_count",
];
//RegEx
const isNumber = /[0-9]+$/;
const isSmallAlphabet = /[a-z]+$/;
const isCapitalAlphabet = /[A-Z]+$/;
const startAnalysis = () => {
  const analyserInpput = document.getElementById("analyser-input").value;
  if (!analyserInpput) {
    console.log("No analyserInpput");
    return;
  }
  let iterator;
  let input_length = analyserInpput.length;
  let spaces = 0;
  let line_break = 0;
  let characters = 0;
  let word_count = 0;
  let digits = 0;
  let alphabets = 0;
  let capitalAlphabets = 0;
  let smallAlphabets = 0;
  let specialCharacters = 0;
  const result = {
    spaces,
    line_break,
    characters,
    words: new Object(),
    raw_characters: input_length,
    alphabets,
    digits,
    capitalAlphabets,
    smallAlphabets,
    specialCharacters,
    word_count,
  };
  let wordStart = true;
  let word;
  const countWord = (word) => {
    if (word && !word.match(isNumber)) {
      if (result.words[word]) {
        result.words[word] += 1;
      } else {
        result.words[word] = 1;
      }
    }
  };
  for (iterator = 0; iterator < input_length; iterator++) {
    const currentCharacter = analyserInpput[iterator];
    if (currentCharacter === " ") {
      countWord(word);
      result.spaces += 1;
      word = null;
      wordStart = true;
    } else if (currentCharacter === "\n") {
      countWord(word);
      result.line_break += 1;
      word = null;
      wordStart = true;
    } else if (punctuations.includes(currentCharacter)) {
      countWord(word);
      word = null;
      result.specialCharacters += 1;
    } else {
      result.characters += 1;
      if (currentCharacter.match(isSmallAlphabet)) {
        result.smallAlphabets += 1;
      } else if (currentCharacter.match(isCapitalAlphabet)) {
        result.capitalAlphabets += 1;
      } else if (currentCharacter.match(isNumber)) {
        result.digits += 1;
      }
      if (wordStart) {
        word = currentCharacter;
        wordStart = false;
        result.word_count += 1;
      } else {
        word += currentCharacter;
      }
    }
  }
  countWord(word);
  result.alphabets = result.capitalAlphabets + result.smallAlphabets;
  console.log(result);
  let resultArray = [["text", "analyser"]];
  propsList.map((prop) => {
    if (prop !== "words") {
      resultArray = [...resultArray, [prop, result[prop]]];
    }
    const br = document.createElement("br");
    // const header = document.createElement("h1");
    const properties = prop + " : " + result[prop];
    document.body.append(properties, br);
  });

  //code for piechart

  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);

  // Draw the chart and set the chart values
  function drawChart() {
    let data = google.visualization.arrayToDataTable(resultArray);

    // Optional; add a title and set the width and height of the chart
    let options = { title: "Text Analysis", width: 550, height: 400 };

    // Display the chart inside the <div> element with id="piechart"
    let chart = new google.visualization.PieChart(
      document.getElementById("piechart")
    );
    chart.draw(data, options);
  }
  return result;
};
