"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getUpdatedCandidates } from "~/components/player-candidate";
import { initPlayerEntity } from "~/components/schemas";
import type {
	EntrySchemaType,
	MatchDataWithEvents,
	MatchEventSchemaType,
	MatchEventWithSystemData,
	PlayerEntity,
	PlayerSchemaType,
} from "~/components/schemas";
import { Accordion } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import Loading from "./loading";

const RaidForm = dynamic(() => import("@/app/components/forms/RaidForm"), {
	ssr: false,
	loading: () => <Loading />,
});

type StatusBarProps = {
	parsedData: EntrySchemaType | null;
	dogScore: number;
	catScore: number;
};

const StatusBar = ({ parsedData, dogScore, catScore }: StatusBarProps) => (
	<div className="h-24 shadow-md rounded flex justify-center items-center py-8">
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
	const [matchEvents, setMatchEvents] = useState<MatchEventWithSystemData[]>(
		[],
	);
	const [dogScore, setDogScore] = useState(0);
	const [catScore, setCatScore] = useState(0);
	const [playerCandidates, setPlayerCandidates] = useState<PlayerEntity[]>([]);
	const [openAccordionItem, setOpenAccordionItem] = useState<
		string | undefined
	>(undefined);
	const accordionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const fetchData = async () => {
			const storedData = localStorage.getItem("formData");
			if (storedData) {
				const parsedData = JSON.parse(storedData);
				setParsedData(parsedData);
				setPlayerCandidates([initPlayerEntity(parsedData)]);
			}
		};

		fetchData();
	}, []);

	// レイド単位のデータを作成する処理
	const handleCommit = (
		formData: MatchEventSchemaType,
		index: number,
		gainedPoints: number,
		lostPoints: number,
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

		const tackler = formData.tackleBy
			? parsedData?.dogPlayers
					.concat(parsedData.catPlayers)
					.find((player) => player.id === formData.tackleBy)
			: null;

		const eventWithSystemData: MatchEventWithSystemData = {
			...formData,
			id: index,
			raiderName: raider.playerName,
			raiderHeight: raider.height,
			raiderWeight: raider.weight,
			raiderTeamName,
			raiderJerseyNumber: raider.jerseyNumber,
			gained: gainedPoints,
			lost: lostPoints,
			defeatedDefenders,
			revivedDefenders,
			tacklerName: tackler?.playerName ?? null,
			tacklerHeight: tackler?.height ?? null,
			tacklerWeight: tackler?.weight ?? null,
			tacklerJerseyNumber: tackler?.jerseyNumber ?? null,
		};

		setMatchEvents((prevEvents) => {
			const updatedEvents = [...prevEvents];
			if (index - 1 < prevEvents.length) {
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
		router.push("/match-report");
	};

	// ページマウント時にキャッシュからデータを取得
	useEffect(() => {
		const storedData = localStorage.getItem("formData");
		if (storedData) {
			setParsedData(JSON.parse(storedData));
		}
	}, []);

	// 得点集計処理
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

	useEffect(() => {
		if (accordionRef.current) {
			const lastAccordionItem = accordionRef.current.querySelector(
				`[data-value="${matchEvents.length}"]`,
			);
			if (lastAccordionItem) {
				lastAccordionItem.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
				setOpenAccordionItem(String(matchEvents.length));
			}
		}
	}, [matchEvents]);

	return (
		<div className="flex flex-col max-w-[62vw] mx-auto">
			<p className="py-4 font-bold text-center">
				PLEASE ENTER DATA FOR EITHER THE FIRST HALF OR THE SECOND HALF ONLY.
			</p>
			<div className="grid grid-cols-1 gap-8 flex-grow mb-20">
				<Accordion
					type="single"
					collapsible
					className="w-full"
					ref={accordionRef}
					value={openAccordionItem}
					onValueChange={setOpenAccordionItem}
				>
					{[...matchEvents, { id: matchEvents.length }].map((event, index) => {
						getUpdatedCandidates(
							index,
							matchEvents,
							playerCandidates,
							() => setPlayerCandidates,
						);

						return (
							<RaidForm
								key={event.id}
								playerCandidates={playerCandidates}
								setPlayerCandidates={setPlayerCandidates}
								eventNumber={index}
								handleCommit={
									(formData, gainedPoints, lostPoints) =>
										handleCommit(formData, index, gainedPoints, lostPoints) // idは０から始まる
								}
							/>
						);
					})}
				</Accordion>
			</div>
			<StatusBar
				parsedData={parsedData}
				dogScore={dogScore}
				catScore={catScore}
			/>
			<div className="flex justify-center mt-4">
				<Dialog>
					<DialogTrigger asChild>
						<Button>Finalize</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Finalize Data</DialogTitle>
							<DialogDescription>
								Are you sure you want to finalize the entered information? The
								data will be downloaded as reusable data and you will be
								redirected to the data viewing page.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button onClick={handleConfirm}>Yes</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
