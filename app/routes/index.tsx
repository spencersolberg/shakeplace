import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
	Link,
	useLoaderData,
	Form,
	useSubmit,
	useNavigate
} from "@remix-run/react";
import { useState, Dispatch, SetStateAction, useEffect } from "react";

import type { Pixel } from "@prisma/client";
import type { UnsignedPixel } from "~/lib/utils";

import Header from "~/lib/components/header";
import NameLink from "~/lib/components/nameLink";
import PixelBoard from "~/lib/components/pixelBoard";
import Timer from "~/lib/components/timer";

import {
	getAllPixels,
	getLastNamerPlacement,
	createPixel
} from "~/lib/pixels.server";
import { verifyPixel } from "~/lib/hsd.server";
import { connect } from "~/lib/ws.server";
import {
	colors,
	getAltColor,
	formatName,
	constructMessage,
	revivePixels
} from "~/lib/utils";
import io from "socket.io-client";

type LoaderData = {
	existingPixels: Pixel[];
};

export const loader: LoaderFunction = async () => {
	const existingPixels = await getAllPixels();
	return json({ existingPixels });
};

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();

	const name = formData.get("name") as string;
	const x = Number(formData.get("x") as string);
	const y = Number(formData.get("y") as string);
	const color = formData.get("color") as string;
	const placedAt = new Date(Number(formData.get("placedAt") as string));
	const signature = formData.get("signature") as string;

	if (!name || !x || !y || !color || !placedAt || !signature)
		throw new Error("Some fields were empty!");

	const verified = await verifyPixel({
		name,
		x,
		y,
		color,
		placedAt,
		signature
	});

	if (!verified) throw new Error("Unable to verify signature.");
	if (placedAt > new Date()) throw new Error("Placed too early.");
	if (Date.now() - placedAt.getTime() > 15 * 1000)
		throw new Error("You took too long to sign the message!");
	if (!colors.includes(color)) throw new Error("That color is invalid!");
	if (x < 1 || x > 256 || y < 1 || y > 256)
		throw new Error("Coordinates out of bounds");

	const lastPlacement = await getLastNamerPlacement(name);
	console.log(lastPlacement, placedAt);
	if (lastPlacement) {
		if (placedAt.getTime() - lastPlacement.getTime() < 60 * 5 * 1000)
			throw new Error("You must wait before placing your next pixel");
	}

	const pixel = await createPixel({ name, x, y, color, placedAt, signature });

	const socket = connect();
	socket.emit("pixel", { ...pixel, key: process.env.SERVER_SOCKET_KEY });

	return null;
};

