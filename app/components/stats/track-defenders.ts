import type { MatchEventWithSystemData } from "~/components/schemas";

//レーダーグラフ用
type DefenderTransitionType = {
	number: string;
	dog: number;
	cat: number;
	fullMark: number;
};

type TeamCountTransition = {
	id: number;
	dogCount: number;
	catCount: number;
};

export const trackDefenderCount = (
	data: MatchEventWithSystemData[],
): TeamCountTransition[] => {
	let currentDog = 7;
	let currentCat = 7;
	const transitions: TeamCountTransition[] = [];

	data.sort((a, b) => a.id - b.id);

	for (const event of data) {
		const teamType = Number(event.raiderId) % 2 === 0 ? "dog" : "cat";

		currentDog -= teamType === "dog" ? event.defeatedDefenders.length : 0;
		currentCat -= teamType === "cat" ? event.defeatedDefenders.length : 0;
		currentDog += teamType === "dog" ? event.revivedDefenders.length : 0;
		currentCat += teamType === "cat" ? event.revivedDefenders.length : 0;

		transitions.push({
			id: event.id,
			dogCount: currentDog,
			catCount: currentCat,
		});
	}

	return transitions;
};

export const calculateDefenderTransition = (
	data: MatchEventWithSystemData[],
): DefenderTransitionType[] => {
	const transitions: DefenderTransitionType[] = [
		{ number: "one", dog: 0, cat: 0, fullMark: 7 },
		{ number: "two", dog: 0, cat: 0, fullMark: 7 },
		{ number: "three", dog: 0, cat: 0, fullMark: 7 },
		{ number: "four", dog: 0, cat: 0, fullMark: 7 },
		{ number: "five", dog: 0, cat: 0, fullMark: 7 },
		{ number: "six", dog: 0, cat: 0, fullMark: 7 },
		{ number: "seven", dog: 0, cat: 0, fullMark: 7 },
	];

	for (const transition of trackDefenderCount(data)) {
		transitions[transition.dogCount - 1].dog += 1;
		transitions[transition.catCount - 1].cat += 1;
	}

	return transitions;
};
