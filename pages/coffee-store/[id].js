import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import cls from 'classnames';
import useSWR from 'swr';

import { fetchCoffeeStores } from '../../lib/coffee-stores';
import { StoreContext } from '../../context/store-context';
import { isEmpty } from '../../utils';

import styles from '../../styles/coffee-store.module.css';

// import coffeeStoresData from '../../data/coffee-store.json';

export async function getStaticProps({ params }) {
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoresById = coffeeStores.find(
    (coffeeStore) => coffeeStore.id.toString() === params.id
  );

  return {
    props: {
      coffeeStore: findCoffeeStoresById ? findCoffeeStoresById : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();

  const paths = coffeeStores.map((cofeeStore) => {
    return {
      params: {
        id: cofeeStore.id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const id = router.query.id;

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, voting, imgUrl, neighborhood, address } = coffeeStore;
      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighborhood: neighborhood || '',
          address: address || '',
        }),
      });
    } catch (e) {
      console.error('Error creating coffee store', e);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      // Context
      if (coffeeStores.length > 0) {
        const cofeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id;
        });

        if (cofeeStoreFromContext) {
          setCoffeeStore(cofeeStoreFromContext);
          handleCreateCoffeeStore(cofeeStoreFromContext);
        }
      }
    } else {
      // SSG
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps.coffeeStore]);

  const { name, address, neighborhood, imgUrl } = coffeeStore;

  const [votingCount, setVotingCount] = useState(0);

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch('/api/favoriteCoffeeStoreById', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        setVotingCount(dbCoffeeStore[0].voting);
      }
    } catch (e) {
      console.error('Error upvoting the coffee store', e);
    }
  };

  if (error) {
    return <div>Something went wrong retriving coffee store page</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href='/'>
              <a>← Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>
        <div className={cls('glass', styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image src='/static/icons/places.svg' width='24' height='24' />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {neighborhood && (
            <div className={styles.iconWrapper}>
              <Image src='/static/icons/nearMe.svg' width='24' height='24' />
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image src='/static/icons/star.svg' width='24' height='24' />
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
