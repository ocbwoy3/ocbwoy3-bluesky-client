"use client";

import { App } from "@/components/App";
import LoginForm from "@/components/Login";
import { setAgent } from "@/lib/atproto/client";
import { BskyAgent, CredentialSession } from "@atproto/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Homepage() {
	const [showLogin, setShowLogin] = useState<boolean>(false);
	const [showApp, setShowApp] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			try {
				const loginPrefs = JSON.parse(
					localStorage.getItem("login-details") || "{}"
				);

				const cs = new CredentialSession(
					loginPrefs.pds!,
					fetch,
					(t, ses) => {
						if (t === "network-error") {
							toast("Error", {
								description: `Network Error while refreshing session.`,
							});
						}
						if (t === "expired") {
							toast("Error", {
								description: `Your session has expired. Please log in.`,
							});
							setShowLogin(true);
							setShowApp(false);
						}
						if (ses) {
							toast("Update", {
								description: `Session updated.`,
							});
							localStorage.setItem(
								"atproto-session",
								JSON.stringify(ses)
							);
						}
					}
				);
				const ag = new BskyAgent(cs);

				try {
					const d = await ag.resumeSession(
						JSON.parse(localStorage.getItem("atproto-session")!)
					);
					if (d.data.active) {
						toast("Success", {
							description: `Restored existing ATProto session`,
						});
						setAgent(ag);
						setShowLogin(false);
						setShowApp(true);
						return;
					}
				} catch {}

				ag.login({
					identifier: loginPrefs.did!,
					password: loginPrefs.password!,
				})
					.then(({ data: res }) => {
						if (!res.active) throw "Inactive account!";
						localStorage.setItem(
							"atproto-session",
							JSON.stringify(res)
						);
						setAgent(ag);
						setShowApp(true);
					})
					.catch((e_) => {
						toast("Error", {
							description: `${e_}`,
						});
						setShowLogin(true);
						setShowApp(false);
					});
			} catch (e_) {
				toast("Error", {
					description: `${e_}`,
				});
				setShowLogin(true);
				setShowApp(false);
			}
		})();
	}, []);

	return (
		<>
			{showLogin ? (
				<>
					<div className="absolute top-0 left-0 w-screen h-screen flex items-center justify-center z-50">
						<LoginForm />
					</div>
					<span className="absolute bottom-2 left-3 font-mono z-[60] select-none">
						<Link
							className="underline"
							href="https://github.com/ocbwoy3/ocbwoy3-bluesky-client"
						>
							OCbwoy3 Bluesky Client
						</Link>
						{` (${process.env.NODE_ENV}) `}
						<span className="text-ctp-surface2">{`@atproto/api ${process
							.env.atproto_api_version!} next ${process.env
							.next_version!}`}</span>
					</span>
				</>
			) : (
				""
			)}
			{showApp ? (
				<>
					{/* <CommandMenu /> */}
					<div className="absolute top-0 left-0 w-screen h-screen overflow-hidden select-none">
						<App />
					</div>
				</>
			) : (
				""
			)}
		</>
	);
}
