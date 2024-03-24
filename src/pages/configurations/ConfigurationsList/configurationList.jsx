import React, { useCallback, useEffect, useState, useContext } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Line from '../../../components/line/line';
import { Box, Button, ListItemButton, CircularProgress } from '@mui/material';
import { CreateConfigurations } from '../createConfigurations/createConfigurations';
import { ConfigurationListPresenter } from '../../../presenters/configurationListPresenter';
import { ConfigurationContext } from '../../../providers/configProvider';
import { CONFIGURATION_VIEWS } from '../configuraciones';
//import useUser from '../../../stores/useUser';
//import { UserContext } from '../../../stores/userContext';

function getDeleteConfigModalContent(configuration, presenter, handleDelete){
    return(
        <div>
            <h4>
                ¿Estas seguro que quieres eliminar {configuration.Name}?
            </h4>
            <div>
                <Button variant="contained" color='error' onClick={()=> {
                    presenter.onDeleteConfig(configuration.Id)
                    handleDelete(configuration.Id)
                    }} sx={{marginX:5}}>
                    Si
                </Button>
                <Button variant="contained" sx={{marginX:5}} onClick={presenter.onCancelDeleteConfig}>
                    No
                </Button>
            </div>
        </div>
    )
}


export const ConfigurationsList = ({setCurrentView}) => {
    const presenter = new ConfigurationListPresenter()
    const {currentConfigID, selectConfig} = useContext(ConfigurationContext);
    //const {userInfo} = useUser()
    const [configurations, setConfigurations] = useState([]);
    const [isLoading, setLoading] = useState(true)
    const isAdmin = true
    
    const handleDelete = (id) => {
        const updatedData = configurations.filter((item) => item.Id !== id);
        setConfigurations(updatedData);
    };

    const fetchConfigData = useCallback(async( func)=> {
        const data = await func();
        setConfigurations(data)
        setLoading(false)
    }, [])
    
    useEffect(() => {
        fetchConfigData(presenter.getConfigurations)
    }, [fetchConfigData]);

    
    return (
        <Box sx={{width: '80%', bgcolor: 'background.paper', margin:"5%"}}>
            <Box sx={{
                    display:"flex",
                    flexDirection: "horizontal",
                    justifyContent:"space-between"}}>

                <span style={{ fontWeight: 'bold' }}>Nombre de configuracion</span>
                <span style={{ fontWeight: 'bold', marginRight: 50}}>Acción</span>
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
                                key={configuration.Id}
                                disableGutters
                                secondaryAction={
                                    <div>
                                        <Button variant="outlined"size='small' onClick={()=>selectConfig(configuration.Id, configuration.Name)}
                                            disabled={configuration.Id === currentConfigID}
                                        >
                                            usar
                                        </Button>
                                        {isAdmin ?
                                            <IconButton aria-label="trash" onClick={() => {
                                                presenter.onDeleteConfigPressed(getDeleteConfigModalContent( configuration, presenter, handleDelete))
                                                }}>
                                                <DeleteForeverIcon color='error'/>
                                            </IconButton> : <></>}
                                    </div>
                                }
                            >
                                <ListItemText primary={`${configuration.Name}`} />
                            </ListItem>
                        </ListItemButton>
                    ))}
                </List>
            }
            {isAdmin ? <Button variant="outlined" sx={{marginTop:"5%"}} onClick={() => setCurrentView(CONFIGURATION_VIEWS.CREATE)}>Agregar configuración</Button> :<></>}
        </Box>
    );
}