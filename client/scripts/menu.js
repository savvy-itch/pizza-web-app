import {displayOrderQuantity} from './displayOrderQuantity.js';

// + sorting
// + pagination
// + filtering
  // + filter price in range
  // + display filters menu on the fe
  // + update products of filters submission 
// + add filters to every query
// hide sender email and secure token from the code
// split code into separate files
// error page
// collapse sidebar when user clicks outside of it

const menuGrid = document.getElementById('menu-grid');
const sortInput = document.getElementById('sort');
const paginationWrapper = document.getElementById('pagination-wrapper');
const filtersForm = document.getElementById('filters-form');
const ingredientFiltersFieldset = document.getElementById('ingredient-filters');
let discountPercent = 10;
let ordersArray = [];
const url =  'http://localhost:3000/api/pizzas';
const ingredientsUrl = 'http://localhost:3000/api/ingredients';
const numOfSkeletons = 4;
let ingredientsList = [];
let appliedFilters = ''

// add skeletons before data is fetched
for (let i = 0; i < numOfSkeletons; i++) {
  const skeleton = document.createElement('div');
  skeleton.className = 'skeleton';
  let content = `
    <div class="skeleton-img"></div>
      <div class="skeleton-info">
        <div class="skeleton-heading"></div>
        <div class="skeleton-info-heading"></div>
      </div>`
  skeleton.innerHTML = content;
  menuGrid.appendChild(skeleton);
};

fetch(url)
  .then(response => response.json())
  .then(MENU => {
    displayMenuItems(MENU.pizzas);
    listPageBtns(MENU); 
    displayOrderQuantity();
  })
  .catch(error => console.error(error));

document.addEventListener('DOMContentLoaded', fetchIngredients);

export function displayMenuItems(MENU) {
  menuGrid.innerHTML = '';
  const createPizzaCard = document.createElement('div');
  createPizzaCard.className = 'single-pizza';
  let content = `
    <img class="create-pizza-img" src="../images/create-pizza.webp" alt="create-pizza">
      <div class="create-pizza-info">
        <h3 class="pizza-info-heading">Create Your Own Pizza</h3>
        <p class="create-info-desc">Choose From Our Options Of Design 
          And Make Your Own Pizza.</p>
      </div>
      <a class="create-btn-link" href="./custom.html">
        <button class="create-btn btn">Create Now</button>
      </a>`;
  createPizzaCard.innerHTML = content;
  menuGrid.appendChild(createPizzaCard);
  MENU.map(item => {
    const singlePizza = document.createElement('div');
    singlePizza.className = 'single-pizza';
    let pizzaContent = `
      <div class="size-btn-container">
        <button class="size-btn">S</button>
        <button class="size-btn active">M</button>
        <button class="size-btn">L</button>
      </div>
      <img src=${item.imgUrl} loading="lazy" alt="pizza">
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
    menuGrid.appendChild(singlePizza);
    if (item.discount !== 0) {
      setDiscountTag(singlePizza, item.discount);
    }

    menuGrid.addEventListener('click', e => {
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
      addPizzaToCart(e, MENU);
      displayOrderQuantity();
    });
  });
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
    // check if discount wasn't already displayed (for M size by default)
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
function setDiscountTag(item, percent) {
  item.querySelector('.size-btn-container')
    .insertAdjacentHTML('afterend', `<div class="discount-tag">-${percent}%</div>`);
}

// calculate price with discount
function setDiscountPrice(price, percent) {
  price = (price - (price * percent/100)).toFixed(2);
  return price;
}

// add order to local storage
function addPizzaToCart(e, MENU) {
  const currentPizza = e.target.parentElement;
  const currentSize = currentPizza.querySelector('.active').textContent.toLowerCase();
  const pizzaTitle = currentPizza.querySelector('.pizza-info-heading').textContent;
  const pizzaFromDb = MENU.find(elem => elem.title === pizzaTitle);
  const {title, imgUrl, price, discount} = pizzaFromDb;
  const pizzaDataToStore = {title, imgUrl, discount};
  pizzaDataToStore.price = discount !== 0 ? setDiscountPrice(price[currentSize], discountPercent) : price[currentSize];
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

sortInput.addEventListener('change', () => {
  fetch(`${url}?${appliedFilters}&sort=${sortInput.value}`)
  .then(response => response.json())
  .then(menu => {
    displayMenuItems(menu.pizzas); 
  })
  .catch(error => console.error(error));
});

function fetchData(url) {
  return fetch(url)
  .then(response => response.json())
  .then(MENU => {
    displayMenuItems(MENU.pizzas);
    listPageBtns(MENU); 
    displayOrderQuantity();
  })
  .catch(error => console.error(error));
}

function listPageBtns(res) {
  paginationWrapper.innerHTML = '';
  // add prev page button 
  const prevPage = document.createElement('button');
  prevPage.disabled = res.page === 1;
  prevPage.addEventListener('click', () => {
    fetchData(`${url}?${appliedFilters}&page=${res.page - 1}`);
  });
  prevPage.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`;
  paginationWrapper.appendChild(prevPage);

  // add current page number
  const currPagePara = document.createElement('p');
  currPagePara.textContent = res.page;
  paginationWrapper.appendChild(currPagePara);

  // add next page button
  const hasMore = (res.totalAmount - res.skip - res.amount) > 0;
  const nextPage = document.createElement('button');
  nextPage.disabled = !hasMore;
  nextPage.addEventListener('click', () => {
    fetchData(`${url}?${appliedFilters}&page=${res.page + 1}`);
  });
  nextPage.innerHTML = `<i class="fa-solid fa-chevron-right"></i>`;
  paginationWrapper.appendChild(nextPage);
}

// Sidebar toggle
const toggleBtn = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector(".sidebar");
const closeBtn = document.querySelector('.close-btn');

toggleBtn.addEventListener('click', function() {
  sidebar.classList.toggle('show-sidebar');
});

closeBtn.addEventListener('click', function() {
  sidebar.classList.remove('show-sidebar');
})

// Filters
function fetchIngredients() {
  return fetch(ingredientsUrl)
  .then(response => response.json())
  .then(data => ingredientsList = data.ingredients)
  .then(() => displayIngredients())
  .catch(error => console.error(error));
}

function displayIngredients() {
  ingredientsList.map(item => {
    const ingredientInput = document.createElement('div')
    ingredientInput.innerHTML = `
      <label>
        <input type="checkbox" id=${item.name} name="ingredients" value=${item.name}>
        ${item.name}
      </label>
    `
    ingredientFiltersFieldset.appendChild(ingredientInput);
  })
}

filtersForm.addEventListener('submit', (e) =>handleFormSubmission(e));

function handleFormSubmission(e) {
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
  const urlWithFilters = `${url}?${appliedFilters}&sort=${sortInput.value}`;
  
  fetch(urlWithFilters)
    .then(response => response.json())
    .then(MENU => {
      displayMenuItems(MENU.pizzas);
      listPageBtns(MENU); 
    })
    .catch(error => console.error(error));
  
  setTimeout(() => sidebar.classList.remove('show-sidebar'), 150);
}
