"use client";

import { useEffect, useState } from "react";
import { convertToScoreDynamicsProps } from "~/components/stats/convert-scorer";
import { runRegressionModel } from "~/lab/run-regression";
import type {
	MatchDataWithEvents,
	RegressionResult,
	ScoreDynamicsProps,
} from "../components/schemas";
import Loading from "./loading";

const getCachedRegressionResult = async (
	data: ScoreDynamicsProps[],
): Promise<RegressionResult[] | null> => {
	try {
		const cacheKey = "regressionResultCache";
		const cachedData = localStorage.getItem(cacheKey);

		// キャッシュが存在する場合はそれを返す
		if (cachedData) {
			return JSON.parse(cachedData);
		}

		// キャッシュがない場合、新しい回帰分析結果を取得
		const result = await runRegressionModel(data);

		// 回帰分析結果をキャッシュ
		localStorage.setItem(cacheKey, JSON.stringify(result));
		return result;
	} catch (error) {
		console.error("Regression model error:", error);
		return null;
	}
};

function JsonResultComponent({
	scoreDynamic,
}: { scoreDynamic: ScoreDynamicsProps[] }) {
	const [jsonResult, setJsonResult] = useState<RegressionResult[] | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		setJsonResult(null); // 新しいデータに応じて結果をリセット

		// キャッシュを活用して回帰分析結果を取得
		getCachedRegressionResult(scoreDynamic)
			.then((result) => {
				setJsonResult(result);
			})
			.finally(() => setLoading(false));
	}, [scoreDynamic]);

	if (loading) {
		return <Loading />;
	}

	if (!jsonResult) {
		return <div>Error loading the results.</div>;
	}

	return <pre>{JSON.stringify(jsonResult, null, 2)}</pre>;
}

export default function LabPage() {
	const [scoreDynamic, setScoreDynamic] = useState<ScoreDynamicsProps[] | null>(
		null,
	);

	useEffect(() => {
		const cachedData = localStorage.getItem("matchDataWithEvents");
		if (cachedData) {
			const parsedData: MatchDataWithEvents = JSON.parse(cachedData);
			const scoreDynamics = convertToScoreDynamicsProps(parsedData.events);
			setScoreDynamic(scoreDynamics);
		}
	}, []);

	if (!scoreDynamic) {
		return <p>No Data</p>;
	}

	return (
		<div>
			<h1>WebR</h1>
			<JsonResultComponent scoreDynamic={scoreDynamic} />
		</div>
	);
}