export default function Index() {
	// const { existingPixels } = useLoaderData<LoaderData>();
	const navigate = useNavigate();
	const existingPixels: Pixel[] = revivePixels(
		useLoaderData<LoaderData>().existingPixels
	);

	if (existingPixels.length < 65536) navigate("/", { replace: true });
	const [pixels, setPixels] = useState<Pixel[]>(existingPixels);
	const [socket, setSocket] = useState<ReturnType<typeof io>>();
	const [newPixel, setNewPixel] = useState<Pixel>();

	useEffect(() => {
		const url = location.protocol + "//" + location.host;
		setSocket(io(url));
	}, []);
	useEffect(() => {
		if (!socket) return;
		socket.on("pixel", ({ name, x, y, color, placedAt, id }) => {
			setNewPixel({
				name,
				x,
				y,
				color,
				placedAt: new Date(placedAt),
				id,
				active: true,
				signature: null
			});
		});
	}, [socket]);

	useEffect(() => {
		if (!newPixel) return;
		if (newPixel.name === name) {
			window.localStorage.setItem(
				"nextPlaceTime",
				String(newPixel.placedAt.getTime() + 5 * 60 * 1000)
			);
		}
		// console.log("Current Pixels:", pixels.length);
		let replacee = pixels.find(
			(pixel) => pixel.x == newPixel.x && pixel.y == newPixel.y
		);
		setPixels(
			pixels
				.filter((pixel) => pixel.id != replacee!.id)
				.concat([newPixel])
		);
		setNewPixel(undefined);
	}, [newPixel]);

	const submit = useSubmit();

	const [color, setColor] = useState<string | null>(null);
	const [x, setX] = useState<number | null>(null);
	const [y, setY] = useState<number | null>(null);
	const [zoom, setZoom] = useState<number>(1);
	const [signature, setSignature] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [placedAt, setPlacedAt] = useState<number>(0);
	const [selectedPixel, setSelectedPixel] = useState<Pixel | null>(null);

	useEffect(() => {
		setName(window.localStorage.getItem("name") ?? "");
	}, []);

	useEffect(() => {
		console.log("Submit initiated...");
		if (!placedAt || !signature) return;
		console.log("Submit allowed...");
		submit(document.getElementById("form") as HTMLFormElement, {
			method: "post"
		});
		setSelectedPixel(null);
		setColor(null);
		window.localStorage.setItem(
			"nextPlaceTime",
			String(placedAt + 5 * 60 * 1000)
		);
	}, [signature]);

	const place = async () => {
		console.log("Place initiated...");
		if (!color || !x || !y || !window.localStorage.getItem("name")) return;
		console.log("Place allowed...");

		const wallet = await window.bob3.connect();
		const placedAt = new Date();
		setPlacedAt(placedAt.getTime());
		const message = constructMessage({ x, y, color, placedAt });
		wallet
			.signWithName(window.localStorage.getItem("name"), message)
			.then((sign: string) => {
				console.log("Message signed...");
				setSignature(sign);
			});
	};

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
				<h1 className="max-w-xs w-full text-center">Shakeplace</h1>
				<h1 className="max-w-xs w-full text-center">
					<Timer pixels={pixels} />
				</h1>
				<NameLink />
			</Header>
			<PixelBoard
				color={color}
				x={x}
				setX={setX}
				y={y}
				setY={setY}
				zoom={zoom}
				pixels={pixels}
				selectedPixel={selectedPixel}
				setSelectedPixel={setSelectedPixel}
			/>
			<PixelInfo selectedPixel={selectedPixel} />

			<section>
				<Form className="mt-4" method="post" replace id="form">
					<input
						type="hidden"
						name="color"
						value={color ?? ""}
						readOnly
					/>
					<input
						type="hidden"
						name="x"
						value={x ?? 0}
						min={1}
						max={256}
						readOnly
					/>
					<input
						type="hidden"
						name="y"
						value={y ?? 0}
						min={1}
						max={256}
						readOnly
					/>
					<input
						type="hidden"
						name="signature"
						value={signature}
						readOnly
					/>
					<input type="hidden" name="name" value={name} readOnly />
					<input
						type="hidden"
						name="placedAt"
						value={placedAt}
						readOnly
					/>
				</Form>
			</section>
			<ColorPalette
				color={color}
				setColor={setColor}
				zoom={zoom}
				setZoom={setZoom}
				pixels={pixels}
				place={place}
				name={name}
			/>
		</main>
	);
}

interface IProps {
	color: string | null;
	setColor: Dispatch<SetStateAction<string | null>>;
	zoom: number;
	setZoom: Dispatch<SetStateAction<number>>;
	pixels: Pixel[];
	place: () => void;
	name: string;
}

