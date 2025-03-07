import {
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
} from "recharts";
import type { MatchDataWithEvents } from "~/components/schemas";
import { calculateDefenderTransition } from "~/components/stats/track-defenders";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "~/components/ui/chart";

export const DefenderCountRadar = ({ data }: { data: MatchDataWithEvents }) => {
	const transformedData = calculateDefenderTransition(data.events);
	const maxFullMark = Math.max(...transformedData.map((d) => d.fullMark));
	const chartConfig = {
		gained: {
			label: "Dog",
			color: "#2563eb",
		},
		lost: {
			label: "Cat",
			color: "#ef4444",
		},
	} satisfies ChartConfig;

	return (
		<Card className="mx-auto aspect-auto size-full">
			<CardHeader>
				<CardTitle>Line Chart - Multiple</CardTitle>
				<CardDescription>January - June 2024</CardDescription>
			</CardHeader>
			<ChartContainer config={chartConfig}>
				<RadarChart
					outerRadius={90}
					width={730}
					height={250}
					data={transformedData}
				>
					<PolarGrid />
					<PolarAngleAxis dataKey="number" />
					<PolarRadiusAxis angle={30} domain={[0, maxFullMark]} />

					<ChartTooltip content={<ChartTooltipContent />} />
					<Radar
						name={data.dogTeamName}
						dataKey="dog"
						stroke="#8884d8"
						fill="#8884d8"
						fillOpacity={0.6}
					/>
					<Radar
						name={data.catTeamName}
						dataKey="cat"
						stroke="#82ca9d"
						fill="#82ca9d"
						fillOpacity={0.6}
					/>
				</RadarChart>
			</ChartContainer>
			<CardFooter>
				<div className="flex w-full items-start gap-2 text-sm">
					<div className="grid gap-2">
						<div className="flex items-center gap-2 font-medium leading-none">
							Trending up by 5.2% this month
						</div>
						<div className="flex items-center gap-2 leading-none text-muted-foreground">
							Showing total visitors for the last 6 months
						</div>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
};
