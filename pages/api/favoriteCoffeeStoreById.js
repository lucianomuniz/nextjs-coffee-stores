import { updateCoffeeStore, findRecordByFilter } from '../../lib/airtable';

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method === 'PUT') {
    try {
      const id = req.body.id;

      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          const record = records[0];
          const calculateVoting = parseInt(record.voting) + 1;

          const updateFields = {
            voting: calculateVoting,
          };

          const updateRecord = await updateCoffeeStore(
            record.recordId,
            updateFields
          );

          if (updateRecord) {
            res.status(200).json(updateRecord);
          } else {
            res
              .status(400)
              .json({ message: `Error updating Coffee store ${id}` });
          }
        } else {
          res.status(400).json({ message: `Coffee store ${id} doesn't exist` });
        }
      } else {
        res.status(400).json({ message: 'Id is missing' });
      }
    } catch (e) {
      console.error('Something went wrong', e);
      res.status(500).json({ message: 'Error upvoting coffee store' });
    }
  }
};

export default favouriteCoffeeStoreById;
