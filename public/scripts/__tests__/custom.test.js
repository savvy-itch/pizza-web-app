import {JSDOM} from 'jsdom';
import fs from 'fs';
import path from 'path';
import { createSizeBtn, displayIngredients, sizesList, updateTotalCost, toppingsZIndex } from "../custom";
import { fireEvent, getAllByLabelText, getByText } from '@testing-library/dom';

const html = fs.readFileSync(path.resolve(__dirname, '../../custom.html'), 'utf8');

let dom;
let document;
const ingredients = [
  {
    _id: '6598f6b425f82811512c6ff9',
    name: "Cheese",
    price: 2.3,
    imgUrl: 'https://i.ibb.co/HFkc3p9/cheese.png',
  }
];

describe('testing individual functions', () => {
  beforeAll(() => {
    dom = new JSDOM(html);
    document = dom.window.document;
  });
  
  test('creates size buttons with default size set to "M"', () => {
    const sizeBtnDiv = document.querySelector('.size-btn-container');
    sizesList.map(item => {
      createSizeBtn(item, sizeBtnDiv);
    })
    const sizeBtns = getAllByLabelText(document, 'size-btn');
    const activeBtnByDefault = sizeBtns.find(btn => /M/i.test(btn.textContent));
    expect(sizeBtns.length).toBe(sizesList.length);
    expect(activeBtnByDefault).toHaveClass('active');
  });

  test('creates ingredient buttons', () => {
    const toppingBtnDiv = document.querySelector('.topping-btn-container');
    displayIngredients(ingredients, toppingBtnDiv, toppingsZIndex);
    const toppingBtn = getByText(document, 'Cheese');
    expect(toppingBtn).toBeInTheDocument();
  });

  test('sets total cost to the price of the default size', () => {
    const totalPrice = document.querySelector('.total-price');
    const sizeBtnDiv = document.querySelector('.size-btn-container');
    const toppingBtnDiv = document.querySelector('.topping-btn-container');
    let total = 0;
    const addBtn = document.getElementById('add-btn');
    updateTotalCost(sizesList, ingredients, sizeBtnDiv, toppingBtnDiv, addBtn, totalPrice);
    const defaultSize = sizesList.find(size => size.size === 'm');
    expect(totalPrice.textContent).toBe(`£${defaultSize.price}`);
  });
});

describe('displaySizes()', () => {
  beforeAll(() => {
    dom = new JSDOM(html);
    document = dom.window.document;
  });

  test('updates total cost on size change', () => {
    const totalPrice = document.querySelector('.total-price');
    const sizeBtnDiv = document.querySelector('.size-btn-container');
    const toppingBtnDiv = document.querySelector('.topping-btn-container');
    let total = 0;
    const addBtn = document.getElementById('add-btn');

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
        updateTotalCost(sizesList, ingredients, sizeBtnDiv, toppingBtnDiv, addBtn, totalPrice);
      });
    });

    const smallSizeBtn = document.querySelector('.size-btn[data-size="s"]');
    
    fireEvent.click(smallSizeBtn);

    const smallSize = sizesList.find(size => size.size === 's');
    expect(totalPrice.textContent).toBe(`£${smallSize.price}`); // 7.25

  });

  test('updates total cost on ingredient button click', () => {
    const totalPrice = document.querySelector('.total-price');
    const sizeBtnDiv = document.querySelector('.size-btn-container');
    const toppingBtnDiv = document.querySelector('.topping-btn-container');
    const pizzaConstructorDiv = document.querySelector('.pizza-constructor-image');
    let total = 0;
    const addBtn = document.getElementById('add-btn');

    ingredients.map(ingredient => {
      const ingredientBtn = toppingBtnDiv.ownerDocument.createElement('button');
      ingredientBtn.className = 'topping-btn';
      ingredientBtn.textContent = ingredient.name;
      toppingBtnDiv.appendChild(ingredientBtn);
      ingredientBtn.addEventListener('click', (e) => {
        ingredientBtn.classList.toggle('active');
        updateTotalCost(sizesList, ingredients, sizeBtnDiv, toppingBtnDiv, addBtn, totalPrice);
      })
    });

    const toppingBtn = document.querySelector('.topping-btn');

    // add ingredient
    fireEvent.click(toppingBtn);

    const smallSize = sizesList.find(size => size.size === 's');
    expect(totalPrice.textContent).toBe(`£${smallSize.price + ingredients[0].price}`); // 7.25 + 2.3 = 9.55

    // remove ingredient
    fireEvent.click(toppingBtn);

    expect(totalPrice.textContent).toBe(`£${smallSize.price}`); // 7.25
  })
})