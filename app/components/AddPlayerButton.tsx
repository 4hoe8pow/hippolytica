import { UserPlus } from "lucide-react";

import { Button } from "~/components/ui/button";

interface AddPlayerButtonProps {
	handleAddPlayer: (
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
	) => void;
	fields: {
		id: string;
		playerName: string;
		height: number;
		weight: number;
		jerseyNumber: number;
	}[];
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
