import { ResultCategory } from "@/app/components/schemas";
import { createMatchEvent } from "@/tests/components/util";
import { describe, expect, it } from "vitest";
import { calculateMatchBasicStats } from "~/components/stats/basic";

describe("calculateMatchBasicStats", () => {
	const matchData = {
		matchDate: new Date(),
		dogTeamName: "Dog Team",
		catTeamName: "Cat Team",
		events: [
			// Raid Failure
			createMatchEvent(
				0, // event id
				"raider2", // raider id
				false, // raid is success
				[], // defeated defenders
				[], // revived players
				"Raider 2", // raider name
				0, // gained
				1, // lost
				false, // has bonus
				"Tackler 4", // tackler name
				ResultCategory.ANKLE_CATCH
			),
			// Empty
			createMatchEvent(
				1,
				"raider1",
				true,
				[],
				[],
				"Raider 1",
				0,
				0,
				false,
				"",
			),
		],
	};

	const { dogTeamStats, catTeamStats } = calculateMatchBasicStats(matchData);

	it("should calculate dog team total points correctly", () => {
		expect(dogTeamStats.totalPoints).toBe(0);
	});

	it("should calculate cat team total points correctly", () => {
		expect(catTeamStats.totalPoints).toBe(1);
	});

	it("should calculate dog team scoring rate correctly", () => {
		expect(dogTeamStats.scoringRate).toBe(0.0);
	});

	it("should calculate cat team scoring rate correctly", () => {
		expect(catTeamStats.scoringRate).toBe(1.0);
	});

	it("should calculate dog team conceding rate correctly", () => {
		expect(dogTeamStats.concedingRate).toBe(0.0);
	});

	it("should calculate cat team conceding rate correctly", () => {
		expect(catTeamStats.concedingRate).toBe(0.0);
	});

	it("should calculate dog team points per raid correctly", () => {
		expect(dogTeamStats.pointsPerRaid).toBe(0.0);
	});

	it("should calculate cat team points per raid correctly", () => {
		expect(catTeamStats.pointsPerRaid).toBe(0.0);
	});

	it("should calculate dog team points per raid correctly", () => {
		expect(dogTeamStats.pointsPerDefence).toBe(0.0);
	});

	it("should calculate cat team points per raid correctly", () => {
		expect(catTeamStats.pointsPerDefence).toBe(1.0);
	});

	it("should calculate dog team successful raid percentage correctly", () => {
		expect(dogTeamStats.successfulRaidPercentage).toBe(0.0);
	});

	it("should calculate cat team successful raid percentage correctly", () => {
		expect(catTeamStats.successfulRaidPercentage).toBe(1.0);
	});

	it("should calculate dog team empty raid percentage correctly", () => {
		expect(dogTeamStats.emptyRaidPercentage).toBe(0.0);
	});

	it("should calculate cat team empty raid percentage correctly", () => {
		expect(catTeamStats.emptyRaidPercentage).toBe(1.0);
	});

	it("should calculate dog team doD success rate correctly", () => {
		expect(dogTeamStats.doDSuccessRate).toBe(0.0);
	});

	it("should calculate cat team doD success rate correctly", () => {
		expect(catTeamStats.doDSuccessRate).toBe(0.0);
	});

	it("should calculate dog team total raids correctly", () => {
		expect(dogTeamStats.totalRaids).toBe(1);
	});

	it("should calculate cat team total raids correctly", () => {
		expect(catTeamStats.totalRaids).toBe(1);
	});

	it("should calculate dog team successful raids correctly", () => {
		expect(dogTeamStats.successfulRaids).toBe(0);
	});

	it("should calculate cat team successful raids correctly", () => {
		expect(catTeamStats.successfulRaids).toBe(1);
	});

	it("should calculate dog team average points conceded correctly", () => {
		expect(dogTeamStats.averagePointsConceded).toBe(0.0);
	});

	it("should calculate cat team average points conceded correctly", () => {
		expect(catTeamStats.averagePointsConceded).toBe(0.0);
	});

	it("should calculate dog team tackle success rate correctly", () => {
		expect(dogTeamStats.tackleSuccessRate).toBe(0.0);
	});

	it("should calculate cat team tackle success rate correctly", () => {
		expect(catTeamStats.tackleSuccessRate).toBe(0.0);
	});

	it("should calculate dog team super tackle success rate correctly", () => {
		expect(dogTeamStats.superTackleSuccessRate).toBe(0.0);
	});

	it("should calculate cat team super tackle success rate correctly", () => {
		expect(catTeamStats.superTackleSuccessRate).toBe(0.0);
	});

	it("should calculate dog team revival rate correctly", () => {
		expect(dogTeamStats.revivalRate).toBe(0.0);
	});

	it("should calculate cat team revival rate correctly", () => {
		expect(catTeamStats.revivalRate).toBe(0.0);
	});

	it("should calculate dog team all out occurrences correctly", () => {
		expect(dogTeamStats.allOutOccurrences).toBe(0);
	});

	it("should calculate cat team all out occurrences correctly", () => {
		expect(catTeamStats.allOutOccurrences).toBe(0);
	});

	it("should calculate dog team scoring acceleration correctly", () => {
		expect(dogTeamStats.scoringAcceleration).toBe(0.0);
	});

	it("should calculate cat team scoring acceleration correctly", () => {
		expect(catTeamStats.scoringAcceleration).toBe(1.0);
	});

	it("should calculate dog team lead changes correctly", () => {
		expect(dogTeamStats.leadChanges).toBe(0);
	});

	it("should calculate cat team lead changes correctly", () => {
		expect(catTeamStats.leadChanges).toBe(0);
	});

	it("should calculate dog team score standard deviation correctly", () => {
		expect(dogTeamStats.scoreStandardDeviation).toBe(0);
	});

	it("should calculate cat team score standard deviation correctly", () => {
		expect(catTeamStats.scoreStandardDeviation).toBe(0);
	});

	it("should calculate dog team offense defense balance correctly", () => {
		expect(dogTeamStats.offenseDefenseBalance).toBe(0.0);
	});

	it("should calculate cat team offense defense balance correctly", () => {
		expect(catTeamStats.offenseDefenseBalance).toBe(1.0);
	});

	it("should calculate dog team efficiency index correctly", () => {
		expect(dogTeamStats.efficiencyIndex).toBe(0.0);
	});

	it("should calculate cat team efficiency index correctly", () => {
		expect(catTeamStats.efficiencyIndex).toBe(1.0);
	});

	it("should calculate dog team clutch performance index correctly", () => {
		expect(dogTeamStats.clutchPerformanceIndex).toBe(0.0);
	});

	it("should calculate cat team clutch performance index correctly", () => {
		expect(catTeamStats.clutchPerformanceIndex).toBe(0.0);
	});
});
