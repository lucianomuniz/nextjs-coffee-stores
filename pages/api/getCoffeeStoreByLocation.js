import { fetchCoffeeStores } from '../../lib/coffee-stores';

const getCoffeeStoreByLocation = async (req, res) => {
  try {
    const { latLong: latLong, limit } = req.query;
    const response = await fetchCoffeeStores(latLong, limit);
    res.status(200).json(response);
  } catch (e) {
    console.error('There is an error', e);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export default getCoffeeStoreByLocation;
