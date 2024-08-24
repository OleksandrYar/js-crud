// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list = []
  static #count = 0
  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }
  static add = (...data) => {
    const newProduct = new Product(...data)
    this.#list.push(newProduct)
  }
  static getList = () => {
    return this.#list
  }
  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }
  static getRandomList = (id) => {
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )
    const shuffedList = filteredList.sort(
      () => Math.random() - 0.5,
    )
    return shuffedList.slice(0, 3)
  }
}
class Purchase {
  static DELIVERY_PRICE = 150
}
Product.add(
  'https://picsum.photos/200/300',
  'The Cool Book',
  'The book boooook booooooooook',
  [
    { id: 1, text: 'Ready to sent' },
    { id: 2, text: 'Top sales' },
  ],
  500,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  'The Cool Book',
  'The book boooook booooooooook',
  [{ id: 2, text: 'Top sales' }],
  1000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  'The Cool Book',
  'The book boooook booooooooook',
  [{ id: 1, text: 'Ready to sent' }],
  300,
  10,
)
// ================================================================
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки

router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',
    data: {
      list: Product.getList(),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-product', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-product',
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
      data: {
        message: 'Error',
        info: 'Incorrect amount of products',
        link: `/purchase-product?id=${id}`,
      },
    })
  }
  const product = Product.getById(id)
  if (product.amount < 1) {
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
      data: {
        message: 'Error',
        info: 'Not in stock',
        link: `/purchase-product?id=${id}`,
      },
    })
  }
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-product', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-product',
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE

  res.render('purchase-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-create',
    data: {
      cart: [
        {
          text: `${product.title} (${amount})`,
          price: productPrice,
        },
        {
          text: 'Deliver',
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
    },
  })
})

// ↑↑ сюди вводимо JSON дані
router.post('/purchase-submit', function (req, res) {
  console.log(req.body)

  res.render('alert', {
    style: 'alert',

    data: {
      message: 'Success',
      info: 'Order created',
      link: '/purchase-list',
    },
  })
})
module.exports = router
