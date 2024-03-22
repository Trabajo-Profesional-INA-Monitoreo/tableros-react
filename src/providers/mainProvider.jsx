import React from "react";
import { ModalProvider } from "./modalProvider";
import { UserContextProvider } from "../services/userService"
import ConfigurationProvider from "./configProvider";

const MainProvider = ( { children } ) => (
    <UserContextProvider>
		<ConfigurationProvider>
			<ModalProvider>
				{children}
			</ModalProvider>
		</ConfigurationProvider>
	</UserContextProvider>
);

export default MainProvider;
