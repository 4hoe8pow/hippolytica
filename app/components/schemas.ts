import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";

const playerNameSchema = z
	.string()
	.regex(/^[a-zA-Z\s]*$/, {
		message: "Username must contain only letters and spaces.",
	})
	.max(26, {
		message: "Username must be at most 26 characters.",
	})
	.min(2, {
		message: "Username must be at least 2 characters.",
	})
	.transform((v) => v.toUpperCase());

const playerSchema = z.object({
	id: z.string().uuid(),
	playerName: playerNameSchema,
	height: z.preprocess(
		(v) => Number(v),
		z
			.number()
			.min(90, {
				message: "Height must be between 90 and 251.",
			})
			.max(251, {
				message: "Height must be between 90 and 251.",
			}),
	),
	weight: z.preprocess(
		(v) => Number(v),
		z
			.number()
			.min(40, {
				message: "Weight must be between 40 and 85.",
			})
			.max(85, {
				message: "Weight must be between 40 and 85.",
			}),
	),
	jerseyNumber: z.preprocess(
		(v) => Number(v),
		z
			.number()
			.min(0, {
				message: "Jersey number must be between 0 and 999.",
			})
			.max(999, {
				message: "Jersey number must be between 0 and 999.",
			}),
	),
});

const entrySchema = z.object({
	matchDate: z.date({
		required_error: "Match date is required.",
	}),
	dog_team_name: z.string().min(2, {
		message: "Team name must be at least 2 characters.",
	}),
	cat_team_name: z.string().min(2, {
		message: "Team name must be at least 2 characters.",
	}),
	dog_players: z.array(playerSchema),
	cat_players: z.array(playerSchema),
});

export type EntrySchemaType = z.infer<typeof entrySchema>;
export const entryResolver = zodResolver(entrySchema);

export const PlayerDefaultValue = {
	id: uuidv4(),
	playerName: "",
	height: 0,
	weight: 0,
	jerseyNumber: 0,
};

export type PlayerSchemaType = z.infer<typeof playerSchema>;

export const EntryDefaultValue = {
	matchDate: new Date(),
	dog_team_name: "",
	cat_team_name: "",
	dog_players: [PlayerDefaultValue],
	cat_players: [PlayerDefaultValue],
};

export enum ResultCategory {
	CLEAN_TOUCH = "Clean-Touch",
	ESCAPE = "Escape",
	EMPTY = "Empty",
	TACKLE = "Tackle",
	COUNTER = "Counter",
	CHAIN = "Chain",
	ANKLE_CATCH = "Ankle-Catch",
	BACK_CATCH = "Back-Catch",
	BONUS_ONLY = "Bonus-Only",
}

export const matchEventSchema = z
	.object({
		raiderId: z.string().uuid("Raider is required"),
		isSuccess: z.boolean(),
		defenderIds: z.array(z.string()),
		hasBonusPoints: z.boolean(),
		resultCategory: z.nativeEnum(ResultCategory).optional(),
		tackleBy: z.string().uuid().optional(),
		timeSpentInRaid: z
			.number()
			.int()
			.min(1)
			.max(30, "Raid time must be between 1 and 30 seconds"),
	})
	.refine(
		(data) => {
			// isSuccess が false の場合は tackleBy が必須
			if (!data.isSuccess && !data.tackleBy) {
				return false;
			}
			return true;
		},
		{
			message: "TackleBy is required when the raid is not successful",
			path: ["tackleBy"],
		},
	)
	.refine(
		(data) => {
			// isSuccess が true の場合は tackleBy が無いことを確認
			if (data.isSuccess && data.tackleBy) {
				return false;
			}
			return true;
		},
		{
			message: "TackleBy must not be provided when the raid is successful",
			path: ["tackleBy"],
		},
	);

export const matchEventResolver = zodResolver(matchEventSchema);

export type MatchEventSchemaType = z.infer<typeof matchEventSchema>;

export type MatchEventWithSystemData = MatchEventSchemaType & {
	id: number;
	gained: number;
	lost: number;
};

export const MatchEventDefaultValue: MatchEventSchemaType = {
	raiderId: "",
	isSuccess: false,
	defenderIds: [],
	hasBonusPoints: false,
	resultCategory: undefined,
	tackleBy: undefined,
	timeSpentInRaid: 0,
};
