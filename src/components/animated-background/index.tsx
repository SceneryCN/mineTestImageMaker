"use client";

import { motion, useReducedMotion } from "motion/react";

const ORBS = [
	{
		x: "15%",
		y: "20%",
		size: 320,
		color: "rgba(99, 102, 241, 0.18)",
		delay: 0,
	},
	{
		x: "75%",
		y: "15%",
		size: 280,
		color: "rgba(236, 72, 153, 0.14)",
		delay: 2,
	},
	{
		x: "60%",
		y: "70%",
		size: 360,
		color: "rgba(56, 189, 248, 0.12)",
		delay: 4,
	},
	{
		x: "25%",
		y: "75%",
		size: 240,
		color: "rgba(167, 139, 250, 0.15)",
		delay: 1,
	},
];

export function AnimatedBackground() {
	const reducedMotion = useReducedMotion();

	return (
		<div
			className="pointer-events-none fixed inset-0 overflow-hidden"
			aria-hidden
		>
			<div className="absolute inset-0 bg-[var(--bg)]" />
			<div className="absolute inset-0 bg-grid opacity-40" />

			{ORBS.map((orb, i) =>
				reducedMotion ? (
					<div
						key={i}
						className="absolute rounded-full blur-3xl"
						style={{
							left: orb.x,
							top: orb.y,
							width: orb.size,
							height: orb.size,
							background: orb.color,
							transform: "translate(-50%, -50%)",
						}}
					/>
				) : (
					<motion.div
						key={i}
						className="absolute rounded-full blur-3xl"
						style={{
							left: orb.x,
							top: orb.y,
							width: orb.size,
							height: orb.size,
							background: orb.color,
						}}
						initial={{ opacity: 0.4, scale: 0.8, x: "-50%", y: "-50%" }}
						animate={{
							opacity: [0.4, 0.7, 0.4],
							scale: [0.8, 1.1, 0.8],
							x: ["-50%", "-48%", "-52%", "-50%"],
							y: ["-50%", "-52%", "-48%", "-50%"],
						}}
						transition={{
							duration: 12 + i * 2,
							repeat: Infinity,
							delay: orb.delay,
							ease: "easeInOut",
						}}
					/>
				),
			)}

			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg)]" />
		</div>
	);
}
