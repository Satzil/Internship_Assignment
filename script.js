var allElements = document.querySelectorAll("*");
var loadedModel;
var element;

async function loadModel() {
  const model = await tf.loadLayersModel("weights/model.json");
  return model;
}

window.onload = async function () {
  loadedModel = await loadModel();
  console.log("Model loaded");

  allElements.forEach(function (element) {
    element.addEventListener("mouseover", handleMouseOver);
    element.addEventListener("mouseout", handleMouseOut);
    element.addEventListener("click", handleClick);
  });
};

function handleMouseOver(event) {
  var hoveredElement = event.target;
  hoveredElement.style.backgroundColor = "yellow";
  event.stopPropagation();
}

function handleMouseOut(event) {
  var hoveredElement = event.target;

  if (element != hoveredElement) {
    hoveredElement.style.backgroundColor = "";
  }
}

function handleClick(event) {
  event.preventDefault();

  if (element) {
    element.style.backgroundColor = "";
  }
  var hoveredElement = event.target;
  element = hoveredElement;
  hoveredElement.style.backgroundColor = "";

  html2canvas(hoveredElement).then(async function (canvas) {
    const img = tf.browser.fromPixels(canvas);
    const resizedImage = tf.image.resizeBilinear(img, [300, 300]);
    const expandedImg = resizedImage.expandDims(0);
    const normalizedImg = expandedImg.toFloat().div(tf.scalar(255));

    const predictions = await loadedModel.predict(normalizedImg).data();

    const predictedClass = tf.argMax(predictions).dataSync()[0];
    // const allPredictions = predictions.dataSync();
    final_class = "";
    if (predictedClass == 0) final_class = "Icon";
    else if (predictedClass == 1) final_class = "Image";
    else final_class = "Text";
    console.log("Predicted Class:", final_class);
    console.log("Icon Probability: ", predictions[0]);
    console.log("Image Probability: ", predictions[1]);
    console.log("Text Probability: ", predictions[2]);
    // console.log('All predictions:', allPredictions);

    final_text = "None";
    if (hoveredElement.innerText != "") final_text = hoveredElement.innerText;
    console.log("Text Found: ", final_text);

    // var dataUrl = canvas.toDataURL();

    // // Create a link element and trigger the download
    // var link = document.createElement('a');
    // link.href = dataUrl;
    // link.download = 'htmlToCanvas.png';
    // link.click();
  });

  hoveredElement.style.backgroundColor = "yellow";
  event.stopPropagation();
}
