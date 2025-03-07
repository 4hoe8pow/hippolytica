"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import EntryForm from "@/app/components/forms/EntryForm";
import AlertDialogComponent from "~/components/AlertDialogComponent";
import Greeting from "~/components/Greeting";
import LanguageToggle from "~/components/LanguageToggle";
import {
	EntryDefaultValue,
	type EntrySchemaType,
	entryResolver,
} from "~/components/schemas";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";

export default function Home() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isEnglish, setIsEnglish] = useState(false);
	const alertTitle = "Cannot Add Player";
	const alertMessage = "You cannot add more than 13 players to a team.";
	const form = useForm<EntrySchemaType>({
		mode: "onChange",
		resolver: entryResolver,
		defaultValues: EntryDefaultValue,
	});

	useEffect(() => {
		const savedData = localStorage.getItem("formData");
		const savedTime = localStorage.getItem("formDataTime");
		const now = new Date().getTime();
		const expiryTime = 24 * 60 * 60 * 1000; // 24 hours

		if (
			savedData &&
			savedTime &&
			now - Number.parseInt(savedTime) < expiryTime
		) {
			form.reset(JSON.parse(savedData));
		} else {
			localStorage.removeItem("formData");
			localStorage.removeItem("formDataTime");
		}
	}, [form]);

	function onSubmit(values: EntrySchemaType) {
		localStorage.setItem("formData", JSON.stringify(values));
		localStorage.setItem("formDataTime", new Date().getTime().toString());
		router.push("/gazer");
	}

	return (
		<>
			<LanguageToggle onToggle={setIsEnglish} />
			<Greeting isEnglish={isEnglish} />
			<div>
				<AlertDialogComponent
					open={open}
					setOpen={setOpen}
					title={alertTitle}
					message={alertMessage}
				/>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<EntryForm form={form} setOpen={setOpen} />
						<div className="flex justify-center">
							<Button
								type="submit"
								className="w-1/3 my-4"
								variant={
									Object.keys(form.formState.errors).length
										? "outline"
										: "default"
								}
							>
								NEXT <ArrowRight />
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
}
