import type { MatchDataWithEvents } from "~/components/schemas";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";

export const MatchTable = ({ data }: { data: MatchDataWithEvents }) => {
	return (
		<Table className="max-h-96 overflow-auto">
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">Seq.</TableHead>
					<TableHead>Raider</TableHead>
					<TableHead>Success</TableHead>
					<TableHead>Bonus</TableHead>
					<TableHead>Gained</TableHead>
					<TableHead>Lost</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.events.map((event) => (
					<TableRow key={event.id}>
						<TableCell className="font-medium">{event.id}</TableCell>
						<TableCell>{event.raiderName}</TableCell>
						<TableCell>
							{event.isSuccess ? <span style={{ color: "green" }}>●</span> : ""}
						</TableCell>
						<TableCell>
							{event.hasBonusPoints ? (
								<span style={{ color: "orange" }}>●</span>
							) : (
								""
							)}
						</TableCell>
						<TableCell>{event.gained}</TableCell>
						<TableCell>{event.lost}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
