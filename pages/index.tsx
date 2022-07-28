import type { NextPage, GetServerSideProps } from 'next';
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
import GameHistory from '../components/gamehistory';
import PlayerModel, { PlayerType } from '../models/player';
import GameModel, { GameType } from '../models/game';

const contentType = 'application/json';
interface Props {
  players: PlayerType[];
  games: GameType[];
}

const Home: NextPage<Props> = ({ players, games }) => {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-gradient-to-t from-red-100 h-full min-h-screen min-w-screen">
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
        <div className="flex w-72 flex-row gap-4">
          <AceOfHearts />
          <AceOfClubs />
          <AceOfDiamonds />
          <AceOfSpades />
        </div>
        <Link href="/form">
          <a className="rainbow rounded-lg p-2 flex items-center bg-white spinButton">
            Create New Game
          </a>
        </Link>
        <button
          onClick={() => setCount((count) => count + 1)}
          className="hover:text-lg text-red-500 h-8"
        >
          ❤️ <span className="font-bold">{count}</span>
        </button>
        <Leaderboard players={players} isLoading={false} />
        <GameHistory games={games} />
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  await dbConnect();
  const players: PlayerType[] = await PlayerModel.find({});
  const filteredPlayers = players.filter((player) => player.gameCount !== 0);
  const sortedPlayers = filteredPlayers.sort(
    (a, b) => b.totalScore - a.totalScore
  );
  const games: GameType[] = await GameModel.find({}).populate('players');
  return {
    props: {
      players: JSON.parse(JSON.stringify(sortedPlayers)),
      games: (JSON.parse(JSON.stringify(games)) as GameType[]).map((game) => ({
        ...game,
        players: (game.players as PlayerType[]).map((player, index) => ({
          ...player,
          score: game.totalScores[index],
        })),
      })),
    },
  };
};

export default Home;
