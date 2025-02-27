import { useState, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useForm } from "react-hook-form";

import {
	type TeamSchemaType,
	matchEventResolver,
	MatchEventDefaultValue,
	type MatchEventSchemaType,
} from "~/components/schemas";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "~/components/ui/form";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";

export default function RaidForm({
	eventNumber,
	eventIndex,
	parsedData,
	handleCommit,
}: {
	eventNumber: number;
	eventIndex: number;
	parsedData: TeamSchemaType | null;
	handleCommit: (data: MatchEventSchemaType, index: number) => void;
}) {
	const form = useForm<MatchEventSchemaType>({
		resolver: matchEventResolver,
		defaultValues: MatchEventDefaultValue,
	});

	const [defenders, setDefenders] = useState<string[]>([]);
	const [hasBonusPoints, setHasBonusPoints] = useState(false);
	const handleRaiderSelect = (value: string) => {
		if (parsedData) {
			const team = parsedData.dog_players.some((player) => player.id === value)
				? "cat_players"
				: "dog_players";
			setDefenders(parsedData[team].map((player) => player.playerName));
		}
		form.setValue("raiderId", value);
	};

	const onSubmit = (formData: MatchEventSchemaType) => {
		handleCommit(formData, eventIndex);
	};
	const defenderIds = useWatch({ control: form.control, name: "defenderIds" });
	const watchedHasBonusPoints = useWatch({
		control: form.control,
		name: "hasBonusPoints",
	});
	const isSuccess = useWatch({ control: form.control, name: "isSuccess" });

	const gainedPoints = useMemo(() => {
		return defenderIds.length + (watchedHasBonusPoints ? 1 : 0);
	}, [defenderIds, watchedHasBonusPoints]);

	const lostPoints = useMemo(() => {
		return isSuccess ? 0 : 1;
	}, [isSuccess]);

	return (
		<Card className="p-4">
			<CardHeader>
				<CardTitle>Raid #{eventNumber}</CardTitle>
				<CardDescription>Answer the questions below.</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						{/* 1. レイダー選択 */}
						<FormField
							control={form.control}
							name="raiderId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>1. Who is the raider?</FormLabel>
									<FormControl>
										<Select
											onValueChange={handleRaiderSelect}
											value={field.value}
										>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Raider" />
											</SelectTrigger>
											<SelectContent>
												{parsedData?.dog_players
													.concat(parsedData.cat_players)
													.map((player) => (
														<SelectItem key={player.id} value={player.id}>
															{player.playerName}
														</SelectItem>
													))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* 2. レイド成功/失敗 */}
						<FormField
							control={form.control}
							name="isSuccess"
							render={({ field }) => (
								<FormItem>
									<FormLabel>2. Was the raid successful?</FormLabel>
									<FormControl>
										<div className="flex gap-4">
											<Switch
												id="isRaidSuccessful"
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
											<Label htmlFor="isRaidSuccessful">
												{field.value ? "Success" : "Failure"}
											</Label>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* 3. 倒したディフェンダー選択 */}
						<FormField
							control={form.control}
							name="defenderIds"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										3. Who are the defeated defenders? (including lineouts)
									</FormLabel>
									<FormControl>
										<div className="grid grid-cols-3 gap-4">
											{defenders.map((defender) => (
												<div key={defender} className="flex items-center">
													<Checkbox
														checked={field.value.includes(defender)}
														onCheckedChange={(checked) => {
															const updatedDefenders = checked
																? [...field.value, defender]
																: field.value.filter((id) => id !== defender);
															field.onChange(updatedDefenders);
														}}
													/>
													<span className="ml-2">{defender}</span>
												</div>
											))}
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* 4. ボーナスポイント */}
						<FormField
							control={form.control}
							name="hasBonusPoints"
							render={({ field }) => (
								<FormItem>
									<FormLabel>4. Were there the bonus points?</FormLabel>
									<FormControl>
										<div className="flex gap-4">
											<Switch
												id="hasBonusPoints"
												checked={field.value}
												onCheckedChange={(checked) => {
													field.onChange(checked);
													setHasBonusPoints(checked);
												}}
											/>
											<Label htmlFor="hasBonusPoints">
												{hasBonusPoints ? "Yes" : "No"}
											</Label>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Commit</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="flex justify-center">
				<CardDescription>
					Gained [{gainedPoints}] / Lost [{lostPoints}]
				</CardDescription>
			</CardFooter>
		</Card>
	);
}
