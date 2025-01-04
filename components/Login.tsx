"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Title } from "./Title";

export default function LoginForm() {
	const [formData, setFormData] = useState({
		did: "",
		password: "",
		pds: "https://bsky.social",
	});

	useEffect(() => {
		const savedPreferences = localStorage.getItem("login-details-input");
		if (savedPreferences) {
			setFormData(JSON.parse(savedPreferences));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("login-details-input", JSON.stringify(formData));
	}, [formData]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		localStorage.setItem("login-details-input", JSON.stringify(formData));
		localStorage.setItem("login-details", JSON.stringify(formData));
		location.reload();
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-center">
					<Title />
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="did">DID</Label>
						<Input
							id="did"
							name="did"
							value={formData.did}
							onChange={handleChange}
							placeholder="did:plc:s7cesz..."
							required
						/>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="password">App Password</Label>
							<a
								href="https://bsky.app/settings/app-passwords"
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
							>
								Create app password
								<ExternalLink className="h-3 w-3" />
							</a>
						</div>
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="xxxx-xxxx-xxxx-xxxx"
							value={formData.password}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="pds">PDS</Label>
							<a
								href="https://atproto.com/guides/glossary#pds-personal-data-server"
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
							>
								{"What's a PDS?"}
								<ExternalLink className="h-3 w-3" />
							</a>
						</div>
						<Input
							id="pds"
							name="pds"
							value={formData.pds}
							onChange={handleChange}
							placeholder="https://bsky.social"
						/>
					</div>

					<Button type="submit" className="w-full">
						Login
					</Button>
				</form>
			</CardContent>
			<CardFooter>
				<span className="text-sm text-yellow-300">
					{
						"Your login details and API keys will be stored in the browser's LocalStorage."
					}
				</span>
			</CardFooter>
		</Card>
	);
}
