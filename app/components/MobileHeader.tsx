"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { NavigationLinks } from "~/components/NavigationLinks";
import { ModeToggle } from "~/components/mode-toggle";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { useState } from "react";

export default function MobileHeader() {
	const [open, setOpen] = useState(false);

	return (
		<header className="sticky top-0 z-10 border-b bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
			<div className="flex items-center justify-between">
				<Link
					href="/"
					className="flex items-center gap-2 font-bold"
					prefetch={false}
				>
					<span className="text-lg">Hippolytica</span>
				</Link>
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon">
							<MenuIcon className="h-6 w-6" />
							<span className="sr-only">Toggle navigation</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="w-64">
						<div className="flex h-full flex-col justify-between py-6 px-4">
							<div className="space-y-6">
								<NavigationLinks onClick={() => setOpen(false)} />
							</div>
							<div className="space-y-4">
								<ModeToggle />
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
