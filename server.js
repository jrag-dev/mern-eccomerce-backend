import express from 'express';
import cors from 'cors';
import path from 'path';

import dbConnect from './config/database.js';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';

const app = express();

// conección a la base de datos
dbConnect()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)


const port = process.env.PORT || 4001;

app.listen(port, () => {
  console.log(`Server running in port http:/localhost:${port}`)
})