import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";

import DesktopHeader from "~/components/DesktopHeader";
import MobileHeader from "~/components/MobileHeader";

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
					<div className="flex-grow flex h-screen w-full">
						<DesktopHeader />
						<div className="flex flex-col w-full">
							<MobileHeader />
							<main className="flex-grow p-4 animate-fade-in">{children}</main>
							<footer className="flex flex-wrap justify-center text-center p-4 bg-slate-100 dark:bg-slate-800 dark:text-white h-[40px]">
								<p>&copy; 2025 Hippolytica. All rights reserved.</p>
							</footer>
						</div>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
