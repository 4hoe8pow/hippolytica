"use client";

import { useEffect, useState } from "react";

import RaidForm from "~/components/RaidForm";
import type {
	TeamSchemaType,
	MatchEventSchemaType,
} from "~/components/schemas";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "~/components/ui/carousel";

export default function GazerPage() {
	const [parsedData, setParsedData] = useState<TeamSchemaType | null>(null);
	const [matchEvents, setMatchEvents] = useState<MatchEventSchemaType[]>([]);

	useEffect(() => {
		const storedData = localStorage.getItem("formData");
		if (storedData) {
			setParsedData(JSON.parse(storedData));
		}
	}, []);

	const addNewEvent = (formData: MatchEventSchemaType, eventIndex: number) => {
		// 新しいイベントに eventIndex を加えた形で追加
		const newEvent = { ...formData, eventIndex };
		setMatchEvents((prevEvents) => [...prevEvents, newEvent]);
	};

	const handleCommit = (formData: MatchEventSchemaType, eventIndex: number) => {
		if (eventIndex === matchEvents.length) {
			addNewEvent(formData, eventIndex);
		} else {
			setMatchEvents((prevEvents) => {
				const updatedEvents = [...prevEvents];
				updatedEvents[eventIndex] = formData;
				return updatedEvents;
			});
		}
	};

	return (
		<Carousel className="w-full max-w-[62vw] mx-auto">
			<CarouselContent>
				{[...matchEvents, { eventIndex: matchEvents.length }].map((event, index) => (
					<CarouselItem key={('eventIndex' in event ? (event as { eventIndex: number }).eventIndex : index)} className="md:basis-1/2">
						<RaidForm
							eventNumber={index + 1}
							eventIndex={index}
							parsedData={parsedData}
							handleCommit={handleCommit}
						/>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}
