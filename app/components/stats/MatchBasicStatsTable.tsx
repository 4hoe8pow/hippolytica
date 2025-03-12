import type { MatchDataWithEvents } from "~/components/schemas";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { type MatchBasicStatsProps, calculateMatchBasicStats } from "./basic";

const renderTeamStats = (key: string, teamStats: MatchBasicStatsProps) => (
	<TableRow key={key}>
		<TableCell className="font-medium">{teamStats.totalPoints}</TableCell>
		<TableCell className="font-medium">{teamStats.totalRaids}</TableCell>
		<TableCell className="font-medium">{teamStats.successfulRaids}</TableCell>
		<TableCell className="font-medium">{teamStats.scoringRate}</TableCell>
		<TableCell className="font-medium">{teamStats.concedingRate}</TableCell>
		<TableCell className="font-medium">{teamStats.pointsPerRaid}</TableCell>
		<TableCell className="font-medium">
			{teamStats.successfulRaidPercentage}
		</TableCell>
		<TableCell className="font-medium">
			{teamStats.emptyRaidPercentage}
		</TableCell>
		<TableCell className="font-medium">{teamStats.doDSuccessRate}</TableCell>
		<TableCell className="font-medium">
			{teamStats.averagePointsConceded}
		</TableCell>
		<TableCell className="font-medium">{teamStats.tackleSuccessRate}</TableCell>
		<TableCell className="font-medium">
			{teamStats.superTackleSuccessRate}
		</TableCell>
		<TableCell className="font-medium">{teamStats.revivalRate}</TableCell>
		<TableCell className="font-medium">{teamStats.allOutOccurrences}</TableCell>
		<TableCell className="font-medium">
			{teamStats.scoringAcceleration}
		</TableCell>
		<TableCell className="font-medium">{teamStats.leadChanges}</TableCell>
		<TableCell className="font-medium">
			{teamStats.scoreStandardDeviation}
		</TableCell>
		<TableCell className="font-medium">
			{teamStats.offenseDefenseBalance}
		</TableCell>
		<TableCell className="font-medium">{teamStats.efficiencyIndex}</TableCell>
		<TableCell className="font-medium">
			{teamStats.clutchPerformanceIndex}
		</TableCell>
	</TableRow>
);

export const MatchBasicStatsTable = ({
	data,
}: { data: MatchDataWithEvents }) => {
	const stats = calculateMatchBasicStats(data);

	return (
		<Card className="mx-auto aspect-auto size-full">
			<CardHeader>
				<CardTitle>Basic Statistics</CardTitle>
				<CardDescription>Overview of the match statistics</CardDescription>
			</CardHeader>
			<CardContent className="max-h-[81vh] relative overflow-auto">
				<Table>
					<TableHeader className="sticky top-0 bg-secondary">
						<TableRow>
							<TableHead>Total Points</TableHead>
							<TableHead>Total Raids</TableHead>
							<TableHead>Successful Raids</TableHead>
							<TableHead>Scoring Rate</TableHead>
							<TableHead>Conceding Rate</TableHead>
							<TableHead>Points Per Raid</TableHead>
							<TableHead>Successful Raid Percentage</TableHead>
							<TableHead>Empty Raid Percentage</TableHead>
							<TableHead>DoD Success Rate</TableHead>
							<TableHead>Average Points Conceded</TableHead>
							<TableHead>Tackle Success Rate</TableHead>
							<TableHead>Super Tackle Success Rate</TableHead>
							<TableHead>Revival Rate</TableHead>
							<TableHead>All Out Occurrences</TableHead>
							<TableHead>Scoring Acceleration</TableHead>
							<TableHead>Lead Changes</TableHead>
							<TableHead>Score Standard Deviation</TableHead>
							<TableHead>Offense Defense Balance</TableHead>
							<TableHead>Efficiency Index</TableHead>
							<TableHead>Clutch Performance Index</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className="text-right">
						{renderTeamStats("dog", stats.dogTeamStats)}
						{renderTeamStats("cat", stats.catTeamStats)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};
