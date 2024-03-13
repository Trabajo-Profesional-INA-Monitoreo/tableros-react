import React, { createContext, useContext } from "react";
import ModalService from "../services/modalService";

const ModalContext = createContext( null );

export const ModalProvider = ( { children } ) => {
	const modalService = new ModalService();
	return (
		<ModalContext.Provider value={modalService}>
			{children}
		</ModalContext.Provider>
	);
};

export const useModalService = () => useContext( ModalContext );

export default ModalProvider;
