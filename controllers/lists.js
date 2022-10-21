import List from '../models/List';

//create List
const createList = async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).send('You do not have permission');

  try {
    const newList = new List(req.body);

    const list = await newList.save();

    res.status(200).send(list);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// delete list by id
const deleteList = async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).send('You do not have permission');

  try {
    await List.findByIdAndDelete(req.params.id);

    res.status(200).send('list successfully deleted');
  } catch (error) {
    res.status(500).send({ error });
  }
};

// get list w/ query
const getList = async (req, res) => {
  const typeQ = req.query.type;
  const genreQ = req.query.genre;
  let list = [];

  try {
    if (typeQ) {
      if (genreQ) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQ, genre: genreQ } },
        ]);
      } else {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQ } },
        ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }
    res.status(200).send(list);
  } catch (error) {
    res.status(500).send(error);
  }
};

export { createList, deleteList, getList };
