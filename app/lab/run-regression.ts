"use server";

import { ChannelType, type RString, WebR } from "webr";
import type { ScoreDynamicsProps } from "~/components/schemas";
import { cache } from "react";

// WebR のインスタンスを作成
const webR = new WebR({
	baseUrl: "./node_modules/webr/dist/",
	channelType: ChannelType.PostMessage,
});

// WebR の初期化をキャッシュ
const initWebR = cache(async () => {
	await webR.init();
	await webR.installPackages(["broom", "jsonlite"]);
});

// 回帰分析を実行
export async function runRegressionModel(data: ScoreDynamicsProps[]) {
	// 初期化をキャッシュ経由で実行
	await initWebR();

	// データの長さチェック
	const lengths = [
		data.map((d) => d.alliesCount).length,
		data.map((d) => d.opponentsCount).length,
		data.map((d) => d.teamScore).length,
		data.map((d) => d.opponentScore).length,
		data.map((d) => d.matchTime).length,
		data.map((d) => (d.isDoD ? 1 : 0)).length,
		data.map((d) => d.resultPoint).length,
	];

	if (!lengths.every((length) => length === lengths[0])) {
		throw new Error("データの長さが一致しません");
	}

	// データフレームの作成
	const alliesCount = data.map((d) => d.alliesCount).join(",");
	const opponentsCount = data.map((d) => d.opponentsCount).join(",");
	const teamScore = data.map((d) => d.teamScore).join(",");
	const opponentScore = data.map((d) => d.opponentScore).join(",");
	const matchTime = data.map((d) => d.matchTime).join(",");
	const isDoD = data.map((d) => (d.isDoD ? 1 : 0)).join(",");
	const resultPoint = data.map((d) => d.resultPoint).join(",");

	const rScript = `
	    library(broom)
	    library(jsonlite)
    
	    # データフレームの作成
	    data <- data.frame(
	    	allies_count = c(${alliesCount}),
	    	opponents_count = c(${opponentsCount}),
	    	team_score = c(${teamScore}),
	    	opponent_score = c(${opponentScore}),
	    	match_time = c(${matchTime}),
	    	is_DoD = c(${isDoD}),
	    	result_point = c(${resultPoint})
	    )
    
	    # 重回帰分析の実行
	    model <- lm(result_point ~ allies_count + opponents_count + team_score + opponent_score + match_time + is_DoD, data = data)
    
	    # 回帰係数をデータフレームとして取得
	    model_summary <- tidy(model)
    
	    # JSON 形式で出力
	    toJSON(model_summary, pretty = TRUE)
    `;

	const myShelter = await new webR.Shelter();

	try {
		const obj = (await myShelter.evalR(rScript)) as RString;
		return JSON.parse(await obj.toString());
	} finally {
		await myShelter.purge();
	}
}
