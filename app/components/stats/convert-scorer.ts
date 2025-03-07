import type {
	MatchEventWithSystemData,
	ScoreDynamicsProps,
} from "~/components/schemas";
import { trackDefenderCount } from "./track-defenders";

export const convertToScoreDynamicsProps = (
	data: MatchEventWithSystemData[],
): ScoreDynamicsProps[] => {
	// 得点の累積を計算
	let teamScore = 0;
	let opponentScore = 0;

	// 守備人数の推移を取得
	const defenderTransitions = trackDefenderCount(data);

	// 変換処理
	return data.map((matchEvent, index) => {
		// 得点差の計算
		const resultPoint = matchEvent.gained - matchEvent.lost;

		// 累積スコアの更新
		teamScore += matchEvent.gained;
		opponentScore += matchEvent.lost;

		// isDoD（Do or Die）の判定
		const isDoD =
			index >= 4 &&
			data[index - 2].gained - data[index - 2].lost === 0 &&
			data[index - 4].gained - data[index - 4].lost === 0;

		// 試合時間の計算（id * 30秒）
		const matchTime = matchEvent.id * 30;

		// 味方・敵の人数を取得
		const transition = defenderTransitions.find((t) => t.id === matchEvent.id);
		const alliesCount = transition ? transition.dogCount : 0;
		const opponentsCount = transition ? transition.catCount : 0;

		// 変換後のオブジェクトを返す
		return {
			alliesCount,
			opponentsCount,
			teamScore,
			opponentScore,
			matchTime,
			isDoD,
			resultPoint,
		};
	});
};
