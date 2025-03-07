import type { MatchEventWithSystemData } from "~/components/schemas";

type ScoringDetailShareData = {
	playerName: string;
	raidPoint: number;
	bonusPoint: number;
	defencePoint: number;
};

export const mergeGainedPoints = (
	events: MatchEventWithSystemData[],
): ScoringDetailShareData[] => {
	const scoringData: ScoringDetailShareData[] = [];

	for (const event of events) {
		console.log(event);
		const raidPoint = event.hasBonusPoints ? event.gained - 1 : event.gained;
		const bonusPoint = event.hasBonusPoints ? 1 : 0;
		const defencePoint = event.lost;

		const raider = scoringData.find(
			(player) => player.playerName === event.raiderName,
		);
		if (raider) {
			raider.raidPoint += raidPoint;
			raider.bonusPoint += bonusPoint;
		} else {
			scoringData.push({
				playerName: event.raiderName,
				raidPoint,
				bonusPoint,
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
					bonusPoint: 0,
					raidPoint: 0,
					defencePoint,
				});
			}
		}
	}

	return scoringData
		.reduce((acc, curr) => {
			const existingPlayer = acc.find(
				(player) => player.playerName === curr.playerName,
			);
			if (existingPlayer) {
				existingPlayer.raidPoint += curr.raidPoint;
				existingPlayer.defencePoint += curr.defencePoint;
				existingPlayer.bonusPoint += curr.bonusPoint;
			} else {
				acc.push(curr);
			}
			return acc;
		}, [] as ScoringDetailShareData[])
		.filter(
			(player) =>
				player.raidPoint !== 0 ||
				player.defencePoint !== 0 ||
				player.bonusPoint !== 0,
		);
};

export const createScoringSharePie = (
	matchData: MatchEventWithSystemData[],
): { name: string; gained: number; fill: string }[] => {
	const colors = [
		"#FF6384",
		"#36A2EB",
		"#FFCE56",
		"#4BC0C0",
		"#9966FF",
		"#FF9F40",
		"#FFCD56",
		"#4BC0C0",
		"#36A2EB",
		"#FF6384",
		"#9966FF",
		"#FF9F40",
	];

	return mergeGainedPoints(matchData).map((player, index) => ({
		name: player.playerName,
		gained: player.raidPoint + player.defencePoint + player.bonusPoint,
		fill: colors[index % colors.length],
	}));
};
