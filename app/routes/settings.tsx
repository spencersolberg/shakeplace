import Header from "~/lib/components/header";
import NameLink from "~/lib/components/nameLink";
import Timer from "~/lib/components/timer";

import { Link } from "@remix-run/react";
import { useState, useEffect } from "react";

export default function Settings() {
	useEffect(() => {
		setName(window.localStorage.getItem("name") ?? undefined);
	}, []);

	const [name, setName] = useState<string>();
	return (
		<main>
			<Header>
				<h1 className="max-w-xs w-full text-center">Settings</h1>
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
			<div className="flex flex-col mx-auto justify-center max-w-sm pt-10">
				<div className="flex max-w-sm mx-auto items-center  mt-8">
					<h1 className="text-6xl mx-auto text-center pl-1 font-bold">
						About
					</h1>
				</div>
				<h2 className="text-3xl mx-auto text-center mt-2 font-medium">
					made with ❤️ by{" "}
					<a
						href="https://spencersolberg/"
						target="_blank"
						className="underline hover:text-blue-500 decoration-blue-500 hover:italic border-b-black pb-4 border-b"
					>
						spencersolberg/
					</a>
				</h2>
				<h2 className="text-2xl font-medium mt-8 mx-auto max-w-sm">
					<a
						href="https://github.com/spencersolberg/shakeplace"
						target="_blank"
						className="underline hover:text-blue-500 decoration-blue-500 hover:italic"
					>
						README
					</a>
				</h2>
				<h2 className="text-xl font-medium mt-8 mx-auto max-w-sm">
					<a
						href="/downloadDatabase"
						className="underline hover:text-blue-500 decoration-blue-500 hover:italic"
						download
					>
						Download Database
					</a>
				</h2>
				{ name ? (
					<Link
						to="/"
						prefetch="intent"
						className="text-2xl font-medium hover:italic hover:text-white hover:bg-black hover:rounded-full mt-4 px-2 pt-1 pb-2 text-center mx-auto border border-black rounded-full"
						onClick={() => {
							localStorage.removeItem("name");
						}
						}
					>
						Logout
					</Link>
				) : (
					<Link
						to="/login"
						prefetch="intent"
						className="text-2xl font-medium hover:italic hover:text-white hover:bg-black hover:rounded-full mt-4 px-2 pt-1 pb-2 text-center mx-auto border border-black rounded-full"
					>
						Login
					</Link>
				)}
				{/* <div className="flex flex-col max-w-sm mx-auto items-center mt-36">
					<h1 className="text-6xl mx-auto text-center pl-1 font-bold">
						Settings
					</h1>
					<div className="flex">
						<input
							type="checkbox"
							name="sfx"
							id="sfx"
							className="mt-4 mr-2"
							disabled
						></input>
						<label
							htmlFor="sfx"
							className="text-3xl mx-auto text-center mt-2 font-medium"
						>
							SFX (COMING SOON)
						</label>
					</div>
					<div className="flex">
						<input
							type="checkbox"
							name="music"
							id="music"
							className="mt-4 mr-2"
							disabled
						></input>
						<label
							htmlFor="music"
							className="text-3xl mx-auto text-center mt-2 font-medium"
						>
							Music (COMING SOON)
						</label>
					</div>
				</div> */}
			</div>
		</main>
	);
}
