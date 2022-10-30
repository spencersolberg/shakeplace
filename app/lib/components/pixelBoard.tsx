import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import type { Pixel } from "@prisma/client";

interface IProps {
	color: string | null;
	x: number | null;
	setX: Dispatch<SetStateAction<number | null>>;
	y: number | null;
	setY: Dispatch<SetStateAction<number | null>>;
	zoom: number;
	pixels: Pixel[];
	selectedPixel: Pixel | null;
	setSelectedPixel: Dispatch<SetStateAction<Pixel | null>>;
}

const widthLevels = {
	1: 98,
	0.5: 50,
	0.25: 25,
	2: 200,
	4: 400,
	8: 800
};

export default function PixelBoard({
	color,
	x,
	setX,
	y,
	setY,
	zoom,
	pixels,
	selectedPixel,
	setSelectedPixel
}: IProps) {
	let scale = 16;

	const render = () => {
		const canvas = document.getElementById(
			"pixelboard"
		) as HTMLCanvasElement;
		const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
		for (let pixel of pixels) {
			ctx.fillStyle = "#" + pixel.color;
			ctx.fillRect(
				(pixel.x - 1) * scale,
				(pixel.y - 1) * scale,
				scale,
				scale
			);
		}
	};

	useEffect(() => {
		if (selectedPixel) {
			let { x, y } = selectedPixel;
			setSelectedPixel(pixels.find(pixel => pixel.x == x && pixel.y == y)!);
		}
		render();
		highlight();
	}, [pixels, selectedPixel]);

	const highlight = () => {
		if (!selectedPixel) return;
		render();
		const canvas = document.getElementById(
			"pixelboard"
		) as HTMLCanvasElement;
		const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
		let primary = "#" + (color ?? selectedPixel!.color);

		let secondary = primary == "#000000" ? "#ffffff" : "#000000";
		// let secondary = getAltColor(primary);

		ctx.lineWidth = 3;

		ctx.fillStyle = primary;
		ctx.strokeStyle = secondary;

		ctx.fillRect(
			(selectedPixel!.x - 1) * scale,
			(selectedPixel!.y - 1) * scale,
			scale,
			scale
		);
		ctx.strokeRect(
			(selectedPixel!.x - 1) * scale,
			(selectedPixel!.y - 1) * scale,
			scale,
			scale
		);
	};

	useEffect(highlight, [color]);

	const canvasClick = ({
		clientX,
		clientY
	}: {
		clientX: number;
		clientY: number;
	}) => {
		const canvas = document.getElementById(
			"pixelboard"
		) as HTMLCanvasElement;
		const rect = canvas.getBoundingClientRect();

		let clickX = clientX - rect.left;
		let clickY = clientY - rect.top;

		clickX = clickX / rect.width;
		clickX *= 256;
		// clickX++;
		clickX = Math.floor(clickX) + 1;

		clickY = clickY / rect.height;
		clickY *= 255;
		// clickY++;
		clickY = Math.floor(clickY) + 1;
		if (rect.top < -1 * (rect.height / 2)) clickY++;

		setX(clickX);
		setY(clickY);

		const selected = pixels
			.filter((p) => p.x == clickX)
			.find((p) => p.y == clickY);
		setSelectedPixel(selected!);
	};

	return (
		<div className="max-w-full overflow-scroll px-2 mt-16 md:mb-0">
			<canvas
				id="pixelboard"
				width={256 * scale}
				height={256 * scale}
				className="border border-black mx-auto cursor-pointer"
				style={{
					width: `${zoom * 98}%`,
					imageRendering: "pixelated"
				}}
				onClick={canvasClick}
			/>
		</div>
	);
}
