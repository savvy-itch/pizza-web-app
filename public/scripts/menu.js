import { pizzasUrl } from './globals.js';
import { fetchIngredients } from './sidebar.js';
import { displaySkeletons, displayOrderQuantity } from './utils.js';

const menuGrid = document.getElementById('menu-grid');
const sortInput = document.getElementById('sort');
const paginationWrapper = document.getElementById('pagination-wrapper');
const filtersForm = document.getElementById('filters-form');
const sidebar = document.querySelector(".sidebar");

let ordersArray = [];
let appliedFilters = '';

fetchData(pizzasUrl);

export function fetchData(url) {
  displaySkeletons(menuGrid);
  return fetch(url)
    .then(response => response.json())
    .then(MENU => {
      displayMenuItems(MENU.pizzas, menuGrid);
      listPageBtns(MENU, paginationWrapper); 
      displayOrderQuantity();
    })
    .catch(error => console.error(error));
}

document.addEventListener('DOMContentLoaded', fetchIngredients);

function displayMenuItems(MENU, containerElement) {
  containerElement.innerHTML = '';
  containerElement.appendChild(createCustomPizzaCard());

  // no results
  if (MENU.length === 0) {
    containerElement.appendChild(createNoResultsCard());
  } else {
    MENU.map(item => {
      const singlePizza = createPizzaCard(item);
      containerElement.appendChild(singlePizza);
      if (item.discount !== 0) {
        setDiscountTag(singlePizza, item.discount);
      }
  
      containerElement.addEventListener('click', e => {
        const sizeBtn = e.target.closest('.size-btn');
        if (sizeBtn) {
          changeSize(sizeBtn, MENU);
          const sizeBtns = [...sizeBtn.parentElement.children];
          sizeBtns.forEach(btn => {
            btn.classList.remove('active');
          })
          sizeBtn.classList.add('active');
        }
      });
      const addBtn = singlePizza.querySelector('.add-btn');
      addBtn.addEventListener('click', (e) => {
        addPizzaToCart(e.target.parentElement, MENU);
        displayOrderQuantity();
      });
    });
  }
}

function createCustomPizzaCard() {
  const customPizzaCard = document.createElement('div');
  customPizzaCard.className = 'single-pizza';
  let content = `
    <img class="create-pizza-img" height="361" width="350" src="../images/create-pizza.webp" alt="create-pizza">
      <div class="create-pizza-info">
        <h3 class="pizza-info-heading">Create Your Own Pizza</h3>
        <p class="create-info-desc">Choose from our topping options 
          and make your own pizza.
        </p>
      </div>
      <a class="create-btn-link" href="./custom.html">
        <button class="create-btn btn">Create Now</button>
      </a>`;
  customPizzaCard.innerHTML = content;
  return customPizzaCard;
}

function createNoResultsCard() {
  const noResultsCard = document.createElement('div');
  noResultsCard.className = 'no-results';
  let pizzaContent = `<h3>Sorry, no results :(</h3>`;
  noResultsCard.innerHTML = pizzaContent;
  return noResultsCard;
}

function createPizzaCard(item) {
  const singlePizza = document.createElement('div');
  singlePizza.className = 'single-pizza';
  let pizzaContent = `
    <div class="size-btn-container">
      <button class="size-btn">S</button>
      <button class="size-btn active">M</button>
      <button class="size-btn">L</button>
    </div>
    <img height="274" width="300" src=${item.imgUrl} loading="lazy" alt="pizza">
    <div class="single-pizza-info">
      <p class="pizza-price">
      ${item.discount !== 0
        ? `<span class="discount-old-price">£${item.price.m}</span>
          £${setDiscountPrice(item.price.m, item.discount)}</p>`
        : `£${item.price.m}`
      }
      </p>
      <h3 class="pizza-info-heading">${item.title}</h3>
      <p class="pizza-info-desc">${item.ingredients.map(i => ` ${i.name}`)}</p>
    </div>
    <button class="add-btn btn">Add</button>`;
  singlePizza.innerHTML = pizzaContent;
  return singlePizza;
}

// change price on size button click
function changeSize(sizeBtn, MENU) {
  const currentSize = sizeBtn.innerText;
  const singlePizza = sizeBtn.parentElement.parentElement;
  const pizzaTitle = singlePizza.querySelector('.pizza-info-heading').innerText;
  // find object with the name of current pizza
  const pizzaFromDb = MENU.find(elem => elem.title === pizzaTitle);
  let newPrice = pizzaFromDb.price[currentSize.toLowerCase()];
  const priceElement = singlePizza.querySelector('.pizza-price');
  // display new price
  // if the pizza has a discount
  if (pizzaFromDb.discount !== 0) {
    // check if discount wasn't already displayed (M size by default)
    if (!priceElement.querySelector('.discount-old-price')) {
      newPrice = setDiscountPrice(newPrice, pizzaFromDb.discount);
    }
    const newContent = `
      <span class="discount-old-price">£${newPrice}</span>
      £${setDiscountPrice(newPrice, pizzaFromDb.discount)}`
    priceElement.innerHTML = newContent;
  } else {
    singlePizza.querySelector('.pizza-price').textContent = `£${newPrice}`;
  }
}

