"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import Picaso from "@/utils/picaso";
import { Instruments } from "@/utils/interfaces.d";

export default function Home() {
	const [playSound, setPlaySound] = useState(false);
	const [instrument, setInstrument] = useState(Instruments.vibraphone);

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
				<button id="playSound" className={`${styles.controlButton} ${styles.playSound} ${playSound ? styles.active : "" }`}
					data-playsound={playSound} title="Toggle Sound" onClick={() => setPlaySound((val) => !val)} >
					{playSound ? "🔊" : "🔇"}
				</button>
				
				<div id="instrument" className={styles.instrumentControls} data-instrument={instrument}>
					{
						Object.keys(Instruments).map((key) => (
							<button key={key} className={`${styles.controlButton} ${(key as Instruments) === instrument ? styles.active : ""}`} 
								onClick={() => setInstrument(key as Instruments)} >
								{key}
							</button>
						))
					}
				</div>
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
