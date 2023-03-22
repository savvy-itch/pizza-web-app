// https://i.ibb.co/5n7tb1h/logo.png
// https://i.ibb.co/QNSTZ0k/menu-pizza1.png
// https://i.ibb.co/Sndb6Cx/menu-pizza2.png
// https://i.ibb.co/prkCZ5P/menu-pizza3.png
// https://i.ibb.co/2qKRhyB/menu-pizza4.png
// https://i.ibb.co/vBTVPtw/menu-pizza5.png
// https://i.ibb.co/M7f3fg1/menu-pizza6.png
// https://i.ibb.co/wSfS4G5/menu-pizza7.png
// https://i.ibb.co/t8X4YXB/pizza2.png
// https://i.ibb.co/1R2pGx4/pizza-background.png
// https://i.ibb.co/yYRXmVM/pizza-background2.png
const menu = [
  {
    id: 1,
    title: 'Eatalian pizza',
    ingredients: 'Dough, Mozzarella, Cheddar, Blue, Parmesan',
    // imgUrl: './images/menu-pizza1.png',
    imgUrl: 'https://i.ibb.co/QNSTZ0k/menu-pizza1.png',
    price: {
      s: '10.25',
      m: '12.30',
      l: '14.75',
    },
    isDiscount: false,
  },
  {
    id: 2,
    title: 'Sicilian pizza',
    ingredients: 'Dough, Mozzarella, Cheddar, Blue, Parmesan',
    // imgUrl: './images/menu-pizza2.png',
    imgUrl: 'https://i.ibb.co/Sndb6Cx/menu-pizza2.png',
    price: {
      s: '12.25',
      m: '14.00',
      l: '15.82',
    },
    isDiscount: true,
  },
  {
    id: 3,
    title: 'Speedy pizza',
    ingredients: 'Dough, Mozzarella, Cheddar, Blue, Parmesan',
    // imgUrl: './images/menu-pizza3.png',
    imgUrl: 'https://i.ibb.co/prkCZ5P/menu-pizza3.png',
    price: {
      s: '9.00',
      m: '11.60',
      l: '13.45',
    },
    isDiscount: false,
  },
  {
    id: 4,
    title: 'L\'appetotosa',
    ingredients: 'Dough, mozzarella, barrel, eggs, Parmesan cheese',
    // imgUrl: './images/menu-pizza4.png',
    imgUrl: 'https://i.ibb.co/2qKRhyB/menu-pizza4.png',
    price: {
      s: '10.60',
      m: '12.52',
      l: '14.63',
    },
    isDiscount: false,
  },
  {
    id: 5,
    title: 'Squisita',
    ingredients: 'Dough, mozzarella, barrel, eggs, Parmesan cheese',
    // imgUrl: './images/menu-pizza5.png',
    imgUrl: 'https://i.ibb.co/vBTVPtw/menu-pizza5.png',
    price: {
      s: '11.40',
      m: '13.56',
      l: '16.90',
    },
    isDiscount: false,
  },
  {
    id: 6,
    title: 'Tomazio',
    ingredients: 'Dough, Mozzarella, Cheddar, tomatoes, Parmesan',
    imgUrl: './images/menu-pizza6.png',
    price: {
      s: '11.45',
      m: '13.15',
      l: '14.48',
    },
    isDiscount: false,
  },
  {
    id: 7,
    title: 'Peppa Pepperono',
    ingredients: 'Dough, pepperoni, mashrooms, tomatoes, Parmesan',
    imgUrl: './images/menu-pizza7.png',
    price: {
      s: '12.50',
      m: '14.10',
      l: '16.12',
    },
    isDiscount: false,
  },
]
export default menu;