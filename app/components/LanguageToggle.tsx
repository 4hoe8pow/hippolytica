import { Earth } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";

interface LanguageToggleProps {
	onToggle: (isEnglish: boolean) => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ onToggle }) => {
	const [isEnglish, setIsEnglish] = useState(false);
	const earthRef = useRef<SVGSVGElement | null>(null);

	const toggleLanguage = () => {
		setIsEnglish((prev) => !prev);
		onToggle(!isEnglish);
		if (earthRef.current) {
			earthRef.current.classList.add("animate-bounce");
			setTimeout(() => {
				earthRef.current?.classList.remove("animate-bounce");
			}, 300);
		}
	};

	return <Earth ref={earthRef} onClick={toggleLanguage} />;
};

export default LanguageToggle;
