import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

declare global {
	var __db: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
	db = new PrismaClient();
} else {
	if (!global.__db) {
		global.__db = new PrismaClient();
	}

	db = global.__db;
}

export { db };

export const allNamers = async (q: string | null) => {
	return await db.namer.findMany({
		where: q
			? {
					name: {
						contains: q
					}
			  }
			: undefined,
		orderBy: {
			pixels: {
				_count: "desc"
			}
		},
		include: {
			_count: {
				select: { pixels: true }
			}
		}
	});
};
