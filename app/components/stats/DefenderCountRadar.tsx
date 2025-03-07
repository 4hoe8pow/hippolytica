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
				<CardTitle>守備動態傾向</CardTitle>
				<CardDescription>アンティ実施人数の回数</CardDescription>
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
					<PolarRadiusAxis angle={30} domain={[0, 7]} />
					<ChartTooltip content={<ChartTooltipContent />} />
					<Radar
						name={data.dogTeamName}
						dataKey="dog"
						stroke="#8884d8"
						fill="#8884d8"
						fillOpacity={0.62}
					/>
					<Radar
						name={data.catTeamName}
						dataKey="cat"
						stroke="#82ca9d"
						fill="#82ca9d"
						fillOpacity={0.62}
					/>
				</RadarChart>
			</ChartContainer>
		</Card>
	);
};
