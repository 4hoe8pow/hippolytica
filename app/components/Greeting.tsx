const messages = {
	ja: {
		note1:
			"入力データは期限付きのキャッシュとして保存されますが、サーバへは保存されませんのでご安心ください。NEXT ボタンを押下すると、データ入力画面に進みます。個人利用の範囲内でお楽しみください。",
		note2:
			"最初の7人がファーストセブンメンバーとして扱われ、8人目以降に記載されたメンバーはリザーブメンバーとなります。",
	},
	en: {
		note1:
			"The entered data is temporarily saved as a cache but is not stored on the server, so please rest assured. Pressing the NEXT button will take you to the data input screen. Please enjoy within the scope of personal use.",
		note2:
			"The first seven players will be treated as the starting members, and any players listed from the eighth onward will be considered reserve members.",
	},
};

interface GreetingProps {
	isEnglish: boolean;
}

const Greeting = ({ isEnglish }: GreetingProps) => {
	const { note1, note2 } = isEnglish ? messages.en : messages.ja;

	return (
		<div className="text-center p-4 mb-8 mx-auto">
			<p className="mb-4">{note1}</p>
			<p className="mb-4">{note2}</p>
		</div>
	);
};

export default Greeting;
