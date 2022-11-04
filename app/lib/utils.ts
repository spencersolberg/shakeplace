import punycode from "punycode";
import type { Pixel } from "@prisma/client";
import { colord, extend } from "colord";
import harmoniesPlugin from "colord/plugins/harmonies";
import a11yPlugin from "colord/plugins/a11y";

export const formatName = (
	unformattedName: string,
	trailingSlash = false
): string => {
	let formattedName = punycode.toUnicode(unformattedName);
	if (trailingSlash) formattedName += "/";
	return formattedName;
};

export const revivePixels = (
	serializedPixels: any[]
) => {
	const revived = [];
	for (let pixel of serializedPixels) {
		revived.push({
			...pixel,
			placedAt: new Date(pixel.placedAt)
		});

	}
	return revived;
}

export const constructMessage = ({
	x,
	y,
	color,
	placedAt
}: {
	x: number;
	y: number;
	color: string;
	placedAt: Date;
}): string => {
	placedAt = new Date(placedAt);
	const string =
		"shakeplace/" +
		placedAt.getTime() +
		": " +
		"#" +
		color +
		" @" +
		x +
		"," +
		y;
	return string;
};

export const colors = [
	"be0039",
	"ff4500",
	"ffa800",
	"ffd635",
	"00a368",
	"00cc78",
	"7eed56",
	"00756f",
	"009eaa",
	"2450a4",
	"3690ea",
	"51e9f4",
	"493ac1",
	"6a5cff",
	"811e9f",
	"b44ac0",
	"ff3881",
	"ff99aa",
	"6d482f",
	"9c6926",
	"000000",
	"898d90",
	"d4d7d9",
	"ffffff"
];

export const getAltColor = (hexCode: string): string => {
	extend([harmoniesPlugin, a11yPlugin]);

	const color = colord(hexCode);
	const harmony = color.harmonies("analogous").map((c) => c.toHex())[0];

	if (color.isReadable(harmony)) {
		return harmony;
	} else return color.invert().toHex();
};

export type NamerPixel = {
	id: string;
	x: number;
	y: number;
	color: string;
	placedAt: Date;
	active: boolean;
};

export type UnsignedPixel = {
	name: string;
	color: string;
	placedAt: Date;
	x: number;
	y: number;
	id: string;
};

export const filterPixels = (
	originalPixels: UnsignedPixel[]
): UnsignedPixel[] => {
	let pixels = originalPixels;
	let newPixels: UnsignedPixel[] = [];

	console.log("Sorting... ", new Date());
	pixels.sort((a, d) => d.placedAt.getTime() - a.placedAt.getTime());
	for (let x = 1; x <= 256; x++) {
		for (let y = 1; y <= 256; y++) {
			const match = pixels.find((p) => p.x == x && p.y == y);
			newPixels.push(match!);
		}
	}

	// 	pixels.forEach((p, _i, a) => {
	// 		const already = Boolean(
	// 			newPixels.find((a) => a.x == p.x && a.y == p.y)
	// 		);
	// 		if (!already) {
	// 			const options = a.filter((o) => o.x == p.x && o.y == p.y);
	//
	// 			options.sort((a, d) => d.placedAt.getTime() - a.placedAt.getTime());
	// 			newPixels.push(options[0]);
	// 		}
	// 	});

	console.log("Finished: ", new Date());

	return newPixels;
};
