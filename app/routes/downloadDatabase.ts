import type { LoaderArgs } from "@remix-run/node";
import { getAllPixels } from "~/lib/pixels.server";

export async function loader({ params }: LoaderArgs) {
        const pixels = await getAllPixels();
        return new Response(JSON.stringify(pixels), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Content-Disposition": "attachment; filename=shakeplace.json"
            },
        });
}
