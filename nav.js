const navToggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.links');
const cartBtn = document.querySelector('.cart-link');
const cartBtnSm = document.querySelector('.cart-link-sm');

navToggle.addEventListener('click', function() {
  links.classList.toggle('show-links');
});