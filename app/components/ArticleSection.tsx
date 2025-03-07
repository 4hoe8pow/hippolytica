"use client";
import type { ReactNode } from "react";

interface ArticleSectionProps {
	title: string;
	children: ReactNode;
	icon?: ReactNode;
}

export function ArticleSection({ title, children, icon }: ArticleSectionProps) {
	return (
		<div className="mb-8 text-left">
			<h2 className="flex flew-row items-center  text-2xl font-semibold mb-6 border-b border-gray-300 pb-1">
				{icon ?? null}
				<span className="ml-4">{title}</span>
			</h2>
			{children}
		</div>
	);
}
