import React from 'react';
import RoundRow from '../../components/roundRow';
import type { NextPage, GetServerSideProps } from 'next';
import GameModel, { GameType } from '../../models/game';
import { PlayerType } from '../../models/player';
import dbConnect from '../../lib/dbConnect';
import Link from 'next/link';
import Head from 'next/head';

interface Props {
  game: GameType;
}

const Game: NextPage<Props> = ({ game }) => {
  const formatName = (name: string) => {
    return name?.charAt(0).toUpperCase() + name?.toLowerCase().slice(1);
  };

  const highestScore = Math.max(...game.totalScores);

  const cumulativeScores: number[][] = [];
  for (let i = 0; i < game.scores.length; i++) {
    cumulativeScores[i] = game.scores[i].slice(0);
  }
  for (let i = 1; i < cumulativeScores.length; i++) {
    for (let j = 0; j < cumulativeScores[i].length; j++) {
      cumulativeScores[i][j] += cumulativeScores[i - 1][j];
    }
  }
  return (
    <div
      id={game._id + 'gamepage'}
      className="flex flex-col  items-center gap-4 p-2 h-full min-h-screen bg-gradient-to-t from-red-100"
    >
      <Head>
        <title>Game #{game.number}</title>
        <meta
          name="description"
          content="ET Bidding Game - a site used to score a card game, the bidding game, when played by the Entertainment Team."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-4xl font-bold text-stone-900">Game #{game.number}</h1>
      <div className="flex justify-between w-72">
        <p className="text-stone-800 my-1 font-semibold">Location:</p>
        <p className="text-stone-800 my-1">{game.location}</p>
      </div>
      <div className="flex justify-between space-x-2 w-72">
        <p className="text-stone-800 my-1 font-semibold">Date:</p>
        <p className="text-stone-800 my-1">
          {new Date(game.date).toUTCString()}
        </p>
      </div>
      <div className="overflow-x-auto w-full text-sm items-center flex flex-col">
        <table className="divide-y divide-black">
          <thead>
            <tr className="flex text-center w-full divide-x divide-black">
              <th key="Suits" className="w-9 pr-0.5 flex whitespace-nowrap">
                Suits
              </th>
              {game.players.map((player: PlayerType) => (
                <th
                  key={player._id}
                  className="flex w-16 justify-center text-center"
                >
                  {formatName(player.name)}
                </th>
              ))}
              <th key="r0w"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {game.rounds.map((round, index) => (
              <RoundRow
                key={round.hands + round.suit + index}
                round={round}
                currentRound={99}
                index={index}
                roundBids={game.bids[index]}
                roundGets={game.gets[index]}
                cumulativeScores={cumulativeScores[index]}
              />
            ))}
            <tr className="border-t border-black text-base flex divide-x divide-black">
              <td className="py-2 w-9 pr-0.5">Total</td>
              {game.totalScores.map((score: number, j: number) => (
                <td
                  key={j}
                  className={
                    'py-2 w-16 text-center ' +
                    (highestScore === score && 'bg-yellow-500')
                  }
                >
                  {score}
                </td>
              ))}
              <td></td>
            </tr>
            <tr className="border-t border-black text-base flex divide-x divide-black">
              <td className="py-2 w-9 pr-0.5">PPH</td>
              {game.totalScores.map((score: number, j: number) => (
                <td key={j} className="py-2 w-16 text-center">
                  {(score / game.rounds.length).toFixed(2)}
                </td>
              ))}
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <Link href="/">
        <a className="border border-black rounded-lg p-2 bg-white">
          Back to Home
        </a>
      </Link>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  await dbConnect();
  const game = await GameModel.findOne({ number: params?.id }).populate(
    'players'
  );
  return {
    props: {
      game: JSON.parse(JSON.stringify(game)),
    },
  };
};

export default Game;
