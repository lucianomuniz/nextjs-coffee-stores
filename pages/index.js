import { useState, useContext, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';

import Banner from '../components/banner';
import Card from '../components/card';

import { fetchCoffeeStores } from '../lib/coffee-stores';
import useTrackLocation from '../hooks/use-track-location';
import { ACTION_TYPES, StoreContext } from '../context/store-context';

// import coffeeStoresData from '../data/coffee-store.json';

import styles from '../styles/home.module.css';

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores,
    }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const [coffeeStoresError, setCoffeeStoresError] = useState('');

  const {
    state: { coffeeStores, latLong },
    dispatch,
  } = useContext(StoreContext);

  const { handleTrackLocation, locationErrorMsg, isLoading } =
    useTrackLocation();

  const handleOnBannerBtnClick = async () => {
    handleTrackLocation();
  };

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/getCoffeeStoreByLocation?latLong=${latLong}&limit=30`
          );
          const coffeeStores = await response.json();
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores },
          });
          setCoffeeStoresError('');
        } catch (e) {
          setCoffeeStoresError(e.message);
        }
      }
    }

    setCoffeeStoresByLocation();
  }, [latLong]);

  return (
    <Html lang='en'>
      <div className={styles.container}>
        <Head>
          <title>Coffee Connoisseur</title>
          <link rel='icon' href='/favicon.ico' />
          <meta
            name='viewport'
            content='initial-scale=1.0, width=device-width'
          />
          <meta
            name='description'
            content='Allows you to discovery coffee stores'
          />
        </Head>

        <main className={styles.main}>
          <Banner
            buttonText={isLoading ? 'Locating...' : 'View stores nearby'}
            handleOnClick={handleOnBannerBtnClick}
            isLoading={isLoading}
          />
          {locationErrorMsg && (
            <span>Something went wrong: {locationErrorMsg}</span>
          )}
          {coffeeStoresError && (
            <span>Something went wrong: {coffeeStoresError}</span>
          )}
          <div className={styles.heroImage}>
            <Image
              src='/static/hero-image.png'
              width={700}
              height={400}
              alt='hero image'
            />
          </div>

          {coffeeStores.length > 0 && (
            <div className={styles.sectionWrapper}>
              <h2 className={styles.heading2}>Stores near me</h2>
              <div className={styles.cardLayout}>
                {coffeeStores.map((coffeeStore) => {
                  return (
                    <Card
                      key={coffeeStore.id}
                      name={coffeeStore.name}
                      imgUrl={
                        coffeeStore.imgUrl ||
                        'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                      }
                      href={`/coffee-store/${coffeeStore.id}`}
                      className={styles.card}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {props.coffeeStores.length > 0 && (
            <div className={styles.sectionWrapper}>
              <h2 className={styles.heading2}>Toronto stores</h2>
              <div className={styles.cardLayout}>
                {props.coffeeStores.map((coffeeStore) => {
                  return (
                    <Card
                      key={coffeeStore.id}
                      name={coffeeStore.name}
                      imgUrl={
                        coffeeStore.imgUrl ||
                        'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                      }
                      href={`/coffee-store/${coffeeStore.id}`}
                      className={styles.card}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </Html>
  );
}
