"use client";

import { motion } from "framer-motion";

export default function Loading() {
	return (
		<div className="relative flex size-full items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
			{/* 背景の光エフェクト */}
			<div className="absolute h-[200%] w-[200%] animate-pulse bg-radial-gradient from-blue-500/30 to-transparent blur-3xl" />

			{/* ロゴ（3Dスケールアニメーション） */}
			<motion.div
				initial={{ scale: 0.5, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 1, ease: "easeOut" }}
				className="relative flex flex-col items-center text-white"
			>
				<div className="text-5xl font-bold tracking-widest">Loading</div>

				{/* ローディングテキスト（フェードアニメーション） */}
				<motion.div
					animate={{ opacity: [0, 1, 0] }}
					transition={{
						repeat: Number.POSITIVE_INFINITY,
						duration: 2,
						ease: "easeInOut",
					}}
					className="mt-4 text-sm text-gray-300"
				>
					Please wait...
				</motion.div>
			</motion.div>
		</div>
	);
}
