import express from 'express';
import bcrystjs from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';

import { generateToken, isAuth } from '../utils/utils.js';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';


const orderRouter = express.Router();

orderRouter.post('/',
  isAuth,
  expressAsyncHandler( async (req, res, next) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((item) => ({ ...item, product: item._id})),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,

    })

    const order = await newOrder.save()
    res.status(201).send({ message: 'Se ha creado una nueva order', order })
  })
)


orderRouter.get('/:id',
  isAuth,
  expressAsyncHandler( async (req, res, next) => {
    const order = await Order.findById({ _id: req.params.id })

    if (order) {
      res.status(200).json({ order })
    } else {
      res.status(401).send({ message: 'Orden de pago no encontrada.'})
    }

  })

)

orderRouter.get('/',
  isAuth,
  expressAsyncHandler( async (req, res, next) => {
    const orders = await Order.find({ user: req.user})

    console.log(orders)

    if (orders) {
      res.status(200).json( { orders })
    } else { 
      res.status(401).send({ message: 'No hay ordenes de pago.'})
    }
  })
)

  
orderRouter.put(
  '/:id/pay',
  expressAsyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      }

      const updateOrder = await order.save();

      res.send({ message: 'Orden Paid', order: updateOrder })
    
    } else{
      res.status(404).send({ message: 'Order Not Found.' })
    }

  })
)



export default orderRouter;