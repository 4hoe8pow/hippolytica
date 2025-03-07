import { describe, expect, it } from "vitest";
import { updateCandidates } from "~/components/player-candidate";
import {
	type EntrySchemaType,
	type MatchEventWithSystemData,
	initPlayerEntity,
} from "~/components/schemas";

// 常に先攻
const testEntry: EntrySchemaType = {
	matchDate: new Date(),
	dogTeamName: "dog",
	catTeamName: "cat",
	dogPlayers: [
		{
			id: "dog01",
			playerName: "ALICE SMITH",
			height: 157,
			weight: 60,
			jerseyNumber: 1,
		},
		{
			id: "dog02",
			playerName: "BOB JOHNSON",
			height: 190,
			weight: 77,
			jerseyNumber: 2,
		},
		{
			id: "dog03",
			playerName: "CAROL WILLIAMS",
			height: 160,
			weight: 62,
			jerseyNumber: 3,
		},
		{
			id: "dog04",
			playerName: "DAVE BROWN",
			height: 165,
			weight: 65,
			jerseyNumber: 4,
		},
		{
			id: "dog05",
			playerName: "EVE JONES",
			height: 170,
			weight: 70,
			jerseyNumber: 5,
		},
		{
			id: "dog06",
			playerName: "FRANK MILLER",
			height: 175,
			weight: 75,
			jerseyNumber: 6,
		},
		{
			id: "dog07",
			playerName: "GRACE DAVIS",
			height: 180,
			weight: 80,
			jerseyNumber: 7,
		},
		{
			id: "dog08",
			playerName: "HEIDI WILSON",
			height: 185,
			weight: 85,
			jerseyNumber: 8,
		},
	],
	catPlayers: [
		{
			id: "cat01",
			playerName: "TAKUYA SAKAUCHI",
			height: 177,
			weight: 67,
			jerseyNumber: 1,
		},
		{
			id: "cat02",
			playerName: "TAKESHI HIRANO",
			height: 164,
			weight: 73,
			jerseyNumber: 2,
		},
		{
			id: "cat03",
			playerName: "HIROKI MIYAHARA",
			height: 171,
			weight: 79,
			jerseyNumber: 3,
		},
		{
			id: "cat04",
			playerName: "YUKI ITO",
			height: 175,
			weight: 84,
			jerseyNumber: 4,
		},
		{
			id: "cat05",
			playerName: "SHOGEN KANBARA",
			height: 170,
			weight: 62,
			jerseyNumber: 5,
		},
		{
			id: "cat06",
			playerName: "TAKUYA HAMAGUCHI",
			height: 173,
			weight: 68,
			jerseyNumber: 6,
		},
		{
			id: "cat07",
			playerName: "SHINYA IWASAKI",
			height: 162,
			weight: 68,
			jerseyNumber: 7,
		},
		{
			id: "cat08",
			playerName: "YU TOKUNAGA",
			height: 177,
			weight: 83,
			jerseyNumber: 8,
		},
	],
};

describe("getUpdatedCandidates", () => {
	const testPlayers = [initPlayerEntity(testEntry)];

	const createMatchEvent = (
		id: number,
		isSuccess: boolean,
		raiderId: string,
		defeatedDefenderIds: string[],
		revivedDefenderIds: string[],
	): MatchEventWithSystemData => ({
		id,
		raiderId,
		isSuccess,
		defeatedDefenderIds,
		revivedDefenderIds,
		hasBonusPoints: false,
		resultCategory: undefined,
		tackleBy: undefined,
		timeSpentInRaid: 0,
		raiderName: "",
		raiderHeight: 0,
		raiderWeight: 0,
		raiderTeamName: "",
		gained: 0,
		lost: 0,
		defeatedDefenders: [],
		revivedDefenders: [],
	});

	it("1.should handle consecutive attack failures", () => {
		updateCandidates(0, true, [], testPlayers);
		// 攻撃失敗
		const raid1 = [
			createMatchEvent(
				0,
				false,
				testPlayers[0].raidPlayers[0].player.id,
				[],
				[],
			),
		];

		const candidates1 = updateCandidates(1, false, raid1, testPlayers);
		expect(candidates1[1].eventNumber).toEqual(1);
		expect(candidates1[1].defencePlayers[0].status).toEqual("inactive");
	});
});
