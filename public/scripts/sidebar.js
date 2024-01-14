import { ingredientsUrl } from "./globals.js";

const toggleBtn = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector(".sidebar");
const closeBtn = document.querySelector('.close-btn');
const ingredientFiltersFieldset = document.getElementById('ingredient-filters');
let ingredientsList = [];

toggleBtn.addEventListener('click', function() {
  sidebar.classList.toggle('show-sidebar');
  toggleBtn.classList.toggle('sidebar-toggle-on');
});

closeBtn.addEventListener('click', function() {
  sidebar.classList.remove('show-sidebar');
  toggleBtn.classList.remove('sidebar-toggle-on');
})

document.addEventListener('click', (e) => {
  // collapse sidebar when clicked outside of it
  if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
    sidebar.classList.remove('show-sidebar');
    toggleBtn.classList.remove('sidebar-toggle-on');
  }
});

export function fetchIngredients() {
  return fetch(ingredientsUrl)
    .then(response => response.json())
    .then(data => ingredientsList = data.ingredients)
    .then(() => displayIngredientsList())
    .catch(error => console.error(error));
}

function displayIngredientsList() {
  ingredientsList.map(item => {
    const ingredientInput = document.createElement('div')
    ingredientInput.innerHTML = `
      <label class="checkbox-label">${item.name}
        <input type="checkbox" id=${item.name} name="ingredients" value=${item.name}>
        <span class="checkmark"></span>
      </label>
    `
    ingredientFiltersFieldset.appendChild(ingredientInput);
  })
}