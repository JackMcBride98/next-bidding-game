//a nextjs page that renders the rules of the game
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const Rules: NextPage = () => {
  return (
    <div className="flex flex-col items-center space-y-4 text-lg text-stone-900 bg-gradient-to-t from-red-100 h-full min-h-screen">
      <Head>
        <title>Rules</title>
        <meta
          name="description"
          content="ET Bidding Game - a site used to score a card game, the bidding game, when played by the Entertainment Team."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center space-y-4 mb-4 w-80">
        <p className="text-4xl text-stone-900">RULES</p>
        <p className="text-stone-900 mt-8 mx-1">
          The bidding game consists of a number of rounds, where players are
          dealt a hand of cards and bids for how many hands they will win in the
          round. Each round has a chosen trump suit. ♥ ♠ ♦ ♣ ⨯
          <br />
          <br />
        </p>
        <p className="text-4xl text-stone-900">BIDDING</p>
        <p className="text-stone-900 mt-4 mx-1">
          During the round players take it in turns to bid for the number of
          hands they will win in the round. <br />
          <br />
          The bidding starts with the player to the left of the dealer and
          continues clockwise. <br /> <br />
          The bids may not add up to the number of hands in the round.
        </p>
        <p className="text-4xl text-stone-900">PLAYING</p>
        <p className="text-stone-900 mt-4 mx-1">
          Play begins with the player to the left of the first bidder <br />
          <br />
          The first player may play any card from their hand. Play then
          continues clockwise with each player choosing one card.
          <br /> <br />
          The card they choose must follow the suit of the first card played if
          possible, otherwise the player is free to play any card (trump or
          not).
          <br /> <br />
          Once all players have played a card, either the higest card of the
          initial suit wins the hand or the highest trump card wins the hand.
          <br /> <br />
          The winner of the hand leads the next hand. Play continues until all
          players are out of cards.
          <br /> <br />
          After each round the dealer moves clockwise.
        </p>
        <p className="text-4xl text-stone-900">SCORING</p>
        <p className="text-stone-900 mt-4 mx-1">
          At the end of the round scores are added up as so: <br />
          <br />
          Players score 2 points for every hand they won and get 10 points if
          they correctly get their bid.
          <br /> <br />
          The winner of the game is the player with the higest score after all
          the rounds have been played.
        </p>
        <Link href="/">
          <a className="border border-black rounded-lg p-2 bg-white">
            Back to Home
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Rules;
