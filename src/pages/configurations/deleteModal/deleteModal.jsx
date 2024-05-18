import React from 'react';

import { Box, Button, Modal } from '@mui/material';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: "center",
    pt: 2,
    px: 4,
    pb: 3,
};

export const DeleteModal = ({open, handleClose, configuration, onDeleteConfig, updateData}) => {
    return (
        <Modal
            key={configuration.Id}
            open={open}
            onClose={handleClose}
        >
            <Box sx={style} >
            <h4>
                ¿Estas seguro que quieres eliminar la configuración: {configuration.Name}?
            </h4>
            <div>
                <Button variant="contained" color='error' onClick={()=> {
                    onDeleteConfig(configuration.Id)
                    updateData(configuration.Id)
                    handleClose()
                    }} sx={{marginX:5}}>
                    Si
                </Button>
                <Button variant="contained" sx={{marginX:5}} onClick={handleClose}>
                    No
                </Button>
            </div>
            </Box>
        </Modal>
    )
}