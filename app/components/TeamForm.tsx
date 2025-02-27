import { Trash } from "lucide-react";
import { useState } from "react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";

import AddPlayerButton from "./AddPlayerButton";
import {
	PlayerDefaultValue,
	type PlayerSchemaType,
	type TeamSchemaType,
} from "./schemas";

interface TeamFormProps {
	form: UseFormReturn<TeamSchemaType>;
	setOpen: (open: boolean) => void;
}

const TeamForm = ({ form, setOpen }: TeamFormProps) => {
	const [useExistingData, setUseExistingData] = useState({
		dog: false,
		cat: false,
	});

	const useCreateFieldArray = (name: "dog_players" | "cat_players") =>
		useFieldArray({
			control: form.control,
			name,
		});

	const dogFieldArray = useCreateFieldArray("dog_players");
	const catFieldArray = useCreateFieldArray("cat_players");

	const handleAddPlayer = (
		fields: {
			id: string;
			playerName: string;
			height: number;
			weight: number;
			jerseyNumber: number;
		}[],
		append: (value: {
			id: string;
			playerName: string;
			height: number;
			weight: number;
			jerseyNumber: number;
		}) => void,
	) => {
		if (fields.length >= 13) {
			setOpen(true);
		} else {
			append({
				id: uuidv4(),
				playerName: "",
				height: 0,
				weight: 0,
				jerseyNumber: 0,
			});
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
					form.setValue(`${team}_team_name`, data.team_name, {
						shouldValidate: true,
						shouldDirty: true,
					});
					form.setValue(`${team}_players`, playersWithId, {
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

	const renderPlayerFields = (
		fields: {
			id: string;
			playerName: string;
			height: number;
			weight: number;
			jerseyNumber: number;
		}[],
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
									| `dog_players.${number}.playerName`
									| `dog_players.${number}.height`
									| `dog_players.${number}.weight`
									| `dog_players.${number}.jerseyNumber`
									| `cat_players.${number}.playerName`
									| `cat_players.${number}.height`
									| `cat_players.${number}.weight`
									| `cat_players.${number}.jerseyNumber`
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
															prefix === "dog_players"
																? dogFieldArray.fields
																: catFieldArray.fields,
															prefix === "dog_players"
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
						className="my-auto"
					>
						<Trash />
					</Button>
				</div>
				<Separator className="my-4" />
			</div>
		));

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
			{["Dog", "Cat"].map((team) => (
				<div key={team}>
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
						name={team === "Dog" ? "dog_team_name" : "cat_team_name"}
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
						`${team.toLowerCase()}_players`,
					)}
					<AddPlayerButton
						handleAddPlayer={handleAddPlayer}
						fields={
							team === "Dog" ? dogFieldArray.fields : catFieldArray.fields
						}
						append={
							team === "Dog"
								? () => dogFieldArray.append(PlayerDefaultValue)
								: () => catFieldArray.append(PlayerDefaultValue)
						}
					/>
				</div>
			))}
		</div>
	);
};

export default TeamForm;
