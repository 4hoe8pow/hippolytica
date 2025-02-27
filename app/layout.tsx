import type { Metadata } from "next";

import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { AppSidebar } from "~/components/app-sidebar";

import { SidebarProvider } from "./components/ui/sidebar";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Hippolytica",
	description: "Data analysis for amateur Kabaddi competitions",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html suppressHydrationWarning lang="ja">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col `}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<SidebarProvider>
						<AppSidebar />
						<div className="flex-grow flex flex-col">
							<main className="flex-grow">{children}</main>
							<footer className="flex gap-6 flex-wrap items-center justify-center p-4 bg-slate-800 text-white h-[40px] mt-4">
								<p>&copy; 2025 Hippolytica. All rights reserved.</p>
							</footer>
						</div>
					</SidebarProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
