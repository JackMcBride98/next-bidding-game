import RoundRow from '../../components/roundRow';
import type { NextPage, GetServerSideProps } from 'next';
import GameModel, { GameType } from '../../models/game';
import PlayerModel, { PlayerType } from '../../models/player';
import dbConnect from '../../lib/dbConnect';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Props {
  game: GameType;
}

interface StatsData {
  handsWonPercentages: number[];
  bidAggressionPercentages: number[];
  bidGetPercentages: number[];
}

const formatName = (name: string) => {
  return name?.charAt(0).toUpperCase() + name?.toLowerCase().slice(1);
};

const isArrayOfNumbers = (arr: any[]) => {
  return Array.isArray(arr) && arr.every((item) => typeof item === 'number');
};

const isValidStatsData = (statsData: StatsData) => {
  return (
    isArrayOfNumbers(statsData.bidAggressionPercentages) &&
    isArrayOfNumbers(statsData.bidGetPercentages) &&
    isArrayOfNumbers(statsData.handsWonPercentages)
  );
};

const Game: NextPage<Props> = ({ game }) => {
  const [statsData, setStatsData] = useState<StatsData | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const getStats = async () => {
      const statsData: StatsData = await fetch(
        `/api/game-stats/${game.number.toString()}`
      ).then((res) => res.json());
      setStatsData(statsData);
    };
    getStats();
    const random = Math.random();
    if (random < 0.1) {
      router.push('/game/cage');
    }

    return () => {};
  }, [game.number, router]);

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

  const title = `Game #${game.number}`;

  return (
    <div
      id={game._id + 'gamepage'}
      className="grid justify-center content-start gap-4 p-2 h-full min-h-screen bg-gradient-to-t from-red-100"
    >
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="ET Bidding Game - a site used to score a card game, the bidding game, when played by the Entertainment Team."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-4xl font-bold text-stone-900 text-center">
        Game #{game.number}
      </h1>
      <div className="flex justify-between w-72 mx-auto">
        <p className="text-stone-800 my-1 font-semibold">Location:</p>
        <p className="text-stone-800 my-1">{game.location}</p>
      </div>
      <div className="flex justify-between space-x-2 w-72 mx-auto">
        <p className="text-stone-800 my-1 font-semibold">Date:</p>
        <p className="text-stone-800 my-1">
          {new Date(game.date).toUTCString()}
        </p>
      </div>
      <div className="flex justify-between space-x-2 w-72 mx-auto">
        <p className="text-stone-800 my-1 font-semibold">
          Added to leaderboard:
        </p>
        <p className="text-stone-800 my-1">
          {game.addToLeaderboard ? 'Yes' : 'No'}
        </p>
      </div>
      <div className="overflow-x-auto w-full text-sm justify-self-center">
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
                    ((game.winner
                      ? game.players[j].name === game.winner
                      : highestScore === score) && 'bg-yellow-500')
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
            {statsData === undefined ? (
              <tr className="border-t border-black text-base flex divide-x divide-black">
                <td className="w-full flex justify-center items-center">
                  <div className="dots-3 py-4" />
                </td>
              </tr>
            ) : isValidStatsData(statsData) ? (
              <>
                <tr className="border-t border-black text-base flex divide-x divide-black">
                  <td className="py-2 w-9 pr-0.5">BGP</td>
                  {statsData.bidGetPercentages.map(
                    (bidGetPercentage: number, j: number) => (
                      <td key={j} className="py-2 w-16 text-center">
                        {(bidGetPercentage * 100).toFixed(0)}%
                      </td>
                    )
                  )}
                  <td></td>
                </tr>
                <tr className="border-t border-black text-base flex divide-x divide-black">
                  <td className="py-2 w-9 pr-0.5">BA</td>
                  {statsData.bidAggressionPercentages.map(
                    (bidAgressionPercentage: number, j: number) => (
                      <td key={j} className="py-2 w-16 text-center">
                        {bidAgressionPercentage.toFixed(2)}
                      </td>
                    )
                  )}
                  <td></td>
                </tr>
                <tr className="border-t border-black text-base flex divide-x divide-black">
                  <td className="py-2 w-9 pr-0.5">HW</td>
                  {statsData.handsWonPercentages.map(
                    (handsWonPercentage: number, j: number) => (
                      <td key={j} className="py-2 w-16 text-center">
                        {(handsWonPercentage * 100).toFixed(0)}%
                      </td>
                    )
                  )}
                  <td></td>
                </tr>
              </>
            ) : (
              <tr className="border-t border-black text-base flex divide-x divide-black">
                <td className="w-full flex justify-center items-center text-red-500">
                  Error fetching stats data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Link href="/">
        <a className="border border-black rounded-lg p-2 bg-white w-max justify-self-center h-max">
          Back to Home
        </a>
      </Link>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  await dbConnect();
  const game = await GameModel.findOne({ number: params?.id }).populate({
    path: 'players',
    model: PlayerModel,
  });

  return {
    props: {
      game: JSON.parse(JSON.stringify(game)),
    },
  };
};

export default Game;
