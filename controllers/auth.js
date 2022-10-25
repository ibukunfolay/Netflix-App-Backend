import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerValidation, loginValidation } from '../utils/validation';

const register = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('user already exists');

  const usernameExist = await User.findOne({ username: req.body.username });
  if (usernameExist) return res.status(400).send('username already taken');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const { password, ...info } = user._doc;

    res.send(info);
  } catch (err) {
    res.send(err.message);
  }
};

const login = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.TOKEN_SECRET,
    { expiresIn: '2d' },
  );

  const { password, ...info } = user._doc;

  res.send({ ...info, token: token });
};

export { register, login };
