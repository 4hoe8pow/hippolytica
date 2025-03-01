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

export const updateTransition = (
	transitions: DefenderTransitionType[],
	currentCount: number,
	teamType: "dog" | "cat",
) => {
	if (currentCount >= 1 && currentCount <= 7) {
		transitions[currentCount - 1][teamType] += 1;
	}
};

// カバディ競技における規則に準ずる
// 1. チームは7人で構成される
// 2. 得点１点ごとに相手チームの人数が１人減る
// 3. ボーナスポイントは、人数増減に一切関与しない
// 4. 人数が０になった場合、７人にリセットされる
// 5. 得点時、味方が減っていれば、得点分だけ味方が復活する
export const trackTeamCountTransition = (
	data: MatchEventWithSystemData[],
	dogName: string,
): TeamCountTransition[] => {
	let currentDog = 7;
	let currentCat = 7;
	const transitions: TeamCountTransition[] = [];

	data.sort((a, b) => a.id - b.id);

	for (const event of data) {
		const teamType = event.raiderTeamName === dogName ? "dog" : "cat";
		const opponentType = teamType === "dog" ? "cat" : "dog";
		let currentTeamCount = teamType === "dog" ? currentDog : currentCat;
		let currentOpponentCount = opponentType === "dog" ? currentDog : currentCat;

		if (event.isSuccess) {
			const gained = event.hasBonusPoints ? event.gained - 1 : event.gained;
			currentOpponentCount =
				currentOpponentCount - gained < 0 ? 7 : currentOpponentCount - gained;
		} else {
			currentTeamCount = currentTeamCount - 1 < 0 ? 7 : currentTeamCount - 1;
		}

		transitions.push({
			id: event.id,
			dogCount: teamType === "dog" ? currentTeamCount : currentDog,
			catCount: teamType === "cat" ? currentTeamCount : currentCat,
		});

		if (teamType === "dog") {
			currentDog = currentTeamCount;
			currentCat = currentOpponentCount;
		} else {
			currentCat = currentTeamCount;
			currentDog = currentOpponentCount;
		}
	}

	return transitions;
};

export const calculateDefenderTransition = (
	data: MatchEventWithSystemData[],
	dogName: string,
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

	const teamCountTransitions = trackTeamCountTransition(data, dogName);

	for (const transition of teamCountTransitions) {
		updateTransition(transitions, transition.dogCount, "dog");
		updateTransition(transitions, transition.catCount, "cat");
	}

	return transitions;
};
