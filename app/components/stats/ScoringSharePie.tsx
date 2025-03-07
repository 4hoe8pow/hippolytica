import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import type { MatchDataWithEvents } from "~/components/schemas";
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
import { createScoringSharePie } from "./merge-gained-point";

/* 合計点を選手ごとに振る */
export const ScoringSharePie = ({
	data,
	teamName,
}: { data: MatchDataWithEvents; teamName: string }) => {
	const chartData = createScoringSharePie(data.events);

	const colors = [
		"#FF6384",
		"#36A2EB",
		"#FFCE56",
		"#4BC0C0",
		"#9966FF",
		"#FF9F40",
		"#FFCD56",
		"#4BC0C0",
		"#36A2EB",
		"#FF6384",
		"#9966FF",
		"#FF9F40",
	];

	// chartConfigを生成し、合計点を計算
	const { chartConfig, totalPoints } = useMemo(() => {
		let totalPoints = 0;
		const chartConfig = {
			Points: {
				label: "Points",
			},
			...chartData.reduce(
				(
					acc: { [key: string]: { label: string; color: string } },
					player,
					index,
				) => {
					const key = `player_${index + 1}`;
					acc[key] = {
						label: player.name,
						color: colors[index % colors.length],
					};
					totalPoints += player.gained;
					return acc;
				},
				{},
			),
		} satisfies ChartConfig;
		return { chartConfig, totalPoints };
	}, [chartData]);

	return (
		<Card className="mx-auto aspect-auto size-full">
			<CardHeader>
				<CardTitle>得点構成 - 概要</CardTitle>
				<CardDescription>{teamName}</CardDescription>
			</CardHeader>
			<ChartContainer config={chartConfig}>
				<PieChart>
					<ChartTooltip
						cursor={false}
						content={<ChartTooltipContent hideLabel />}
					/>

					<Pie
						data={chartData}
						dataKey="gained"
						innerRadius={60}
						strokeWidth={5}
					>
						<Label
							content={({ viewBox }) => {
								if (viewBox && "cx" in viewBox && "cy" in viewBox) {
									return (
										<text
											x={viewBox.cx}
											y={viewBox.cy}
											textAnchor="middle"
											dominantBaseline="middle"
										>
											<tspan
												x={viewBox.cx}
												y={viewBox.cy}
												className="fill-foreground text-3xl font-bold"
											>
												{totalPoints.toLocaleString()}
											</tspan>
											<tspan
												x={viewBox.cx}
												y={(viewBox.cy || 0) + 24}
												className="fill-muted-foreground"
											>
												Points
											</tspan>
										</text>
									);
								}
							}}
						/>
					</Pie>
				</PieChart>
			</ChartContainer>
		</Card>
	);
};
