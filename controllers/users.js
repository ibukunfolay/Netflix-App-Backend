import User from '../models/User';
import bcrypt from 'bcrypt';

//update user data
const userUpdate = async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.user.password, salt);
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true },
      );
      res.status(201).send(updatedUser);
    } catch (error) {
      res.status(500).send('server error');
    }
  } else res.status(403).send('forbidden');
};

//delete user
const userDelete = async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json('User has been deleted');
    } catch (error) {
      res.status(500).send({ err });
    }
  }
  res.status(403).send('You dont have permission');
};

//get single user by id
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (error) {
    res.status(500).send({ error });
  }
};

//get all users
const getAllUsers = async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
        : User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).send({ error });
    }
  }
  res.status(403).send('forbidden');
};

//get user monthly stats

const monthlyStats = async (req, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.setFullYear() - 1);

  const monthsArray = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 },
        },
      },
    ]);

    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ err });
  }
};

export { userUpdate, userDelete, getUser, getAllUsers, monthlyStats };
