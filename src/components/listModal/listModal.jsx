import { Box, Button, Modal, Typography } from "@mui/material";

import { useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import Line from "../line/line";

const MODAL_STYLE = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    maxHeight: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
}

export const ListModal = ({open, onClose, list, title}) => {

    const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 5});
    const navigate = useNavigate();

    return (
        <Modal open={open} onClose={onClose}>
            {list.length > 0 ?
                <Box sx = {MODAL_STYLE}>
                <Typography  variant="h6" align='center'>{title}</Typography>
                <Line/>
                    <DataGrid
                    rows={list.map((streamId, index) => ({streamId: streamId, id: index}))}
                    columns={
                        [
                            { field: 'streamId', headerName: 'ID Serie', flex: 1 },
                            { field: 'Ver', width: 90, renderCell: (cellValues) => {
                                return <Button onClick={() => navigate('/monitoreo/series', {
                                    state: {
                                        streamId: cellValues.row.streamId,
                                    }
                                    })}>Ver</Button>
                            } }
                        ]
                    }
                    pageSizeOptions={[5]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    disableRowSelectionOnClick
                />
                </Box> :
                <Box sx = {MODAL_STYLE}> <Typography  variant="h6" align='center'> No hay series con este error </Typography> </Box>
            }
            
        </Modal>
    )
}