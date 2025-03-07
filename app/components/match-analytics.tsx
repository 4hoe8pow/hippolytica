import type { MatchDataWithEvents } from "~/components/schemas";
import { DefenderCountRadar } from "~/components/stats/DefenderCountRadar";
import { DefenderTransitionLine } from "~/components/stats/DefenderTransitionLine";
import { MatchTable } from "~/components/stats/RaidResultTable";
import { ScoringDetailShareBar } from "~/components/stats/ScoringDetailShareBar";
import { ScoringSharePie } from "./stats/ScoringSharePie";

const MatchAnalytics = ({ data }: { data: MatchDataWithEvents }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div className="col-span-1 flex justify-center items-center">
				<ScoringDetailShareBar data={data} />
			</div>
			<div className="col-span-1 flex justify-center items-center">
				<MatchTable data={data} />
			</div>
			<div className="col-span-1 flex justify-center items-center">
				<ScoringSharePie data={data} />
			</div>
			<div className="rcol-span-1 flex justify-center items-center">
				<DefenderTransitionLine data={data} />
			</div>
			<div className="rcol-span-1 flex justify-center items-center">
				<DefenderCountRadar data={data} />
			</div>
		</div>
	);
};

export default MatchAnalytics;
