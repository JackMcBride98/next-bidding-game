import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import Count from '../../models/count';

type Data = {
	count: number;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	await dbConnect();
	return new Promise((resolve, reject) => {
		Count.find().exec(function (err, savedCount) {
			if (err) {
				console.log(err);
			}
			const count = savedCount[0];
			count.count += 1;
			count.save(function (err: unknown) {
				if (err) {
					res.status(404).end();
					resolve(1);
				}
				res.statusCode = 200;
				res.end(JSON.stringify({ count: count.count }));
				resolve(1);
			});
		});
	});
}
