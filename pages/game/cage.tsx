import { NextPage } from 'next';
import Head from 'next/head';
import { NCage } from 'ncage-cube';
import Image from "next/image";
import manifesto from '../../public/images/manifest.png'

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
      <div className="flex flex-col items-center space-y-4 mb-4">
        <h1 className="text-9xl">Vote Jack and Jake</h1>
      </div>
        <Image className="overflow-visible" src={manifesto} alt="manifesto" />

      <NCage
        appearPercentage={0.8}
        alwaysVisible={true}
        initialCubeNumber={1}
        cubeDelta={1.25}
        initialCubeScale={1.5}
        cubeScaleDelta={1.0005}
        startOpacity={0.2}
        startIntervalMs={10}
        intervalDeltaMs={100}
      ></NCage>
    </div>
  );
};

export default Cage;
