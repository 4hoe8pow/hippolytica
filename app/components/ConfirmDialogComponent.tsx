import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "~/components/ui/button";

interface ConfirmDialogComponentProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	onConfirm: () => void;
}

const ConfirmDialogComponent = ({
	open,
	setOpen,
	onConfirm,
}: ConfirmDialogComponentProps) => {
	return (
		<AlertDialog.Root open={open} onOpenChange={setOpen}>
			<AlertDialog.Portal>
				<AlertDialog.Overlay className="fixed inset-0 " />
				<AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-black p-6 rounded-md shadow-lg">
					<AlertDialog.Title className="text-lg font-bold dark:text-white">
						Confirm Action
					</AlertDialog.Title>
					<AlertDialog.Description className="mt-2">
						Are you sure you want to finalize the entered information? The data
						will be downloaded as reusable data and you will be redirected to
						the data viewing page.
					</AlertDialog.Description>
					<div className="mt-4 flex justify-end space-x-2">
						<AlertDialog.Cancel asChild>
							<Button onClick={() => setOpen(false)}>No</Button>
						</AlertDialog.Cancel>
						<AlertDialog.Action asChild>
							<Button onClick={onConfirm}>Yes</Button>
						</AlertDialog.Action>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
};

export default ConfirmDialogComponent;
