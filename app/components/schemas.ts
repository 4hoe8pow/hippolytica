import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Player Schema
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

export type PlayerSchemaType = z.infer<typeof playerSchema>;

export const playerDefaultValue = {
	id: "",
	playerName: "",
	height: 170,
	weight: 80,
	jerseyNumber: 0,
};

// Entry Schema
const entrySchema = z.object({
	matchDate: z.preprocess(
		(v) => new Date(v as string),
		z.date({
			required_error: "Match date is required.",
		}),
	),
	dogTeamName: z.string().min(2, {
		message: "Team name must be at least 2 characters.",
	}),
	catTeamName: z.string().min(2, {
		message: "Team name must be at least 2 characters.",
	}),
	dogPlayers: z.array(playerSchema),
	catPlayers: z.array(playerSchema),
});

export type EntrySchemaType = z.infer<typeof entrySchema>;
export const entryResolver = zodResolver(entrySchema);

export const EntryDefaultValue = {
	matchDate: new Date(),
	dogTeamName: "",
	catTeamName: "",
	dogPlayers: [playerDefaultValue],
	catPlayers: [playerDefaultValue],
};

// Match Event Schema
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
	DIVE = "Dive",
}

export const matchEventSchema = z
	.object({
		raiderId: z.string().uuid("Raider is required"),
		isSuccess: z.boolean(),
		defeatedDefenderIds: z.array(z.string()),
		revivedDefenderIds: z.array(z.string()),
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

export type MatchEventSchemaType = z.infer<typeof matchEventSchema>;

export const matchEventResolver = zodResolver(matchEventSchema);

export const MatchEventDefaultValue: MatchEventSchemaType = {
	raiderId: "",
	isSuccess: false,
	defeatedDefenderIds: [],
	revivedDefenderIds: [],
	hasBonusPoints: false,
	resultCategory: undefined,
	tackleBy: undefined,
	timeSpentInRaid: 0,
};

export type MatchEventWithSystemData = MatchEventSchemaType & {
	id: number;
	raiderName: string;
	raiderHeight: number;
	raiderWeight: number;
	raiderTeamName: string;
	raiderJerseyNumber: number;
	gained: number;
	lost: number;
	defeatedDefenders: PlayerSchemaType[];
	revivedDefenders: PlayerSchemaType[];
	tacklerName: string | null;
	tacklerHeight: number | null;
	tacklerWeight: number | null;
	tacklerJerseyNumber: number | null;
};

export type MatchDataWithEvents = {
	matchDate: Date;
	dogTeamName: string;
	catTeamName: string;
	events: MatchEventWithSystemData[];
};

export enum PlayerStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
	RESERVED = "reserved",
}

export type PlayerClass = {
	team: "dog" | "cat";
	player: PlayerSchemaType;
	status: PlayerStatus;
};

export type PlayerEntity = {
	eventNumber: number;
	raidPlayers: PlayerClass[];
	defencePlayers: PlayerClass[];
};

export const initPlayerEntity = (
	parsedData: EntrySchemaType,
): PlayerEntity => ({
	eventNumber: 0,
	raidPlayers: parsedData?.dogPlayers.map((player, index) => ({
		team: "dog",
		player,
		status: index < 7 ? PlayerStatus.ACTIVE : PlayerStatus.RESERVED,
	})),
	defencePlayers: parsedData?.catPlayers.map((player, index) => ({
		team: "cat",
		player,
		status: index < 7 ? PlayerStatus.ACTIVE : PlayerStatus.RESERVED,
	})),
});

export type ScoreDynamicsProps = {
	alliesCount: number; // 味方の人数（1-7人）
	opponentsCount: number; // 敵の人数（1-7人）
	teamScore: number; // 現在の自チームスコア（0-∞点）
	opponentScore: number; // 現在の敵チームスコア（0-∞点）
	matchTime: number; // 試合時間経過（0-900秒）
	isDoD: boolean; // Do or Dieレイドか
	resultPoint: number; // 負の値をもつなら失点
};

export type RegressionResult = {
	term: string;
	estimate: number;
	"std.error": number;
	statistic: number;
	"p.value": number;
};
