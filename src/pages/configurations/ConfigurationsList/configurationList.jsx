import React, { useCallback, useEffect, useState, useContext } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditIcon from '@mui/icons-material/Edit';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Line from '../../../components/line/line';
import { Box, Button, ListItemButton, CircularProgress } from '@mui/material';
import { CreateConfigurations } from '../createConfigurations/createConfigurations';
import { ConfigurationListPresenter } from '../../../presenters/configurationListPresenter';
import { ConfigurationContext } from '../../../providers/configProvider';
import useUser from '../../../stores/useUser';
import { CONFIGURATION_VIEWS } from '../configuraciones';
import { getConfigurationID, setConfigurationID, setConfigurationName } from '../../../utils/storage';
import { notifyError } from "../../../utils/notification";
import { CurrentConfiguration } from '../../../components/currentConfiguration/currentConfiguration';
import { DeleteModal } from '../deleteModal/deleteModal';
import NoResults from '../../../components/noResults/noResults';
import NoConectionSplash from '../../../components/noConection/noConection';

const saveSelectedId = (id, name) => {
    setConfigurationID(id);
    setConfigurationName(name);
};

const getConfigId = () => {
    return getConfigurationID();
};

export const ConfigurationsList = ({setCurrentView, setSelectedConfigurationID}) => {
    const presenter = new ConfigurationListPresenter()
    const {currentConfigID, selectConfig} = useContext(ConfigurationContext);
    const {userInfo} = useUser()
    const [configurations, setConfigurations] = useState([]);
    const [isLoading, setLoading] = useState(true)
    const isAdmin = userInfo.roles?.includes("admin")
    const [modalId, setModalId] = useState(null);
    const [error, setError] = useState(false)

    const handleDelete = (id) => {
        const updatedData = configurations.filter((item) => item.Id !== id);
        setConfigurations(updatedData);
    };

    const fetchConfigData = useCallback(async( func)=> {
        try{
            const data = await func();
            if (data){
                setConfigurations(data)
                if(!currentConfigID && data.length>0) { //setteo por default la primera
                    selectConfig(data[0].Id, data[0].Name);
                    saveSelectedId(data[0].Id, data[0].Name)
                }
            }
        } catch(error){
            notifyError(`${error} configurations`)
            setError(true)
        } finally {
            setLoading(false)
        }
    }, [])
    
    useEffect(() => {
        
        fetchConfigData(presenter.getConfigurations)
        
        
    }, [fetchConfigData]);


    return (
        <>
        <CurrentConfiguration/>

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
                :(error? <NoConectionSplash/> : 
                (configurations.length>0? 
                    <Box sx={{width: '90%', bgcolor: 'background.paper', margin:"5%"}}>

                    <Box sx={{
                        display:"flex",
                        flexDirection: "horizontal",
                        justifyContent:"space-between"}}
                    >
                        <span style={{ fontWeight: 'bold' }}>Nombre de configuracion</span>
                        <span style={{ fontWeight: 'bold', marginRight: 50}}>Acción</span>
                    </Box>
                    <Line/>
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
                                            <Button variant="outlined"size='small' onClick={()=>{
                                                    selectConfig(configuration.Id, configuration.Name);
                                                    saveSelectedId(configuration.Id, configuration.Name)
                                                }}
                                                disabled={configuration.Id === getConfigId()}
                                            >
                                                usar
                                            </Button>
                                            <IconButton aria-label="trash" onClick={() => { setCurrentView(CONFIGURATION_VIEWS.VIEW); setSelectedConfigurationID(configuration.Id); window.scrollTo(0, 0)}}>
                                                <VisibilityOutlinedIcon color='primary'/>
                                            </IconButton>
                                            {isAdmin ?
                                                <>
                                                    <IconButton aria-label="trash" onClick={() => { setCurrentView(CONFIGURATION_VIEWS.EDIT); setSelectedConfigurationID(configuration.Id); window.scrollTo(0, 0)}}>
                                                        <EditIcon color='primary'/>
                                                    </IconButton>
                                                    <IconButton aria-label="trash" onClick={() =>{setModalId(configuration.Id)}}>
                                                        <DeleteForeverIcon color='error'/>
                                                    </IconButton>
                                                </> : <></>}
                                            </div>
                                        }
                                    >
                                        <ListItemText primary={`${configuration.Name}`} />
                                    </ListItem>
                                </ListItemButton>
                            ))
                        }
                    </List>
                    {configurations.map((config) => (
                        <DeleteModal 
                            open={config.Id === modalId} 
                            handleClose={() => setModalId(null)} 
                            configuration={config}
                            onDeleteConfig={presenter.onDeleteConfig}
                            updateData={handleDelete}
                        />
                    ))}

                {isAdmin ?
                    <Button
                        variant="contained"
                        sx={{
                            position: "fixed",
                            bottom: "30px",
                            right: "20px",
                        }}
                        onClick={() => {setCurrentView(CONFIGURATION_VIEWS.CREATE); window.scrollTo(0, 0)}}
                    >
                        Agregar configuración
                    </Button> :<></>}

                </Box>
                :
                    <NoResults textNoResults="configuraciones"/>
                ))
            }
        </>
    );
}