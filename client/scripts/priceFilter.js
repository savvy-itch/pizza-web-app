// Reference: https://medium.com/@predragdavidovic10/native-dual-range-slider-html-css-javascript-91e778134816

const minPriceSlider = document.getElementById('min-slider');
const maxPriceSlider = document.getElementById('max-slider');
const minPriceInput = document.getElementById('min-input');
const maxPriceInput = document.getElementById('max-input');

minPriceSlider.addEventListener('input', controlMaxPriceSlider);
maxPriceSlider.addEventListener('input', controlMinPriceSlider);
minPriceInput.addEventListener('input', controlMinPriceInput);
maxPriceInput.addEventListener('input', controlMaxPriceInput);

function controlMinPriceInput() {
  const [min, max] = getParsed(minPriceInput, maxPriceInput);
  fillSlider(minPriceInput, maxPriceInput);
  if (min > max) {
    minPriceSlider.value = max;
    minPriceInput.value = max;
  } else {
    minPriceSlider.value = min;
  }
}

function controlMaxPriceInput() {
  const [min, max] = getParsed(minPriceInput, maxPriceInput);
  fillSlider(minPriceInput, maxPriceInput);
  setToggleAccessible(maxPriceInput);
  if (min <= max) {
    maxPriceSlider.value = max;
    maxPriceInput.value = max;
  } else {
    maxPriceInput.value = min;
  }
}

function controlMaxPriceSlider() {
  const [min, max] = getParsed(minPriceSlider, maxPriceSlider);
  fillSlider(minPriceSlider, maxPriceSlider);
  if (min > max) {
    minPriceSlider.value = max;
    minPriceInput.value = max;
  } else {
    minPriceInput.value = min;
  }
}

function controlMinPriceSlider() {
  const [min, max] = getParsed(minPriceSlider, maxPriceSlider);
  fillSlider(minPriceSlider, maxPriceSlider);
  setToggleAccessible(maxPriceSlider);
  if (min <= max) {
    maxPriceSlider.value = max;
    maxPriceInput.value = max;
  } else {
    maxPriceInput.value = min;
    maxPriceSlider.value = min;
  }
}

function getParsed(currentFrom, currentTo) {
  const min = parseInt(currentFrom.value, 10);
  const max = parseInt(currentTo.value, 10);
  return [min, max];
}

function fillSlider(minInput, maxInput) {
  const sliderColor = '#C6C6C6';
  const rangeColor = '#ffaa2c';
  maxPriceSlider.style.background = `linear-gradient(
    to right,
    ${sliderColor} 0%,
    ${sliderColor} ${(minInput.value/maxInput.max)*100}%,
    ${sliderColor} ${(minInput.value/maxInput.max)*100}%,
    ${rangeColor} ${(minInput.value/maxInput.max)*100}%,
    ${rangeColor} ${(maxInput.value/maxInput.max)*100}%, 
    ${sliderColor} ${(maxInput.value/maxInput.max)*100}%, 
    ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget) {
  if (Number(currentTarget.value) <= 0 ) {
    maxPriceSlider.style.zIndex = 102;
  } else {
    maxPriceSlider.style.zIndex = 101;
  }
}

fillSlider(minPriceSlider, maxPriceSlider);
setToggleAccessible(maxPriceSlider);