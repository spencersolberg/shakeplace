import type { Social } from "~/lib/hsd.server";
import { FaGithub, FaTwitter, FaDiscord } from "react-icons/fa";
import { GrReddit, GrSnapchat } from "react-icons/gr";
import { BsChatFill, BsLightningChargeFill, BsTelegram } from "react-icons/bs";
import { IoMdMail } from "react-icons/io";
import { AiFillInstagram } from "react-icons/ai";

const knowns = [
	{
		service: "github",
		url: "https://github.com/",
		icon: <FaGithub />
	},
	{
		service: "twitter",
		url: "https://www.twitter.com/",
		prefix: "@",
		icon: <FaTwitter />
	},
	{
		service: "reddit",
		url: "https://www.reddit.com/u/",
		prefix: "u/",
		icon: <GrReddit />
	},
	{
		service: "discord",
		icon: <FaDiscord />
	},
	{
		service: "hnschat",
		url: "https://hnschat/#message:",
		icon: <BsChatFill />
	},
	{
		service: "email",
		url: "mailto:",
		icon: <IoMdMail />
	},
	{
		service: "lightning",
		url: "lightning:",
		icon: <BsLightningChargeFill />
	},
	{
		service: "telegram",
		url: "https://t.me/",
		prefix: "@",
		icon: <BsTelegram />
	},
	{
		service: "instagram",
		url: "https://www.instagram.com/",
		prefix: "@",
		icon: <AiFillInstagram />
	},
	{
		service: "snapchat",
		url: "https://www.snapchat.com/add/",
		icon: <GrSnapchat />
	}
];

export default function SocialLink({ social }: { social: Social }) {
	const known = knowns.find((k) => k.service === social.service);
	return (
		<div className="flex items-end text-white bg-black rounded-full px-2 pt-1 mb-2 text-center">
			{known?.url ? (
				<>
					<div className="pb-2.5 ">
						{known.icon ? known.icon : null}
					</div>
					<a
						href={known.url + social.username}
						target="_blank"
						className="hover:italic underline pl-1.5 pb-2"
					>
						{known.prefix ?? ""}
						{social.username}
					</a>
				</>
			) : (
				<>
					<div className="pb-2.5">
						{known?.icon ? known.icon : null}
					</div>
					<p className="pl-1.5 pb-2">
						{known?.icon ? "" : social.service + ": "}
						{social.username}
					</p>
				</>
			)}
		</div>
	);
}
