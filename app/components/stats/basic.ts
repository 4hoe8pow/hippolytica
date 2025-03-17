import {
	type MatchDataWithEvents,
	type MatchEventWithSystemData,
	ResultCategory,
} from "~/components/schemas";

// 小数点第3位まで、4位は四捨五入する関数
const roundToThreeDecimal = (num: number) => {
	return Math.round(num * 1000) / 1000;
};

export type MatchBasicStatsProps = {
		// 得点関連
		totalPoints: number; // 総得点(得点 + 敵の失点)
		scoringRate: number; // 得点率 (成功レイド数 ÷ 総レイド数)
		concedingRate: number; // 失点率 (被得点数 ÷ 相手の総レイド数)

		// レイド関連
		pointsPerRaid: number; // 平均得点/レイド (総得点 ÷ 総レイド数)
		successfulRaidPercentage: number; // 成功レイド率
		emptyRaidPercentage: number; // エンプティレイド率
		doDSuccessRate: number; // DoDレイド成功率

		// タックル関連
		pointsPerDefence: number
		totalRaids: number; // 総レイド数
		successfulRaids: number; // 成功レイド数
		averagePointsConceded: number; // 平均被得点
		tackleSuccessRate: number; // タックル成功率
		superTackleSuccessRate: number; // スーパータックル成功率

		// その他
		revivalRate: number; // リバイブ率 (復帰選手数 ÷ 総レイド数)
		allOutOccurrences: number; // オールアウト発生数

		// 時系列関連
		scoringAcceleration: number; // 得点の加速度 (得点増加率の変化 ÷ 時間)
		leadChanges: number; // 逆転回数(勝つ方向に上回る)
		scoreStandardDeviation: number; // スコア推移の標準偏差

		// 統合指標
		offenseDefenseBalance: number; // 攻守バランス指数 (SRP − CR)
		efficiencyIndex: number; // 効率指数 (得点 ÷ (レイド数 + タックル数))
		clutchPerformanceIndex: number; // プレッシャー耐性指数 (DoD成功率 + オールアウト回避回数) ÷ (DoD試行回数 + オールアウト回数)
	};

