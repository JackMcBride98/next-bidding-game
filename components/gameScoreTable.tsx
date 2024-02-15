import Link from 'next/link';
import { formatName } from '../helpers/helpers';
import { GameScore } from '../pages/api/stats';

export type GameScoreTableProps = {
	gameScores?: Array<GameScore>;
};

export const GameScoreTable = ({ gameScores }: GameScoreTableProps) => {
	return (
		<>
			<table className="text-sm">
				<thead>
					<tr className="">
						<th className="py-2 px-1"></th>
						<th className="py-2 px-4 unselectable">Name</th>
						<th className="py-2 px-2 hover:cursor-pointer unselectable">
							Points
						</th>
						<th className="py-2 px-1 hover:cursor-pointer unselectable">
							Game #
						</th>
					</tr>
				</thead>
				<tbody>
					{gameScores?.map((game, index) => (
						<tr key={game.name} className="border-t">
							<th className="py-2 px-1">{index + 1} </th>
							<th className="font-normal">{formatName(game.name)}</th>
							<th className="font-normal">{game.score}</th>
							<th className="font-normal text-blue-500 underline">
								<Link href={`/game/${game.number}`}>{game.number}</Link>
							</th>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
};
