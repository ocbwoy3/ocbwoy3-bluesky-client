"use client";

import { Title } from "./Title";
import { Button } from "./ui/button";

export function App() {
	return (
		<>
			<Title/>
			<Button onClick={()=>{
				localStorage.removeItem("login-details");
				localStorage.removeItem("atproto-session");
				location.reload();
			}}>
				Log Out
			</Button>
		</>
	);
}
