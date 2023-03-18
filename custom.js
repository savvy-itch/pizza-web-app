import { sizes, ingredients } from "./ingredients.js";

// update total cost in add to cart button on every change
// on add to cart button update local storage
// make add to cart button disabled if no toppings are selected
// maybe add events to enter key press

const sizeBtnDiv = document.querySelector('.size-btn-container');
const toppingBtnDiv = document.querySelector('.topping-btn-container');
const pizzaConstructorDiv = document.querySelector('.pizza-constructor-image');
const addBtn = document.getElementById('add-btn');

document.addEventListener('DOMContentLoaded', () => {
  displaySizes();
  displayIngredients();
  updateTotalCost();
});
addBtn.addEventListener('click', addPizzaToCart);

function displaySizes() {
  sizes.map(size => {
    const sizeBtn = document.createElement('button');
    sizeBtn.className = 'size-btn';
    sizeBtn.innerHTML = `<span class="pizza-size">${size.size}</span><span>£${size.price}</span>`;
    // set default size of medium
    if (size.size === 'm') {
      sizeBtn.classList.add('active');
    }
    sizeBtnDiv.appendChild(sizeBtn);
  });

  const sizeBtns = [...document.querySelectorAll('.size-btn')];
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      updateTotalCost();
      sizeBtns.forEach(btn => {
        btn.classList.remove('active');
      })
      btn.classList.add('active');
    });
  });
}

function displayIngredients() {
  ingredients.map(ingredient => {
    const ingredientBtn = document.createElement('button');
    ingredientBtn.className = 'topping-btn';
    ingredientBtn.textContent = ingredient.topping;
    toppingBtnDiv.appendChild(ingredientBtn);
    ingredientBtn.addEventListener('click', (e) => {
      ingredientBtn.classList.toggle('active');
      addTopping(e);
      updateTotalCost();
    })
  });
}

// add topping image to the pizza
function addTopping(e) {
  const currentTopping = e.target;
  const toppingFromDb = ingredients.find(el => el.topping === currentTopping.textContent);

  // add topping image
  if (currentTopping.classList.contains('active')) {
    const toppingImg = document.createElement('img');
    toppingImg.src = toppingFromDb.imgUrl;
    toppingImg.alt = toppingFromDb.topping;
    toppingImg.className = 'pizza-topping-image';
    toppingImg.id = toppingFromDb.id;
    toppingImg.style.zIndex = toppingFromDb.zIndex;
    pizzaConstructorDiv.appendChild(toppingImg);
  } else {
    // remove topping image
    const displayedToppings = document.querySelectorAll('.pizza-topping-image');

    for (let img of displayedToppings) {
      if (img.id === toppingFromDb.id) {
        pizzaConstructorDiv.removeChild(img);
      }
    }
  }
}

function updateTotalCost() {
  const selectedSize = sizeBtnDiv.querySelector('.active .pizza-size');

  let total; 
}

function addPizzaToCart() {
  //
}