// @ts-ignore
import { NodeClient } from "hs-client";
import { constructMessage } from "~/lib/utils";
import { config } from "dotenv";
config();
// @ts-ignore
// import { fetchAddress, setServers } from "hip2-dane";

// setServers([
// 	"127.0.0.1:5350"
// 	// "165.22.151.242:5350"
// ]);


export type UnidentifiedPixel = {
	color: string;
	x: number;
	y: number;
	signature: string;
	placedAt: Date;
	name: string;
};

console.log(process.env.HSD_HOST, process.env.HSD_PORT)

const hsdOptions = {
	port: parseInt(process.env.HSD_PORT ?? "12037"),
	host: process.env.HSD_HOST ?? "127.0.0.1"
};

const hsd = new NodeClient(hsdOptions);

type Profile = {
	caption?: string;
	socials?: Social[];
	avatar?: URL;
	wallets?: Wallet[];
};

type Wallet = {
	ticker: string;
	address: string;
}

export type Social = {
	service: string;
	username: string;
};

type Resource = {
	records: Record<string, any>[];
};

export const getProfile = async (name: string): Promise<Profile> => {
	const { records }: Resource = await hsd.execute("getnameresource", [name]);
	const txtRecords: string[] = records
		.filter((r) => r.type === "TXT")
		.map(({ txt }) => txt)
		.flat();

	let socials: Social[] | undefined = [];
	const socialRegex = /(?:profile )?social=([A-z0-9]*) (.*)/;
	for (let txtRecord of txtRecords) {
		const matches = socialRegex.exec(txtRecord);

		if (matches) {
			socials = [
				...socials,
				{ service: matches[1].toLowerCase(), username: matches[2] }
			];
		}
	}

	let email: string | undefined;
	const emailRegex = /(?:profile )?email=(.*)/;
	for (let txtRecord of txtRecords) {
		const matches = emailRegex.exec(txtRecord);
		if (matches) email = matches[1];
	}
	if (email) socials = [...socials, { service: "email", username: email }];
	if (socials.length == 0) socials = undefined;

	let avatar: URL | undefined;
	const avatarRegex = /(?:profile )?avatar=(.*)/;
	for (let txtRecord of txtRecords) {
		const matches = avatarRegex.exec(txtRecord);
		if (matches) avatar = new URL(matches[1]);
	}

	let caption: string | undefined;
	const captionRegex = /(?:profile )?caption=((?:[\n\r]|.)*)/;
	for (let txtRecord of txtRecords) {
		const matches = captionRegex.exec(txtRecord);
		if (matches) caption = matches[1];
	}

	// fetchAddress("spencersolberg", {
	// 	token: 'HNS',
	// 	maxLength: 90,
	// 	validate: (key: string) => !!key && key.slice(0, 3) === 'hs1' && key.length <= 90
	// }).then(console.log).catch(console.error);

	return { socials, avatar, caption };
};

export const verifyPixel = async ({
	name,
	x,
	y,
	color,
	placedAt,
	signature
}: UnidentifiedPixel) => {
	const message = constructMessage({ x, y, color, placedAt });
	return await hsd.execute("verifymessagewithname", [
		name,
		signature,
		message
	]);
};
