"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import Picaso from "@/utils/picaso";

export default function Home() {
	const [playSound, setPlaySound] = useState(false);

	useEffect(() => {
		document.onvisibilitychange = () => setPlaySound(false);
	}, [setPlaySound]);

	useEffect(() => {
		Picaso();
	}, []);

	return (
		<div className={`${styles.metronome} ${playSound ? styles.playSound : ""}`}>
			<div className={styles.backgroundImage} />
			<div className={styles.backgroundFilter} />
			<div className={styles.controls}>
				<button
					id="playSound"
					className={styles.soundToggle}
					data-playsound={playSound}
					title="Toggle Sound"
					onClick={() => setPlaySound((val) => !val)}
				>
					{playSound ? "🔊" : "🔇"}
				</button>
			</div>
			<div className={styles.soundMessage}>
				<p>Click anywhere to toggle sound</p>
			</div>
			<canvas
				id="paper"
				className={styles.paper}
				onClick={() => setPlaySound((val) => !val)}
			/>
			<div className={styles.logo} />
		</div>
	);
}
