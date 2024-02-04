import { displayOrderQuantity } from './utils.js';
import { ingredientsUrl } from './globals.js';

const sizeBtnDiv = document.querySelector('.size-btn-container');
const toppingBtnDiv = document.querySelector('.topping-btn-container');
const pizzaConstructorDiv = document.querySelector('.pizza-constructor-image');
const addBtn = document.getElementById('add-btn');
const descriptionPara = document.getElementById('create-pizza-desc');
const totalPrice = document.querySelector('.total-price');
const sizesList = [
  {size:"s", price: 7.25},
  {size:"m", price: 9.25},
  {size:"l", price: 11.25}
];
const toppingsZIndex = [
  { id: '6598f6b425f82811512c6ff9', zIndex: 1},
  { id: '6598f6b425f82811512c6ffa', zIndex: 3},
  { id: '6598f6b425f82811512c6ffd', zIndex: 100},
  { id: '6598f6b425f82811512c6ffe', zIndex: 2},
  { id: '6598f6b425f82811512c6fff', zIndex: 4},
  { id: '6598f6b425f82811512c6ffc', zIndex: 5},
  { id: '6598f6b425f82811512c6ffb', zIndex: 3},
]
let fetchedIngredients = [];
let ordersArray = [];
let total = 0;

document.addEventListener('DOMContentLoaded', initialFetch);

function initialFetch() {
  fetch(ingredientsUrl)
    .then(response => response.json())
    .then(ingredients => {
      fetchedIngredients = ingredients.ingredients;
      displaySizes(sizesList, sizeBtnDiv);
      displayIngredients(ingredients.ingredients, toppingBtnDiv);
      updateTotalCost(sizesList, ingredients.ingredients, sizeBtnDiv, toppingBtnDiv, total, addBtn, totalPrice);
      displayOrderQuantity();
      populateDescription();
  });
}

function displaySizes(sizesList, sizeBtnDiv) {
  sizesList.map(size => {
    createSizeBtn(size, sizeBtnDiv);
  });
  
  const sizeBtns = [...document.querySelectorAll('.size-btn')];
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(btn => {
        btn.classList.remove('active');
      });
      btn.classList.add('active');
      updateTotalCost(sizesList, fetchedIngredients, sizeBtnDiv, toppingBtnDiv, total, addBtn, totalPrice);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  addBtn.addEventListener('click', () => {
    addPizzaToCart(sizeBtnDiv, total);
    displayOrderQuantity();
  });
})

function createSizeBtn(sizeObj, sizeBtnDiv) {
  const sizeBtn = sizeBtnDiv.ownerDocument.createElement('button');
  sizeBtn.className = 'size-btn';
  sizeBtn.setAttribute('aria-label', 'size-btn');
  sizeBtn.setAttribute('data-size', sizeObj.size);
  sizeBtn.innerHTML = `<span class="pizza-size">${sizeObj.size}</span><span>£${sizeObj.price}</span>`;
  // set default size of medium
  if (sizeObj.size === 'm') {
    sizeBtn.classList.add('active');
  }
  sizeBtnDiv.appendChild(sizeBtn);
}

function displayIngredients(ingredients, toppingBtnDiv, toppingsZIndex) {
  ingredients.map(ingredient => {
    const ingredientBtn = toppingBtnDiv.ownerDocument.createElement('button');
    ingredientBtn.className = 'topping-btn';
    ingredientBtn.textContent = ingredient.name;
    toppingBtnDiv.appendChild(ingredientBtn);
    ingredientBtn.addEventListener('click', (e) => {
      ingredientBtn.classList.toggle('active');
      const toppingFromDb = ingredients.find(el => el.name === e.target.textContent);
      toggleTopping(e.target, toppingFromDb, toppingsZIndex);
      updateTotalCost(sizesList, ingredients, sizeBtnDiv, toppingBtnDiv, total, addBtn, totalPrice);
    })
  });
}

// update topping image for the pizza
function toggleTopping(currentTopping, toppingFromDb, toppingsZIndex) {
  // add topping image
  if (currentTopping.classList.contains('active')) {
    const toppingImg = document.createElement('img');
    toppingImg.src = toppingFromDb.imgUrl;
    toppingImg.alt = toppingFromDb.name;
    toppingImg.className = 'pizza-topping-image';
    toppingImg.id = toppingFromDb._id;
    toppingImg.style.zIndex = toppingsZIndex.find(item => item.id === toppingImg.id).zIndex;
    pizzaConstructorDiv.appendChild(toppingImg);
  } else {
    // remove topping image
    const displayedToppings = document.querySelectorAll('.pizza-topping-image');

    for (let img of displayedToppings) {
      if (img.id === toppingFromDb._id) {
        pizzaConstructorDiv.removeChild(img);
      }
    }
  }
}

function updateTotalCost(sizesList, ingredients, sizeBtnDiv, toppingBtnDiv, total, addBtn, totalPrice) {
  // add pizza size price
  const selectedSize = sizeBtnDiv.querySelector('.active .pizza-size');
  const sizeFromDb = sizesList.find(el => el.size === selectedSize.textContent);
  total = Number(sizeFromDb.price);

  // add toppings price
  const selectedToppings = [...toppingBtnDiv.querySelectorAll('.active')];
  // if no toppings were selected, disable add button
  if (selectedToppings.length < 1) {
    addBtn.setAttribute("disabled", "disabled");
  } else {
    addBtn.removeAttribute("disabled");
    let toppingsTotal = 0;
    selectedToppings.forEach(btn => {
      let toppingFromDb = ingredients.find(el => el.name === btn.textContent);
      toppingsTotal += parseFloat(toppingFromDb.price);
    });
    total += toppingsTotal;
  }
  total = total.toFixed(2);
  totalPrice.textContent = `£${total}`;
}

// add pizza info into local storage
function addPizzaToCart(sizeBtnDiv, total) {
  const orders = localStorage.getItem('pizzas') ?? '[]';
  const storedOrders = JSON.parse(orders);
  const selectedSize = sizeBtnDiv.querySelector('.active .pizza-size').textContent;
  const customPizza = {
    title: 'Custom pizza',
    imgUrl: 'https://i.ibb.co/PwtRr1M/custom-pizza.png',
    amount: 1,
    size: selectedSize,
  };
  customPizza.price = Number(total);

  let isMatchFound = false;
  // increase amount of repeated pizzas
  ordersArray = storedOrders.reduce((acc, obj) => {
    // if such order is already in the array
    if (obj.title === customPizza.title && obj.price === customPizza.price) {
      // increase its amount
      obj.amount++;
      isMatchFound = true;
    }
    acc.push(obj);
    return acc;
  }, []);

  // if there's no such order in the array
  if (!isMatchFound) {
    // add it to the array
    ordersArray.push(customPizza);
  } else {
    // set back the flag to false for the next iteration
    isMatchFound = false;
  }
  // storedOrders.push(customPizza);
  localStorage.setItem('pizzas', JSON.stringify(ordersArray));
}

function populateDescription() {
  descriptionPara.textContent = `Create your own pizza by choosing its size and toppings! Select from three sizes and over ${fetchedIngredients.length} individual types of toppings.`
}

export { 
  sizesList, 
  displaySizes, 
  createSizeBtn,
  displayIngredients,
  toggleTopping,
  updateTotalCost,
  toppingsZIndex
};