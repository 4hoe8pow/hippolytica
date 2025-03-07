import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import type { MatchDataWithEvents } from "~/components/schemas";
import { trackDefenderCount } from "~/components/stats/track-defenders";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "~/components/ui/chart";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "~/components/ui/card";

export const DefenderTransitionLine = ({
	data,
}: { data: MatchDataWithEvents }) => {
	const transformedData = trackDefenderCount(data.events);
	const chartConfig = {
		dogCount: {
			label: "dogCount",
		},
		catCount: {
			label: "catCount",
		},
	} satisfies ChartConfig;
	return (
		<Card className="mx-auto aspect-auto size-full">
			<CardHeader>
				<CardTitle>守備安定性</CardTitle>
				<CardDescription>アンティ実施人数の推移</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<LineChart
						accessibilityLayer
						data={transformedData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="id"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
						/>
						<YAxis tickLine={false} axisLine={false} />
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Line
							type="monotone"
							dataKey="dogCount"
							name={data.dogTeamName}
							stroke="#4ee35a"
							activeDot={{ r: 8 }}
						/>
						<Line
							type="monotone"
							dataKey="catCount"
							name={data.catTeamName}
							stroke="#e35a4e"
							activeDot={{ r: 8 }}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};
