const sortInput = document.getElementById('sort');

sortInput.addEventListener('change', () => {
  fetch(`${url}?sort=${sortInput.value}`)
  .then(response => response.json())
  .then(menu => {
    displayMenuItems(menu.pizzas); 
  })
  .catch(error => console.error(error));
})