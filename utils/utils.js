import jsonwebtoken from 'jsonwebtoken';

export const generateToken = (user) => {
  return jsonwebtoken.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
}


export const isAuth = (req, res, next) => {

  const authorization = req.headers.authorization;
  
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer xxxxx
    jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET,
      (error, decode) => {
        if (error) {
          res.status(401).send({ message: 'Token Invalido'});
        } else {
          req.user = decode;
          next();
        }
      }
    )
  } else {
    res.status(401).send( { message: 'Token no enviado.'})
  }
}