import dynamic from "next/dynamic";

import { Fragment } from "react";

const NoSSR = ({ children }: { children: React.ReactNode }) => (
	<Fragment>{children}</Fragment>
);

export default dynamic(() => Promise.resolve(NoSSR), {
	ssr: false,
});
