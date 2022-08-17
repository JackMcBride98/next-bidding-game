import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import React, { useState } from 'react';

const Form: NextPage = () => {
  const router = useRouter();
  const [rounds, setRounds] = useState(10);
  const [randomiseSuits, setRandomiseSuits] = useState(true);
  const [upAndDown, setUpAndDown] = useState(false);
  const [bonusRound, setBonusRound] = useState(false);
  const [players, setPlayers] = useState(['Jack', 'Brad', 'Matt', 'Liam']);
  const [location, setLocation] = useState('GG');

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    let errors = formValidate();
    if (Object.keys(errors).length === 0) {
      router.push({
        pathname: '/scoreboard',
        query: {
          rounds: rounds,
          randomiseSuits: randomiseSuits,
          upAndDown: upAndDown,
          bonusRound: bonusRound,
          players: players,
          location: location,
        },
      });
    } else {
      alert(errors.join('\n'));
    }
  };

  const formValidate = (): String[] => {
    let errors: String[] = [];
    players.forEach((player) => {
      if (!player) {
        errors.push('Player Name must not be empty');
      }
    });
    if (!location) {
      errors.push('location must not be empty');
    }
    let noDups = new Set(players.map((player) => player.trim().toLowerCase()));
    if (noDups.size !== players.length) {
      errors.push('No duplicate names');
    }
    if (players.length < 2) {
      errors.push('Must have at least two players');
    }
    if (rounds * players.length >= 52) {
      errors.push('There are not that many cards in the deck, Impossible');
    }
    return errors;
  };

  return (
    <div className="flex flex-col items-center space-y-4 text-lg text-stone-900 bg-gradient-to-t from-red-100 h-full min-h-screen">
      <Head>
        <title>Game Form</title>
        <meta
          name="description"
          content="ET Bidding Game - a site used to score a card game, the bidding game, when played by the Entertainment Team."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <p className="text-4xl text-stone-900">FORM</p>
      <form
        onSubmit={(e) => onSubmit(e)}
        className="flex flex-col space-y-4 border-black border rounded-lg p-4 bg-white"
      >
        <label className="">
          Number of Rounds:
          <input
            className="ml-4 border-stone-900 border rounded-lg px-1 w-16 text-2xl"
            type="number"
            value={rounds}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.preventDefault();
              if (
                parseInt(e.target.value) > 1 &&
                parseInt(e.target.value) * players.length <= 52 &&
                !e.target.value.includes('.')
              ) {
                setRounds(parseInt(e.target.value));
              }
              if (
                parseInt(e.target.value) > 1 &&
                parseInt(e.target.value) * players.length >= 52
              ) {
                setRounds(Math.floor(52 / players.length));
              }
            }}
          />
        </label>
        <label>
          Randomise Suits:
          <input
            className="ml-4 w-4 h-4"
            type="checkbox"
            style={{ accentColor: '#ec4899' }}
            checked={randomiseSuits}
            onChange={(e) => setRandomiseSuits(!randomiseSuits)}
          />
        </label>
        <label>
          Up and Down:
          <input
            className="ml-4 w-4 h-4"
            style={{ accentColor: '#ec4899' }}
            type="checkbox"
            checked={upAndDown}
            onChange={(e) => setUpAndDown(!upAndDown)}
          />
        </label>
        <label>
          Bonus Round:
          <input
            className="ml-5 w-4 h-4"
            type="checkbox"
            style={{ accentColor: '#ec4899' }}
            checked={bonusRound}
            onChange={(e) => setBonusRound(!bonusRound)}
          />
        </label>
        {players.map((player, i) => (
          <label key={i}>
            Player {i + 1}:
            <input
              className="border ml-2 px-1 rounded-lg"
              type="text"
              value={players[i]}
              onChange={(e) => {
                e.preventDefault();
                if (!e.target.value.includes(' ')) {
                  let newArr = [...players];
                  newArr[i] = e.target.value;
                  setPlayers(newArr);
                }
              }}
            />
          </label>
        ))}
        <div className="flex justify-evenly">
          <button
            onClick={(e) => {
              e.preventDefault();
              let newArr = [...players];
              newArr.push('');
              setPlayers(newArr);
            }}
            className="p-2 border-black border rounded-lg bg-gray-100"
          >
            Add Player{' '}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              let newArr = [...players];
              newArr.pop();
              setPlayers(newArr);
            }}
            className="p-2 border-black border rounded-lg bg-gray-100"
          >
            Remove Player{' '}
          </button>
        </div>
        <label>
          Location:
          <input
            className="ml-2 px-1 border rounded-lg"
            type="text"
            value={location}
            onChange={(e) => {
              e.preventDefault();
              setLocation(e.target.value);
            }}
          />
        </label>

        <input
          type="submit"
          value="submit"
          className="rounded-lg border border-black p-2 hover:cursor-pointer"
        />
      </form>
      <Link href="/">
        <a className="border border-black rounded-lg p-2 bg-white">
          Back to Home
        </a>
      </Link>
    </div>
  );
};

export default Form;