// add discount tag on pizza
export function setDiscountTag(item, percent) {
  item.querySelector('.size-btn-container')
    .insertAdjacentHTML('afterend', `<div class="discount-tag">-${percent}%</div>`);
}

// calculate price with discount
function setDiscountPrice(price, percent) {
  price = Number((price - (price * percent/100)).toFixed(2));
  return price;
}

// add order to local storage
function addPizzaToCart(currentPizza, MENU) {
  const currentSize = currentPizza.querySelector('.active').textContent.toLowerCase();
  const pizzaTitle = currentPizza.querySelector('.pizza-info-heading').textContent;
  const pizzaFromDb = MENU.find(elem => elem.title === pizzaTitle);
  const {title, imgUrl, price, discount} = pizzaFromDb;
  const pizzaDataToStore = {title, imgUrl, discount};
  pizzaDataToStore.price = discount !== 0 ? setDiscountPrice(price[currentSize], discount) : Number(price[currentSize]);
  pizzaDataToStore.size = currentSize;
  pizzaDataToStore.amount = 1;
  const orders = localStorage.getItem('pizzas') ?? '[]';
  let storedOrders = JSON.parse(orders);

  let isMatchFound = false;
  ordersArray = storedOrders.reduce((acc, obj) => {
    // if such order is already in the array
    if (obj.title === pizzaDataToStore.title && obj.price === pizzaDataToStore.price) {
      // increase its amount
      obj.amount++;
      isMatchFound = true;
    }
    acc.push(obj);
    return acc;
  }, [])
  // if there's no such order in the array
  if (!isMatchFound) {
    // add it to the array
    ordersArray.push(pizzaDataToStore);
  } else {
    // set back the flag to false for the next iteration
    isMatchFound = false;
  }
  localStorage.setItem('pizzas', JSON.stringify(ordersArray));
}

// ======== SORTING =========

sortInput.addEventListener('change', () => {
  displaySkeletons(menuGrid);
  fetch(`${pizzasUrl}?${appliedFilters}&sort=${sortInput.value}`)
    .then(response => response.json())
    .then(menu => {
      displayMenuItems(menu.pizzas, menuGrid); 
    })
    .catch(error => console.error(error));
});

// ======= PAGINATION ==========

function listPageBtns(res, wrapperElement) {
  wrapperElement.innerHTML = '';
  // add prev page button 
  const prevPage = document.createElement('button');
  prevPage.disabled = res.page === 1;
  prevPage.ariaLabel = "Previous";
  prevPage.addEventListener('click', () => {
    fetchData(`${pizzasUrl}?${appliedFilters}&page=${res.page - 1}`);
  });
  prevPage.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`;
  wrapperElement.appendChild(prevPage);

  // add current page number
  const currPagePara = document.createElement('p');
  currPagePara.textContent = res.page;
  wrapperElement.appendChild(currPagePara);

  // add next page button
  const hasMore = (res.totalAmount - res.skip - res.amount) > 0;
  const nextPage = document.createElement('button');
  nextPage.disabled = !hasMore;
  nextPage.ariaLabel = "Next";
  nextPage.addEventListener('click', () => {
    fetchData(`${pizzasUrl}?${appliedFilters}&page=${res.page + 1}`);
  });
  nextPage.innerHTML = `<i class="fa-solid fa-chevron-right"></i>`;
  wrapperElement.appendChild(nextPage);
}

// =========== FILTERS ==============

filtersForm.addEventListener('submit', (e) =>handleFormSubmission(e));

function handleFormSubmission(e) {
  displaySkeletons(menuGrid);
  e.preventDefault();
  const formData = new FormData(filtersForm);
  let numericFilters = 'numericFilters=';
  const minPrice = formData.get('min-price');
  const maxPrice = formData.get('max-price');
  const discountFilter = formData.get('discount');
  const ingredientFilters = formData.getAll('ingredients');

  if (minPrice > 0) {
    numericFilters += 'price.m>=' + minPrice;
  }
  if (maxPrice < 100) {
    numericFilters += `${minPrice > 0 ? ',price.m<=' : 'price.m<='}` + maxPrice;
  }
  if (discountFilter) {
    numericFilters += `${(minPrice > 0 || maxPrice < 100) ? ',discount' : 'discount'}` + discountFilter;
  }
  appliedFilters = `${numericFilters}${ingredientFilters && `&ingredients=${ingredientFilters.join(',')}`}`;
  const urlWithFilters = `${pizzasUrl}?${appliedFilters}&sort=${sortInput.value}`;
  
  fetch(urlWithFilters)
    .then(response => response.json())
    .then(MENU => {
      displayMenuItems(MENU.pizzas, menuGrid);
      listPageBtns(MENU, paginationWrapper); 
    })
    .catch(error => console.error(error));
  // timeout for a less rapid collapsing
  setTimeout(() => sidebar.classList.remove('show-sidebar'), 150);
}