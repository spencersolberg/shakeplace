import type { ActionFunction } from "@remix-run/node";

import { getLastNamerPlacement } from "~/lib/pixels.server";

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	const name = formData.get("name") as string;
};
