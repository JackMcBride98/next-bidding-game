import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import dbConnect from '../lib/dbConnect';
import { useEffect, useState } from 'react';
import AceOfClubs from '../public/images/aceOfClubs.svg';
import AceOfHearts from '../public/images/aceOfHearts.svg';
import AceOfDiamonds from '../public/images/aceOfDiamonds.svg';
import AceOfSpades from '../public/images/aceOfSpades.svg';
import Leaderboard from '../components/leaderboard';

const contentType = 'application/json';

const Home: NextPage = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/hello', {
        method: 'GET',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
      }).then((res) => res.json());
      console.log(res);
    };
    fetchData();
    return () => {};
  }, []);

  return (
    <div className="bg-gradient-to-t from-red-100 h-full min-h-screen">
      <Head>
        <title>ET Bidding Game</title>
        <meta
          name="description"
          content="ET Bidding Game - a site used to score a card game, the bidding game, when played by the Entertainment Team."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center space-y-5">
        <h1 className="text-4xl font-bold text-stone-900">ET Bidding Game</h1>
        <div className="flex w-72 space-x-4">
          <AceOfHearts />
          <AceOfClubs />
          <AceOfDiamonds />
          <AceOfSpades />
        </div>
        <Link href="/form">
          <a className="border border-black rounded-lg p-2 bg-white">
            Create New Game
          </a>
        </Link>
        <button
          onClick={() => setCount((count) => count + 1)}
          className="hover:text-lg text-red-500"
        >
          ❤️ <span className="font-bold">{count}</span>
        </button>
        <Leaderboard players={[]} isLoading={false} handleSort={() => {}} />
      </main>
    </div>
  );
};

export default Home;
