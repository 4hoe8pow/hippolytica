import type { MatchDataWithEvents } from "~/components/schemas";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "~/components/ui/card";

export const MatchTable = ({ data }: { data: MatchDataWithEvents }) => {
	return (
		<Card className="mx-auto aspect-auto size-full">
			<CardHeader>
				<CardTitle>レイドサマリ</CardTitle>
				<CardDescription>時系列順</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
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
					<TableBody className="max-h-96 overflow-auto">
						{data.events.map((event) => (
							<TableRow key={event.id}>
								<TableCell className="font-medium">{event.id}</TableCell>
								<TableCell>{event.raiderName}</TableCell>
								<TableCell>
									{event.isSuccess ? (
										<span style={{ color: "green" }}>●</span>
									) : (
										""
									)}
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
			</CardContent>
		</Card>
	);
};
