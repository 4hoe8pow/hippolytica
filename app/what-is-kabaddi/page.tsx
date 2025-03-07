"use client";

import { useState } from "react";
import { ArticleSection } from "~/components/ArticleSection";
import LanguageToggle from "~/components/LanguageToggle";

const TEXTS = {
	japanese: {
		title: "カバディとは？",
		overview: "概要",
		overviewDescription:
			"カバディは、インド発祥のチームコンタクトスポーツです。",
		origin: "起源",
		originDescription:
			"カバディの起源は古代インドにさかのぼり、戦士たちの狩猟訓練として嗜まれていました。",
		rules: "ルール",
		rulesDescription: "カバディは、交互にレイドを繰り返し、得点を競います。",
		raidPhases: [
			{
				title: "レイドの基本",
				items: [
					"レイドは、攻撃側の選手が一人で敵陣に入り、相手選手にタッチして戻ることを目的とするプレーです",
					"レイドを担当するプレイヤーは、レイダーと呼ばれます",
					"レイダーは「カバディ」という発声を定期的に継続しなければなりません",
				],
			},
			{
				title: "ストラグル",
				items: [
					"レイダーが敵陣内にいられる時間は最大30秒です",
					"レイダーと敵が接触すると、その瞬間から“ストラグル”状態に移行します",
				],
			},
			{
				title: "成功・失敗の条件",
				items: [
					"帰還に成功すると、ストラグルに関与した敵の数だけ得点が入ります",
					"捕まった場合、またはラインを踏み越えた場合は失敗となり、敵に1点が加算されます",
				],
			},
			{
				title: "エンプティレイドとDO OR DIE",
				items: [
					"ボークラインを越えてさえいれば、ストラグルなしで帰還することを許されます",
					"2回連続でエンプティレイドをしたチームの3回目のレイドでは、「DO OR DIE」ルールが適用されます",
					"「DO OR DIE」では、得点できなければアウトとなります",
				],
			},
			{
				title: "特殊状況",
				items: [
					"守備側が全滅すると、「ローナ」が成立し、攻撃側に2点のボーナスが加算されます",
					"守備側が3人以下の状態でレイダーをアウトにすると、守備側に2点が入ります",
					"インサイドラインとアウトサイドラインの間は「ロビー」と呼ばれ、ストラグル中のみ使用可能です",
				],
			},
		],
		video: "おすすめの動画",
		videoDescription: "カバディに関連する動画を紹介します",
	},
	english: {
		title: "What is Kabaddi?",
		overview: "Overview",
		overviewDescription:
			"Kabaddi is a team contact sport that originated in India.",
		origin: "Origin",
		originDescription:
			"Kabaddi dates back to ancient India, where it was practiced as a training exercise for warriors.",
		rules: "Rules",
		rulesDescription:
			"Kabaddi is played between two teams, with attackers entering the opponent’s area to touch players and return safely.",
		raidPhases: [
			{
				title: "Basic Raid",
				items: [
					"A raid involves an attacker entering the opponent’s zone, touching defenders, and returning safely.",
					"The raider must continuously chant 'Kabaddi' while inside the opponent’s area.",
				],
			},
			{
				title: "Struggle",
				items: [
					"A raider can stay in the opponent’s area for a maximum of 30 seconds.",
					"If the raider makes contact with a defender, the situation transitions into a 'struggle' phase.",
				],
			},
			{
				title: "Success & Failure",
				items: [
					"If the raider returns successfully, they earn points equal to the number of defenders involved in the struggle.",
					"If the raider is caught or steps out of bounds, the opposing team gains 1 point.",
				],
			},
			{
				title: "Empty Raid & DO OR DIE",
				items: [
					"In an empty raid, the raider avoids struggle and returns after crossing the baulk line.",
					"If a player performs two consecutive empty raids, the 'DO OR DIE' rule applies.",
					"Under 'DO OR DIE,' failing to score results in an automatic out.",
				],
			},
			{
				title: "Lona",
				items: [
					"If all defenders are eliminated, a 'Lona' is declared, and the attacking team gains 2 bonus points.",
					"If the defending team has three or fewer players and catches the raider, they earn 2 points.",
					"The area between the inside and outside lines is called the 'Lobby,' which is only active during struggles.",
				],
			},
		],
		video: "Recommended Videos",
		videoDescription: "Here are some videos related to Kabaddi.",
	},
};

function List({ items }: { items: string[] }) {
	return (
		<ul className="list-disc list-inside text-left">
			{items.map((item) => (
				<li key={item} className="text-lg mb-2">
					{item}
				</li>
			))}
		</ul>
	);
}

export default function WhatIsKabaddiPage() {
	const [isEnglish, setIsEnglish] = useState(false);

	const lang = isEnglish ? TEXTS.english : TEXTS.japanese;

	return (
		<div className="prose mx-auto p-4 lg:p-8 text-center max-w-4xl border border-gray-300 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
			<LanguageToggle onToggle={setIsEnglish} />
			<h1 className="text-lg py-8">{lang.title}</h1>

			<ArticleSection title={lang.overview}>
				{lang.overviewDescription}
			</ArticleSection>
			<ArticleSection title={lang.origin}>
				{lang.originDescription}
			</ArticleSection>
			<ArticleSection title={lang.rules}>
				<p className="p-4">{lang.rulesDescription}</p>
				{lang.raidPhases.map((phase) => (
					<div key={phase.title} className="mb-6">
						<h3 className="text-lg font-semibold mb-2">{phase.title}</h3>
						<List items={phase.items} />
					</div>
				))}
			</ArticleSection>
			<ArticleSection title={lang.video}>
				<p className="p-4">{lang.videoDescription}</p>
				<div className="flex justify-center items-center">
					<iframe
						className="my-4"
						width="560"
						height="315"
						src="https://www.youtube.com/embed/_7rAOE7bJH4?si=k9f9DKY33SRDfsXK"
						title="YouTube video player"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerPolicy="strict-origin-when-cross-origin"
						allowFullScreen
					/>
				</div>
			</ArticleSection>
		</div>
	);
}
