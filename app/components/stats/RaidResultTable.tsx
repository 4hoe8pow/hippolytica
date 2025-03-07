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
	CardFooter,
} from "~/components/ui/card";

export const MatchTable = ({ data }: { data: MatchDataWithEvents }) => {
	return (
		<Card className="mx-auto aspect-auto size-full">
			<CardHeader>
				<CardTitle>Line Chart - Multiple</CardTitle>
				<CardDescription>January - June 2024</CardDescription>
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
			<CardFooter>
				<div className="flex w-full items-start gap-2 text-sm">
					<div className="grid gap-2">
						<div className="flex items-center gap-2 font-medium leading-none">
							Trending up by 5.2% this month
						</div>
						<div className="flex items-center gap-2 leading-none text-muted-foreground">
							Showing total visitors for the last 6 months
						</div>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
};
