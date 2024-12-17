import Link from 'next/link';
import { formatName } from '../helpers/helpers';
import { GameScore, PlayerStats } from '../pages/api/stats';
import { useEffect, useState } from 'react';

export type PlayerStatsTableProps = {
	playerStats?: Array<PlayerStats>;
	filterFewGamesPlayersOut: boolean;
};

export const PlayerStatsTable = ({
	playerStats,
	filterFewGamesPlayersOut,
}: PlayerStatsTableProps) => {
	const [stats, setStats] = useState<PlayerStats[]>(
		playerStats?.filter((s) => !filterFewGamesPlayersOut || s.totalGames > 2) ||
			[]
	);

	const sortStats = (key: keyof PlayerStats) => {
		const sorted = [
			...stats.filter((s) => !filterFewGamesPlayersOut || s.totalGames > 2),
		].sort((a, b) => {
			if (a[key] < b[key]) return 1;
			if (a[key] > b[key]) return -1;
			return 0;
		});

		setStats(sorted);
	};

	useEffect(() => {
		setStats(
			playerStats?.filter(
				(s) => !filterFewGamesPlayersOut || s.totalGames > 2
			) || []
		);
	}, [playerStats, filterFewGamesPlayersOut]);

	const handleSort = (key: keyof PlayerStats) => {
		sortStats(key);
	};

	return (
		<>
			<table className="text-sm">
				<thead>
					<tr className="">
						<th className="py-2 px-1"></th>
						<th
							className="py-2 px-4 unselectable"
							onClick={() => handleSort('name')}
						>
							Name
						</th>
						<th
							className="py-2 px-2 hover:cursor-pointer unselectable"
							onClick={() => handleSort('pph')}
						>
							PPH
						</th>
						<th
							className="py-2 px-1 hover:cursor-pointer unselectable"
							onClick={() => handleSort('bidGetPercentage')}
						>
							BGP
						</th>
						<th
							className="py-2 px-1 hover:cursor-pointer unselectable"
							onClick={() => handleSort('bigAggression')}
						>
							BA
						</th>
						<th
							className="py-2 px-1 hover:cursor-pointer unselectable"
							onClick={() => handleSort('handsWonPercentage')}
						>
							HW
						</th>
					</tr>
				</thead>
				<tbody>
					{stats?.map((stats, index) => (
						<tr key={stats.name} className="border-t">
							<th className="py-2 px-1">{index + 1} </th>
							<th className="font-normal">{formatName(stats.name)}</th>
							<th className="font-normal px-1">{stats.pph.toFixed(2)}</th>
							<th className="font-normal px-1">
								{(stats.bidGetPercentage * 100).toFixed(2)}%
							</th>
							<th className="font-normal">{stats.bigAggression.toFixed(3)}</th>
							<th className="font-normal px-1">
								{(stats.handsWonPercentage * 100).toFixed(2)}%
							</th>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
};
