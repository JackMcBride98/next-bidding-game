import { useQuery } from '@tanstack/react-query';
import { NextPage } from 'next';
import Head from 'next/head';
import { formatName } from '../helpers/helpers';

interface PlayerStats {
  name: string;
  games: number;
  bidGets: number;
  handsWon: number;
  possibleHandsWon: number;
  handsWonPercentage: number;
  rounds: number;
  bidGetPercentage: number;
  bidAggression: number;
  bonusRoundPoints: number;
  bounusRounds: number;
  heartRoundPoints: number;
  heartRounds: number;
  diamondRoundPoints: number;
  diamondRounds: number;
  spadeRoundPoints: number;
  spadeRounds: number;
  clubRoundPoints: number;
  clubRounds: number;
  pph: number;
}

interface StatsData {
  players: PlayerStats[];
}

const Stats: NextPage = () => {
  const { data, isLoading, error } = useQuery<StatsData>(['stats'], () => {
    return fetch('https://et-bidding-game-stats-api.herokuapp.com/stats').then(
      (res) => res.json()
    );
  });
  console.log(data, isLoading, error);
  return (
    <div className="flex flex-col items-center space-y-4 text-lg text-stone-900 bg-gradient-to-t from-red-100 h-full min-h-screen">
      <Head>
        <title>Stats</title>
        <meta
          name="description"
          content="ET Bidding Game - a site used to score a card game, the bidding game, when played by the Entertainment Team."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-4xl text-stone-900">STATS</h1>
      <div className="border p-4 bg-white opacity-100 rounded-lg text-stone-900 w-[21rem]">
        {!error && isLoading ? (
          <div className="dots-3" />
        ) : (
          <table className="">
            <thead>
              <tr className="">
                <th className="py-2 px-1"></th>
                <th className="py-2 px-4 unselectable">Name</th>
                <th
                  className="py-2 px-2 hover:cursor-pointer unselectable"
                  // onClick={() => handleSort('totalScore')}
                >
                  Points
                </th>
                <th
                  className="py-2 px-1 hover:cursor-pointer unselectable"
                  // onClick={() => handleSort('gameCount')}
                >
                  Games
                </th>
                <th
                  className="py-2 px-1 hover:cursor-pointer unselectable"
                  // onClick={() => handleSort('wins')}
                >
                  Wins
                </th>
                <th
                  className="py-2 px-1 hover:cursor-pointer unselectable"
                  // onClick={() => handleSort('pph')}
                >
                  PPH
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.players.map((player, index) => (
                <tr key={player.name} className="border-t">
                  <th className="py-2 px-1">{index + 1} </th>
                  <th className="font-normal">{formatName(player.name)}</th>
                  <th className="font-normal"></th>
                  <th className="font-normal">{player.games}</th>
                  <th className="font-normal"></th>
                  <th className="font-normal">
                    {/* {(player.totalScore / player.totalHands).toFixed(2)} */}
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Stats;
