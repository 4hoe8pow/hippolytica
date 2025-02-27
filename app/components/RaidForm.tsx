import { CircleCheck, CircleOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { useForm } from "react-hook-form";

import {
	type EntrySchemaType,
	MatchEventDefaultValue,
	type MatchEventSchemaType,
	ResultCategory,
	matchEventResolver,
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
	FormControl,
	FormField,
	FormItem,
	FormLabel,
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

export type RaidFormProps = {
	eventNumber: number;
	parsedData: EntrySchemaType | null;
	handleCommit: (data: MatchEventSchemaType) => void;
};

export default function RaidForm({
	eventNumber,
	parsedData,
	handleCommit,
}: RaidFormProps) {
	const form = useForm<MatchEventSchemaType>({
		resolver: matchEventResolver,
		defaultValues: MatchEventDefaultValue,
	});

	const [defenders, setDefenders] = useState<
		{ id: string; playerName: string }[]
	>([]); // id と playerName を含む形式に変更
	const [hasBonusPoints, setHasBonusPoints] = useState(false);

	const raiderId = useWatch({ control: form.control, name: "raiderId" });

	useEffect(() => {
		if (parsedData && raiderId) {
			const team = parsedData.dog_players.some(
				(player) => player.id === raiderId,
			)
				? "cat_players"
				: "dog_players";
			setDefenders(
				parsedData[team].map((player) => ({
					id: player.id,
					playerName: player.playerName,
				})),
			);
		}
	}, [raiderId, parsedData]);

	const onSubmit = (
		formData: Omit<MatchEventSchemaType, "id" | "gained" | "lost">,
	) => {
		const eventWithSystemData = {
			...formData,
			id: eventNumber,
			gained: gainedPoints,
			lost: lostPoints,
		};
		handleCommit(eventWithSystemData);
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

	const availableResultCategories = useMemo(() => {
		if (defenderIds.length > 0) {
			return [ResultCategory.CLEAN_TOUCH, ResultCategory.ESCAPE];
		}
		if (defenderIds.length === 0 && isSuccess) {
			return [ResultCategory.EMPTY];
		}
		return [
			ResultCategory.TACKLE,
			ResultCategory.COUNTER,
			ResultCategory.CHAIN,
			ResultCategory.ANKLE_CATCH,
			ResultCategory.BACK_CATCH,
		];
	}, [defenderIds, isSuccess]);

	useEffect(() => {
		if (availableResultCategories.length === 1) {
			form.setValue("resultCategory", availableResultCategories[0]);
		} else {
			form.resetField("resultCategory");
		}
	}, [availableResultCategories, form]);

	useEffect(() => {
		if (isSuccess) {
			form.resetField("tackleBy");
		}
	}, [isSuccess, form]);

	return (
		<Card className="p-4">
			<CardHeader>
				<div className="flex justify-between items-center w-full">
					<CardTitle>Raid #{eventNumber}</CardTitle>
					{isSuccess ? (
						<CircleCheck color="#6be109" />
					) : (
						<CircleOff color="#ff2e2e" />
					)}
				</div>
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
										<Select onValueChange={field.onChange} value={field.value}>
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
												<div key={defender.id} className="flex items-center">
													<Checkbox
														checked={field.value.includes(defender.id)}
														onCheckedChange={(checked) => {
															const updatedDefenders = checked
																? [...field.value, defender.id]
																: field.value.filter(
																		(id) => id !== defender.id,
																	);
															field.onChange(updatedDefenders);
														}}
													/>
													<span className="ml-2">{defender.playerName}</span>
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
									<FormLabel>4. Were there bonus points?</FormLabel>
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
						{/* 5. 決まり手 */}
						<FormField
							control={form.control}
							name="resultCategory"
							render={({ field }) => (
								<FormItem>
									<FormLabel>5. Result Category</FormLabel>
									<FormControl>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											disabled={availableResultCategories.length === 1}
										>
											<SelectTrigger className="w-[200px]">
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
											<SelectContent>
												{availableResultCategories.map((category) => (
													<SelectItem key={category} value={category}>
														{category}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* 6. タックラー */}
						<FormField
							control={form.control}
							name="tackleBy"
							render={({ field }) => (
								<FormItem>
									<FormLabel>6. Who tackled the raider?</FormLabel>
									<FormControl>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											disabled={isSuccess}
										>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Tackle by" />
											</SelectTrigger>
											<SelectContent>
												{defenders.map((defender) => (
													<SelectItem key={defender.id} value={defender.id}>
														{defender.playerName}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* 7. レイド秒 */}
						<FormField
							control={form.control}
							name="timeSpentInRaid"
							render={({ field }) => (
								<FormItem>
									<FormLabel>7. Time spent in raid (seconds)</FormLabel>
									<FormControl>
										<Select
											value={field.value?.toString()}
											onValueChange={(value) => field.onChange(Number(value))}
										>
											<SelectTrigger className="w-[100px]">
												<SelectValue placeholder="Time" />
											</SelectTrigger>
											<SelectContent>
												{[...Array(30).keys()].map((i) => (
													<SelectItem key={i + 1} value={(i + 1).toString()}>
														{i + 1}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
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
