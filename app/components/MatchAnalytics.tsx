import type { MatchDataWithEvents } from "~/components/schemas";
import { DefenderCountRadar } from "~/components/stats/DefenderCountRadar";
import { DefenderTransitionLine } from "~/components/stats/DefenderTransitionLine";
import { MatchTable } from "~/components/stats/RaidResultTable";
import { ScoringDetailShareBar } from "~/components/stats/ScoringDetailShareBar";
import { ScoringSharePie } from "./stats/ScoringSharePie";

const MatchAnalytics = ({ data }: { data: MatchDataWithEvents }) => {
	const dogTeamEvents = data.events.filter(
		(event) =>
			(event.raiderTeamName === data.dogTeamName && event.isSuccess) ||
			(event.raiderTeamName === data.catTeamName && !event.isSuccess),
	);
	const catTeamEvents = data.events.filter(
		(event) =>
			(event.raiderTeamName === data.catTeamName && event.isSuccess) ||
			(event.raiderTeamName === data.dogTeamName && !event.isSuccess),
	);

	const dogTeamData = { ...data, events: dogTeamEvents };
	const catTeamData = { ...data, events: catTeamEvents };

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div className="col-span-1 flex justify-center items-center">
				<DefenderTransitionLine data={data} />
			</div>
			<div className="col-span-1 row-span-2 flex justify-center items-center">
				<MatchTable data={data} />
			</div>
			<div className="col-span-1 flex justify-center items-center">
				<DefenderCountRadar data={data} />
			</div>
			<div className="col-span-1 flex justify-center items-center">
				<ScoringSharePie data={dogTeamData} teamName={data.dogTeamName} />
			</div>
			<div className="col-span-1 flex justify-center items-center">
				<ScoringDetailShareBar data={dogTeamData} teamName={data.dogTeamName} />
			</div>
			<div className="col-span-1 flex justify-center items-center">
				<ScoringSharePie data={catTeamData} teamName={data.catTeamName} />
			</div>
			<div className="col-span-1 flex justify-center items-center">
				<ScoringDetailShareBar data={catTeamData} teamName={data.catTeamName} />
			</div>
		</div>
	);
};

export default MatchAnalytics;
