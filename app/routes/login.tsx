import { useState, useEffect } from "react";
import { redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { formatName } from "~/lib/utils";

declare global {
	interface Window {
		bob3: any | undefined;
	}
}

type LoginState =
	| {
			hasBob: Boolean;
			names?: string[];
	  }
	| undefined;

const getNames = async (): Promise<LoginState> => {
	let hasBob = true;
	try {
		window.bob3;
	} catch (err: any) {
		if (err.name == "ReferenceError") {
			hasBob = false;
		}
	}

	if (typeof window.bob3 === "undefined") {
		hasBob = false;
	}

	if (!hasBob) return { hasBob };

	const wallet = await window.bob3.connect();
	const names = (await wallet.getNames())
		.map((o: Record<string, string>) => o.name)
		.sort();

	return { hasBob, names };
};

const saveName = (option: string) => {
	window.localStorage.removeItem("name");
	window.localStorage.setItem("name", option);
};

export default function Login() {
	const [loginState, setLoginState] = useState<LoginState>();
	const [name, setName] = useState<string>("");

	useEffect(() => {
		getNames().then(setLoginState);
	}, []);

	return (
		<main className="max-w-sm flex flex-col justify-center mx-auto p-2">
			{!loginState ? null : loginState.hasBob ? (
				<>
					{loginState.names && loginState.names.length > 0 ? (
						<ul className="mt-4">
							{loginState.names?.map((option) => (
								<li className="mb-2 mx-auto">
									<Link
										to="/"
										prefetch="intent"
										className="text-2xl font-medium hover:italic hover:text-white hover:bg-black hover:rounded-full px-2 pt-1 pb-2 text-center mx-auto"
										onClick={() => saveName(option)}
									>
										{formatName(option, true)}
									</Link>
								</li>
							))}
						</ul>
					) : (
						<>
							<p className="text-center text-xl font-medium pt-8">
								No names found in your wallet.{" "}
							</p>
							<Link
								to="/"
								prefetch="intent"
								className="text-2xl pt-8 max-w-xs w-full text-center hover:text-blue-500 cursor-pointer underline decoration-blue-500 hover:italic"
							>
								Back
							</Link>
						</>
					)}
				</>
			) : (
				<div>
					<h2 className="font-medium mt-40 text-5xl text-center text-red-500">
						Bob extension not found.
					</h2>
					<p className="text-center text-xl mt-4 font-medium">
						This app requires the{" "}
						<a
							className="underline hover:text-blue-500 decoration-blue-500 hover:italic"
							href="https://bobwallet.io"
						>
							Bob Wallet browser extension
						</a>
						.
					</p>
				</div>
			)}
		</main>
	);
}
