"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import AlertDialogComponent from "~/components/AlertDialogComponent";
import Greeting from "~/components/Greeting";
import {
	entryResolver,
	EntryDefaultValue,
	type EntrySchemaType,
} from "~/components/schemas";
import EntryForm from "@/app/components/EntryForm";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";

export default function Home() {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const form = useForm<EntrySchemaType>({
		resolver: entryResolver,
		defaultValues: EntryDefaultValue,
	});

	useEffect(() => {
		const savedData = localStorage.getItem("formData");
		if (savedData) {
			form.reset(JSON.parse(savedData));
		}
	}, [form]);

	function onSubmit(values: EntrySchemaType) {
		localStorage.setItem("formData", JSON.stringify(values));
		router.push("/gazer");
	}

	return (
		<>
			<Greeting />
			<div>
				<AlertDialogComponent open={open} setOpen={setOpen} />
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<EntryForm form={form} setOpen={setOpen} />
						<div className="flex justify-center">
							<Button type="submit">
								Submit <ArrowRight />
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
}
