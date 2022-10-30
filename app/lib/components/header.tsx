import type { ReactNode } from "react";
import { getAltColor } from "~/lib/utils";

export default function Header({
	children,
	color
}: {
	children: ReactNode;
	color?: string;
}) {
	const foreground = "#" + color ?? "#000000";
	const background = getAltColor(foreground);
	if (color) {
	}
	return (
		<div
			style={{
				color: foreground,
				backgroundColor: background
			}}
			className="z-30 flex justify-between p-2 fixed top-0 pt-1 pb-2 border-b border-black bg-white w-full text-2xl font-semibold"
		>
			{children}
		</div>
	);
}
