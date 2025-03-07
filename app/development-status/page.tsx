"use client";

import { Hammer, Mountain, PartyPopper } from "lucide-react";
import { useState } from "react";
import { ArticleSection } from "~/components/ArticleSection";
import LanguageToggle from "~/components/LanguageToggle";
import { TEXTS } from "~/components/dev-log/dev-log";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";

type Description = {
	id: string;
	text: string;
	startDate: string;
	releaseDate: string;
};

type Headers = {
	item: string;
	detail: string;
	startDate: string;
	releaseDate: string;
	endDate: string;
};

const TABLE_HEADERS = {
	japanese: {
		item: "項",
		detail: "内容",
		startDate: "起票",
		releaseDate: "リリース予定",
		endDate: "完了",
	},
	english: {
		item: "Item",
		detail: "Detail",
		startDate: "Start Date",
		releaseDate: "Release Date",
		endDate: "End Date",
	},
};

const renderTable = (
	headers: Headers,
	descriptions: Description[],
	isResolved = false,
) => {
	const sortedDescriptions = isResolved
		? [...descriptions].reverse()
		: descriptions;

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-1/12">{headers.item}</TableHead>
					<TableHead className="w-6/12">{headers.detail}</TableHead>
					<TableHead className="w-2/12">{headers.startDate}</TableHead>
					<TableHead className="w-2/12">
						{!isResolved ? headers.releaseDate : headers.endDate}
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{sortedDescriptions.map((desc) => (
					<TableRow key={desc.id}>
						<TableCell className="w-1/12">{desc.id}</TableCell>
						<TableCell className="w-6/12">{desc.text}</TableCell>
						<TableCell className="w-2/12">{desc.startDate}</TableCell>
						<TableCell className="w-2/12">{desc.releaseDate}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default function DevelopmentStatusPage() {
	const [isEnglish, setIsEnglish] = useState(false);

	const lang = isEnglish ? TEXTS.english : TEXTS.japanese;
	const headers = isEnglish ? TABLE_HEADERS.english : TABLE_HEADERS.japanese;

	return (
		<div className="prose mx-auto p-4 lg:p-8 text-center max-w-4xl border border-gray-300 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
			<LanguageToggle onToggle={setIsEnglish} />
			<h1 className="text-lg py-6">{lang.title}</h1>
			{[
				{
					title: lang.currentStatus,
					descriptions: lang.currentStatusDescription,
					icon: <Hammer />,
				},
				{
					title: lang.futurePlans,
					descriptions: lang.futurePlansDescription,
					icon: <Mountain />,
				},
				{
					title: lang.resolved,
					descriptions: lang.resolvedDescription,
					isResolved: true,
					icon: <PartyPopper />,
				},
			].map(({ title, descriptions, isResolved, icon }) => (
				<ArticleSection key={title} title={title} icon={icon}>
					<div className="max-h-[320px] overflow-y-auto">
						{renderTable(headers, descriptions, isResolved)}
					</div>
				</ArticleSection>
			))}
		</div>
	);
}
