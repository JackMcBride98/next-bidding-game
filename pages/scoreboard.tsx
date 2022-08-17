import RoundRow from '../components/roundRow';
import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Round } from '../models/game';
import Head from 'next/head';

const suits = ['♥', '♠', '♦', '♣', '⨯'];

const generateRounds = (
  roundCount: number,
  randomiseSuits: boolean,
  upAndDown: boolean,
  bonusRound: boolean
) => {
  let theRounds = [];
  if (randomiseSuits) {
    shuffle(suits);
  }
  let suitPlaceholder = [...suits];

  for (let i = roundCount; i > 0; i--) {
    theRounds.push({ hands: i, suit: suitPlaceholder.pop() });
    if (suitPlaceholder.length === 0) {
      suitPlaceholder = [...suits];
    }
  }
  if (bonusRound) {
    theRounds.push({ hands: 1, suit: 'B' });
  }
  if (upAndDown) {
    for (let i = 1; i < roundCount; i++) {
      theRounds.push({ hands: i + 1, suit: suitPlaceholder.pop() });
      if (suitPlaceholder.length === 0) {
        suitPlaceholder = [...suits];
      }
    }
  }
  return theRounds;
};

const shuffle = (array: string[]) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const arraySum = (array: number[][]) => {
  if (array.length === 1) {
    return array[0];
  }
  let newArray = new Array(array[0].length).fill(0);
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      newArray[j] += array[i][j];
    }
  }
  return newArray;
};

