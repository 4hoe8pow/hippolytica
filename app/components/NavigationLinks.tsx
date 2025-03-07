import {
	HomeIcon,
	NotebookText,
	ChartLine,
	MessageCircleQuestion,
	Candy,
	Flame,
} from "lucide-react";
import Link from "next/link";

export function NavigationLinks({ onClick }: { onClick?: () => void }) {
	return (
		<>
			<Link
				href="/"
				className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-50"
				onClick={onClick}
				scroll={false}
			>
				<HomeIcon className="h-5 w-5" />
				Home
			</Link>
			<Link
				href="/what-is-kabaddi"
				className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-50"
				onClick={onClick}
				scroll={false}
			>
				<NotebookText className="h-5 w-5" />
				What is Kabaddi?
			</Link>
			<Link
				href="/match-report"
				className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-50"
				onClick={onClick}
				scroll={false}
			>
				<ChartLine className="h-5 w-5" />
				Match Report
			</Link>
			<Link
				href="/lab"
				className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-50"
				onClick={onClick}
				scroll={false}
			>
				<Flame className="h-5 w-5" />
				Lab
			</Link>
			<Link
				href="/about-us"
				className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-50"
				onClick={onClick}
				scroll={false}
			>
				<MessageCircleQuestion className="h-5 w-5" />
				About Us
			</Link>
			<Link
				href="/development-status"
				className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-50"
				onClick={onClick}
				scroll={false}
			>
				<Candy className="h-5 w-5" />
				Development Status
			</Link>
		</>
	);
}
