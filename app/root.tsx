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
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest" />
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
