import type { MatchDataWithEvents } from "~/components/schemas";
import { DefenceMemberTransitionRadar } from "~/components/defence-member-transition-radar";
import { MatchBarChart } from "~/components/match-bar-chart";
import { MatchTable } from "~/components/match-table";
import { DefenceMemberTransitionLine } from "~/components/defence-member-transition-line";

const MatchAnalytics = ({ data }: { data: MatchDataWithEvents }) => {
	return (
		<div className="grid place-content-center grid-cols-1 md:grid-cols-2 gap-4">
			<div className="col-span-1 rounded-md border flex justify-center items-center">
				<MatchBarChart data={data} />
			</div>
			<div className="col-span-1 rounded-md border max-h-96 overflow-auto flex justify-center items-center">
				<MatchTable data={data} />
			</div>
			<div className="rounded-md border max-h-96 flex justify-center items-center">
				<DefenceMemberTransitionLine data={data} />
			</div>
			<div className="rounded-md border max-h-96 flex justify-center items-center">
				<DefenceMemberTransitionRadar data={data} />
			</div>
		</div>
	);
};

export default MatchAnalytics;
