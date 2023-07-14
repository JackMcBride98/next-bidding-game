//a nextjs page that renders the rules of the game
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { NCage } from 'ncage-cube';

const Cage: NextPage = () => {
  return (
    <div className="flex flex-col items-center space-y-4 text-lg text-stone-900 bg-gradient-to-t from-red-100 h-full min-h-screen">
      <Head>
        <title>Cage</title>
        <meta
          name="description"
          content="ET Bidding Game - a site used to score a card game, the bidding game, when played by the Entertainment Team."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center space-y-4 mb-4 w-80">
        <p>Ho ho god I love memes</p>
        <p>whats up</p>
        <p>Something good</p>
        <p> </p>
      </div>
      <NCage
        appearPercentage={0}
        alwaysVisible={true}
        initialCubeNumber={7}
        initialCubeScale={1.5}
        cubeScaleDelta={1.0005}
        startOpacity={1}
      ></NCage>
    </div>
  );
};

export default Cage;
