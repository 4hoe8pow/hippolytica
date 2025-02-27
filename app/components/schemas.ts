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

const teamSchema = z.object({
	dog_team_name: z.string().min(2, {
		message: "Team name must be at least 2 characters.",
	}),
	cat_team_name: z.string().min(2, {
		message: "Team name must be at least 2 characters.",
	}),
	dog_players: z.array(playerSchema),
	cat_players: z.array(playerSchema),
});

export type TeamSchemaType = z.infer<typeof teamSchema>;
export const teamResolver = zodResolver(teamSchema);

export const PlayerDefaultValue = {
	id: uuidv4(),
	playerName: "",
	height: 0,
	weight: 0,
	jerseyNumber: 0,
};

export type PlayerSchemaType = z.infer<typeof playerSchema>;

export const TeamDefaultValue = {
	dog_team_name: "",
	cat_team_name: "",
	dog_players: [PlayerDefaultValue],
	cat_players: [PlayerDefaultValue],
};

const matchEventSchema = z.object({
	raiderId: z.string().uuid(),
	isSuccess: z.boolean(),
	defenderIds: z.array(z.string()),
	hasBonusPoints: z.boolean(),
});

export const matchEventResolver = zodResolver(matchEventSchema);

export const MatchEventDefaultValue = {
	raiderId: undefined,
	isSuccess: false,
	defenderIds: [],
	hasBonusPoints: false,
};

export type MatchEventSchemaType = z.infer<typeof matchEventSchema>;
