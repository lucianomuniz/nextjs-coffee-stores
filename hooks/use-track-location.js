import { useContext, useState } from 'react';
import { ACTION_TYPES, StoreContext } from '../store/store-context';

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { dispatch } = useContext(StoreContext);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setTimeout(() => {
      dispatch({
        type: ACTION_TYPES.SET_LAT_LONG,
        payload: { latLong: `${latitude},${longitude}` },
      });
      setLocationErrorMsg('');
      setIsLoading(false);
    }, 1000);
  };

  const error = () => {
    setTimeout(() => {
      setLocationErrorMsg('Unable to retrieve your location');
      setIsLoading(false);
    }, 1000);
  };

  const handleTrackLocation = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      setTimeout(() => {
        setLocationErrorMsg('Geolocation is not supported by your browser');
        setIsLoading(false);
      }, 1000);
    } else {
      // status.textContent = "Locating…";
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    // latLong,
    handleTrackLocation,
    locationErrorMsg,
    isLoading,
  };
};

export default useTrackLocation;
