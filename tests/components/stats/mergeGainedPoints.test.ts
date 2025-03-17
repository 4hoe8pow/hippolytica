import { describe, expect, it } from "vitest";
import { mergeGainedPoints } from "~/components/stats/merge-gained-point";
import { createMatchEvent } from "../util";

describe("mergeGainedPoints", () => {
	it("should correctly merge points", () => {
		const events = [
			createMatchEvent(0, "1", true, ["c1"], [], "Taro", 1, 0),
			createMatchEvent(1, "2", true, ["d1"], ["c1"], "Hanako", 2, 0, true),
			createMatchEvent(2, "3", true, ["c1", "c2"], ["d1"], "Jiro", 2, 0),
			createMatchEvent(3, "4", true, [], [], "Hanako", 0, 0),
			createMatchEvent(4, "5", true, ["c3", "c4", "c5"], [], "Taro", 3, 0),
			createMatchEvent(
				5,
				"6",
				false,
				[""],
				["d1"],
				"Hanako",
				0,
				1,
				false,
				"Taro",
			),
		];
		const result = mergeGainedPoints(events);

		expect(result[0]).toEqual({
			playerName: "Taro",
			raidPoint: 4,
			bonusPoint: 0,
			defencePoint: 1,
		});
		expect(result[1]).toEqual({
			playerName: "Hanako",
			raidPoint: 1,
			bonusPoint: 1,
			defencePoint: 0,
		});
	});
});
