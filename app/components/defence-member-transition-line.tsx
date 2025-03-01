import {
	ResponsiveContainer,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	Line,
	LineChart,
} from "recharts";
import type { MatchDataWithEvents } from "~/components/schemas";
import { trackTeamCountTransition } from "~/components/stats/defence";

export const DefenceMemberTransitionLine = ({
	data,
}: { data: MatchDataWithEvents }) => {
	const transformedData = trackTeamCountTransition(
		data.events,
		data.dogTeamName,
	);

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
