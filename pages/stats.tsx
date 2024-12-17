import { useQuery } from '@tanstack/react-query';
import { NextPage } from 'next';
import Head from 'next/head';
import { formatName } from '../helpers/helpers';
import { GameScore, PlayerStats } from './api/stats';
import Link from 'next/link';
import { GameScoreTable } from '../components/gameScoreTable';
import { PlayerStatsTable } from '../components/playerStatsTable';
import { useState } from 'react';

interface StatsData {
	bestTenUpTenDownGameScores: Array<GameScore>;
	bestTenDownGameScores: Array<GameScore>;
	playerStats: Array<PlayerStats>;
}

const Stats: NextPage = () => {
	const { data, isLoading, error } = useQuery<StatsData>(['stats'], () => {
		const apiUrl = '/api/stats';
		return fetch(apiUrl).then((res) => res.json());
	});

	const [filterPlayerStats, setFilterPlayerStats] = useState(true);

	return (
		<div className="flex flex-col items-center space-y-4 text-lg text-stone-900 bg-gradient-to-t from-red-100 h-full min-h-screen pb-8">
			<Head>
				<title>Stats</title>
				<meta
					name="description"
					content="ET Bidding Game - a site used to score a card game, the bidding game, when played by the Entertainment Team."
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<h1 className="text-4xl text-stone-900">STATS</h1>
			<h2>Best 10 up 10 down games of all time</h2>
			<div className="border p-4 bg-white opacity-100 rounded-lg text-stone-900">
				{!error && isLoading ? (
					<div className="dots-3" />
				) : (
					<GameScoreTable gameScores={data?.bestTenUpTenDownGameScores} />
				)}
			</div>
			<h2>Best 10 down games of all time</h2>
			<div className="border p-4 bg-white opacity-100 rounded-lg text-stone-900">
				{!error && isLoading ? (
					<div className="dots-3" />
				) : (
					<GameScoreTable gameScores={data?.bestTenDownGameScores} />
				)}
			</div>
			<h2>All time player stats</h2>
			<button
				className="border border-black rounded-lg p-2 bg-white w-max justify-self-center mt-4 text-sm"
				onClick={() => setFilterPlayerStats((x) => !x)}
			>
				{!filterPlayerStats ? 'Filter out' : 'Show'} players with less than 3
				games
			</button>
			<div className="border p-4 bg-white opacity-100 rounded-lg text-stone-900">
				{!error && isLoading ? (
					<div className="dots-3" />
				) : (
					<PlayerStatsTable
						playerStats={data?.playerStats}
						filterFewGamesPlayersOut={filterPlayerStats}
					/>
				)}
			</div>
			<Link href="/">
				<a className="border border-black rounded-lg p-2 bg-white">
					Back to Home
				</a>
			</Link>
		</div>
	);
};

export default Stats;
