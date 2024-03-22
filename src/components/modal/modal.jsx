import React from "react";
import { observer } from "mobx-react-lite";
import { Modal as ModalBase, Box} from '@mui/material';
import { useModalService } from "../../providers/modalProvider";

const style = {
	position: "absolute",
	top: '50%',
	left: '50%',
	width: 400,
	bgcolor: 'background.paper',
	boxShadow: 24,
    padding: "2%",
    display: "flex",
    justifyContent: "center",
	marginTop:"-50px",
  	marginLeft:"-200px",
};

const Modal = () => {
	const modalService = useModalService();
	if ( !modalService ) return null;

	return (
		<ModalBase
			open={modalService?.visible}
			onClose={()=>modalService?.hide()}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
            <Box sx={style}>
				<h1> {modalService.title}</h1>		
				{modalService?.children}
			</Box>
		</ModalBase>
	);
};

export default observer( Modal );
