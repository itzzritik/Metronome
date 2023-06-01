import { Instruments } from "./interfaces";

export default function Picaso() {
	const paper = <HTMLCanvasElement> document.getElementById("paper");
	const pen = paper.getContext("2d");

    if (!pen) return;

	const colors = Array(21).fill("#A6C48A");
	const settings = {
		startTime: new Date().getTime(),
		duration: 900, 
		maxCycles: Math.max(colors.length, 100),
		pulseEnabled: true,
		instrument: document.getElementById("instrument")?.dataset?.instrument,
	};

	const getFileName = (index: number) => {
		if (!settings.instrument || settings.instrument === "default") return `key-${index}`;
		return `${settings.instrument}-key-${index}`;
	};
	const generateKeys = () => {
		return colors.map((color, index) => {
			const audio = new Audio(`/media/${getFileName(index)}.wav`);
			audio.volume = 0.15;
			return audio;
		});
	}

	let keys = generateKeys();
	let arcs: IArc[] = [];

	const calculateVelocity = (index: number) => {
		const numberOfCycles = settings.maxCycles - index,
			distancePerCycle = 2 * Math.PI;
		return (numberOfCycles * distancePerCycle) / settings.duration;
	};
	const calculateNextImpactTime = (currentImpactTime: number, velocity: number) => {
		return currentImpactTime + (Math.PI / velocity) * 1000;
	};
	const calculateDynamicOpacity = (
		currentTime: number,
		lastImpactTime: number,
		baseOpacity: number,
		maxOpacity: number,
		duration: number
	) => {
		const timeSinceImpact = currentTime - lastImpactTime,
			percentage = Math.min(timeSinceImpact / duration, 1),
			opacityDelta = maxOpacity - baseOpacity;

		return maxOpacity - opacityDelta * percentage;
	};
	const determineOpacity = (
		currentTime: number,
		lastImpactTime: number,
		baseOpacity: number,
		maxOpacity: number,
		duration: number
	) => {
		if (!settings.pulseEnabled) return baseOpacity;

		return calculateDynamicOpacity(
			currentTime,
			lastImpactTime,
			baseOpacity,
			maxOpacity,
			duration
		);
	};
	const calculatePositionOnArc = (center: ICoordinate, radius: number, angle: number) => ({
		x: center.x + radius * Math.cos(angle),
		y: center.y + radius * Math.sin(angle),
	});
	const playKey = (index: number) => keys[index].play();
	const init = () => {
		pen.lineCap = "round";

		arcs = colors.map((color, index) => {
			const velocity = calculateVelocity(index),
				lastImpactTime = 0,
				nextImpactTime = calculateNextImpactTime(
					settings.startTime,
					velocity
				);

			return {
				color,
				velocity,
				lastImpactTime,
				nextImpactTime,
			};
		});
	};
	const drawArc = (x: number, y: number, radius: number, start: number, end: number, action = "stroke") => {
		pen.beginPath();

		pen.arc(x, y, radius, start, end);

		if (action === "stroke") pen.stroke();
		else pen.fill();
	};
	const drawPointOnArc = (center: ICoordinate, arcRadius: number, pointRadius: number, angle: number) => {
		const position = calculatePositionOnArc(center, arcRadius, angle);

		drawArc(position.x, position.y, pointRadius, 0, 2 * Math.PI, "fill");
	};

	const draw = () => {
		paper.width = paper.clientWidth;
		paper.height = paper.clientHeight;

        const playSound = document.getElementById("playSound")?.dataset?.playsound === "true";
		const currentTime = new Date().getTime();
		const elapsedTime = (currentTime - settings.startTime) / 1000;
		const length = Math.min(paper.width, paper.height) * 0.9;
		const offset = (paper.width - length) / 2;

		const start: ICoordinate = {
			x: offset,
			y: paper.height / 2,
		};
		const end: ICoordinate = {
			x: paper.width - offset,
			y: paper.height / 2,
		};
		const center: ICoordinate = {
			x: paper.width / 2,
			y: paper.height / 2,
		};
		const base = {
			length: end.x - start.x,
			minAngle: 0,
			startAngle: 0,
			maxAngle: 2 * Math.PI,
            initialRadius: 0,
            circleRadius: 0,
            clearance: 0,
            spacing: 0,
		};

		base.initialRadius = base.length * 0.05;
		base.circleRadius = base.length * 0.006;
		base.clearance = base.length * 0.03;
		base.spacing = (base.length - base.initialRadius - base.clearance) / 2 / colors.length;

		const newInstrument = document.getElementById("instrument")?.dataset?.instrument
		if (settings.instrument !== newInstrument) {
			settings.instrument = newInstrument;
			keys = generateKeys();
		}

		arcs.forEach((arc: IArc, index: number) => {
			const radius = base.initialRadius + base.spacing * index;

			// Draw arcs
			pen.globalAlpha = determineOpacity(
				currentTime,
				arc.lastImpactTime,
				0.15,
				0.65,
				1000
			);
			pen.lineWidth = base.length * 0.002;
			pen.strokeStyle = arc.color;

			const offset = (base.circleRadius * (5 / 3)) / radius;

			drawArc(
				center.x,
				center.y,
				radius,
				Math.PI + offset,
				2 * Math.PI - offset
			);

			drawArc(center.x, center.y, radius, offset, Math.PI - offset);

			// Draw impact points
			pen.globalAlpha = determineOpacity(
				currentTime,
				arc.lastImpactTime,
				0.15,
				0.85,
				1000
			);
			pen.fillStyle = arc.color;

			drawPointOnArc(center, radius, base.circleRadius * 0.75, Math.PI);

			drawPointOnArc(
				center,
				radius,
				base.circleRadius * 0.75,
				2 * Math.PI
			);

			// Draw moving circles
			pen.globalAlpha = 1;
			pen.fillStyle = arc.color;

			if (currentTime >= arc.nextImpactTime) {
				if (playSound) {
					playKey(index);
					arc.lastImpactTime = arc.nextImpactTime;
				}

				arc.nextImpactTime = calculateNextImpactTime(
					arc.nextImpactTime,
					arc.velocity
				);
			}

			const distance = elapsedTime >= 0 ? elapsedTime * arc.velocity : 0,
				angle = (Math.PI + distance) % base.maxAngle;

			drawPointOnArc(center, radius, base.circleRadius, angle);
		});
		requestAnimationFrame(draw);
	};

	init();
	draw();
}

interface ICoordinate {
    x: number,
    y: number
}
interface IArc {
    color: string,
    velocity: number,
    lastImpactTime: number,
    nextImpactTime: number
}