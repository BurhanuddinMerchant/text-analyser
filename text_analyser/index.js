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
const drawPieChart = (dataArray) => {
  let data = google.visualization.arrayToDataTable(dataArray);
  let options = { title: "Text Analysis", width: 550, height: 400 };
  let chart = new google.visualization.PieChart(
    document.getElementById("piechart")
  );
  chart.draw(data, options);
};

//RegEx
const isNumber = /[0-9]+$/;
const isSmallAlphabet = /[a-z]+$/;
const isCapitalAlphabet = /[A-Z]+$/;
const startAnalysis = () => {
  const analyserInput = document.getElementById("analyser-input").value;
  if (!analyserInput) {
    document.body.append("Error :No analyser Input");
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
    const currentCharacter = analyserInput[iterator];
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
    } else if (specialCharactersArray.includes(currentCharacter)) {
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
        result.blob_count += 1;
      } else {
        word += currentCharacter;
      }
    }
  }
  countWord(word);
  result.alphabets = result.capitalAlphabets + result.smallAlphabets;
  let wordWithHighestFrequency = null;
  let maxFrequency = -1;
  console.log(result);
  let resultArray = [["text", "analyser"]];
  for (let key in result) {
    if (key !== "words") {
      resultArray = [...resultArray, [key, result[key]]];
    }
    const br = document.createElement("br");
    const properties = key + " : " + result[key];
    document.body.append(properties, br);
  }
  const wordsObject = result.words;
  for (let wrd in wordsObject) {
    if (wordsObject[wrd] > maxFrequency) {
      maxFrequency = wordsObject[wrd];
      wordWithHighestFrequency = wrd;
    }
    // const br = document.createElement("br");
    // const properties = wrd + " : " + wordsObject[wrd];
    // document.body.append(properties, br);
  }
  if (wordWithHighestFrequency) {
    document.body.append(
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
const voiceFemale = {
  voiceURI: "Microsoft Zira Desktop - English (United States)",
  name: "Microsoft Zira Desktop - English (United States)",
  lang: "en-US",
  localService: true,
  default: false,
};
const speak = () => {
  // var msg = new SpeechSynthesisUtterance();
  // var voices2 = window.speechSynthesis.getVoices();
  // msg.voice = voices2[3];
  // msg.text = "Hello World";
  // speechSynthesis.speak(msg);
  //here
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
  let utter = new SpeechSynthesisUtterance();
  utter.voiceURI = "Google français";
  utter.lang = "en-US";
  utter.name = "Microsoft Zira Desktop - English (United States)";
  utter.text = analyserInput;
  utter.volume = 1;
  window.speechSynthesis.speak(utter);
  // window.speechSynthesis.speak(new SpeechSynthesisUtterance(analyserInput));
};
