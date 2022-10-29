import {
  table,
  getMinifiedRecords,
  findRecordByFilter,
} from '../../lib/airtable';

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    const { id, name, neighborhood, address, imgUrl, voting } = req.body;

    try {
      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          res.status(200).json(records);
        } else {
          if (name) {
            const newRecord = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighborhood,
                  voting,
                  imgUrl,
                },
              },
            ]);
            const records = getMinifiedRecords(newRecord);
            res.status(200).json(records);
          } else {
            res.status(400).json({ message: 'Name is missing' });
          }
        }
      } else {
        res.status(400).json({ message: 'Id is missing' });
      }
    } catch (e) {
      console.error('Error finding or creating a store', e);
      res.status(500).json({ message: 'Error finding or creating a store' });
    }
  }
};

export default createCoffeeStore;
