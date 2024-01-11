const filtersForm = document.getElementById('filters-form');
const ingredientFilters = document.getElementById('ingredient-filters');

const baseUrl =  'http://localhost:3000/api/pizzas';

document.addEventListener('DOMContentLoaded', fetchData())

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