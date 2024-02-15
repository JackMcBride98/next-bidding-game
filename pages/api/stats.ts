import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import Count from '../../models/count';
import GameModel, { GameType } from '../../models/game';
import PlayerModel from '../../models/player';
import { Dictionary } from 'async';

export type GameScore = {
	number: number;
	score: number;
	name: string;
};

export type PlayerStats = {
	name: string;
	pph: number;
	bidGetPercentage: number;
	bigAggression: number;
	handsWonPercentage: number;
	totalGames: number;
};

type Data = {
	bestTenUpTenDownGameScores: Array<GameScore>;
	bestTenDownGameScores: Array<GameScore>;
	statsByPlayer: Record<string, PlayerStats>;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		try {
			await dbConnect();
			const games: GameType[] = await GameModel.find({})
				.sort({ _id: -1 })
				.populate('players');

			const tenUpTenDownGames = games
				.filter(
					(game) =>
						game.upAndDown && game.bonusRound && game.rounds.length === 20
				)
				.flatMap((game) =>
					game.totalScores.map((score, index) => {
						const scoreAfterBonus = game.scores
							.slice(0, 11)
							.reduce((a, b) => a + b[index], 0);
						return {
							number: game.number,
							score,
							name: game.players[index].name,
							scoreAfterBonus,
						};
					})
				)
				.sort((a, b) => b.score - a.score)
				.slice(0, 20);

			const tenDownGames = games
				.filter(
					(game) =>
						!game.upAndDown && game.bonusRound && game.rounds.length === 11
				)
				.flatMap((game) =>
					game.totalScores.map((score, index) => ({
						number: game.number,
						score,
						name: game.players[index].name,
					}))
				)
				.concat(
					tenUpTenDownGames.map((game) => ({
						...game,
						score: game.scoreAfterBonus,
					}))
				)
				.sort((a, b) => b.score - a.score)
				.slice(0, 20);

			const allDistinctPlayerNames = Array.from(
				new Set(
					games.flatMap((game) => game.players.map((player) => player.name))
				)
			);

			const playerStats = [];

			for (const playerName of allDistinctPlayerNames) {
				playerStats.push(calculatePlayerStats(playerName, games));
			}

			res.status(200).json({
				bestTenUpTenDownGameScores: tenUpTenDownGames,
				bestTenDownGameScores: tenDownGames,
				playerStats,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json(error);
		}
	} else {
		res.setHeader('Allow', 'GET');
		res.status(405).end('Method Not Allowed');
	}
}

const calculatePlayerStats = (name: string, games: GameType[]): PlayerStats => {
	const playerGames = games.filter((game) =>
		game.players.some((player) => player.name === name)
	);

	var totalScore = 0;
	var totalHands = 0;
	var totalRounds = 0;
	var totalBids = 0;
	var totalGets = 0;
	var totalBidGets = 0;

	for (const game of playerGames) {
		const playerIndex = game.players.findIndex(
			(player) => player.name === name
		);
		totalScore += game.totalScores[playerIndex];
		totalHands += game.rounds.reduce((prev, curr) => prev + curr.hands, 0);
		totalRounds += game.rounds.length;

		totalBids += game.bids.reduce((prev, curr) => prev + curr[playerIndex], 0);
		totalGets += game.gets.reduce((prev, curr) => prev + curr[playerIndex], 0);
		for (let i = 0; i < game.rounds.length; i++) {
			if (game.bids[i][playerIndex] === game.gets[i][playerIndex]) {
				totalBidGets++;
			}
		}
	}

	return {
		name,
		pph: totalScore / totalRounds,
		bidGetPercentage: totalBidGets / totalRounds,
		bigAggression: totalBids / totalHands,
		handsWonPercentage: totalGets / totalHands,
		totalGames: playerGames.length,
	};
};
