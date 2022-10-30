import type { LoaderFunction } from "@remix-run/node";
import punycode from "punycode";
import {
	Form,
	useLoaderData,
	Link,
	useSubmit,
	useSearchParams
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { useEffect, useState } from "react";

import { allNamers } from "~/lib/db.server";
import { formatName } from "~/lib/utils";

import Header from "~/lib/components/header";
import Timer from "~/lib/components/timer";
import NameLink from "~/lib/components/nameLink";

export const loader: LoaderFunction = async ({ request }) => {
	const url = new URL(request.url);
	const q = punycode.toASCII(url.searchParams.get("q") ?? "");
	let pageString = url.searchParams.get("page");
	console.log(pageString);
	let page: number = 1;
	if (pageString != null && Number(pageString) > 1) page = Number(pageString);
	// 1: 0-99
	// 2: 100-199
	let start = (page - 1) * 100;
	let end = start + 99;
	console.log(page, start, end);

	const namers = await allNamers(q);
	const paginatedNamers = namers.slice(start, end + 1);
	return json({ paginatedNamers });
};

type LoaderData = {
	paginatedNamers: Awaited<ReturnType<typeof allNamers>>;
};

export default function NamersIndex() {
	const { paginatedNamers } = useLoaderData<LoaderData>();
	const [params] = useSearchParams();
	const submit = useSubmit();
	const [page, setPage] = useState(1);

	// useEffect(() => {
	// 	const form = document.getElementById("searchform")! as HTMLFormElement;

	// 	submit(form);
	// }, [page]);

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
				<h2 className="max-w-xs w-full text-center">Namers</h2>
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
			<section>
				<Form
					method="get"
					className="mt-24 flex flex-col justify-center mx-auto max-w-sm px-2"
					replace
				>
					<label
						htmlFor="q"
						className="font-bold text-4xl text-center md:text-left mb-2"
					>
						Search namers...
					</label>
					<input
						type="text"
						name="q"
						placeholder="bittersweetpoetry"
						defaultValue={params.get("q") ?? undefined}
						onChange={(e) => {
							if (page != 1) {
								setPage(1);
							} else {
								submit(e.currentTarget.form);
							}
						}}
						className="border border-black rounded-md w-full font-medium text-2xl pb-1 px-1 mb-2"
						autoCapitalize="off"
						autoCorrect="off"
						spellCheck="false"
					/>
					<input
						type="hidden"
						value={page}
						name="page"
						onChange={(e) => submit(e.currentTarget.form)}
					/>
					<div className="flex justify-between mb-4">
						<button
							className="hover:italic"
							style={{
								color: page != 1 ? "black" : "white",
								textDecoration:
									page != 1 ? "underline" : "none",
								cursor: page != 1 ? "pointer" : "default"
							}}
							onClick={() => setPage(page - 1)}
						>
							previous page
						</button>
						<button
							className="hover:italic"
							style={{
								color:
									paginatedNamers.length == 100
										? "black"
										: "white",
								textDecoration:
									paginatedNamers.length == 100
										? "underline"
										: "none",
								cursor:
									paginatedNamers.length == 100
										? "pointer"
										: "default"
							}}
							onClick={() => setPage(page + 1)}
						>
							next page
						</button>
					</div>
				</Form>
			</section>
			<section>
				<ul className="flex flex-col justify-center mx-auto max-w-sm px-2 text-center md:text-left mb-4">
					{page}
					{paginatedNamers.map((namer) => (
						<li key={namer.name}>
							<div>
								<Link
									to={`/namers/${namer.name}`}
									prefetch="intent"
									className="hover:text-blue-500 cursor-pointer underline decoration-blue-500 hover:italic text-4xl font-medium"
								>
									{formatName(namer.name, true)}
								</Link>
								<h3>
									{namer._count.pixels} pixel
									{namer._count.pixels > 1 ? "s" : ""}
								</h3>
							</div>
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}
