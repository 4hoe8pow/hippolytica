import {
	PlayerStatus,
	type MatchEventWithSystemData,
	type PlayerClass,
	type PlayerEntity,
} from "~/components/schemas";

export const updateCandidates = (
	index: number,
	matchEvents: MatchEventWithSystemData[],
	playerCandidates: PlayerEntity[],
): PlayerEntity[] => {
	// 最新のインデックスが存在するのなら、メンバーチェンジが為されているため更新しない
	if (index === 0 || playerCandidates.length === index + 1) {
		return playerCandidates;
	}

	// 直前の攻撃側・防御側候補者リスト、および蘇生対象候補リストを定義
	let prevRaiderCandidates: PlayerClass[] = [];
	let prevDefenderCandidates: PlayerClass[] = [];

	// 直前の攻撃側と防御側の候補者リストを取得（インデックスが0なら初期状態を保持）
	prevRaiderCandidates =
		playerCandidates[index - 1]?.raidPlayers || playerCandidates[0].raidPlayers;
	prevDefenderCandidates =
		playerCandidates[index - 1]?.defencePlayers ||
		playerCandidates[0]?.defencePlayers;

	// 攻守交代: インデックスが0の場合はそのまま、それ以降は前回の防御側が今回の攻撃側に
	const currentRaiderCandidates: PlayerClass[] =
		index === 0 ? prevRaiderCandidates : prevDefenderCandidates;
	const currentDefenderCandidates: PlayerClass[] =
		index === 0 ? prevDefenderCandidates : prevRaiderCandidates;

	// インデックスが0より大きい場合、前回の試合結果を考慮して候補者リストを更新
	if (index === 0) {
		return playerCandidates;
	}
	const prevEvent = matchEvents[index - 1];
	const { defeatedDefenders, revivedDefenderIds, isSuccess, raiderId } =
		prevEvent;

	// 【攻撃側候補の更新1】
	// 前回の防御側の中で敗北したプレイヤーをinactiveに変更
	let updatedRaiderCandidates: PlayerClass[] = currentRaiderCandidates.map(
		(player) =>
			defeatedDefenders.some((defender) => defender.id === player.player.id)
				? { ...player, status: PlayerStatus.INACTIVE }
				: player,
	);

	// 【攻撃側候補の更新2】
	// 前回の復活したプレイヤーをactiveに変更
	updatedRaiderCandidates = updatedRaiderCandidates.map((player) =>
		revivedDefenderIds.some((revivedId) => revivedId === player.player.id)
			? { ...player, status: PlayerStatus.ACTIVE }
			: player,
	);

	// 【防御側候補の更新】
	let updatedDefenderCandidates: PlayerClass[] = currentDefenderCandidates.map(
		(player) =>
			revivedDefenderIds.some((revivedId) => revivedId === player.player.id)
				? { ...player, status: PlayerStatus.ACTIVE }
				: player,
	);

	if (!isSuccess) {
		// 攻撃が失敗した場合、攻撃者（raiderId）を防御側候補リストからinactiveに変更
		updatedDefenderCandidates = updatedDefenderCandidates.map((player) =>
			player.player.id === raiderId
				? { ...player, status: PlayerStatus.INACTIVE }
				: player,
		);
	}

	// 全滅対応
	const revivePlayers = (players: PlayerClass[]) =>
		players.map((player) =>
			player.status === PlayerStatus.INACTIVE
				? { ...player, status: PlayerStatus.ACTIVE }
				: player,
		);

	const activeRaiderCount = updatedRaiderCandidates.filter(
		(player) => player.status === PlayerStatus.ACTIVE,
	).length;
	const activeDefenderCount = updatedDefenderCandidates.filter(
		(player) => player.status === PlayerStatus.ACTIVE,
	).length;

	if (activeRaiderCount === 0) {
		updatedRaiderCandidates = revivePlayers(prevDefenderCandidates);
	}
	if (activeDefenderCount === 0) {
		updatedDefenderCandidates = revivePlayers(prevRaiderCandidates);
	}

	// 更新された攻撃側・防御側のリストを保存
	playerCandidates[index] = {
		eventNumber: index,
		raidPlayers: updatedRaiderCandidates,
		defencePlayers: updatedDefenderCandidates,
	};

	// 更新された候補者リストを返却
	return playerCandidates;
};

export const getUpdatedCandidates = (
	index: number,
	matchEvents: MatchEventWithSystemData[],
	playerCandidates: PlayerEntity[],
	setPlayerCandidates: (candidates: PlayerEntity[]) => void,
): void => {
	const updatedCandidates = updateCandidates(
		index,
		matchEvents,
		playerCandidates,
	);
	setPlayerCandidates(updatedCandidates);
};
