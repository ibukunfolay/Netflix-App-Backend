import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const atoken = req.headers.authorization;
  if (!atoken) res.status(401).send('Access denied');

  const token = atoken.split(' ')[1];

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};

export default verifyToken;
