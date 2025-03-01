import { Trash } from "lucide-react";
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
import { DatePicker } from "./date-picker";

import AddPlayerButton from "./AddPlayerButton";
import {
	type EntrySchemaType,
	type PlayerSchemaType,
	playerDefaultValue,
} from "./schemas";

interface EntryFormProps {
	form: UseFormReturn<EntrySchemaType>;
	setOpen: (open: boolean) => void;
}

const EntryForm = ({ form, setOpen }: EntryFormProps) => {
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
		if (fields.length >= 13) {
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
				} catch (error) {
					console.error("Error parsing JSON:", error);
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

	const renderPlayerFields = (
		fields: PlayerSchemaType[],
		remove: (index: number) => void,
		prefix: string,
	) =>
		fields.map((field, index) => (
			<div key={field.id}>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
								<FormItem className="grid grid-rows-3 grid-cols-1 py-1">
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
											placeholder={`Enter ${attr}`}
											{...field}
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
		<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
			{/* 試合日 */}
			<div className="col-span-2 flex items-center space-x-4">
				<FormField
					control={form.control}
					name="matchDate"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormLabel>Match Date</FormLabel>
							<FormControl>
								<DatePicker value={field.value} onSelect={field.onChange} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="button" onClick={handleReset}>
					Reset Form
				</Button>
			</div>
			{["Dog", "Cat"].map((team) => (
				<div key={team}>
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
						<Label htmlFor={`${team.toLowerCase()}-use-existing`}>
							Use existing team data
						</Label>
					</div>

					<Separator className="my-4" />
					<FormField
						control={form.control}
						name={team === "Dog" ? "dogTeamName" : "catTeamName"}
						render={({ field }) => (
							<FormItem>
								<FormLabel>{team} Team Name</FormLabel>
								<FormControl>
									<Input
										placeholder="Enter team name"
										{...field}
										value={String(field.value)}
									/>
								</FormControl>
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
