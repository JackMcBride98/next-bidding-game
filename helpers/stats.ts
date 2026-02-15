import dbConnect from '../lib/dbConnect';
import GameModel, { GameType } from '../models/game';
import PlayerModel from '../models/player';

export type StatsData = {
	handsWonPercentages: number[];
	bidAggressionPercentages: number[];
	bidGetPercentages: number[];
};

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

export async function getGameStats(
	gameNumber: number,
): Promise<StatsData | undefined> {
	await dbConnect();
	const game = (await GameModel.findOne({ number: gameNumber }).lean()) as
		| (GameType & { _id: any })
		| null;
	if (!game) return undefined;

	const numPlayers = game.players.length;

	// Hands won percentages
	const hands = new Array<number>(numPlayers).fill(0);
	let totalHands = 0;
	for (let i = 0; i < game.rounds.length; i++) {
		for (let j = 0; j < numPlayers; j++) {
			hands[j] += (game.gets as number[][])[i][j];
		}
		totalHands += game.rounds[i].hands;
	}
	const handsWonPercentages = hands.map((h) => h / totalHands);

	// Bid aggression
	const bidAggression = new Array<number>(numPlayers).fill(0);
	for (let i = 0; i < game.rounds.length; i++) {
		for (let j = 0; j < numPlayers; j++) {
			bidAggression[j] +=
				(game.bids as number[][])[i][j] / game.rounds[i].hands;
		}
	}
	const bidAggressionPercentages = bidAggression.map(
		(b) => b / game.rounds.length,
	);

	// Bid-get percentage
	const bidGets = new Array<number>(numPlayers).fill(0);
	for (let i = 0; i < game.rounds.length; i++) {
		for (let j = 0; j < numPlayers; j++) {
			if ((game.bids as number[][])[i][j] === (game.gets as number[][])[i][j]) {
				bidGets[j]++;
			}
		}
	}
	const bidGetPercentages = bidGets.map((bg) => bg / game.rounds.length);

	return {
		handsWonPercentages,
		bidAggressionPercentages,
		bidGetPercentages,
	};
}

// Site-level stats (extracted from pages/api/stats.ts)
export async function getSiteStats() {
	await dbConnect();
	const games: GameType[] = await GameModel.find({})
		.sort({ _id: -1 })
		.populate({
			path: 'players',
			model: PlayerModel,
		});

	const tenUpTenDownGames = games
		.filter(
			(game) => game.upAndDown && game.bonusRound && game.rounds.length === 20,
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
				} as any;
			}),
		)
		.sort((a, b) => b.score - a.score)
		.slice(0, 20);

	const tenDownGames = games
		.filter(
			(game) => !game.upAndDown && game.bonusRound && game.rounds.length === 11,
		)
		.flatMap((game) =>
			game.totalScores.map((score, index) => ({
				number: game.number,
				score,
				name: game.players[index].name,
			})),
		)
		.concat(
			tenUpTenDownGames.map((game) => ({
				...game,
				score: (game as any).scoreAfterBonus,
			})),
		)
		.sort((a, b) => b.score - a.score)
		.slice(0, 20);

	const allDistinctPlayerNames = Array.from(
		new Set(games.flatMap((game) => game.players.map((player) => player.name))),
	);

	const playerStats: PlayerStats[] = [];

	for (const playerName of allDistinctPlayerNames) {
		playerStats.push(calculatePlayerStats(playerName, games));
	}

	return {
		bestTenUpTenDownGameScores: tenUpTenDownGames,
		bestTenDownGameScores: tenDownGames,
		playerStats,
	};
}

const calculatePlayerStats = (name: string, games: GameType[]): PlayerStats => {
	const playerGames = games.filter((game) =>
		game.players.some((player) => player.name === name),
	);

	var totalScore = 0;
	var totalHands = 0;
	var totalRounds = 0;
	var totalBids = 0;
	var totalGets = 0;
	var totalBidGets = 0;

	for (const game of playerGames) {
		const playerIndex = game.players.findIndex(
			(player) => player.name === name,
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
