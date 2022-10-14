import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: 'coffee shop',
    page: 1,
    perPage: 30,
  });

  const photoUrlList = photos.response.results.map(
    (result) => result.urls['small']
  );

  return photoUrlList;
};

export const fetchCoffeeStores = async () => {
  const photos = await getListOfCoffeeStorePhotos();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForCoffeeStores(
      // '-21.390699819085114%2C-48.51221919922354',
      '43.64990206482973%2C-79.38448035304708',
      'coffee',
      6
    ),
    options
  );

  const data = await response.json();
  // .catch((err) => console.error(err));

  const coffeeStoresData = data.results.map((result, index) => {
    const neighborhood = result.location.neighborhood;

    return {
      id: result.fsq_id,
      name: result.name,
      address: result.location.address,
      neighborhood: neighborhood?.length > 0 ? neighborhood[0] : '',
      imgUrl: photos?.length > 0 ? photos[index] : null,
    };
  });

  return coffeeStoresData;
};
