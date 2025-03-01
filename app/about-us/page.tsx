"use client";

import { Earth } from "lucide-react";
import { useRef, useState } from "react";
import { ArticleSection } from "~/components/ArticleSection";

const TEXTS = {
	japanese: {
		title: "ヒポリティカについて",
		applicationValue: "アプリケーションの価値",
		applicationDescription:
			"Hippolytica（ヒポリティカ）は、カバディ競技のスタッツデータ分析を支援するアプリケーションです。選手やチームのパフォーマンスを可視化し、新たな知見を提供することで、戦略の精緻化やトレーニングの洗練、競技成績の向上に貢献します。",
		purpose: "開発の経緯",
		purposeDescription:
			"カバディは、日本において競技者が限られているスポーツであり、これを普及させるために多くの関係者が努力を重ねています。現在、日本国内でのアクティブな競技者数は男女合わせて約400人と推定されています。競技の発展と普及に尽力されているすべての関係者に、深く敬意を表します。未経験者に向けたプロモーション活動が盛んに行われている一方で、既存の競技者を支援するツールの整備も必要ではないかと考えました。データ活用を通じ、競技全体の振興に貢献を目指します。",
		projectNature: "プロジェクトの性質",
		projectNatureDescription:
			"本アプリケーションは設計および実装をすべて一人で行っており、バグ修正や機能の改善に一定の時間を要する場合があります。費用もすべて自己負担しており、趣味の一環として開発しています。主に個人利用の範疇で使用されることを前提としておりますので、予めご理解いただけますようお願い申し上げます。",
		disclaimer: "免責事項",
		disclaimerDescription:
			"本アプリケーションは情報提供を目的としたものであり、いかなる保証も行っておりません。利用者は自己の責任において本アプリケーションをご利用ください。提供されるデータや情報の正確性、完全性、適時性については一切保証いたしかねます。本アプリケーションの利用により生じた損害について、当方は一切責任を負いません。知的財産権に関する事項についても十分にご留意の上、ご利用いただきますようお願い申し上げます。",
	},
	english: {
		title: "About Hippolytica",
		applicationValue: "Value of the Application",
		applicationDescription:
			"Hippolytica is a tool designed to assist in the statistical data analysis of the sport of Kabaddi. By visualizing the performance of players and teams, it provides valuable insights that contribute to the refinement of strategies, enhancement of training, and improvement of competition results.",
		purpose: "Background of Development",
		purposeDescription:
			"Kabaddi is a sport with a limited number of participants in Japan, and many stakeholders are actively working towards its promotion. Currently, the estimated number of active players in Japan, both men and women, is approximately 400. We extend our deepest respect to all those dedicated to the development and popularization of the sport. While there are active promotional activities aimed at attracting newcomers to the sport, we also believe there is a need for tools to support the existing athletes. Motivated by a desire to contribute to the promotion of the sport through data utilization, I initiated this personal development project.",
		projectNature: "Nature of the Project",
		projectNatureDescription:
			"This tool is entirely designed and implemented by a single individual, so bug fixes or feature improvements may take some time. Additionally, all associated costs are personally funded, and the tool is primarily intended for personal use within a limited scope. We kindly ask for your understanding in this matter.",
		disclaimer: "Disclaimer",
		disclaimerDescription:
			"This application is intended solely for informational purposes and does not offer any guarantees. Users are solely responsible for their use of the application. We do not guarantee the accuracy, completeness, or timeliness of the data and information provided. We are not liable for any damages resulting from the use of this application. Please also be mindful of intellectual property rights when using the app.",
	},
};

export default function AboutHippolyticaPage() {
	const [isEnglish, setIsEnglish] = useState(false);
	const earthRef = useRef<SVGSVGElement | null>(null);

	const toggleLanguage = () => {
		setIsEnglish((prev) => !prev);
		if (earthRef.current) {
			// Earthアイコンにバウンドアニメーションを追加
			earthRef.current.classList.add("animate-bounce");
			// アニメーション完了後にクラスを削除
			setTimeout(() => {
				earthRef.current?.classList.remove("animate-bounce");
			}, 300);
		}
	};

	const lang = isEnglish ? TEXTS.english : TEXTS.japanese;

	return (
		<div className="prose mx-auto p-4 lg:p-8 text-center max-w-4xl border border-gray-300 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700">
			<Earth ref={earthRef} onClick={toggleLanguage} />
			<h1 className="text-lg py-6">{lang.title}</h1>
			<ArticleSection title={lang.applicationValue}>
				<p className="text-lg">{lang.applicationDescription}</p>
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
