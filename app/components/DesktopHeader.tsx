import Image from "next/image";
import Link from "next/link";
import { NavigationLinks } from "~/components/NavigationLinks";
import { ModeToggle } from "~/components/mode-toggle";

export default function DesktopHeader() {
	return (
		<div className="hidden lg:block lg:w-64 lg:shrink-0 lg:border-r lg:bg-slate-100 dark:lg:bg-slate-800">
			<div className="flex h-full flex-col justify-between py-6 px-4">
				<div className="space-y-6">
					<Link
						href="/"
						className="flex items-center gap-2 font-bold"
						prefetch={false}
					>
						<Image
							src="/icon.svg"
							alt="Hippolytica Logo"
							width={32}
							height={32}
						/>
						<span className="text-lg">Hippolytica</span>
					</Link>
					<nav className="space-y-1">
						<NavigationLinks />
					</nav>
				</div>
				<div className="space-y-4">
					<ModeToggle />
				</div>
			</div>
		</div>
	);
}
