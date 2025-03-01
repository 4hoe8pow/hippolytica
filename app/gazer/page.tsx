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
	const [parsedData, setParsedData] = useState<EntrySchemaType | null>(null);
	const [matchEvents, setMatchEvents] = useState<MatchEventWithSystemData[]>(
		[],
	);
	const [dogScore, setDogScore] = useState(0);
	const [catScore, setCatScore] = useState(0);
	const router = useRouter();
	const [confirmOpen, setConfirmOpen] = useState(false);

	const getUpdatedCandidates = (index: number, isDogTeamTurn: boolean) => {
		let raiderCandidates: PlayerSchemaType[] = [];
		let defenderCandidates: PlayerSchemaType[] = [];
		let reviverCandidates: PlayerSchemaType[] = [];

		if (parsedData) {
			// 初期候補
			raiderCandidates = isDogTeamTurn
				? parsedData.dogPlayers
				: parsedData.catPlayers;
			defenderCandidates = isDogTeamTurn
				? parsedData.catPlayers
				: parsedData.dogPlayers;

			// 前回のイベント
			if (index > 0) {
				const prevEvent = matchEvents[index - 1];
				raiderCandidates = raiderCandidates.filter(
					(player) =>
						!prevEvent.defeatedDefenders.some((d) => d.id === player.id),
				);
				if (prevEvent.revivedDefenders.length > 0) {
					raiderCandidates = raiderCandidates.concat(
						prevEvent.revivedDefenders,
					);
				}
			}

			// 前々回のイベント
			if (index > 1) {
				const prevPrevEvent = matchEvents[index - 2];
				defenderCandidates = defenderCandidates.filter(
					(player) =>
						!prevPrevEvent.defeatedDefenders.some((d) => d.id === player.id),
				);
				if (!matchEvents[index - 1].isSuccess) {
					defenderCandidates = defenderCandidates.filter(
						(player) => player.id !== matchEvents[index - 1].raiderId,
					);
				}
				if (matchEvents[index - 1].revivedDefenders.length > 0) {
					defenderCandidates = defenderCandidates.concat(
						matchEvents[index - 1].revivedDefenders,
					);
				}
			}

			// reviverCandidatesの設定
			reviverCandidates = isDogTeamTurn
				? parsedData.dogPlayers
				: parsedData.catPlayers;
			reviverCandidates = reviverCandidates.filter(
				(player) => !raiderCandidates.some((raider) => raider.id === player.id),
			);
		}

		return { raiderCandidates, defenderCandidates, reviverCandidates };
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

		const revivedDefenders: PlayerSchemaType[] = []; // ここで適切なロジックを追加してください

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
						const { raiderCandidates, defenderCandidates, reviverCandidates } =
							getUpdatedCandidates(index, isDogTeamTurn);

						return (
							<div key={event.id}>
								<RaidForm
									eventNumber={index + 1}
									raiderCandidates={raiderCandidates}
									defenderCandidates={defenderCandidates}
									reviverCandidates={reviverCandidates}
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
