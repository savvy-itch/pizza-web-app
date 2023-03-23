# Pizza Store Website

This is a pizza website project. Here's a [live version of it](https://prog-pizza-website.netlify.app). 

## Structure

- Home
- Menu
- Custom Pizza Creator
- Contact
- Cart
- Form

### Home

Basic home page. Has a navbar and links to other pages. No functionality.

### Menu

Menu page asynchronously fetches data from menu.json to display its layout.

**Functionality**:
1. Create custom pizza
2. Add pizza to cart
3. Change size of pizza (price changes dynamically)
4. Cart icon in navbar has order count which updates in real time (on every page)
5. Some items have discount tag (not static) and discount price that's taken to account in cost calculations
6. All changes are being stored in local storage

### Custom Pizza Creator

The page asynchronously fetches ingredients data from ingredients.json to display sizes and toppings.

**Functionality**:
1. Size of pizza can be changed
2. Toppings can be added or removed. Their images are also being displayed or hidden when chosen
3. Total price of the custom pizza updates in real time and is displayed in 'Add to Cart' button
4. By default 'Add to Cart' button is disabled to prevent adding empty pizzas without toppings to the cart

### Contact

Contact page. No functionality.

### Cart

Cart page displays user's current order (pizza image, title, price, amount, total cost).

**Functionality**
1. User can change amount of each pizza that updates total cost and order quiantity in cart icon
2. If amount of a pizza is less than 1, then the pizza gets removed from the cart
3. Remove button removes a pizza from the cart
4. Confirm button links to order confirmation page
5. If the cart is empty, then Confirm button is hidden and special empty cart message is displayed. 

### Form

Form page queries user's name, phone number and email and sends email about the order details.

**Functionality**
1. Each input has validator functions that triggers an alert (used *SweetAlerts*) message when something is wrong
2. If everything's correct an email is sent to user (used *SMTP.js*)
3. Email displays user's contact information and order details similar to the cart page.

#### The website is fully responsive.