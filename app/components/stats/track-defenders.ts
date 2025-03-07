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
	const transitions: TeamCountTransition[] = [
		{
			id: 0,
			dogCount: currentDog,
			catCount: currentCat,
		},
	];

	data.sort((a, b) => a.id - b.id);

	for (const event of data) {
		const isTeamDog = Number(event.id) % 2 === 0;
		const isSuccess = event.isSuccess;

		currentDog = Math.min(
			7,
			Math.max(
				0,
				currentDog +
					(isSuccess
						? isTeamDog
							? event.revivedDefenders.length
							: -event.defeatedDefenders.length
						: isTeamDog
							? -1
							: 1),
			),
		);
		currentCat = Math.min(
			7,
			Math.max(
				0,
				currentCat +
					(isSuccess
						? isTeamDog
							? -event.defeatedDefenders.length
							: event.revivedDefenders.length
						: isTeamDog
							? 1
							: -1),
			),
		);

		transitions.push({
			id: event.id + 1,
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
		if (transition.dogCount === 0 || transition.catCount === 0) {
			continue;
		}
		transitions[transition.dogCount - 1].dog += 1;
		transitions[transition.catCount - 1].cat += 1;
	}

	return transitions;
};
