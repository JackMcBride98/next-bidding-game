import React from 'react';

interface Player {
  name: string;
  totalScore: number;
  gameCount: number;
  wins: number;
  totalHands: number;
}

interface LeaderboardProps {
  isLoading: boolean;
  players: Player[];
  handleSort: (sortBy: string) => void;
}

function Leaderboard(props: LeaderboardProps) {
  const formatName = (name: String) => {
    return name.charAt(0).toUpperCase() + name.toLowerCase().slice(1);
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-stone-900">Leaderboard</h1>
      <div className="border p-4 bg-white opacity-100 rounded-lg text-stone-900">
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
                  onClick={() => props.handleSort('totalScore')}
                >
                  Points
                </th>
                <th className="py-2 px-1">Games</th>
                <th
                  className="py-2 px-1 hover:cursor-pointer"
                  onClick={() => props.handleSort('wins')}
                >
                  Wins
                </th>
                <th
                  className="py-2 px-1 hover:cursor-pointer"
                  onClick={() => props.handleSort('pph')}
                >
                  PPH
                </th>
              </tr>
            </thead>
            <tbody>
              {props.players.map((player, index) => (
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
