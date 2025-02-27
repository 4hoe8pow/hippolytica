"use client";

import { useEffect, useState } from "react";
import RaidForm from "~/components/RaidForm";
import type {
	MatchEventSchemaType,
	MatchEventWithSystemData,
	EntrySchemaType,
} from "~/components/schemas";

type StatusBarProps = {
	parsedData: EntrySchemaType | null;
	dogScore: number;
	catScore: number;
};

const StatusBar = ({ parsedData, dogScore, catScore }: StatusBarProps) => (
	<div className="h-[50px] shadow-md rounded flex justify-center items-center h-24 py-8">
		<span className="text-lg font-bold flex items-center rounded-lg p-2 bg-black text-white dark:bg-white dark:text-slate-900">
			<span className="px-2">{parsedData?.dog_team_name}</span>
			<span className="px-2">{dogScore}</span>
			<span className="px-2">-</span>
			<span className="px-2">{catScore}</span>
			<span className="px-2">{parsedData?.cat_team_name}</span>
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

	useEffect(() => {
		const storedData = localStorage.getItem("formData");
		if (storedData) {
			setParsedData(JSON.parse(storedData));
		}
	}, []);

	const handleCommit = (
		formData: Omit<MatchEventSchemaType, "id" | "gained" | "lost">,
		index: number,
	) => {
		const eventWithSystemData: MatchEventWithSystemData = {
			...formData,
			id: index + 1,
			gained: formData.defenderIds.length + (formData.hasBonusPoints ? 1 : 0),
			lost: formData.isSuccess ? 0 : 1,
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

	useEffect(() => {
		let newDogScore = 0;
		let newCatScore = 0;

		for (const event of matchEvents) {
			const isDogRaider = parsedData?.dog_players.some(
				(player) => player.id === event.raiderId,
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
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow mb-24">
				{[...matchEvents, { id: matchEvents.length + 1 }].map(
					(event, index) => (
						<div key={event.id}>
							<RaidForm
								eventNumber={index + 1}
								parsedData={parsedData}
								handleCommit={(formData) => handleCommit(formData, index)}
							/>
						</div>
					),
				)}
			</div>
			<StatusBar
				parsedData={parsedData}
				dogScore={dogScore}
				catScore={catScore}
			/>
		</div>
	);
}
