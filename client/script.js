let inputString = "";
let index = 0;
let delay = 100;
let canvasHeight; 

let img;
let imgList = ['https://i.ibb.co/JkHMGw3/Sun.webp', 'https://i.ibb.co/Sx1Xvt8/Rain.jpg', 'https://i.ibb.co/Tqxp9nH/Fog.jpg'];

function preload() {
  img = loadImage(imgList[0]);
}

function setup() {
  canvasHeight = img.height + 20;
  createCanvas(500, 500);
  textSize(32);


  // create dropdown box for selecting image
  let imageSelector = createSelect();
  for (let i = 0; i < imgList.length; i++) {
    let option = imgList[i].split('/').pop().split('.')[0];
    imageSelector.option(option);

  }
  imageSelector.changed(changeImage);

  // create text input field
  let inputBox = createInput("Enter your text here");
  inputBox.position(10, img.height + 0);
  inputBox.size(width - 100, 40);

  // create generate button
  let generateButton = createButton("Generate");
  generateButton.position(10, img.height + 60);
  generateButton.mousePressed(() => {
    getTextFromAPI(inputBox.value());
  });
  
}

function draw() {
  background(255);
  image(img, 0, 0, img.width, img.height);

  

  let displayString = "";
  let words = inputString.split(" ");
  let currentLine = "";
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    if (textWidth(currentLine + word) < width - 50) {
      currentLine += word + " ";
    } else {
      displayString += currentLine + "\n";
      currentLine = word + " ";
    }
  }
  displayString += currentLine;
  let lines = displayString.split("\n");
  let lineHeight = textAscent() + textDescent();
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let y = (height + lineHeight) / 2 + lineHeight * i;
    text(line, 50, y);
  }
}

function changeImage() {
  let selectedImage = this.value();
  let index = imgList.findIndex((imgUrl) => imgUrl.includes(selectedImage));
  img = loadImage(imgList[index], function() {
    image(img, 0, 0, width, height);
  });

}

let interval;
async function getTextFromAPI(userText) {
  const response = await fetch("http://localhost:3000/generate", 
  {method: "post", body: {text: userText}});
  const data = await response.json();
  inputString = data.text;
  delay = Math.floor(Math.random() * 200) + 50;
  index = 0;
  clearInterval(interval);
  interval = setInterval(function() {
    index++;
    if (index > inputString.length) {
      clearInterval(interval);
    }
  }, delay);
}

