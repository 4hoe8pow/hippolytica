import { describe, expect, it } from "vitest";
import {
	calculateDefenderTransition,
	trackDefenderCount,
} from "~/components/stats/track-defenders";
import { createMatchEvent } from "../util";

describe("trackDefenderCount", () => {
	it("should track defender counts correctly", () => {
		const events = [
			createMatchEvent(0, "1", true, ["c1"], []),
			createMatchEvent(1, "2", true, ["d1"], ["c1"]),
			createMatchEvent(2, "3", true, ["c1", "c2"], ["d1"]),
			createMatchEvent(3, "4", true, [], []),
			createMatchEvent(4, "5", true, ["c3", "c4", "c5"], []),
			createMatchEvent(5, "6", true, ["d1"], ["c1"]),
		];

		const result = trackDefenderCount(events);
		expect(result[0]).toEqual({ id: 0, dogCount: 7, catCount: 7 });
		expect(result[1]).toEqual({ id: 1, dogCount: 7, catCount: 6 });
		expect(result[2]).toEqual({ id: 2, dogCount: 6, catCount: 7 }); // データ2つ
		expect(result[3]).toEqual({ id: 3, dogCount: 7, catCount: 5 });
		expect(result[4]).toEqual({ id: 4, dogCount: 7, catCount: 5 });
		expect(result[5]).toEqual({ id: 5, dogCount: 7, catCount: 2 });
		expect(result[6]).toEqual({ id: 6, dogCount: 6, catCount: 3 });
	});

	it("should track defender counts correctly with failed events", () => {
		const events = [
			createMatchEvent(0, "1", true, ["c1"], []),
			createMatchEvent(1, "2", true, ["d1"], ["c1"]),
			createMatchEvent(2, "3", true, ["c1", "c2"], ["d1"]),
			createMatchEvent(3, "4", true, [], []),
			createMatchEvent(4, "5", true, ["c3", "c4", "c5"], []),
			createMatchEvent(5, "6", true, ["d1"], ["c1"]),
		];

		const result = calculateDefenderTransition(events);
		expect(result[6]).toEqual({ number: "seven", dog: 5, cat: 2, fullMark: 7 });
		expect(result[5]).toEqual({ number: "six", dog: 2, cat: 1, fullMark: 7 });
	});
});
