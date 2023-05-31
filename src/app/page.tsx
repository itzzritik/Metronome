"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.scss";
import Picaso from "@/utils/picaso";

export default function Home() {
  const [playSound, setPlaySound] = useState(false);

  useEffect(() => {
    document.onvisibilitychange = () => setPlaySound(false);
    Picaso(playSound);
  },[playSound, setPlaySound]);

	return (
		<div className={`${styles.metronome} ${playSound ? styles.playSound : ''}`}>
      <div className={styles.backgroundImage} />
      <div className={styles.backgroundFilter} />
			<div className={styles.controls}>
				<button
					className={styles.soundToggle}
					title="Toggle Sound"
					onClick={() => setPlaySound((val) => !val)}
				>
          {
            playSound ? '🔊' : '🔇'
          }
				</button>
			</div>
      <div className={styles.soundMessage}>
				<p>Click anywhere to toggle sound</p>
			</div>

			{/* <div id="logo">
				<img
					src="https://assets.codepen.io/1468070/Hyperplexed+Logo+-+White.png"
					alt=""
				/>
			</div> */}

			<canvas id="paper" className={styles.paper} onClick={() => setPlaySound((val) => !val)} />
		</div>
	);
}
