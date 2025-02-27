"use client";
import type { ReactNode } from "react";

interface ArticleSectionProps {
	title: string;
	children: ReactNode;
}

export function ArticleSection({ title, children }: ArticleSectionProps) {
	return (
		<div className="mb-8 text-left">
			<h2 className="text-2xl font-semibold mb-6 border-b border-gray-300 pb-1">
				{title}
			</h2>
			{children}
		</div>
	);
}
