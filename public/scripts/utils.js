import { numOfSkeletons } from "./globals.js";

// add skeletons before data is fetched
export function displaySkeletons(menuGrid) {
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
}

// order quantity next to cart icon in navbar
export function displayOrderQuantity() {
  console.log('displayOrderQuantity')
  const storedOrders = localStorage.getItem('pizzas');
  // there's 2 quantity divs - one for desktop, one for mobile
  const quantityDiv = document.querySelectorAll('.order-quantity');
  let amount;

  // if orders quantity > 0
  if (storedOrders) {
    const ordersArray = JSON.parse(storedOrders);
    if(ordersArray.length) {
      amount = ordersArray.reduce((acc, obj) => acc + obj.amount, 0);
      quantityDiv.forEach(el => el.textContent = amount > 9 ? '9+' : amount);
    } else {
      quantityDiv.forEach(el => el.textContent = '');
    }
  } else {
    quantityDiv.forEach(el => el.textContent = '');
  }
}