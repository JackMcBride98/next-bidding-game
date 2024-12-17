// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

const apiUrl = 'https://et-bidding-game-stats-api.azurewebsites.net/';

type Data = {
	handsWonPercentages: number[] | undefined;
	bidAggressionPercentages: number[] | undefined;
	bidGetPercentages: number[] | undefined;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	try {
		const { gameNumber } = req.query;
		const bidGetPercentages = await fetch(
			`${apiUrl}/game/${gameNumber}/bid-get-percentage`
		).then((res) => res.json());
		const bidAggressionPercentages: number[] = await fetch(
			`${apiUrl}/game/${gameNumber}/bid-aggression`
		).then((res) => res.json());

		const handsWonPercentages: number[] = await fetch(
			`${apiUrl}/game/${gameNumber}/hands-percentage`
		).then((res) => res.json());
		res.status(200).send({
			bidGetPercentages,
			bidAggressionPercentages,
			handsWonPercentages,
		});
	} catch (err) {
		console.log('caught an error');
		res.status(500).send({
			handsWonPercentages: undefined,
			bidAggressionPercentages: undefined,
			bidGetPercentages: undefined,
		});
	}
}
