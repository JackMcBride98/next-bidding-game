// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

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
      `https://et-bidding-game-stats-api.herokuapp.com/game/${gameNumber}/bid-get-percentage`
    ).then((res) => res.json());
    const bidAggressionPercentages: number[] = await fetch(
      `https://et-bidding-game-stats-api.herokuapp.com/game/${gameNumber}/bid-aggression`
    ).then((res) => res.json());

    const handsWonPercentages: number[] = await fetch(
      `https://et-bidding-game-stats-api.herokuapp.com/game/${gameNumber}/hands-percentage`
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
