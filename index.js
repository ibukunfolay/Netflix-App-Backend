import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

//routes
import authRoute from './Routes/auth';
import usersRoute from './Routes/users';
import moviesRoute from './Routes/movies';
import listsRoute from './Routes/lists';

dotenv.config();
const app = express();
const Port = process.env.PORT || 5000;

const params = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(process.env.MONGODB_URL, params)
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.log(err));

//middlewares
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/lists', listsRoute);
app.use('/api/movies', moviesRoute);
app.get('/', (res) => {
  res.send('welcome');
});

app.listen(Port, () => {
  console.log(`server live 😎✔✔ on port ${Port}`);
});
