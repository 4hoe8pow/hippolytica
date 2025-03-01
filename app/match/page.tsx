"use client";

import { useEffect, useState } from "react";
import MatchAnalytics from "~/components/match-analytics";
import type { MatchDataWithEvents } from "~/components/schemas";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";

const MatchPage = () => {
	const [matchData, setMatchData] = useState<MatchDataWithEvents | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const storedMatchData = localStorage.getItem("matchDataWithEvents");
		if (storedMatchData) {
			try {
				const parsedData: MatchDataWithEvents = JSON.parse(storedMatchData);
				console.info(parsedData);

				if (parsedData.events && parsedData.events.length > 0) {
					setMatchData(parsedData);
				} else {
					setError("Invalid data format or insufficient data.");
				}
			} catch (error) {
				setError("Error parsing stored data.");
			}
		}
	}, []);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const data: MatchDataWithEvents = JSON.parse(
						e.target?.result as string,
					);
					if (data.events && data.events.length > 0) {
						setMatchData(data);
						localStorage.setItem("matchDataWithEvents", JSON.stringify(data));
						setError(null);
					} else {
						setError("Invalid data format or insufficient data.");
					}
				} catch (error) {
					setError("Error parsing JSON.");
				}
			};
			reader.readAsText(file);
		}
	};

	return (
		<div className="max-w-[62vw] mx-auto">
			{matchData ? (
				<AspectRatio ratio={16 / 9}>
					<MatchAnalytics data={matchData} />
				</AspectRatio>
			) : (
				<div className="flex flex-col items-center">
					{error && <p className="text-red-500">{error}</p>}
					<Label htmlFor="match-data-upload">Upload Match Data</Label>
					<Input
						id="match-data-upload"
						type="file"
						onChange={handleFileUpload}
					/>
					<Separator className="my-4" />
					<Button
						onClick={() =>
							document.getElementById("match-data-upload")?.click()
						}
					>
						Upload Data
					</Button>
				</div>
			)}
		</div>
	);
};

export default MatchPage;
