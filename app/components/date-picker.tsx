"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";

interface DatePickerProps {
	value: Date | undefined;
	onSelect: (date: Date | undefined) => void;
}

export function DatePicker({ value, onSelect }: DatePickerProps) {
	const handleSelect = (date: Date | undefined) => {
		if (date) {
			const offset = date.getTimezoneOffset();
			const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
			onSelect(adjustedDate);
		} else {
			onSelect(date);
		}
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[280px] justify-start text-left font-normal",
						!value && "text-muted-foreground",
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{value ? format(value, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={value}
					onSelect={handleSelect}
					autoFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
