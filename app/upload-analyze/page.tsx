import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function UploadAnalyzePage() {
	return (
		<div className="flex justify-center items-center">
			<div className="grid w-full max-w-sm items-center">
				<Label htmlFor="hippo-data">Data File</Label>
				<Input id="hippo-data" type="file" />
			</div>
		</div>
	);
}
