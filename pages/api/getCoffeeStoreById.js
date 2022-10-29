import { findRecordByFilter } from '../../lib/airtable';

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;

  try {
    if (id) {
      const records = await findRecordByFilter(id);

      if (records.length !== 0) {
        res.status(200).json(records);
      } else {
        res
          .status(200)
          .json({ message: `Coffee Store id ${id} could not be found` });
      }
    } else {
      res.status(400).json({ message: 'Id is missing' });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export default getCoffeeStoreById;
