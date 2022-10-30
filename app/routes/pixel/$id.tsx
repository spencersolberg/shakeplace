import type { LoaderFunction, LinksFunction } from "@remix-run/node";
import { useParams, Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { Pixel } from "@prisma/client";

import Header from "~/lib/components/header";
import NameLink from "~/lib/components/nameLink";
import Timer from "~/lib/components/timer";

import { getPixel } from "~/lib/pixels.server";
import { getProfile } from "~/lib/hsd.server";
import { getAltColor, formatName, constructMessage } from "~/lib/utils";

type LoaderData = {
	pixel: Pixel;
	profile: Awaited<ReturnType<typeof getProfile>>;
};

export const loader: LoaderFunction = async ({ params }) => {
	const pixel = await getPixel(params.id!);

	let profile;

	if (!pixel?.name) {
		profile = {};
	} else {
		profile = await getProfile(pixel.name);
	}

	const backgroundColor = "#" + pixel!.color;

	return json({ pixel, profile, backgroundColor });
};

export default function Pixel() {
	const params = useParams();
	const { pixel, profile } = useLoaderData<LoaderData>();

	return (
		<main>
			<Header color={pixel.color}>
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
				<NameLink />
			</Header>
			<section
				style={{
					color: getAltColor("#" + pixel.color)
				}}
				className="w-screen h-screen"
			>
				<div className="flex flex-col justify-center text-center mt-4 pb-4 mx-auto px-2">
					<div className="flex flex-col-reverse md:flex-row mx-auto pt-20 max-w-md">
						{profile.avatar ? (
							<img
								src={profile.avatar!.toString()}
								alt={formatName(pixel.name) + "'s avatar"}
								className="mx-auto w-40 h-40 rounded-md aspect-square mb-4"
							/>
						) : null}
						<div className="md:text-left">
							<Link
								className={
									"text-5xl md:text-4xl font-bold cursor-pointer underline hover:italic md:ml-2" +
									(!profile.avatar ? " md:text-center" : "")
								}
								to={`/namers/${pixel.name}`}
								prefetch="intent"
							>
								{formatName(pixel.name, true)}
							</Link>
							{profile.caption ? (
								<h1
									className={
										"text-3xl font-semibold md: ml-2" +
										(!profile.avatar
											? " md:text-center"
											: "")
									}
								>
									{profile.caption}
								</h1>
							) : null}
							<h1
								className={
									"text-2xl font-medium md:ml-2 mb-2" +
									(!profile.avatar ? " md:text-center" : "")
								}
							>
								<Link
									to={`/${pixel.x},${pixel.y}`}
									prefetch="intent"
									className="underline hover:italic"
								>
									@{pixel.x},{pixel.y}
								</Link>
							</h1>
						</div>
					</div>
					<div
						className="w-full border-t mt-2 mb-2 max-w-md mx-auto"
						style={{
							borderColor: getAltColor("#" + pixel.color)
						}}
					/>
					<p
						className={
							"my-2 text-5xl max-w-md mx-auto text-center" +
							(profile.avatar ? " md:text-left" : "")
						}
					>
						This pixel was placed by
						<br />
						<Link
							to={`/namers/${pixel.name}`}
							className="font-bold underline hover:italic"
							prefetch="intent"
						>
							{formatName(pixel.name)}
						</Link>
						<br />
						with hex code
						<br />
						<span className="font-bold">
							#{pixel.color.toUpperCase()}
						</span>
						<br />
						at
						<br />
						<span className="font-bold">
							{new Date(pixel.placedAt).toLocaleString()}
						</span>
						.
					</p>
					<p
						className={
							"my-2 text-5xl max-w-md mx-auto text-center" +
							(profile.avatar ? " md:text-left" : "")
						}
					>
						{pixel.active ? (
							<>This pixel is still on the canvas.</>
						) : (
							<>
								This pixel is{" "}
								<Link
									to={`/${pixel.x},${pixel.y}`}
									prefetch="intent"
									className="underline hover:italic"
								>
									no longer on the canvas.
								</Link>
							</>
						)}
					</p>

					{pixel.signature ? (
						<>
							<div
								className="w-full border-t mt-4 mb-2 max-w-md mx-auto"
								style={{
									borderColor: getAltColor("#" + pixel.color)
								}}
							/>
							<h1 className="font-bold text-6xl">Don't trust.</h1>
							<h1 className="font-bold text-6xl">Verify.</h1>
							<pre
								className="w-full overflow-scroll rounded-md p-1 max-w-md mx-auto mt-8 text-left"
								style={{
									backgroundColor: getAltColor(
										"#" + pixel.color
									),
									color: "#" + pixel.color
								}}
							>
								{pixel.name}
							</pre>
							<button
								className="text-xl mx-auto text-center underline hover:italic"
								onClick={() => {
									navigator.clipboard.writeText(pixel.name);
								}}
							>
								Copy Name
							</button>
							<pre
								className="w-full overflow-scroll rounded-md p-1 max-w-md mx-auto mt-4 text-left"
								style={{
									backgroundColor: getAltColor(
										"#" + pixel.color
									),
									color: "#" + pixel.color
								}}
							>
								{constructMessage(pixel)}
							</pre>
							<button
								className="text-xl mx-auto text-center underline hover:italic"
								onClick={() => {
									navigator.clipboard.writeText(
										constructMessage(pixel)
									);
								}}
							>
								Copy Message
							</button>
							<pre
								className="w-full overflow-scroll rounded-md p-1 max-w-md mx-auto mt-4 text-left"
								style={{
									backgroundColor: getAltColor(
										"#" + pixel.color
									),
									color: "#" + pixel.color
								}}
							>
								{pixel.signature}
							</pre>
							<button
								className="text-xl mx-auto text-center underline hover:italic"
								onClick={() => {
									navigator.clipboard.writeText(
										pixel.signature!
									);
								}}
							>
								Copy Signature
							</button>
						</>
					) : null}
				</div>
			</section>
		</main>
	);
}
