import express from 'express';
import cors from 'cors';

import data from './data.js';


const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/api/products', (req, res) => {

  console.log(data.products)
  res.send(data.products)
})



const port = process.env.PORT || 4001;

app.listen(port, () => {
  console.log(`Server running in port http:/localhost:${port}`)
})