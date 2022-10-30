import type { Pixel } from "@prisma/client";
import { Link } from "@remix-run/react";
import { FixedSizeList as List } from "react-window";

import { constructMessage, getAltColor } from "~/lib/utils";

export default function PixelTable({ pixels }: { pixels: Pixel[] }) {
	return (
		<>
			<div className="mx-auto grid grid-cols-7  border-black max-w-sm mb-1">
				<h2 className="font-semibold text-center">X</h2>
				<h2 className="font-semibold text-center">Y</h2>
				<h2 className="font-semibold text-center">Color</h2>
				<h2 className="font-semibold text-center col-span-2">Date</h2>
				<h2 className="font-semibold text-center">Active</h2>
				<h2 className="font-semibold text-center">Proof</h2>
			</div>
			<PixelList data={pixels} />
		</>
	);
}
interface RowProps {
	data: Pixel[];
	index: number;
	style: any;
}
function Row({ data, index, style }: RowProps) {
	const pixel = data[index];
	return (
		<div className="min-w-full grid grid-cols-7 border-t border-r border-l border-black px-2" style={{
			...style,
			backgroundColor: "#" + pixel.color,
			color: getAltColor("#" + pixel.color)
		}}>
			<h2 className="text-center">{pixel.x}</h2>
			<h2 className="text-center">{pixel.y}</h2>
			<h2 className="text-center">#{pixel.color}</h2>
			<h2 className="text-center text-xs my-auto col-span-2">{new Date(pixel.placedAt).toLocaleDateString()}</h2>
			<Link to={`/${pixel.x},${pixel.y}`} prefetch="intent" className="text-center underline hover:italic">{pixel.active ? "✔" : "✖"}</Link>
			<Link to={`/pixel/${pixel.id}`} prefetch="intent" className="text-center underline hover:italic">Verify</Link>
		</div>

	);
}

interface PixelListProps {
	data: Pixel[]
}
function PixelList({ data }: PixelListProps) {
	return (
		<List
			className="mx-auto border-b border-black"
			height={432}
			itemCount={data.length}
			itemSize={25}
			width={338}
			itemData={data}
		>
			{Row}
		</List>
	);
}

