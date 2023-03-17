import menu from './data.js';
// add random discount
// on add click, add pizza to cart and display number on cart icon;

const menuGrid = document.getElementById('menu-grid');
let discountPercent = 10;

document.addEventListener('DOMContentLoaded', displayMenuItems);

function displayMenuItems() {
  menu.map(item => {
    const singlePizza = document.createElement('div');
    singlePizza.className = 'single-pizza';
    let pizzaContent = `
      <div class="size-btn-container">
        <button class="size-btn">S</button>
        <button class="size-btn active">M</button>
        <button class="size-btn">L</button>
      </div>
      <img src=${item.imgUrl} alt="pizza">
      <div class="single-pizza-info">
        <p class="pizza-price">
        ${item.isDiscount
          ? `<span id="discount-old-price">£${item.price.m}</span>
            £${setDiscountPrice(item.price.m, discountPercent)}</p>`
          : `£${item.price.m}`
        }
        </p>
        <h3 class="pizza-info-heading">${item.title}</h3>
        <p class="pizza-info-desc">${item.ingredients}</p>
      </div>
      <button class="add-btn">Add</button>`;
    singlePizza.innerHTML = pizzaContent;
    menuGrid.appendChild(singlePizza);
    if (item.isDiscount) {
      setDiscountTag(singlePizza, discountPercent);
    }

    const sizeBtns = [...singlePizza.querySelectorAll('.size-btn')];
    sizeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        changeSize(e);
        sizeBtns.forEach(btn => {
          btn.classList.remove('active');
        })
        btn.classList.add('active');
      });
    });
  });
}

// change price on size button click
function changeSize(e) {
  const currentSize = e.target.innerText;
  const singlePizza = e.target.parentElement.parentElement;
  const pizzaTitle = singlePizza.querySelector('.pizza-info-heading').innerText;
  // find object with the name of current pizza
  let pizzaFromDb = menu.find(elem => elem.title === pizzaTitle);
  let newPrice = pizzaFromDb.price[currentSize.toLowerCase()];
  // if the pizza has a discount
  if (pizzaFromDb.isDiscount) {
    // console.log(newPrice);
    newPrice = setDiscountPrice(newPrice, discountPercent);
    // console.log(newPrice);
    singlePizza.querySelector('.pizza-price').textContent = `£${newPrice}`;
  } else {
    singlePizza.querySelector('.pizza-price').textContent = `£${newPrice}`;
  }
  displayDiscountPrice(e.target.parentElement.parentElement);
}

function setDiscountTag(item, percent) {
  // add discount tag on pizza
  item.querySelector('.size-btn-container')
    .insertAdjacentHTML('afterend', `<div class="discount-tag">-${percent}%</div>`);
}

// calculate price with discount
function setDiscountPrice(price, percent) {
  price = (price - (price * percent/100)).toFixed(2);
  return price;
}

// !!!!!!!!!!!!!! неверно работает
function displayDiscountPrice(pizzaElement) {
  const priceElement = pizzaElement.querySelector('.pizza-price');
  const pizzaTitle = pizzaElement.querySelector('.pizza-info-heading').innerText;
  const pizzaFromDb = menu.find(elem => elem.title === pizzaTitle);
  const currentSize = pizzaElement.querySelector('.active').textContent;
  const oldPrice = pizzaFromDb.price[currentSize.toLowerCase()];
  const newContent = `
    <span id="discount-old-price">£${oldPrice}</span>
    £${setDiscountPrice(oldPrice, discountPercent)}
  `
  priceElement.innerHTML = newContent;
}