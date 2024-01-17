import {displayOrderQuantity} from './utils.js';

const confirmBtn = document.getElementById('confirm-btn');
const nameInput = document.getElementById('name-input');
const phoneInput = document.getElementById('phone-input');
const emailInput = document.getElementById('email-input');
const orders = localStorage.getItem('pizzas');
let storedOrders = JSON.parse(orders);
let emailTotal = 0;

confirmBtn.addEventListener('click', (e) => {
  e.preventDefault();
  checkNameValidity();
  checkNumberValidity();
  checkEmailValidity();
  console.log(storedOrders);
  if (!storedOrders || storedOrders.length === 0) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Error',
      text: 'You don\'t have any orders to submit. Please choose products from our menu',
      showConfirmButton: false,
      timer: 2500
    });
  } else if (checkNameValidity() && checkNumberValidity() && checkEmailValidity()) {
    getTotalCost();
    sendEmail();
    localStorage.removeItem('pizzas');
    storedOrders = [];
    displayOrderQuantity();
  } else {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Error',
      text: 'Please enter correct values',
      showConfirmButton: false,
      timer: 2500
    });
  }
})

function checkNameValidity() {
  if (nameInput.value) {
    nameInput.style.border = '2px solid black';
    // names without numbers and special symbols aside from "."
    const result = !/[^a-zа-яіїє \.]/i.test(nameInput.value);
    result 
      ? nameInput.style.border = '2px solid black' 
      : nameInput.style.border = '2px solid red'; 
    return result;
  } else {
    nameInput.style.border = '2px solid red';
    return false;
  }
}

function checkNumberValidity() {
  // if input is not empty
  if (phoneInput.value) {
    phoneInput.style.border = '2px solid black';
    // check for a number of 12 digits strating with +380
    let result = /^[\+]380\d{9}$/.test(phoneInput.value);
    result 
      ? phoneInput.style.border = '2px solid black' 
      : phoneInput.style.border = '2px solid red'; 
    return result;
  } else {
    phoneInput.style.border = '2px solid red';
    return false;
  }
}

// function taken from https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
function checkEmailValidity() {
  if (emailInput.value) {
    emailInput.style.border = '2px solid black';
    let result = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(emailInput.value);
    result 
      ? emailInput.style.border = '2px solid black' 
      : emailInput.style.border = '2px solid red'; 
    return result;
  } else {
    emailInput.style.border = '2px solid red';
    return false;
  }
}

function getTotalCost() {
  storedOrders.forEach(pizza => {
    let pizzaPrice = pizza.price * pizza.amount;
    emailTotal += pizzaPrice;
  })
  emailTotal = Number(emailTotal).toFixed(2);
}

function sendEmail() {
  const reqBody = {
    to: nameInput.value,
    phoneNumber: phoneInput.value,
    toEmail: emailInput.value,
    order: storedOrders,
    emailTotal
  }

  return fetch ('/form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqBody)
  })
  .then(response => response.json())
  .then(Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Email sent',
    text: 'Check your inbox for our letter',
    showConfirmButton: true,
    })
  )
  .catch(err => console.log(err));
}