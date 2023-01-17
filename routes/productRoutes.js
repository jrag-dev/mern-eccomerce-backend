import express from 'express';
import Product from '../models/productModel.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  let categories = []

  if (products.length > 0) {
    products.forEach(product => {
      if (!categories.includes(product.category)) {
        categories.push(product.category)
      }
    })
  }

  console.log(categories);

  res.json({ products, categories })
})

productRouter.get('/slug/:slug', async (req, res) => {
  // const product = data.products.find(item => item.slug === req.params.slug);

  const product = await Product.findOne({ slug: req.params.slug })

  if (product) {
    res.json(product);
  }
  else {
    res.status(404).json({ message: 'Producto no encontrado.'})
  }
})


productRouter.get('/:id', async (req, res) => {
  // const product = data.products.find(item => item._id === req.params.id);

  const product = await Product.findById({ _id: req.params.id })

  if (product) {
    res.json(product);
  }
  else {
    res.status(404).json({ message: 'Producto no encontrado.'})
  }
})


productRouter.post('/search/:query', async (req, res, next) => {
  const { query } = req.params
  const product = await Product.find({ name: new RegExp(query, 'i') })
  
  if (product.length === 0) {
    res.status(404).json({ message: 'Producto no encontrado'})
    next()
  }
  else {
    res.json(product)
  }
})


productRouter.post('/search/category/:query', async (req, res, next) => {
  const { query } = req.params

  let products;

  if (query === 'all') {
    products = await Product.find()
  }
  else {
    products = await Product.find({ category: new RegExp(query, 'i') })
  }
  
  if (products.length === 0) {
    res.status(404).json({ message: 'Producto no encontrado'})
    next()
  }
  else {
    res.json(products)
  }
})


productRouter.get('/categories', async (req, res, next) => {
  const products = await Product.find({ category });

  if (products.length === 0) {
    res.status(404).json({ message: 'Productos no encontrados'})
  }
  else {
    res.json(products)
    next()
  }
})



export default productRouter;