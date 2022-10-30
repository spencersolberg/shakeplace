import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getPixelAtCoordinate } from "~/lib/pixels.server";

export const loader: LoaderFunction = async ({ params }) => {
	const [x, y] = params.coordinates!.split(",");

	const pixel = await getPixelAtCoordinate(Number(x), Number(y));
	return redirect("/pixel/" + pixel!.id);
};
