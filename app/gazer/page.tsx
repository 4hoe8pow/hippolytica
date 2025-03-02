"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ConfirmDialogComponent from "~/components/ConfirmDialogComponent";
import RaidForm from "~/components/RaidForm";
import type {
	EntrySchemaType,
	MatchDataWithEvents,
	MatchEventSchemaType,
	MatchEventWithSystemData,
	PlayerSchemaType,
} from "~/components/schemas";
import { Button } from "~/components/ui/button";

type StatusBarProps = {
	parsedData: EntrySchemaType | null;
	dogScore: number;
	catScore: number;
};

const StatusBar = ({ parsedData, dogScore, catScore }: StatusBarProps) => (
	<div className="h-[50px] shadow-md rounded flex justify-center items-center h-24 py-8">
		<span className="text-lg font-bold flex items-center rounded-lg p-2 bg-black text-white dark:bg-white dark:text-slate-900">
			<span className="px-2">{parsedData?.dogTeamName}</span>
			<span className="px-2">{dogScore}</span>
			<span className="px-2">-</span>
			<span className="px-2">{catScore}</span>
			<span className="px-2">{parsedData?.catTeamName}</span>
		</span>
	</div>
);

export default function GazerPage() {
	const router = useRouter();
	const [parsedData, setParsedData] = useState<EntrySchemaType | null>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [matchEvents, setMatchEvents] = useState<MatchEventWithSystemData[]>(
		[],
	);
	const [dogScore, setDogScore] = useState(0);
	const [catScore, setCatScore] = useState(0);
	const raiderCandidatesList: PlayerSchemaType[][] = [[]];
	const defenderCandidatesList: PlayerSchemaType[][] = [[]];

	// 候補者リストの初期化：先攻はdog、後攻はcat
	raiderCandidatesList[0] = parsedData?.dogPlayers ?? [];
	defenderCandidatesList[0] = parsedData?.catPlayers ?? [];

	const getUpdatedCandidates = (index: number, isDogTeamTurn: boolean) => {
		let prevRaiderCandidates: PlayerSchemaType[] = [];
		let prevDefenderCandidates: PlayerSchemaType[] = [];
		let dogReviverCandidates: PlayerSchemaType[] = [];
		let catReviverCandidates: PlayerSchemaType[] = [];

		prevRaiderCandidates =
			raiderCandidatesList[index - 1] || raiderCandidatesList[0];
		prevDefenderCandidates =
			defenderCandidatesList[index - 1] || defenderCandidatesList[0];

		// 攻守交代
		const currentRaiderCandidates =
			index === 0 ? prevRaiderCandidates : prevDefenderCandidates;
		const currentDefenderCandidates =
			index === 0 ? prevDefenderCandidates : prevRaiderCandidates;

		if (index > 0) {
			const prevEvent = matchEvents[index - 1];
			const { defeatedDefenders, revivedDefenders, isSuccess, raiderId } =
				prevEvent;

			// currentRaiderCandidatesへ競技規則の反映
			const updatedRaiderCandidates = currentRaiderCandidates.filter(
				(player) =>
					!defeatedDefenders.some((defender) => defender.id === player.id),
			);
			for (const reviver of revivedDefenders) {
				if (
					!updatedRaiderCandidates.some((player) => player.id === reviver.id)
				) {
					updatedRaiderCandidates.push({ ...reviver });
				}
			}

			// currentDefenderCandidatesへ競技規則の反映
			let updatedDefenderCandidates = currentDefenderCandidates;
			if (!isSuccess) {
				updatedDefenderCandidates = currentDefenderCandidates.filter(
					(player) => player.id !== raiderId,
				);
			} else {
				for (const reviver of revivedDefenders) {
					if (
						!updatedDefenderCandidates.some(
							(player) => player.id === reviver.id,
						)
					) {
						updatedDefenderCandidates.push({ ...reviver });
					}
				}
			}

			raiderCandidatesList[index] = updatedRaiderCandidates;
			defenderCandidatesList[index] = updatedDefenderCandidates;
		} else {
			raiderCandidatesList[index] = currentRaiderCandidates;
			defenderCandidatesList[index] = currentDefenderCandidates;
		}

		const filterCandidates = (
			sourceList: PlayerSchemaType[],
			targetList: PlayerSchemaType[],
		) =>
			sourceList.filter(
				(player) =>
					!targetList.some((currentPlayer) => currentPlayer.id === player.id),
			);

		dogReviverCandidates = filterCandidates(
			raiderCandidatesList[0],
			isDogTeamTurn
				? raiderCandidatesList[index]
				: defenderCandidatesList[index],
		);

		catReviverCandidates = filterCandidates(
			defenderCandidatesList[0],
			isDogTeamTurn
				? defenderCandidatesList[index]
				: raiderCandidatesList[index],
		);

		return {
			raiderCandidates: raiderCandidatesList[index],
			defenderCandidates: defenderCandidatesList[index],
			dogReviverCandidates,
			catReviverCandidates,
		};
	};

	// レイド単位のデータを作成する処理
	const handleCommit = (
		formData: Omit<MatchEventSchemaType, "id" | "gained" | "lost">,
		index: number,
	) => {
		const raider = parsedData?.dogPlayers
			.concat(parsedData.catPlayers)
			.find((player) => player.id === formData.raiderId);
		if (!raider) return;

		const raiderTeamName = parsedData?.dogPlayers.some(
			(player) => player.id === formData.raiderId,
		)
			? parsedData.dogTeamName
			: (parsedData?.catTeamName ?? "");

		const defeatedDefenders = formData.defeatedDefenderIds.map((defenderId) => {
			const defender = parsedData?.dogPlayers
				.concat(parsedData.catPlayers)
				.find((player) => player.id === defenderId);
			return defender as PlayerSchemaType;
		});

		const revivedDefenders = formData.revivedDefenderIds.map((reviverId) => {
			const reviver = parsedData?.dogPlayers
				.concat(parsedData.catPlayers)
				.find((player) => player.id === reviverId);
			return reviver as PlayerSchemaType;
		});

		const eventWithSystemData: MatchEventWithSystemData = {
			...formData,
			id: index + 1,
			raiderName: raider.playerName,
			raiderHeight: raider.height,
			raiderWeight: raider.weight,
			raiderTeamName,
			gained:
				formData.defeatedDefenderIds.length + (formData.hasBonusPoints ? 1 : 0),
			lost: formData.isSuccess ? 0 : 1,
			defeatedDefenders,
			revivedDefenders,
		};

		setMatchEvents((prevEvents) => {
			const updatedEvents = [...prevEvents];
			if (index < prevEvents.length) {
				updatedEvents[index] = eventWithSystemData;
			} else {
				updatedEvents.push(eventWithSystemData);
			}
			return updatedEvents;
		});
	};

	// データの最終形を作成する処理
	const handleConfirm = () => {
		const matchDataWithEvents: MatchDataWithEvents = {
			matchDate: parsedData?.matchDate ?? new Date(),
			dogTeamName: parsedData?.dogTeamName ?? "",
			catTeamName: parsedData?.catTeamName ?? "",
			events: matchEvents,
		};

		// 1. matchDataWithEventsをキャッシュ
		localStorage.setItem(
			"matchDataWithEvents",
			JSON.stringify(matchDataWithEvents),
		);

		// 2. jsonとしてダウンロード開始
		const blob = new Blob([JSON.stringify(matchDataWithEvents)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "matchDataWithEvents.json";
		a.click();
		URL.revokeObjectURL(url);

		// 3. 遷移先は/match ページ
		router.push("/match");
	};

	// ページマウント時にキャッシュからデータを取得
	useEffect(() => {
		const storedData = localStorage.getItem("formData");
		if (storedData) {
			setParsedData(JSON.parse(storedData));
		}
	}, []);

	// データが変更されたらステータスバーを更新
	useEffect(() => {
		let newDogScore = 0;
		let newCatScore = 0;

		for (const event of matchEvents) {
			const isDogRaider = parsedData?.dogPlayers.some(
				(player) => player.playerName === event.raiderName,
			);

			if (isDogRaider) {
				newDogScore += event.gained;
				newCatScore += event.lost;
			} else {
				newCatScore += event.gained;
				newDogScore += event.lost;
			}
		}
		setDogScore(newDogScore);
		setCatScore(newCatScore);
	}, [matchEvents, parsedData]);

	return (
		<div className="flex flex-col max-w-[62vw] mx-auto">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow mb-24">
				{[...matchEvents, { id: matchEvents.length + 1 }].map(
					(event, index) => {
						const isDogTeamTurn = index % 2 === 0;
						const {
							raiderCandidates,
							defenderCandidates,
							dogReviverCandidates,
							catReviverCandidates,
						} = getUpdatedCandidates(index, isDogTeamTurn);

						return (
							<div key={event.id}>
								<RaidForm
									eventNumber={index + 1}
									raiderCandidates={raiderCandidates}
									defenderCandidates={defenderCandidates}
									dogReviverCandidates={dogReviverCandidates}
									catReviverCandidates={catReviverCandidates}
									raiderTeam={isDogTeamTurn ? "dog" : "cat"}
									handleCommit={(formData) => handleCommit(formData, index)}
								/>
							</div>
						);
					},
				)}
			</div>
			<StatusBar
				parsedData={parsedData}
				dogScore={dogScore}
				catScore={catScore}
			/>
			<div className="flex justify-center mt-4">
				<Button onClick={() => setConfirmOpen(true)}>Finalize</Button>
			</div>
			<ConfirmDialogComponent
				open={confirmOpen}
				setOpen={setConfirmOpen}
				onConfirm={handleConfirm}
			/>
		</div>
	);
}
