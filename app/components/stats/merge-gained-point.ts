import type { MatchEventWithSystemData } from "~/components/schemas";

type ScoringDetailShareData = {
	playerName: string;
	raidPoint: number;
	defencePoint: number;
};

export const mergeGainedPoints = (
	events: MatchEventWithSystemData[],
): ScoringDetailShareData[] => {
	const scoringData: ScoringDetailShareData[] = [];

	for (const event of events) {
		const raidPoint = event.gained + (event.hasBonusPoints ? 1 : 0);
		const defencePoint = event.lost;

		const raider = scoringData.find(
			(player) => player.playerName === event.raiderName,
		);
		if (raider) {
			raider.raidPoint += raidPoint;
		} else {
			scoringData.push({
				playerName: event.raiderName,
				raidPoint,
				defencePoint: 0,
			});
		}

		if (event.tacklerName) {
			const tackler = scoringData.find(
				(player) => player.playerName === event.tacklerName,
			);
			if (tackler) {
				tackler.defencePoint += defencePoint;
			} else {
				scoringData.push({
					playerName: event.tacklerName,
					raidPoint: 0,
					defencePoint,
				});
			}
		}
	}

	return scoringData.reduce((acc, curr) => {
		const existingPlayer = acc.find(
			(player) => player.playerName === curr.playerName,
		);
		if (existingPlayer) {
			existingPlayer.raidPoint += curr.raidPoint;
			existingPlayer.defencePoint += curr.defencePoint;
		} else {
			acc.push(curr);
		}
		return acc;
	}, [] as ScoringDetailShareData[]);
};
