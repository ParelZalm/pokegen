import {JSX, ReactNode} from "react";
import styles from "./gradient.module.scss";

export interface GradientTextProps {
	children: ReactNode;
	colors?: string[];
	animationSpeed?: number;
	showBorder?: boolean;
}

export default function GradientText(
	{
		children,
		colors = ["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"],
		animationSpeed = 8,
		showBorder = false
	}: GradientTextProps): JSX.Element {
	const gradientStyle = {
		backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
		animationDuration: `${animationSpeed}s`,
	};

	return (
		<div className={styles["animated-gradient-text"]}>
			{showBorder && (
				<div className={styles["gradient-overlay"]} style={gradientStyle}></div>
			)}
			<div className={styles["text-content"]} style={gradientStyle}>
				{children}
			</div>
		</div>
	);
}