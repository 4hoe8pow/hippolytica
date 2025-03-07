import { CircleCheck, CircleOff } from "lucide-react";
import React, {
	type Dispatch,
	type SetStateAction,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useForm, useWatch } from "react-hook-form";
import MemberChangeDialog from "~/components/MemberChangeDialog";
import {
	MatchEventDefaultValue,
	type MatchEventSchemaType,
	type PlayerClass,
	type PlayerEntity,
	ResultCategory,
	matchEventResolver,
} from "~/components/schemas";
import { Badge } from "~/components/ui/badge";
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
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";

export type RaidFormProps = {
	eventNumber: number;
	playerCandidates: PlayerEntity[];
	setPlayerCandidates: Dispatch<SetStateAction<PlayerEntity[]>>;
	isDogTeamTurn: boolean;
	handleCommit: (
		formData: MatchEventSchemaType,
		gainedPoints: number,
		lostPoints: number,
	) => void;
};

export default function RaidForm({
	eventNumber,
	playerCandidates,
	setPlayerCandidates,
	isDogTeamTurn,
	handleCommit,
}: RaidFormProps) {
	const form = useForm<MatchEventSchemaType>({
		resolver: matchEventResolver,
		defaultValues: MatchEventDefaultValue,
	});
	const [hasBonusPoints, setHasBonusPoints] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const raiderCandidates = useMemo(() => {
		return playerCandidates[eventNumber]?.raidPlayers
			.filter((p: PlayerClass) => p.status === "active")
			.map((p: PlayerClass) => p.player);
	}, [playerCandidates, eventNumber]);

	const defenderCandidates = useMemo(() => {
		return playerCandidates[eventNumber]?.defencePlayers
			.filter((p: PlayerClass) => p.status === "active")
			.map((p: PlayerClass) => p.player);
	}, [playerCandidates, eventNumber]);

	const dogReviverCandidates = useMemo(() => {
		return playerCandidates[eventNumber]?.raidPlayers
			.filter((p) => p.team === "dog" && p.status === "inactive")
			.map((p) => p.player);
	}, [playerCandidates, eventNumber]);

	const catReviverCandidates = useMemo(() => {
		return playerCandidates[eventNumber]?.raidPlayers
			.filter((p) => p.team === "cat" && p.status === "inactive")
			.map((p) => p.player);
	}, [playerCandidates, eventNumber]);

	const reviverCandidates = useMemo(() => {
		return isSuccess
			? isDogTeamTurn
				? dogReviverCandidates
				: catReviverCandidates
			: isDogTeamTurn
				? catReviverCandidates
				: dogReviverCandidates;
	}, [isSuccess, isDogTeamTurn, dogReviverCandidates, catReviverCandidates]);

	const onSubmit = (formData: MatchEventSchemaType) => {
		handleCommit(formData, gainedPoints, lostPoints);
	};

	const defeatedDefenderIds = useWatch({
		control: form.control,
		name: "defeatedDefenderIds",
	});
	const watchedHasBonusPoints = useWatch({
		control: form.control,
		name: "hasBonusPoints",
	});

	// 得点計算
	const gainedPoints = useMemo(() => {
		if (!defenderCandidates) return 0;
		let points = defeatedDefenderIds.length + (watchedHasBonusPoints ? 1 : 0);
		//Lona
		if (defenderCandidates.length === defeatedDefenderIds.length) {
			points += 2;
		}
		return points;
	}, [defeatedDefenderIds, watchedHasBonusPoints, defenderCandidates]);

	// 失点計算
	const lostPoints = useMemo(() => {
		if (!defenderCandidates) return 0;
		let points = isSuccess ? 0 : 1;
		// Super Tackle
		if (
			!isSuccess &&
			defeatedDefenderIds.length <= 3 &&
			defenderCandidates.length <= 3
		) {
			points = 2;
		}
		// Lona
		if (!isSuccess && raiderCandidates.length === 1) {
			points += 2;
		}
		return points;
	}, [isSuccess, defeatedDefenderIds, raiderCandidates, defenderCandidates]);

	const availableResultCategories = useMemo(() => {
		if (defeatedDefenderIds.length > 0) {
			return [ResultCategory.CLEAN_TOUCH, ResultCategory.ESCAPE];
		}
		if (defeatedDefenderIds.length === 0 && isSuccess) {
			return [ResultCategory.EMPTY];
		}
		return [
			ResultCategory.TACKLE,
			ResultCategory.COUNTER,
			ResultCategory.CHAIN,
			ResultCategory.ANKLE_CATCH,
			ResultCategory.BACK_CATCH,
		];
	}, [defeatedDefenderIds, isSuccess]);

	useEffect(() => {
		if (availableResultCategories.length === 1) {
			form.setValue("resultCategory", availableResultCategories[0]);
		} else {
			form.resetField("resultCategory");
		}
	}, [availableResultCategories, form]);

	const raidChallengeSummary = useMemo(() => {
		if (!defenderCandidates) return 0;
		let summary = isSuccess ? "Success" : "Failure";
		if (gainedPoints === 1 && hasBonusPoints) {
			summary += " Bonus";
		}
		if (
			!isSuccess &&
			defeatedDefenderIds.length <= 3 &&
			defenderCandidates.length <= 3
		) {
			summary = "Super Tackle";
		}
		if (!isSuccess && raiderCandidates.length === 1) {
			summary = "Lona";
		}
		return summary;
	}, [
		isSuccess,
		gainedPoints,
		hasBonusPoints,
		defeatedDefenderIds,
		defenderCandidates,
		raiderCandidates,
	]);

	// メンバーチェンジ
	const handleChangeMembers = (playerChangeCandidate: PlayerEntity) => {
		// 変更リクエストを適用
		setPlayerCandidates((prevCandidates) => {
			console.log(playerChangeCandidate);
			const currentCandidates = prevCandidates.map((candidate) =>
				candidate.eventNumber === playerChangeCandidate.eventNumber
					? playerChangeCandidate
					: candidate,
			);
			return currentCandidates;
		});

		form.reset();
	};

	return (
		<AccordionItem value={String(eventNumber)}>
			<Card className="p-4">
				<AccordionTrigger>
					<CardHeader>
						<div className="flex justify-between items-center w-full">
							<CardTitle>Raid #{eventNumber + 1}</CardTitle>
							<div className="flex items-center gap-2">
								<Badge
									variant={isSuccess ? "default" : "destructive"}
									className="text-md"
								>
									{raidChallengeSummary}
								</Badge>
								{isSuccess ? (
									<CircleCheck color="#6be109" />
								) : (
									<CircleOff color="#ff2e2e" />
								)}
							</div>
						</div>
						<CardDescription>Answer the questions below.</CardDescription>
					</CardHeader>
				</AccordionTrigger>
				<AccordionContent>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-8"
							>
								{/* 1. レイダー選択 */}
								<FormField
									control={form.control}
									name="raiderId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>1. Who is the raider?</FormLabel>
											<FormControl>
												<Select
													onValueChange={field.onChange}
													value={field.value}
												>
													<SelectTrigger className="w-[180px]">
														<SelectValue placeholder="Raider" />
													</SelectTrigger>
													<SelectContent>
														{raiderCandidates?.map((player) => (
															<SelectItem key={player.id} value={player.id}>
																{player.jerseyNumber}:{player.playerName}
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
														onCheckedChange={(checked) => {
															field.onChange(checked);
															setIsSuccess(checked);
														}}
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
									name="defeatedDefenderIds"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												3. Who are the defeated defenders? (including lineouts)
											</FormLabel>
											<FormControl>
												<div className="grid grid-cols-3 gap-4">
													{defenderCandidates?.map((defender) => (
														<div
															key={defender.id}
															className="flex items-center"
														>
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
															<span className="ml-2">
																{defender.jerseyNumber}:{defender.playerName}
															</span>
														</div>
													))}
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* 4. 復活する味方ディフェンダー選択 */}
								<FormField
									control={form.control}
									name="revivedDefenderIds"
									render={({ field }) => (
										<FormItem>
											<FormLabel>4. Who are the revived defenders?</FormLabel>
											<FormControl>
												<div className="grid grid-cols-3 gap-4">
													{reviverCandidates?.map((defender) => (
														<div
															key={defender.id}
															className="flex items-center"
														>
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
															<span className="ml-2">
																{defender.jerseyNumber}:{defender.playerName}
															</span>
														</div>
													))}
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* 5. ボーナスポイント */}
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
														disabled={
															!defenderCandidates ||
															defenderCandidates.length < 6
														}
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
								{/* 6. 決まり手 */}
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
								{/* 7. タックラー */}
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
														{defenderCandidates?.map((defender) => (
															<SelectItem key={defender.id} value={defender.id}>
																{defender.jerseyNumber}:{defender.playerName}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* 8. レイド秒 */}
								<FormField
									control={form.control}
									name="timeSpentInRaid"
									render={({ field }) => (
										<FormItem>
											<FormLabel>7. Time spent in raid (seconds)</FormLabel>
											<FormControl>
												<Select
													value={field.value?.toString()}
													onValueChange={(value) =>
														field.onChange(Number(value))
													}
												>
													<SelectTrigger className="w-[100px]">
														<SelectValue placeholder="Time" />
													</SelectTrigger>
													<SelectContent>
														{[...Array(30).keys()].map((i) => (
															<SelectItem
																key={i + 1}
																value={(i + 1).toString()}
															>
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
								<div className="flex flex-row justify-between">
									<Button type="submit">COMMIT</Button>
									{playerCandidates.length === eventNumber + 1 && (
										<MemberChangeDialog
											eventNumber={eventNumber}
											currentCandidates={playerCandidates[eventNumber]}
											handleChangeMembers={handleChangeMembers}
										/>
									)}
								</div>
							</form>
						</Form>
					</CardContent>
				</AccordionContent>
				<Separator />
				<CardFooter className="flex justify-center">
					<CardDescription>
						Gained [{gainedPoints}] / Lost [{lostPoints}]
					</CardDescription>
				</CardFooter>
			</Card>
		</AccordionItem>
	);
}
