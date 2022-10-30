import { useEffect, useState } from "react";

interface TimerProps {
	pixels?: any[];
}

export default function Timer({ pixels }: TimerProps) {
	const [nextPlaceTime, setNextPlaceTime] = useState(0);

	useEffect(() => {
		setNextPlaceTime(
			Number(window.localStorage.getItem("nextPlaceTime") ?? 0)
		);
	}, [pixels]);

	const [countdownToNextPlaceTime, setCountdownToNextPlaceTime] = useState(0);
	useEffect(() => {
		const interval = setInterval(() => {
			const now = Date.now();
			const timeLeft = nextPlaceTime - now;
			setCountdownToNextPlaceTime(timeLeft);
		}, 1000);
		return () => clearInterval(interval);
	}, [nextPlaceTime]);

	const convertMsToTime = (ms: number) => {
		if (ms < 0) return "0:00";
		const seconds = Math.floor((ms / 1000) % 60);
		const paddedSeconds = seconds.toString().padStart(2, "0");
		const minutes = Math.floor((ms / (1000 * 60)) % 60);
		return `${minutes}:${paddedSeconds}`;
	};

	return <>{convertMsToTime(countdownToNextPlaceTime)}</>;
}
