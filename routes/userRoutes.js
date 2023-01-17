import express from 'express';
import bcrystjs from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';

import { generateToken, isAuth } from '../utils/utils.js';
import User from '../models/userModel.js';


const userRouter = express.Router();


userRouter.post(
  '/signin', 
  expressAsyncHandler( async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrystjs.compareSync(req.body.password, user.password)) {
        const newUser = {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        }
        res.send({
          user: newUser,
          token: generateToken(user)
        });
        return;
      }
    }
    res.status(401).send({ message: 'Email o Password invalidos!'})
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler( async (req, res, next) => {
    const newuser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrystjs.hashSync(req.body.password)
    })

    const user = await newuser.save();

    res.send({
      user: user,
      token: generateToken(user)
    })

  })
)


userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler( async (req, res, next) => {
    const user = await User.findById( req.user._id ) 

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrystjs.hashSync(req.body.password, 10);
      }

      const updateUser = await user.save();

      res.send({
        user: {
          _id: updateUser._id,
          name: updateUser.name,
          email: updateUser.email,
          isAdmin: updateUser.isAdmin,
        },
        token: generateToken(updateUser)
      })
    } else {
      res.status(404).send({ message: 'User not found.'})
    }
  })
)


export default userRouter;