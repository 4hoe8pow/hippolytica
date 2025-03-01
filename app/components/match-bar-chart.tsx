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

export const MatchBarChart = ({ data }: { data: MatchDataWithEvents }) => {
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
			<BarChart accessibilityLayer data={data.events}>
				<CartesianGrid vertical={false} />
				<ChartTooltip content={<ChartTooltipContent />} />
				<ChartLegend content={<ChartLegendContent />} />
				<Bar dataKey="gained" fill="var(--color-gained)" radius={4} />
				<Bar dataKey="lost" fill="var(--color-lost)" radius={4} />
			</BarChart>
		</ChartContainer>
	);
};
