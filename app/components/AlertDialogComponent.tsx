import * as AlertDialog from "@radix-ui/react-alert-dialog";

import { Button } from "~/components/ui/button";

interface AlertDialogComponentProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	title: string;
	message: string;
}

const AlertDialogComponent = ({
	open,
	setOpen,
	title,
	message,
}: AlertDialogComponentProps) => {
	return (
		<AlertDialog.Root open={open} onOpenChange={setOpen}>
			<AlertDialog.Portal>
				<AlertDialog.Overlay className="fixed inset-0 " />
				<AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-black p-6 rounded-md shadow-lg">
					<AlertDialog.Title className="text-lg font-bold dark:text-white">
						{title}
					</AlertDialog.Title>
					<AlertDialog.Description className="mt-2">
						{message}
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
