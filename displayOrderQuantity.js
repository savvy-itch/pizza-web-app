export function displayOrderQuantity() {
  const storedOrders = localStorage.getItem('pizzas');
  const quantityDiv = document.querySelectorAll('.order-quantity')

  // if orders quantity > 0
  if (storedOrders) {
    const ordersArray = JSON.parse(storedOrders);
    quantityDiv.forEach(el => el.textContent = ordersArray.length);
  }
}