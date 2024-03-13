import React from "react";
import { ModalProvider } from "./modalProvider";
import { UserContextProvider } from "../services/userService"

const MainProvider = ( { children } ) => (
    <UserContextProvider>
        <ModalProvider>
			{children}
		</ModalProvider>
	</UserContextProvider>
);

export default MainProvider;
