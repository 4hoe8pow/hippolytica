import { Download, Paintbrush, Trash } from "lucide-react";
import { useState } from "react";
import { type UseFormReturn, useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { Button } from "~/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { DatePicker } from "../DatePicker";

import AddPlayerButton from "../AddPlayerButton";
import {
	type EntrySchemaType,
	type PlayerSchemaType,
	playerDefaultValue,
} from "../schemas";

interface EntryFormProps {
	form: UseFormReturn<EntrySchemaType>;
	setOpen: (open: boolean) => void;
	setAlertDialogText: (text: { title: string; message: string }) => void;
}

const EntryForm = ({ form, setOpen, setAlertDialogText }: EntryFormProps) => {
	const [useExistingData, setUseExistingData] = useState({
		dog: false,
		cat: false,
	});

	const useCreateFieldArray = (name: "dogPlayers" | "catPlayers") =>
		useFieldArray({
			control: form.control,
			name,
		});

	const dogFieldArray = useCreateFieldArray("dogPlayers");
	const catFieldArray = useCreateFieldArray("catPlayers");

	const handleAddPlayer = (
		fields: PlayerSchemaType[],
		append: (value: PlayerSchemaType) => void,
	) => {
		const playerDefaultValueWithId = {
			...playerDefaultValue,
			id: uuidv4(),
		};
		if (fields.length > 11) {
			setOpen(true);
		} else {
			append(playerDefaultValueWithId);
		}
	};

	const handleFileUpload = (
		event: React.ChangeEvent<HTMLInputElement>,
		team: "dog" | "cat",
	) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const data = JSON.parse(e.target?.result as string);
					const playersWithId = data.players.map(
						(player: PlayerSchemaType) => ({
							...player,
							id: uuidv4(),
						}),
					);
					form.setValue(`${team}TeamName`, data.teamName, {
						shouldValidate: true,
						shouldDirty: true,
					});
					form.setValue(`${team}Players`, playersWithId, {
						shouldValidate: true,
						shouldDirty: true,
					});
				} catch (_) {
					setAlertDialogText({
						title: "File Upload Error",
						message: "Please upload data containing team data.",
					});
					setOpen(true);
				}
			};
			reader.readAsText(file);
		}
	};

	const handleReset = () => {
		form.reset();
		localStorage.clear();
		const fileInputs = document.querySelectorAll('input[type="file"]');
		for (const input of fileInputs) {
			(input as HTMLInputElement).value = "";
		}
		setUseExistingData({ dog: false, cat: false });
	};

	const handleDownloadData = (team: "dog" | "cat") => {
		const teamName = form.getValues(`${team}TeamName`);
		const teamData = {
			teamName,
			players: form
				.getValues(`${team}Players`)
				.map((player: PlayerSchemaType) => {
					const { id, ...rest } = player;
					return rest;
				}),
		};
		const blob = new Blob([JSON.stringify(teamData, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${teamName}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const renderPlayerFields = (
		fields: PlayerSchemaType[],
		remove: (index: number) => void,
		prefix: string,
	) =>
		fields.map((field, index) => (
			<div key={field.id}>
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
					{["jerseyNumber", "playerName", "height", "weight"].map((attr) => (
						<FormField
							key={`${field.id}-${attr}`}
							control={form.control}
							name={
								`${prefix}.${index}.${attr}` as
									| `dogPlayers.${number}.playerName`
									| `dogPlayers.${number}.height`
									| `dogPlayers.${number}.weight`
									| `dogPlayers.${number}.jerseyNumber`
									| `catPlayers.${number}.playerName`
									| `catPlayers.${number}.height`
									| `catPlayers.${number}.weight`
									| `catPlayers.${number}.jerseyNumber`
							}
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										{attr === "jerseyNumber"
											? "Jersey No."
											: attr === "playerName"
												? "Name"
												: attr === "height"
													? "Ht"
													: "Wt"}
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											className="col-span-1"
											type="text"
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													if (attr === "weight") {
														handleAddPlayer(
															prefix === "dogPlayers"
																? dogFieldArray.fields
																: catFieldArray.fields,
															prefix === "dogPlayers"
																? dogFieldArray.append
																: catFieldArray.append,
														);
													}
												} else if (e.key === "Tab") {
													const formElements = Array.from(
														e.currentTarget.form?.elements || [],
													) as HTMLElement[];
													const index = formElements.indexOf(e.currentTarget);
													if (e.shiftKey) {
														if (index > 0) {
															formElements[index - 1].focus();
															e.preventDefault();
														}
													} else {
														if (index > -1 && index < formElements.length - 1) {
															formElements[index + 1].focus();
															e.preventDefault();
														}
													}
												}
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					))}
					<Button
						type="button"
						onClick={() => remove(index)}
						className="my-auto w-10"
					>
						<Trash />
					</Button>
				</div>
				<Separator className="my-4" />
			</div>
		));

	return (
		<div className="grid">
			{/* 試合日 */}
			<div className="p-4 col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4">
				<FormField
					control={form.control}
					name="matchDate"
					render={({ field }) => (
						<FormItem className="">
							<FormLabel>Match Date</FormLabel>
							<FormControl>
								<DatePicker value={field.value} onSelect={field.onChange} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					variant={"destructive"}
					className="w-1/4"
					type="button"
					onClick={handleReset}
				>
					Reset <Paintbrush />
				</Button>
			</div>

			{["Dog", "Cat"].map((team) => (
				<div key={team} className="col-span-2 sm:col-span-1 space-x-4">
					{/* データアップロード */}
					<div className="flex items-center space-x-2">
						<Label htmlFor={`${team.toLowerCase()}-data`}>Data File</Label>
						<Input
							id={`${team.toLowerCase()}-data`}
							type="file"
							onChange={(e) =>
								handleFileUpload(e, team.toLowerCase() as "dog" | "cat")
							}
							disabled={!useExistingData[team.toLowerCase() as "dog" | "cat"]}
						/>
						<Switch
							id={`${team.toLowerCase()}-use-existing`}
							checked={useExistingData[team.toLowerCase() as "dog" | "cat"]}
							onCheckedChange={(checked) =>
								setUseExistingData((prev) => ({
									...prev,
									[team.toLowerCase()]: checked,
								}))
							}
						/>
					</div>

					<Separator className="my-4" />
					{/* チーム名 */}
					<FormField
						control={form.control}
						name={team === "Dog" ? "dogTeamName" : "catTeamName"}
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									{team === "Dog" ? "レイド先攻" : "レイド後攻"}
								</FormLabel>
								<div className="flex justify-between items-center p-4">
									<FormControl className="w-2/5">
										<Input
											{...field}
											placeholder="Enter team name"
											value={String(field.value)}
										/>
									</FormControl>
									<Button
										type="button"
										onClick={() =>
											handleDownloadData(team.toLowerCase() as "dog" | "cat")
										}
										className="w-2/5"
									>
										Save Team <Download />
									</Button>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Separator className="my-4" />
					{renderPlayerFields(
						team === "Dog" ? dogFieldArray.fields : catFieldArray.fields,
						team === "Dog" ? dogFieldArray.remove : catFieldArray.remove,
						`${team.toLowerCase()}Players`,
					)}
					<AddPlayerButton
						handleAddPlayer={handleAddPlayer}
						fields={
							team === "Dog" ? dogFieldArray.fields : catFieldArray.fields
						}
						append={
							team === "Dog"
								? () => dogFieldArray.append(playerDefaultValue)
								: () => catFieldArray.append(playerDefaultValue)
						}
					/>
				</div>
			))}
		</div>
	);
};

export default EntryForm;
