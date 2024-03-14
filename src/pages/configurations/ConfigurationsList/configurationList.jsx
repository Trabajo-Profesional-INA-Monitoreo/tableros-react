import React, { useCallback, useEffect, useState } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Line from '../../../components/line/line';
import { Box, Button, ListItemButton, CircularProgress } from '@mui/material';
import { CreateConfigurations } from '../createConfigurations/createConfigurations';
import configurationService from '../../../services/configurationService';
import { ConfigurationListPresenter } from '../../../presenters/configurationListPresenter';

function getDeleteConfigModalContent(configuration, presenter){
    return(
        <div>
            <h4>
                ¿Estas seguro que quieres eliminar {configuration.name}?
            </h4>
            <div>
                <Button variant="contained" color='error' onClick={presenter.onDeleteConfig(configuration.id)}>
                    Si
                </Button>
                <Button variant="contained">
                    No
                </Button>
            </div>
        </div>
    )
}

export const ConfigurationsList = () => {
    const presenter = new ConfigurationListPresenter()

    const [configurations, setConfigurations] = useState([]);
    const [isLoading, setLoading] = useState(true)

    const fetchProductsData = useCallback(async()=> {
        const data = await presenter.getConfigurations();
        setConfigurations(data)
        setLoading(false)
    }, [presenter])
    
    useEffect(() => {
        fetchProductsData()
    }, [fetchProductsData]);
    return (
        <Box sx={{width: '80%', bgcolor: 'background.paper', margin:"5%"}}>

            <Box sx={{
                    display:"flex",
                    flexDirection: "horizontal",
                    justifyContent:"space-between"}}>

                <span style={{ fontWeight: 'bold' }}>Nombre de configuracion</span>
                <span style={{ fontWeight: 'bold' }}>Acción</span>
            </Box>
            <Line></Line>
            {isLoading?
                <CircularProgress 
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                        margin: 'auto',
                        width: '10vw'
                    }}
                />
                :
                <List>
                    {configurations?.map((configuration) => (
                        <ListItemButton
                            onClick={() => ( <CreateConfigurations/> )}
                        >
                            <ListItem
                                key={configuration.id}
                                disableGutters
                                secondaryAction={
                                    <IconButton aria-label="trash" onClick={() => presenter.onDeleteConfigPressed(getDeleteConfigModalContent( configuration, presenter ))}>
                                        <DeleteForeverIcon color='error'/>
                                    </IconButton>
                                }
                            >
                                <ListItemText primary={`${configuration.name}`} />
                            </ListItem>
                        </ListItemButton>
                    ))}
                </List>
            }
            <Button variant="outlined" color="warning" sx={{marginTop:"5%"}}>Agregar configuración</Button>
        </Box>
    );
}