

export default function pizzasRequest(url) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      pizzas ? resolve(pizzas) : reject({ error: `no data found`})
    })
  })
}