const Scoreboard: NextPage = () => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [roundBids, setRoundBids] = useState<number[][]>([]);
  const [roundGets, setRoundGets] = useState<number[][]>([]);
  const [roundScores, setRoundScores] = useState<number[][]>([]);
  const [cumulativeScores, setCumulativeScores] = useState<number[][]>([]);
  const [bidsDone, setBidsDone] = useState(false);
  const [addToLeaderboard, setAddToLeaderboard] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const {
    rounds: roundCount,
    randomiseSuits,
    upAndDown,
    bonusRound,
    players,
    location,
  } = router.query;

  const warningText =
    'You have unsaved changes - are you sure you wish to leave this page?';
  const handleWindowClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    return (e.returnValue = warningText);
  };
  const handleBrowseAway = () => {
    if (window.confirm(warningText)) return;
    router.events.emit('routeChangeError');
    throw 'routeChange aborted.';
  };

  useEffect(() => {
    const theRounds = generateRounds(
      parseInt(roundCount as string),
      randomiseSuits === 'true' ? true : false,
      upAndDown === 'true' ? true : false,
      bonusRound === 'true' ? true : false
    );
    setRounds(theRounds as Round[]);
    setRoundBids(
      new Array(theRounds.length)
        .fill(0)
        .map(() => new Array(players?.length || 0).fill(0))
    );
    setRoundGets(
      new Array(theRounds.length)
        .fill(0)
        .map(() => new Array(players?.length || 0).fill(0))
    );
    setRoundScores(
      new Array(theRounds.length)
        .fill(0)
        .map(() => new Array(players?.length || 0).fill(0))
    );
    setCumulativeScores(
      new Array(theRounds.length)
        .fill(0)
        .map(() => new Array(players?.length || 0).fill(0))
    );
  }, []); //eslint-disable-line

  // prompt the user if they try and leave with unsaved changes
  useEffect(() => {
    if (!isSubmitting) {
      window.addEventListener('beforeunload', handleWindowClose);
      router.events.on('routeChangeStart', handleBrowseAway);
    }
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleBrowseAway);
    };
  }, [isSubmitting]); //eslint-disable-line react-hooks/exhaustive-deps

  const handleBidsDone = () => {
    let bidsSum = roundBids[currentRound].reduce((a, b) => a + b, 0);
    if (bidsSum === rounds[currentRound].hands) {
      alert(
        'Bids Total(' +
          bidsSum +
          ') cannot equal number of hands(' +
          rounds[currentRound].hands +
          ')'
      );
    } else {
      setBidsDone(true);
    }
  };

  const handleGetsDone = () => {
    let getsSum = roundGets[currentRound].reduce((a, b) => a + b, 0);
    if (getsSum === rounds[currentRound].hands) {
      let arr = [...roundScores];
      for (let i = 0; i < arr[currentRound].length; i++) {
        arr[currentRound][i] =
          roundGets[currentRound][i] * 2 +
          (roundBids[currentRound][i] === roundGets[currentRound][i] ? 10 : 0);
      }
      setRoundScores(arr);

      arr = [...cumulativeScores];
      arr[currentRound] = arraySum(roundScores.slice(0, currentRound + 1));
      setCumulativeScores(arr);
      setCurrentRound(currentRound + 1);
      setBidsDone(false);
    } else {
      alert(
        'Gets total(' +
          getsSum +
          ') must equal number of hands(' +
          rounds[currentRound].hands +
          ')'
      );
    }
  };

  const handleBidsChange = (event: string, index: number) => {
    if (event === '+') {
      let arr = [...roundBids];
      arr[currentRound][index] = arr[currentRound][index] + 1;
      setRoundBids(arr);
    }
    if (event === '-') {
      if (roundBids[currentRound][index] > 0) {
        let arr = [...roundBids];
        arr[currentRound][index] = arr[currentRound][index] - 1;
        setRoundBids(arr);
      }
    }
  };

  const handleGetsChange = (event: string, index: number) => {
    if (event === '+') {
      let arr = [...roundGets];
      arr[currentRound][index] = arr[currentRound][index] + 1;
      setRoundGets(arr);
    }
    if (event === '-') {
      if (roundGets[currentRound][index] > 0) {
        let arr = [...roundGets];
        arr[currentRound][index] = arr[currentRound][index] - 1;
        setRoundGets(arr);
      }
    }
  };

  const handleUndo = () => {
    if (bidsDone) {
      setBidsDone(false);
    } else {
      if (currentRound > 0) {
        setCurrentRound(currentRound - 1);
        setBidsDone(true);
      }
    }
  };

  const submitGame = async () => {
    const response = await fetch('/api/submit-game', {
      method: 'POST',
      body: JSON.stringify({
        location: location as string,
        date: new Date(),
        players: players,
        rounds: rounds.slice(0, currentRound),
        upAndDown: upAndDown,
        bonusRound: bonusRound,
        bids: roundBids,
        gets: roundGets,
        scores: roundScores,
        totalScores: cumulativeScores[currentRound - 1],
        addToLeaderboard: addToLeaderboard,
      }),
    });
    if (response.status === 200) {
      router.push({ pathname: '/', query: { gameSubmitted: true } });
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-t from-red-100">
      <Head>
        <title>Scoreboard</title>
        <meta
          name="description"
          content="ET Bidding Game - a site used to score a card game, the bidding game, when played by the Entertainment Team."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col text-sm overflow-x-auto p-1 mx-auto min-h-screen bg-transparent md:items-center">
        {/* <p>Location: {gameData.location}</p> */}
        <table className="mb-5 divide-y divide-black border-collapse">
          <thead>
            <tr className="flex text-center divide-x divide-black">
              <th key="Suits" className="flex whitespace-nowrap w-9">
                <p className="w-full"> Suits</p>
              </th>
              {(players as string[])?.map((player) => (
                <th
                  key={player}
                  className="flex w-16 text-center justify-center"
                >
                  <p className="text-center"> {player}</p>
                </th>
              ))}
              <th key="r0w" className="flex w-18">
                <p className=""></p>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {rounds.map((round, index) => (
              <RoundRow
                key={round.hands + round.suit + index}
                round={rounds[index]}
                currentRound={currentRound}
                index={index}
                roundBids={roundBids[index]}
                roundGets={roundGets[index]}
                bidsDone={bidsDone}
                handleBidsDone={handleBidsDone}
                handleGetsDone={handleGetsDone}
                handleBidsChange={handleBidsChange}
                handleGetsChange={handleGetsChange}
                cumulativeScores={cumulativeScores[index]}
                handleUndo={handleUndo}
              />
            ))}
          </tbody>
        </table>
        {currentRound >= rounds.length ? (
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={() => handleUndo()}
              className="border border-black rounded-lg text-xs p-1"
            >
              {' '}
              Undo{' '}
            </button>
            <label className="border p-2 rounded-lg w-max">
              Add to Leaderboard
              <input
                className="text-lg text-stone-900 ml-4 w-4 h-4 accent-pink-500"
                type="checkbox"
                checked={addToLeaderboard}
                onChange={() => setAddToLeaderboard(!addToLeaderboard)}
              />
            </label>
            {isSubmitting ? (
              <div className="dots-3" />
            ) : (
              <button
                onClick={() => {
                  setIsSubmitting(true);
                  submitGame();
                }}
                className="rounded-lg border border-black p-2 w-max"
              >
                Submit Game!
              </button>
            )}
          </div>
        ) : isSubmitting ? (
          <div className="dots-3" />
        ) : (
          <div className="flex flex-col items-center mb-4 space-y-4 mt-80">
            <label className="border p-2 rounded-lg w-max bg-white border-black flex items-center">
              Add to Leaderboard
              <input
                className="text-lg text-stone-900 ml-4 w-4 h-4 accent-pink-500"
                type="checkbox"
                checked={addToLeaderboard}
                onChange={() => setAddToLeaderboard(!addToLeaderboard)}
              />
            </label>
            <button
              onClick={() => {
                if (
                  currentRound !== 0 &&
                  window.confirm(
                    '🤔Are you sure you want to submit the game early🤔?\n(Add To leaderboard === ' +
                      addToLeaderboard +
                      ' )'
                  )
                ) {
                  setIsSubmitting(true);
                  submitGame();
                }
              }}
              className="rounded-lg border border-black p-2 w-max bg-white"
            >
              Submit game early?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scoreboard;
