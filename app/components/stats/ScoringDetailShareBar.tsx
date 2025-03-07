import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import type { MatchDataWithEvents } from "~/components/schemas";
import { mergeGainedPoints } from "~/components/stats/merge-gained-point";
import {
	Card,
	CardDescription,
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
	teamName,
}: { data: MatchDataWithEvents; teamName: string }) => {
	const chartConfig = {
		raidPoint: {
			label: "Raid",
			color: "#2563eb",
		},
		defencePoint: {
			label: "Defence",
			color: "#ef4444",
		},
		bonusPoint: {
			label: "Bonus",
			color: "#f59e0b",
		},
	} satisfies ChartConfig;

	return (
		<Card className="mx-auto aspect-auto size-full">
			<CardHeader>
				<CardTitle>得点構成 - 詳細</CardTitle>
				<CardDescription>{teamName}</CardDescription>
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
					<Bar
						name={"Bonus"}
						dataKey="bonusPoint"
						fill="var(--color-bonusPoint)"
						radius={4}
						stackId="a"
					/>
				</BarChart>
			</ChartContainer>
		</Card>
	);
};
