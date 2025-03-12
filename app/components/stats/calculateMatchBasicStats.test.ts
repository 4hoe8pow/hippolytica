import { describe, expect, it } from "vitest";
import type { MatchDataWithEvents } from "~/components/schemas";
import { calculateMatchBasicStats } from "~/components/stats/basic";
import { event1 } from "@/tests/samples/raid/event1";

describe("calculateMatchBasicStats", () => {
	it("should calculate basic stats correctly", () => {
		const matchData: MatchDataWithEvents = {
			matchDate: new Date(),
			dogTeamName: "Dog Team",
			catTeamName: "Cat Team",
			events: event1,
		};

		const { dogTeamStats, catTeamStats } = calculateMatchBasicStats(matchData);

		expect(dogTeamStats.totalPoints).toEqual(1);
		expect(catTeamStats.totalPoints).toEqual(0);
		expect(dogTeamStats.scoringRate).toEqual(1);
		// expect(catTeamStats.scoringRate).toEqual(0);
		// ...additional assertions...
	});
});
