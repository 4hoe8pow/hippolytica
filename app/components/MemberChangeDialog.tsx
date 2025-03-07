import { RefreshCw } from "lucide-react";
import { useState, useMemo } from "react";
import {
	type PlayerClass,
	type PlayerEntity,
	PlayerStatus,
} from "~/components/schemas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";

type MemberChangeDialogProps = {
	eventNumber: number;
	currentCandidates: PlayerEntity;
	handleChangeMembers: (playerChangeCandidate: PlayerEntity) => void;
};

const MemberList = ({
	players,
	onStatusChange,
}: {
	players: PlayerClass[];
	onStatusChange: (player: PlayerClass, status: PlayerStatus) => void;
}) => (
	<Table>
		<TableHeader>
			<TableRow className="text-left">
				<TableHead>No.</TableHead>
				<TableHead>Player </TableHead>
				<TableHead>In</TableHead>
				<TableHead>Out</TableHead>
				<TableHead>RSV</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{players?.map((playerClass) => (
				<TableRow key={playerClass.player.id} className="text-left">
					<TableCell className="font-medium">
						{playerClass.player.jerseyNumber}
					</TableCell>
					<TableCell>{playerClass.player.playerName}</TableCell>
					<TableCell colSpan={3}>
						<RadioGroup
							defaultValue={playerClass.status}
							onValueChange={(value) =>
								onStatusChange(playerClass, value as PlayerStatus)
							}
							className="flex flex-row space-x-2 justify-between"
						>
							<RadioGroupItem
								value={PlayerStatus.ACTIVE}
								id={`active-${playerClass.player.id}`}
							/>
							<RadioGroupItem
								value={PlayerStatus.INACTIVE}
								id={`inactive-${playerClass.player.id}`}
							/>
							<RadioGroupItem
								value={PlayerStatus.RESERVED}
								id={`reserved-${playerClass.player.id}`}
							/>
						</RadioGroup>
					</TableCell>
				</TableRow>
			))}
		</TableBody>
	</Table>
);

const MemberChangeDialog = ({
	eventNumber,
	currentCandidates,
	handleChangeMembers,
}: MemberChangeDialogProps) => {
	const [players, setPlayers] = useState(currentCandidates);

	const handleStatusChange = (
		playerClass: PlayerClass,
		status: PlayerStatus,
	) => {
		const newPlayers = {
			...players,
			raidPlayers: players.raidPlayers.map((p) =>
				p.player.id === playerClass.player.id ? { ...p, status } : p,
			),
			defencePlayers: players.defencePlayers.map((p) =>
				p.player.id === playerClass.player.id ? { ...p, status } : p,
			),
		};
		setPlayers(newPlayers);
	};

	const playerChangeCandidate: PlayerEntity = useMemo(() => {
		return {
			eventNumber,
			raidPlayers: players.raidPlayers,
			defencePlayers: players.defencePlayers,
		};
	}, [players, eventNumber]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={"ghost"} type="button" size={"sm"}>
					<RefreshCw />
				</Button>
			</DialogTrigger>
			<DialogContent className="flex flex-col text-center items-center space-y-4">
				<DialogHeader>
					<DialogTitle>Member Change</DialogTitle>
					<DialogDescription>
						The members for this raid will be changed
					</DialogDescription>
				</DialogHeader>
				<Tabs defaultValue="dog">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="dog">Raid Side</TabsTrigger>
						<TabsTrigger value="cat">Defense Side</TabsTrigger>
					</TabsList>
					<TabsContent value="dog">
						<Card>
							<CardContent className="space-y-4">
								<MemberList
									players={players.raidPlayers}
									onStatusChange={handleStatusChange}
								/>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="cat">
						<Card>
							<CardContent className="space-y-4">
								<MemberList
									players={players.defencePlayers}
									onStatusChange={handleStatusChange}
								/>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
				<DialogFooter>
					<DialogClose
						onClick={() => handleChangeMembers(playerChangeCandidate)}
					>
						APPLY
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default MemberChangeDialog;
