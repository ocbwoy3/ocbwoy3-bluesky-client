import type { NextConfig } from "next";
import v from "./package.json";

const nextConfig: NextConfig = {
	/* config options here */
	env: {
		atproto_api_version: v.dependencies["@atproto/api"],
		react_version: v.dependencies.react,
		tailwind_version: v.devDependencies.tailwindcss,
		next_version: v.dependencies.next,
		packagejson: JSON.stringify(v)
	},
};

export default nextConfig;
