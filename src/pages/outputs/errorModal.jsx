import { Box, Button, Modal, Typography } from "@mui/material";
import Line from "../../components/line/line";
import CircularProgressLoading from "../../components/circularProgressLoading/circularProgressLoading";
import { SeriesPresenter } from "../../presenters/seriesPresenter";
import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";

const MODAL_STYLE = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    maxHeight: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
}

export const ErrorModal = ({open, onClose, errorType}) => {

    const presenter = new SeriesPresenter();

    const [isLoading, setIsLoading] = useState(true);
    const [implicatedSeries, setImplicatedSeries] = useState([]);
    const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 2});

    const getImplicatedSeries = async() => {
        const implicatedSeries = await presenter.getImplicatedSeries(errorType);
        setImplicatedSeries(implicatedSeries);
        setIsLoading(false);
    }

    useEffect(() => {
        if (open) getImplicatedSeries();
    }, [open]);

    const navigate = useNavigate();

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx = {MODAL_STYLE}>
                <Typography  variant="h6" align='center'> Series implicadas </Typography>
                <Line />
                {isLoading ? <CircularProgressLoading/> : 
                     <DataGrid
                        rows={implicatedSeries.map((serie, index) => ({...serie, id: index}))}
                        columns={
                            [
                                { field: 'StreamId', headerName: 'ID Serie', width: 90 },
                                { field: 'StationId', headerName: 'ID Estación', width: 90 },
                                { field: 'StationName', headerName: 'Nombre Estación', minWidth: 300, flex: 1 },
                                { field: 'Ver', renderCell: (cellValues) => {
                                    return <Button onClick={() => navigate('/monitoreo/series', {
                                        state: {
                                          streamId: cellValues.row.StreamId,
                                        }
                                      })}>Ver</Button>
                                } }
                            ]
                        }
                        pageSizeOptions={[2]}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        disableRowSelectionOnClick
                   />
                }
                
            </Box>
        </Modal>
    )
}

export const NoErrorModal = ({open, onClose}) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx = {MODAL_STYLE}>
                <Typography  variant="h6" align='center'> No hay errores de este tipo </Typography>
            </Box>
        </Modal>
    )
}