function ColorPalette({
	color,
	setColor,
	zoom,
	setZoom,
	pixels,
	place,
	name
}: IProps) {
	const [nextPlaceTime, setNextPlaceTime] = useState(0);

	useEffect(() => {
		setNextPlaceTime(
			Number(window.localStorage.getItem("nextPlaceTime") ?? 0)
		);
	}, [pixels]);

	const [countdownToNextPlaceTime, setCountdownToNextPlaceTime] = useState(0);
	useEffect(() => {
		const interval = setInterval(() => {
			const now = Date.now();
			const timeLeft = nextPlaceTime - now;
			setCountdownToNextPlaceTime(timeLeft);
		}, 1000);
		return () => clearInterval(interval);
	}, [nextPlaceTime]);
	const zoomOut = () => {
		if (zoom > 0.25) {
			setZoom(zoom / 2);
		}
	};

	const zoomIn = () => {
		if (zoom < 8) {
			setZoom(zoom * 2);
		}
	};
	return (
		<>
			<div className="mb-64 md:mb-20" />
			<div className="flex flex-col md:grid md:grid-cols-6 justify-between px-2 fixed bottom-0 py-2 border-t border-black bg-white w-full">
				<div className="select-none text-center text-2xl font-semibold mb-2 md:mb-0 md:mt-8 col-col-span-1">
					<span className="cursor-pointer" onClick={zoomOut}>
						-
					</span>
					<span className="px-2">{zoom}x</span>
					<span className="cursor-pointer" onClick={zoomIn}>
						+
					</span>
				</div>
				<div className="grid lg:grid-cols-12 md:grid-cols-8 grid-cols-6 border border-black col-span-4">
					{colors.map((option) => (
						<div
							key={option}
							className=" pt-0.5 pb-2 flex justify-center align-middle text-3xl {color == selected
							? 'ring-2 ring-inset'
							: ''} cursor-pointer select-none"
							style={{
								backgroundColor: `#${option}`,
								color:
									color == option
										? getAltColor("#" + option)
										: "#" + option
							}}
							onClick={() => {
								if (color == option) {
									setColor(null);
								} else {
									setColor(option);
								}
							}}
						>
							★
						</div>
					))}
				</div>
				{countdownToNextPlaceTime < 0 && name ? (
					<button
						className="text-center
						  
						bg-black rounded-full text-white w-24 h-10 pb-1 text-2xl font-semibold mx-auto mb-2 mt-4 md:mt-8 border border-black hover:bg-blue-500 md:mb-0 col-span-1"
						onClick={place}
					>
						Place
					</button>
				) : (
					<button
						className="text-center
						  
						bg-black rounded-full text-white w-24 h-10 pb-1 text-2xl font-semibold mx-auto mb-2 mt-4 md:mt-8 border border-black opacity-50 md:mb-0 col-span-1 cursor-default"
					>
						Place
					</button>
				)}
			</div>
		</>
	);
}

interface PixelProps {
	selectedPixel: UnsignedPixel | null;
}

function PixelInfo({ selectedPixel }: PixelProps) {
	return (
		<div className="flex flex-col justify-center text-center mt-4 pb-20 md:pb-24 lg:pb-14 max-w-sm mx-auto px-2">
			{selectedPixel ? (
				<>
					<Link
						className="text-3xl font-bold hover:text-blue-500 cursor-pointer underline decoration-blue-500 hover:italic"
						to={`/namers/${selectedPixel.name}`}
						prefetch="intent"
					>
						{formatName(selectedPixel.name, true)}
					</Link>
					<h1 className="text-3xl font-bold">
						@{selectedPixel.x},{selectedPixel.y}
					</h1>
				</>
			) : (
				<>
					<h1 className="text-3xl font-bold">Choose a pixel...</h1>
					<h1 className="tex-3xl font-bold text-white">
						Placeholder
					</h1>
				</>
			)}

			<p className="my-2">
				This pixel was placed by{" "}
				<b>
					{selectedPixel
						? formatName(selectedPixel.name)
						: "an unknown namer"}
				</b>{" "}
				at{" "}
				<b>
					{selectedPixel
						? selectedPixel.placedAt.toLocaleString()
						: "an unknown time"}
				</b>
				.
			</p>
			{selectedPixel ? (
				<Link
					to={`/pixel/${selectedPixel?.id}`}
					className="hover:text-blue-500 cursor-pointer underline decoration-blue-500 hover:italic text-xl font-semibold"
				>
					Verify
				</Link>
			) : (
				<h2 className="hover:text-blue-500 opacity-50 underline decoration-blue-500 select-none text-xl font-semibold">
					Verify
				</h2>
			)}
		</div>
	);
}
