"use client";

import { useState } from "react";
import { ArticleSection } from "~/components/ArticleSection";
import LanguageToggle from "~/components/LanguageToggle";

const TEXTS = {
	japanese: {
		title: "ヒポリティカについて",
		applicationValue: "存在価値",
		applicationDescription:
			"Hippolytica（ヒポリティカ）は、カバディ競技のスタッツデータを分析し、選手やチームのパフォーマンスを可視化するWebアプリです。新たな知見を提供することで競技の振興を促し、戦略の精緻化および国内競技レベルの向上の一助となることを目指します。",
		mission: "ミッションステートメント",
		missionDescription:
			"『カバディをわかりやすく、より身近なスポーツの地位へ近づける』",
		visions: "ビジョン",
		visionsDescription:
			"スタッツデータの解析は、カバディ全体をシステム的で難解な印象に導くものではなく、ライブ配信時のリアルタイムでのスタッツ表示や、試合中の状態を定量的に可視化することで、カバディをより理解しやすくするサービスを提供することを目指しています。その研究材料として、カバディに関するデータは必要不可欠であり、ヒポリティカはその基盤を構築する役割を担います。",
		purpose: "開発の経緯",
		purposeDescription:
			"日本において、カバディは競技者が限られているスポーツであり、これを普及させるために多くの関係者が努力を重ねています。現在、日本国内でのアクティブな競技者数は男女合わせて約400人と推定されています。競技の発展と普及に尽力されているすべての関係者に、深く敬意を表します。未経験者に向けたプロモーション活動が盛んに行われている一方で、既存の競技者を支援するツールの整備も必要ではないかと考えました。",
		projectNature: "プロジェクトの性質",
		projectNatureDescription:
			"本アプリケーションは設計、コーディング、テスト、構成管理をすべて一人で担当しており、バグ修正や機能の改善に一定の時間を要する場合があります。費用もすべて自己負担しており、趣味の一環として開発しています。主に個人利用の範疇で使用されることを前提としておりますので、予めご理解いただけますようお願い申し上げます。",
		disclaimer: "免責事項",
		disclaimerDescription:
			"本アプリケーションはあくまで情報提供を目的としたものに過ぎず、いかなる保証も行っておりません。利用者は自己の責任において本アプリケーションをご利用ください。提供されるデータや情報の正確性、完全性、適時性については一切保証いたしかねます。本アプリケーションの利用により生じた損害について、当方は一切責任を負いません。知的財産権に関する事項についても十分にご留意の上、ご利用いただきますようお願い申し上げます。",
	},
	english: {
		title: "About Hippolytica",
		applicationValue: "Value of the Application",
		applicationDescription:
			"Hippolytica is a web application that analyzes Kabaddi game statistics to visualize the performance of players and teams. By providing new insights, it aims to promote the sport, refine strategies, and improve the level of competition in Japan.",
		mission: "Mission Statement",
		missionDescription:
			"The mission of this initiative is to make Kabaddi more understandable and bring it closer to being a more familiar sport.",
		visions: "Vision",
		visionsDescription:
			"The analysis of statistics is not intended to make Kabaddi appear overly systematic or complex. Instead, by displaying real-time statistics during live broadcasts and quantitatively visualizing the state of the game, we aim to provide a service that makes Kabaddi more comprehensible. To achieve this, data on Kabaddi is essential, and Hippolytica plays a crucial role in building this foundation.",
		purpose: "Background of Development",
		purposeDescription:
			"Kabaddi is a sport with a limited number of participants in Japan, and many stakeholders are making efforts to promote it. Currently, the estimated number of active players in Japan is about 400. We deeply respect all those dedicated to the development and popularization of the sport. While promotional activities for newcomers are active, we also felt the need for tools to support existing players.",
		projectNature: "Nature of the Project",
		projectNatureDescription:
			"This application is entirely designed and implemented by a single individual, so bug fixes or feature improvements may take some time. All costs are personally funded, and it is developed as a hobby. It is primarily intended for personal use, so we ask for your understanding.",
		disclaimer: "Disclaimer",
		disclaimerDescription:
			"This application is intended for informational purposes only and does not offer any guarantees. Users are solely responsible for their use of the application. We do not guarantee the accuracy, completeness, or timeliness of the data and information provided. We are not liable for any damages resulting from the use of this application. Please also be mindful of intellectual property rights when using the app.",
	},
};

export default function AboutHippolyticaPage() {
	const [isEnglish, setIsEnglish] = useState(false);

	const lang = isEnglish ? TEXTS.english : TEXTS.japanese;

	return (
		<div className="prose mx-auto p-4 lg:p-8 text-center max-w-4xl border border-gray-300 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
			<LanguageToggle onToggle={setIsEnglish} />
			<h1 className="text-lg py-6">{lang.title}</h1>
			<ArticleSection title={lang.applicationValue}>
				<p className="text-lg">{lang.applicationDescription}</p>
			</ArticleSection>
			<ArticleSection title={lang.mission}>
				<p className="text-lg">{lang.missionDescription}</p>
			</ArticleSection>
			<ArticleSection title={lang.visions}>
				<p className="text-lg">{lang.visionsDescription}</p>
			</ArticleSection>
			<ArticleSection title={lang.purpose}>
				<p className="text-lg">{lang.purposeDescription}</p>
			</ArticleSection>
			<ArticleSection title={lang.projectNature}>
				<p className="text-lg">{lang.projectNatureDescription}</p>
			</ArticleSection>
			<ArticleSection title={lang.disclaimer}>
				<p className="text-lg">{lang.disclaimerDescription}</p>
			</ArticleSection>
		</div>
	);
}
