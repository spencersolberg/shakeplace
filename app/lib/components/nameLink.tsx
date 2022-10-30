import { Link } from "@remix-run/react";
import { useState, useEffect } from "react";

import { formatName } from "~/lib/utils";

type NameLinkProps = {
	paramName?: string;
};

export default function NameLink({ paramName }: NameLinkProps) {
	useEffect(() => {
		setName(window.localStorage.getItem("name") ?? undefined);
	}, []);

	const [name, setName] = useState<string>();
	return (
		<>
			{name ? (
				name !== paramName ? (
					<Link
						to={`/namers/${name}`}
						prefetch="intent"
						className="max-w-xs w-full text-center hover:text-blue-500 cursor-pointer underline decoration-blue-500 hover:italic"
					>
						{formatName(name, true)}
					</Link>
				) : (
					<h1 className="max-w-xs w-full text-center">
						{formatName(name, true)}
					</h1>
				)
			) : (
				<Link
					to="/login"
					prefetch="intent"
					className="max-w-xs w-full text-center hover:text-blue-500 cursor-pointer underline decoration-blue-500 hover:italic"
				>
					Login
				</Link>
			)}
		</>
	);
}
