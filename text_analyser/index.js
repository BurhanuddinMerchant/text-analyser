const specialCharactersArray = [
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
  "{",
  "}",
  "[",
  "]",
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
  "|",
  "\\",
];
//utility function to draw barchart
const drawBarChart = (wordsObject) => {
  let dataPoints = [["data", "Analysis"]];
  for (word in wordsObject) {
    dataPoints = [...dataPoints, [word, wordsObject[word]]];
  }
  let data = google.visualization.arrayToDataTable(dataPoints);
  let options = { title: "Word Analysis", width: 550, height: 400 };
  let chart = new google.visualization.BarChart(
    document.getElementById("barChart")
  );
  chart.draw(data, options);
};
//utility function to draw piechart
const drawPieChart = (dataArray) => {
  let data = google.visualization.arrayToDataTable(dataArray);
  let options = { title: "Text Analysis", width: 550, height: 400 };
  let chart = new google.visualization.PieChart(
    document.getElementById("piechart")
  );
  chart.draw(data, options);
};
//utility function to count words
const countWord = (word, wordsObject) => {
  if (word && !word.match(isNumber)) {
    if (wordsObject[word]) {
      wordsObject[word] += 1;
    } else {
      wordsObject[word] = 1;
    }
  }
};
//RegEx
const isNumber = /[0-9]+$/;
const isSmallAlphabet = /[a-z]+$/;
const isCapitalAlphabet = /[A-Z]+$/;

//function to handle the Analyze button
const startAnalysis = () => {
  const resultArea = document.getElementById("result");

  const analyserInput = document.getElementById("analyser-input").value;
  if (!analyserInput) {
    resultArea.append("Error :No analyser Input");
    return;
  }
  let iterator;
  let input_length = analyserInput.length;
  let wordStart = true;
  let word;
  const result = {
    spaces: 0,
    line_break: 0,
    characters: 0,
    words: new Object(),
    raw_characters: input_length,
    alphabets: 0,
    digits: 0,
    capitalAlphabets: 0,
    smallAlphabets: 0,
    specialCharacters: 0,
    blob_count: 0,
  };
  for (iterator = 0; iterator < input_length; iterator++) {
    const currentCharacter = analyserInput[iterator];
    if (currentCharacter === " ") {
      countWord(word, result.words);
      result.spaces += 1;
      word = null;
      wordStart = true;
    } else if (currentCharacter === "\n") {
      countWord(word, result.words);
      result.line_break += 1;
      word = null;
      wordStart = true;
    } else if (specialCharactersArray.includes(currentCharacter)) {
      countWord(word, result.words);
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
        result.blob_count += 1;
      } else {
        word += currentCharacter;
      }
    }
  }
  countWord(word, result.words);
  result.alphabets = result.capitalAlphabets + result.smallAlphabets;
  let wordWithHighestFrequency = null;
  let maxFrequency = -1;
  console.log(result);
  let resultArray = [["text", "analyser"]];
  const resultHeader = document.createElement("h2");
  resultHeader.textContent = "Analysis";
  resultArea.appendChild(resultHeader);
  resultArea.appendChild(document.createElement("hr"));
  for (let key in result) {
    if (key !== "words") {
      resultArray = [...resultArray, [key, result[key]]];
      const br = document.createElement("br");
      const properties = key + " : " + result[key];
      resultArea.append(properties, br);
    }
  }
  const wordsObject = result.words;
  for (let wrd in wordsObject) {
    if (wordsObject[wrd] > maxFrequency) {
      maxFrequency = wordsObject[wrd];
      wordWithHighestFrequency = wrd;
    }
  }
  if (wordWithHighestFrequency) {
    resultArea.append(
      "Word With highest frequency is '",
      wordWithHighestFrequency,
      "' with frequency : ",
      result.words[wordWithHighestFrequency]
    );
  }
  //code for google charts

  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(() => {
    drawPieChart(resultArray);
  });
  google.charts.setOnLoadCallback(() => {
    drawBarChart(wordsObject);
  });

  return result;
};

//function to handle the speak functionality
const speak = () => {
  let synth = window.speechSynthesis;
  const voices = synth.getVoices();
  let i = 0;
  for (voice in voices) {
    console.log(voices[i]);
    i++;
  }
  let analyserInput = document.getElementById("analyser-input").value;
  if (!analyserInput) {
    analyserInput = "No analyser Input";
  }
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(analyserInput));
};
const reset = () => {
  location.reload();
};
