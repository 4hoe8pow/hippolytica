import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { MatchDataWithEvents } from "~/components/schemas";
import { trackDefenderCount } from "~/components/stats/track-defenders";

export const DefenderTransitionLine = ({
	data,
}: { data: MatchDataWithEvents }) => {
	const transformedData = trackDefenderCount(data.events);

	return (
		<ResponsiveContainer className="p-2 w-full h-hull">
			<LineChart data={transformedData}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="id" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line
					type="monotone"
					dataKey="dogCount"
					name={data.dogTeamName}
					stroke="#2563eb"
					activeDot={{ r: 8 }}
				/>
				<Line
					type="monotone"
					dataKey="catCount"
					name={data.catTeamName}
					stroke="#ef4444"
					activeDot={{ r: 8 }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};
