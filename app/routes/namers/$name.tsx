import type {
	LoaderArgs,
	LoaderFunction,
	SerializeFrom
} from "@remix-run/node";
import type { Pixel } from "@prisma/client";
import { json } from "@remix-run/node";
import { useLoaderData, useParams, Link } from "@remix-run/react";

import { getProfile } from "~/lib/hsd.server";
import { getNamerPixels } from "~/lib/pixels.server";
import { formatName, revivePixels } from "~/lib/utils";
import type { NamerPixel } from "~/lib/utils";

import Header from "~/lib/components/header";
import NameLink from "~/lib/components/nameLink";
import SocialLink from "~/lib/components/socialLink";
import PixelTable from "~/lib/components/pixelTable";
import Timer from "~/lib/components/timer";

// type LoaderData = {
// 	profile: Awaited<ReturnType<typeof getProfile>>;
// 	pixels: Pixel[];
// };

export async function loader({ params }: LoaderArgs) {
	const name: string = params.name!;

	const profile = await getProfile(name);
	const pixels = await getNamerPixels(name);

	return json({ profile, pixels });
}

// export const loader: LoaderFunction = async ({ params }) => {
// 	const name: string = params.name!;

// 	const profile = await getProfile(name);
// 	const pixels = await getNamerPixels(name);

// 	return json({ profile, pixels });
// };

export default function Namer() {
	const { name } = useParams();
	const loaderData = useLoaderData<typeof loader>();
	const { profile } = loaderData;
	const pixels: NamerPixel[] = revivePixels(loaderData.pixels);

	return (
		<main>
			<Header>
				<Link
					to="/settings"
					prefetch="intent"
					className="max-w-xs w-full text-center hover:text-blue-500 cursor-pointer underline decoration-blue-500 hover:italic"
				>
					Settings
				</Link>
				<Link
					to="/namers"
					prefetch="intent"
					className="max-w-xs w-full text-center hover:text-blue-500 cursor-pointer underline decoration-blue-500 hover:italic"
				>
					Namers
				</Link>
				<Link
					to="/"
					prefetch="intent"
					className="max-w-xs w-full text-center hover:text-blue-500 cursor-pointer underline decoration-blue-500 hover:italic"
				>
					Shakeplace
				</Link>
				<h1 className="max-w-xs w-full text-center">
					<Timer />
				</h1>
				<NameLink paramName={name} />
			</Header>
			<div className="flex flex-col justify-center mt-12 border-b border-black pb-4">
				<h1 className="font-bold text-6xl mt-4 text-center text-white bg-black rounded-full w-min mx-auto px-4 pt-1 pb-6">
					{formatName(name!, true)}
				</h1>
				{profile.caption ? (
					<h2 className="font-medium text-3xl mt-4 max-w-md text-center mx-auto">
						{profile.caption}
					</h2>
				) : null}
			</div>
			<section>
				{profile.avatar || profile.socials ? (
					<div className="flex flex-col justify-center mt-8 max-w-md mx-auto border border-black p-2">
						<h3 className="mx-auto text-center text-3xl font-medium">
							{formatName(name!)}'s Profile
						</h3>
						<div className="flex flex-col md:flex-row justify-between mt-8">
							{profile.avatar ? (
								<img
									src={profile.avatar.toString()}
									alt={`${name}'s avatar`}
									className="mx-auto w-52 h-52 w- rounded-md mb-4"
								/>
							) : null}
							{profile.socials ? (
								<ul>
									{profile.socials.map((social) => (
										<li key={social.service}>
											<SocialLink social={social} />
										</li>
									))}
								</ul>
							) : null}
						</div>
					</div>
				) : null}
			</section>
			<section className="mb-4">
				{pixels.length > 0 ? (
					<div className="flex flex-col justify-center mt-8 max-w-md mx-auto border border-black p-2">
						<h3 className="mx-auto text-center text-3xl font-medium">
							{formatName(name!)}'s Pixels
						</h3>
						<h4 className="mx-auto text-center text-xl">
							{formatName(name!)} has placed{" "}
							{pixels.length.toLocaleString()} pixel
							{pixels.length > 1 ? "s" : ""}:
						</h4>
						<PixelTable pixels={pixels} />
					</div>
				) : (
					<div className="flex flex-col justify-center mt-8 max-w-md mx-auto border border-black p-2">
						<h3 className="mx-auto text-center text-3xl font-medium">
							{formatName(name!)}'s Pixels
						</h3>
						<h4 className="mx-auto text-center text-xl">
							{formatName(name!)} hasn't placed any pixels yet
						</h4>
					</div>
				)}
			</section>
		</main>
	);
}
