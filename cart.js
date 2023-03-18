import {displayOrderQuantity} from './displayOrderQuantity.js';

const cartDiv = document.querySelector('.cart');
const confirmDiv = document.querySelector('.confirm-div');

const orders = localStorage.getItem('pizzas');
const storedOrders = JSON.parse(orders);

let cartOrders = [];

// update quantity on +/- click
// remove button functionality
// update total cost
// email order details on confirm
// after confirming order remove order from cart and storage

document.addEventListener('DOMContentLoaded', () => {
  setOrderAmount();
  displayOrder();
  displayOrderQuantity();
});

function setOrderAmount() {
  if (storedOrders !== null) {
    cartOrders = storedOrders.reduce((acc, obj) => {
      const index = acc.findIndex(item => item.title === obj.title && item.price === obj.price);
      if (index !== -1) {
        acc[index].amount++;
      } else {
        acc.push({ ...obj, amount: 1 });
      }
      return acc;
    }, []);
  }
}
console.log(cartOrders);

function displayOrder() {
  // if no orders were made
  if (storedOrders === null) {
    displayEmptyCartMsg();
  } else {
    cartOrders.map(item => {
      const { title, imgUrl, price, amount } = item;
      const orderDiv = document.createElement('div');
      orderDiv.className = 'order';
      const orderDetails = `
        <div class="order-image">
          <img src=${imgUrl} alt=${title}>
        </div>
        <div class="order-info">
          <p class="order-title">${title}</p>
          <p class="order-cost">£${price}</p>
          <button class="remove-btn">Remove</button>
        </div>
        <div class="amount-div">
          <button>-</button>
          <p>${amount}</p>
          <button>+</button>
        </div>`;
      orderDiv.innerHTML = orderDetails;
      cartDiv.appendChild(orderDiv);
      if (cartOrders.indexOf(item) !== cartOrders.length - 1) {
        const separationLine = document.createElement('div');
        separationLine.className = 'line';
        cartDiv.appendChild(separationLine);
      }
    });
  }
}

function displayEmptyCartMsg() {
  const emptyCartMsg = document.createElement('div');
  emptyCartMsg.className = 'empty-cart';
  let msgContent = `
    <p>No items in your cart yet :(</p>
    <img src="./images/empty pizza box.svg" alt="empty cart icon">
    <a href="./menu.html"><button>Go back shopping</button></a>`;
  emptyCartMsg.innerHTML = msgContent;
  cartDiv.appendChild(emptyCartMsg);
  confirmDiv.style.display = 'none';
}