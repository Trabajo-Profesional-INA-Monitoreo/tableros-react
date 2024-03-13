import React from "react";
import { Modal as ModalBase} from '@mui/base/Modal';
import { useModalService } from "../../providers/modalProvider";

const Modal = ( children ) => {
	const modalService = useModalService();
	if ( !modalService ) return null;

	return (
		<ModalBase
		>
			{children}
		</ModalBase>
	);
};

export default ( Modal );
