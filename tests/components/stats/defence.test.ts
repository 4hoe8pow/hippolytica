import { describe, expect, it } from "vitest";
import type { MatchEventWithSystemData } from "~/components/schemas";
import {
	calculateDefenderTransition,
	trackTeamCountTransition,
	updateTransition,
} from "~/components/stats/defence";
