import { useState } from 'react';
import { GameType } from '../models/game';

interface GameHistoryProps {
  games: GameType[];
}

function GameHistory(props: GameHistoryProps) {
  const [view, setView] = useState('recent');
  const formatName = (name: string) => {
    return name?.charAt(0).toUpperCase() + name?.toLowerCase().slice(1);
  };

  return (
    <div className="w-[21rem] items-center flex flex-col">
      {props.games
        .slice(0, view === 'recent' ? 5 : props.games.length)
        .map((game, j) => (
          <div
            key={game._id}
            className="bg-white my-4 p-4 border rounded-lg text-stone-900 grid opacity-80 w-full"
          >
            <h1 className="font-semibold text-center text-lg mb-3 text-stone-900">
              Game #{game.number}
            </h1>
            <div className="flex justify-between">
              <p className="text-stone-800 my-1 font-semibold">Location:</p>
              <p className="text-stone-800 my-1">{game.location}</p>
            </div>
            <div className="flex justify-between space-x-2">
              <p className="text-stone-800 my-1 font-semibold">Date:</p>
              <p className="text-stone-800 my-1">
                {new Date(game.date).toUTCString()}
              </p>
            </div>
            <div className="flex justify-between ">
              <p className="text-stone-800 my-1 font-semibold">
                Number of Rounds:
              </p>
              <p className="text-stone-800 my-1">{game.rounds.length}</p>
            </div>
            <table
              key={game._id + 'table'}
              className="w-full text-left text-stone-900 mt-4"
            >
              <thead>
                <tr>
                  <th className="py-2 px-4"></th>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Points</th>
                </tr>
              </thead>
              <tbody>
                {game.players
                  .sort((a, b) => (b.score || 0) - (a.score || 0))
                  .map((player, index) => (
                    <tr key={player._id} className="border-t">
                      <td className="py-2 px-4 font-bold">{index + 1}</td>
                      <td className="py-2 px-4">{formatName(player.name)}</td>
                      <td className="py-2 px-4">{player.score}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <button
              // onClick={() => props.handleMoreInfo(game)}
              className="border border-black rounded-lg p-2 bg-white w-max justify-self-center mt-4"
            >
              More Info
            </button>
          </div>
        ))}
      <button
        onClick={() => setView(view === 'all' ? 'recent' : 'all')}
        className="border border-black rounded-lg p-2 bg-white mb-6"
      >
        {view === 'all' ? 'Show only recent games' : 'See more games'}
      </button>
    </div>
  );
}

export default GameHistory;
