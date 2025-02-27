import * as AlertDialog from "@radix-ui/react-alert-dialog";

import { Button } from "~/components/ui/button";

interface AlertDialogComponentProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

const AlertDialogComponent = ({ open, setOpen }: AlertDialogComponentProps) => {
	return (
		<AlertDialog.Root open={open} onOpenChange={setOpen}>
			<AlertDialog.Portal>
				<AlertDialog.Overlay className="fixed inset-0 " />
				<AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-black p-6 rounded-md shadow-lg">
					<AlertDialog.Title className="text-lg font-bold dark:text-white">
						Cannot Add Player
					</AlertDialog.Title>
					<AlertDialog.Description className="mt-2">
						You cannot add more than 13 players to a team.
					</AlertDialog.Description>
					<AlertDialog.Action asChild>
						<Button onClick={() => setOpen(false)}>OK</Button>
					</AlertDialog.Action>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
};

export default AlertDialogComponent;
