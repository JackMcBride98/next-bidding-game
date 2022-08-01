import { useState } from 'react';
import { PlayerType } from '../models/player';

interface LeaderboardProps {
  isLoading: boolean;
  players: PlayerType[];
}

type sortBy = 'pph' | 'totalScore' | 'gameCount' | 'wins';

function Leaderboard(props: LeaderboardProps) {
  const formatName = (name: String) => {
    return name.charAt(0).toUpperCase() + name.toLowerCase().slice(1);
  };

  const [sortedPlayers, setSortedPlayers] = useState(props.players);

  const handleSort = (by: sortBy) => {
    if (by === 'pph') {
      props.players.forEach(
        (player) => (player.pph = player.totalScore / player.totalHands)
      );
    }
    setSortedPlayers(
      [...props.players].sort((a, b) => (b[by] ?? 0) - (a[by] ?? 0))
    );
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-stone-900">Leaderboard</h1>
      <div className="border p-4 bg-white opacity-100 rounded-lg text-stone-900 w-[21rem]">
        {props.isLoading ? (
          <p>Loading ...</p>
        ) : (
          <table className="">
            <thead>
              <tr className="">
                <th className="py-2 px-1"></th>
                <th className="py-2 px-4">Name</th>
                <th
                  className="py-2 px-2 hover:cursor-pointer"
                  onClick={() => handleSort('totalScore')}
                >
                  Points
                </th>
                <th
                  className="py-2 px-1 hover:cursor-pointer"
                  onClick={() => handleSort('gameCount')}
                >
                  Games
                </th>
                <th
                  className="py-2 px-1 hover:cursor-pointer"
                  onClick={() => handleSort('wins')}
                >
                  Wins
                </th>
                <th
                  className="py-2 px-1 hover:cursor-pointer"
                  onClick={() => handleSort('pph')}
                >
                  PPH
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player, index) => (
                <tr key={player.name} className="border-t">
                  <th className="py-2 px-1">{index + 1} </th>
                  <th className="font-normal">{formatName(player.name)}</th>
                  <th className="font-normal">{player.totalScore}</th>
                  <th className="font-normal">{player.gameCount}</th>
                  <th className="font-normal">{player.wins}</th>
                  <th className="font-normal">
                    {(player.totalScore / player.totalHands).toFixed(2)}
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Leaderboard;
