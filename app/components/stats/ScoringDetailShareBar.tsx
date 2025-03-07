import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import type { MatchDataWithEvents } from "~/components/schemas";
import { mergeGainedPoints } from "~/components/stats/merge-gained-point";
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
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "~/components/ui/chart";

/* 横軸：選手、縦軸：レイドによる得点とディフェンスによる得点のスタック */
export const ScoringDetailShareBar = ({
	data,
}: { data: MatchDataWithEvents }) => {
	const chartConfig = {
		raidPoint: {
			label: "Raid",
			color: "#2563eb",
		},
		defencePoint: {
			label: "Defence",
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
				<BarChart accessibilityLayer data={mergeGainedPoints(data.events)}>
					<CartesianGrid vertical={false} />
					<ChartTooltip content={<ChartTooltipContent />} />
					<ChartLegend content={<ChartLegendContent />} />
					<XAxis
						dataKey="playerName"
						tickLine={false}
						tickMargin={10}
						axisLine={false}
						padding={{ left: 20, right: 20 }}
						tickFormatter={(value) => value.slice(0, 5)}
					/>
					<Bar
						name={"Defence"}
						dataKey="defencePoint"
						fill="var(--color-raidPoint)"
						radius={4}
						stackId="a"
					/>
					<Bar
						name={"Raid"}
						dataKey="raidPoint"
						fill="var(--color-defencePoint)"
						radius={4}
						stackId="a"
					/>
				</BarChart>
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
