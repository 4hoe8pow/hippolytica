"use client";

import MatchAnalytics from "@/app/components/MatchAnalytics";
import { Download, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import type { MatchDataWithEvents } from "~/components/schemas";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";

const MatchPage = () => {
	const [matchData, setMatchData] = useState<MatchDataWithEvents | null>(null);

	useEffect(() => {
		const storedMatchData = localStorage.getItem("matchDataWithEvents");
		if (storedMatchData) {
			try {
				const parsedData: MatchDataWithEvents = JSON.parse(storedMatchData);
				console.info(parsedData);

				if (parsedData.events && parsedData.events.length > 0) {
					setMatchData(parsedData);
				}
			} catch (error) {
				console.error("Error parsing stored data.");
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
					}
				} catch (error) {
					console.error("Error parsing JSON.");
				}
			};
			reader.readAsText(file);
		}
	};

	const handleResetCache = () => {
		localStorage.removeItem("matchDataWithEvents");
		setMatchData(null);
	};

	const handleRedownload = () => {
		const storedMatchData = localStorage.getItem("matchDataWithEvents");
		if (storedMatchData) {
			const blob = new Blob([storedMatchData], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "match-report.json";
			a.click();
			URL.revokeObjectURL(url);
		}
	};

	return (
		<div className="mx-auto">
			{matchData ? (
				<div className="flex flex-col space-y-8 items-center">
					<MatchAnalytics data={matchData} />
					<div className="flex flex-row space-x-12 w-1/3 justify-between align-bottom">
						<Button
							onClick={handleRedownload}
							className="w-1/3"
							variant={"default"}
						>
							Redownload <Download />
						</Button>
						<Button
							onClick={handleResetCache}
							className="w-1/3"
							variant={"destructive"}
						>
							Delete <Trash />
						</Button>
					</div>
				</div>
			) : (
				<div className="flex flex-col items-center">
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
