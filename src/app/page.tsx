import Image from "next/image";
import styles from "./page.module.scss";

export default function Home() {
  console.log('Styles:', styles)
	return (<></>
		// <>
		// 	<div className={styles.controlBar}>
		// 		<div id="control-bar">
		// 			<button
		// 				id="sound-toggle"
		// 				className="toggle"
		// 				type="button"
		// 				data-toggled="false"
		// 				onClick={() => console.log('asd')}
		// 				title="Toggle Pulse"
		// 			>
		// 				<i className="fa-solid fa-music-slash off"></i>
		// 				<i className="fa-solid fa-music on"></i>
		// 			</button>
		// 		</div>
		// 	</div>

		// 	<div id="background-image"></div>

		// 	<div id="background-filter"></div>

		// 	<div id="logo">
		// 		<img
		// 			src="https://assets.codepen.io/1468070/Hyperplexed+Logo+-+White.png"
		// 			alt=""
		// 		/>
		// 	</div>

		// 	<div id="sound-message">
		// 		<p>Click anywhere to toggle sound</p>
		// 	</div>

		// 	<canvas id="paper"></canvas>
		// </>
	);
}
