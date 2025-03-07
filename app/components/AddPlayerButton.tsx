import { UserPlus } from "lucide-react";

import { Button } from "~/components/ui/button";
import type { PlayerSchemaType } from "./schemas";

interface AddPlayerButtonProps {
	handleAddPlayer: (
		fields: PlayerSchemaType[],
		append: (value: PlayerSchemaType) => void,
	) => void;
	fields: PlayerSchemaType[];
	append: () => void;
}

const AddPlayerButton = ({
	handleAddPlayer,
	fields,
	append,
}: AddPlayerButtonProps) => (
	<Button type="button" onClick={() => handleAddPlayer(fields, append)}>
		<UserPlus />
	</Button>
);

export default AddPlayerButton;
