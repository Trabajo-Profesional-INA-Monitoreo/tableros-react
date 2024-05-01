import React from "react";
import { UserContextProvider } from "../services/userService"
import ConfigurationProvider from "./configProvider";

const MainProvider = ( { children } ) => (
    <UserContextProvider>
		<ConfigurationProvider>
				{children}
		</ConfigurationProvider>
	</UserContextProvider>
);

export default MainProvider;
