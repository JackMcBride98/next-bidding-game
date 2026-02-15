import type { NextApiRequest, NextApiResponse } from 'next';
import { getSiteStats } from '../../helpers/stats';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method === 'GET') {
		try {
			const result = await getSiteStats();
			res.status(200).json(result);
		} catch (error) {
			console.log(error);
			res.status(500).json(error);
		}
	} else {
		res.setHeader('Allow', 'GET');
		res.status(405).end('Method Not Allowed');
	}
}
