// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }
  static getList = () => this.#list
  static getById = (id) =>
    this.#list.find((user) => user.id === id)
  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  static updateById = (id, data) => {
    const user = this.getById(id)
    if (user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }
  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}
// ================================================================
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body
  const user = new User(email, login, password)
  User.add(user)
  console.log(User.getList())
  res.render('success-info', {
    style: 'success-info',
    info: 'User created',
  })
})
router.get('/user-delete', function (req, res) {
  const { id } = req.query
  User.deleteById(Number(id))

  res.render('success-info', {
    style: 'success-info',
    info: 'User deleted',
  })
})
router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body
  let result = false
  const user = User.getById(Number(id))
  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }
  res.render('success-info', {
    style: 'success-info',
    info: result ? 'Email changed' : 'Error',
  })
})

// ================================================================
// ================================================================
class Product {
  static #list = []

  constructor(name, price, description) {
    this.id = Math.floor(Math.random() * 90000) + 10000
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }
  static getList = () => this.#list
  static add = (product) => {
    this.#list.push(product)
  }
  static getById = (id) =>
    this.#list.find((product) => product.id === id)
  static updateById = (id, data) => {
    const product = this.getById(id)
    if (product) {
      Object.assign(product, data)
    }
    return product
  }
  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}
// ================================================================
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
// GET /product-create (форма створення продукту)
router.get('/product-create', (req, res) => {
  res.render('product-create')
})

// POST /product-create (створення продукту)
router.post('/product-create', (req, res) => {
  const { name, price, description } = req.body
  const newProduct = new Product(name, price, description)
  Product.add(newProduct)
  res.render('alert', {
    message: 'Product created successfully',
    redirect: '/product-list',
  })
})
router.get('/product-list', (req, res) => {
  const products = Product.getList()
  res.render('product-list', { products })
})
router.get('/product-edit', (req, res) => {
  const { id } = req.query
  const product = Product.getById(parseInt(id))
  if (product) {
    res.render('product-edit', { product })
  } else {
    res.render('alert', {
      message: 'Product not found',
      redirect: '/product-list',
    })
  }
})
router.post('/product-edit', (req, res) => {
  const { id, name, price, description } = req.body
  const updatedProduct = Product.updateById(parseInt(id), {
    name,
    price,
    description,
  })
  if (updatedProduct) {
    res.render('alert', {
      message: 'Product updated successfully!',
      redirect: '/product-edit',
    })
  }
})
router.get('/product-delete', (req, res) => {
  const { id } = req.query
  const success = Product.deleteById(parseInt(id))
  if (success) {
    res.render('alert', {
      redirect: '/product-edit',
      message: 'Product deleted successfully!',
    })
  } else {
    res.render('alert', {
      redirect: '/product-edit',
      message: 'Product not found',
    })
  }
})
module.exports = router
