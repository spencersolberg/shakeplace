import type { MetaFunction, LinksFunction } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useMatches
} from "@remix-run/react";
import { useState, useEffect } from "react";

import { Howl, Howler } from "howler";

import styles from "./tailwind.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => ({
	charset: "utf-8",
	title: "Shakeplace",
	viewport: "width=device-width,initial-scale=1"
});

export default function App() {
	const matches = useMatches();
	const backgroundColor: string =
		matches.filter((match) => match.data?.backgroundColor).pop()?.data
			.backgroundColor ?? "#ffffff";

	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body
				style={{
					backgroundColor
				}}
			>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