export function calculateMatchBasicStats(matchData: MatchDataWithEvents): {
	dogTeamStats: MatchBasicStatsProps;
	catTeamStats: MatchBasicStatsProps;
} {
	const { dogTeamName, catTeamName, events } = matchData;

	// データを id 昇順にソート
	const sortedEvents = [...events].sort((a, b) => a.id - b.id);

	// dogTeam と catTeam のイベントを分離
	const teamEvents = (teamName: string) =>
		sortedEvents.filter((e) => e.raiderTeamName === teamName);

	const dogEvents = teamEvents(dogTeamName);
	const catEvents = teamEvents(catTeamName);

	// DoD（Do-or-Die）判定フラグを追加
	const markDoD = (events: MatchEventWithSystemData[]): boolean[] =>
		events.map(
			(_, i, arr) =>
				i >= 2 &&
				arr[i - 1].resultCategory === ResultCategory.EMPTY &&
				arr[i - 2].resultCategory === ResultCategory.EMPTY,
		);

	const dogDoDFlags = markDoD(dogEvents);
	const catDoDFlags = markDoD(catEvents);

	const calculateRaidPoints = (events: MatchEventWithSystemData[]): number => {
		return events.reduce((sum, e) => sum + e.gained, 0);
	};

	const calculateDefencePoints = (
		opponentEvents: MatchEventWithSystemData[],
	): number => {
		return opponentEvents.reduce((sum, e) => sum + e.lost, 0);
	};

	const calculateTotalOpponentPoints = (
		opponentEvents: MatchEventWithSystemData[],
	): number => {
		return opponentEvents.reduce((sum, e) => sum + e.gained, 0);
	};

	const calculateSuccessfulRaids = (
		events: MatchEventWithSystemData[],
	): number => {
		return events.filter((e) => e.isSuccess).length;
	};

	const calculateEmptyRaids = (events: MatchEventWithSystemData[]): number => {
		return events.filter((e) => e.resultCategory === ResultCategory.EMPTY)
			.length;
	};

	const calculateDoDRaids = (doDFlags: boolean[]): number => {
		return doDFlags.filter((isDoD) => isDoD).length;
	};

	const calculateSuccessfulDoDRaids = (
		events: MatchEventWithSystemData[],
		doDFlags: boolean[],
	): number => {
		return events.filter((e, i) => doDFlags[i] && e.isSuccess).length;
	};

	const calculateSuccessfulTackles = (
		opponentEvents: MatchEventWithSystemData[],
	): number => {
		return opponentEvents.filter((e) => e.tackleBy !== undefined).length;
	};

	const calculateSuperTackles = (
		opponentEvents: MatchEventWithSystemData[],
	): number => {
		return opponentEvents.filter(
			(e) => e.tackleBy !== undefined && e.defeatedDefenders.length >= 2,
		).length;
	};

	const calculateTotalRevives = (
		events: MatchEventWithSystemData[],
	): number => {
		return events.reduce((sum, e) => sum + e.revivedDefenders.length, 0);
	};

	const calculateAllOutOccurrences = (
		events: MatchEventWithSystemData[],
	): number => {
		return events.filter((e) => e.defeatedDefenders.length === 7).length;
	};

	const computeStats = (
		events: MatchEventWithSystemData[],
		opponentEvents: MatchEventWithSystemData[],
		doDFlags: boolean[],
	): MatchBasicStatsProps => {
		const raidPoints = calculateRaidPoints(events);
		const defencePoints = calculateDefencePoints(opponentEvents);
		const totalPoints = raidPoints + defencePoints;
		const totalOpponentPoints = calculateTotalOpponentPoints(opponentEvents);
		const totalRaids = events.length;
		const totalDefenses = opponentEvents.length;
		const successfulRaids = calculateSuccessfulRaids(events);
		const emptyRaids = calculateEmptyRaids(events);
		const doDRaids = calculateDoDRaids(doDFlags);
		const successfulDoDRaids = calculateSuccessfulDoDRaids(events, doDFlags);
		const successfulTackles = calculateSuccessfulTackles(opponentEvents);
		const superTackles = calculateSuperTackles(opponentEvents);
		const totalRevives = calculateTotalRevives(events);
		const allOutOccurrences = calculateAllOutOccurrences(events);

		const totalTime = Math.max(...events.map((e) => e.timeSpentInRaid), 1);
		const leadChanges = 0; // todo:逆転回数は後で実装
		const scoreStandardDeviation = 0; // todo:スコアの標準偏差も後で実装

		const offenseDefenseBalance =
			successfulRaids - totalOpponentPoints / (totalDefenses || 1);
		const efficiencyIndex = totalPoints / (totalRaids + successfulTackles || 1);
		const clutchPerformanceIndex =
			(successfulDoDRaids + (allOutOccurrences > 0 ? 1 : 0)) /
			(doDRaids + allOutOccurrences + 1 || 1);

		return {
			totalPoints: roundToThreeDecimal(totalPoints),
			totalRaids,
			successfulRaids,
			scoringRate: roundToThreeDecimal(
				totalRaids > 0 ? successfulRaids / totalRaids : 0,
			),
			concedingRate: roundToThreeDecimal(
				totalDefenses > 0 ? totalOpponentPoints / totalDefenses : 0,
			),

			pointsPerRaid: roundToThreeDecimal(
				totalRaids > 0 ? raidPoints / totalRaids : 0,
			),
			pointsPerDefence: roundToThreeDecimal(
				totalDefenses > 0 ? defencePoints / totalDefenses : 0,
			),
			successfulRaidPercentage: roundToThreeDecimal(
				totalRaids > 0 ? successfulRaids / totalRaids : 0,
			),
			emptyRaidPercentage: roundToThreeDecimal(
				totalRaids > 0 ? emptyRaids / totalRaids : 0,
			),
			doDSuccessRate: roundToThreeDecimal(
				doDRaids > 0 ? successfulDoDRaids / doDRaids : 0,
			),

			averagePointsConceded: roundToThreeDecimal(
				totalDefenses > 0 ? totalOpponentPoints / totalDefenses : 0,
			),
			tackleSuccessRate: roundToThreeDecimal(
				totalDefenses > 0 ? successfulTackles / totalDefenses : 0,
			),
			superTackleSuccessRate: roundToThreeDecimal(
				totalDefenses > 0 ? superTackles / totalDefenses : 0,
			),

			revivalRate: roundToThreeDecimal(
				totalRaids > 0 ? totalRevives / totalRaids : 0,
			),
			allOutOccurrences,

			scoringAcceleration: roundToThreeDecimal(
				totalTime > 0 ? totalPoints / totalTime : 0,
			),
			leadChanges,
			scoreStandardDeviation,

			offenseDefenseBalance: roundToThreeDecimal(offenseDefenseBalance),
			efficiencyIndex: roundToThreeDecimal(efficiencyIndex),
			clutchPerformanceIndex: roundToThreeDecimal(clutchPerformanceIndex),
		};
	};

	return {
		dogTeamStats: computeStats(dogEvents, catEvents, dogDoDFlags),
		catTeamStats: computeStats(catEvents, dogEvents, catDoDFlags),
	};
}
