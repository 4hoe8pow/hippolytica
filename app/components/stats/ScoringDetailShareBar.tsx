import { Bar, BarChart, CartesianGrid } from "recharts";
import type { MatchDataWithEvents } from "~/components/schemas";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "~/components/ui/chart";
import { mergeGainedPoints } from "@/app/components/stats/merge-gained-point";

/* 横軸：選手、縦軸：レイドによる得点とディフェンスによる得点のスタック */
export const ScoringDetailShareBar = ({
	data,
}: { data: MatchDataWithEvents }) => {
	const chartConfig = {
		gained: {
			label: "Gained",
			color: "#2563eb",
		},
		lost: {
			label: "Lost",
			color: "#ef4444",
		},
	} satisfies ChartConfig;

	return (
		<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
			<BarChart accessibilityLayer data={mergeGainedPoints(data.events)}>
				<CartesianGrid vertical={false} />
				<ChartTooltip content={<ChartTooltipContent />} />
				<ChartLegend content={<ChartLegendContent />} />
				<Bar
					dataKey="defencePoint"
					fill="var(--color-gained)"
					radius={4}
					stackId="a"
				/>
				<Bar
					dataKey="raidPoint"
					fill="var(--color-lost)"
					radius={4}
					stackId="a"
				/>
			</BarChart>
		</ChartContainer>
	);
};
