import { db } from "~/lib/db.server";
import type { UnidentifiedPixel } from "~/lib/hsd.server";

import { filterPixels } from "~/lib/utils";
import type { NamerPixel } from "~/lib/utils";

export const getAllPixels = async () => {
	const pixels = await db.pixel.findMany({
		where: {
			active: true
		},
		select: {
			x: true,
			y: true,
			placedAt: true,
			color: true,
			name: true,
			id: true
		}
	});
	return pixels;
};

export const getNamerPixels = async (name: string): Promise<NamerPixel[]> => {
	return await db.pixel.findMany({
		where: {
			name: name
		},
		orderBy: {
			placedAt: "desc"
		},
		select: {
			x: true,
			y: true,
			placedAt: true,
			color: true,
			id: true,
			active: true,
		}
	});
};

export const getLastNamerPlacement = async (name: string) => {
	const lastPixel = await db.pixel.findFirst({
		where: {
			name: name
		},
		orderBy: {
			placedAt: "desc"
		},
		select: {
			placedAt: true
		}
	});

	return lastPixel?.placedAt ?? null;
};

export const createPixel = async ({
	name,
	x,
	y,
	color,
	placedAt,
	signature
}: UnidentifiedPixel) => {
	const existing = await db.pixel.findFirst({
		where: {
			x: x,
			y: y,
			active: true
		},
		select: {
			id: true
		}
	});

	await db.pixel.update({
		where: {
			id: existing!.id
		},
		data: {
			active: false
		}
	});

	return await db.pixel.create({
		data: {
			color,
			x,
			y,
			placedAt,
			signature,
			namer: {
				connectOrCreate: {
					where: {
						name: name
					},

					create: {
						name: name
					}
				}
			}
		}
	});
};

export const getPixel = async (id: string) => {
	return await db.pixel.findUnique({
		where: {
			id: id
		}
	});
};

export const getPixelAtCoordinate = async (x: number, y: number) => {
	const pixel = await db.pixel.findFirst({
		where: {
			x,
			y,
			active: true
		},
		select: {
			id: true
		}
	});

	return pixel;
};
