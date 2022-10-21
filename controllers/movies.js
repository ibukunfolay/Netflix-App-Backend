import Movie from '../models/Movie';

//create movie
const createMovie = async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).send('You do not have permission');

  try {
    const newMovie = new Movie(req.body);

    const movie = await newMovie.save();

    res.status(200).send(movie);
  } catch (error) {
    res.status(500).send({ error });
  }
};

//update movie
const updateMovie = async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).send('You do not have permission');

  try {
    const updatedMovie = await Movie.findOneAndUpdate(
      req.params.id,
      { $set: req.body },
      { $new: true },
    );

    res.status(200).send(updatedMovie);
  } catch (error) {
    res.status(500).send({ error });
  }
};

//delete movie
const deleteMovie = async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).send('You do not have permission');

  try {
    await Movie.findByIdAndDelete(req.params.id);

    res.status(200).send('movie successfully deleted ');
  } catch (error) {
    res.status(500).send({ error });
  }
};

//get movie
const getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    res.status(200).send(movie);
  } catch (error) {
    res.status(500).send({ error });
  }
};

//get all movies
const getAllMovies = async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).send('You do not have permission');

  try {
    const movies = await Movie.find();

    res.status(200).send(movies.reverse());
  } catch (error) {
    res.status(500).send({ error });
  }
};

//get random movies
const getRandomMovie = async (req, res) => {
  const type = req.query.type;
  let movie;

  try {
    if (type === 'series') {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    res.status(200).send(movie);
  } catch (error) {
    res.status(500).send({ error });
  }
};

export {
  createMovie,
  updateMovie,
  deleteMovie,
  getMovie,
  getRandomMovie,
  getAllMovies,
};
