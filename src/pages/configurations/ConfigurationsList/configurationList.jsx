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
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import { CONFIGURATION_VIEWS } from '../configuraciones';
import { getConfigurationID, setConfigurationID, setConfigurationName } from '../../../utils/storage';
import { NoResultStyles } from './Style';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { CurrentConfiguration } from '../../../components/currentConfiguration/currentConfiguration';
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

const saveSelectedId = (id, name) => {
    setConfigurationID(id);
    setConfigurationName(name);
    console.log('xxxxx')
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
    
    const handleDelete = (id) => {
        const updatedData = configurations.filter((item) => item.Id !== id);
        setConfigurations(updatedData);
    };

    const fetchConfigData = useCallback(async( func)=> {
        const data = await func();
        if (data){
            setConfigurations(data)
            const confID = getConfigurationID()
            if(!confID && data.length>0) { //setteo por default la primera
                selectConfig(data[0].Id, data[0].Name);
                saveSelectedId(data[0].Id, data[0].Name)
        }
        }
        setLoading(false)
    }, [])
    
    useEffect(() => {
        fetchConfigData(presenter.getConfigurations)
    }, [fetchConfigData]);

    const styles= NoResultStyles()

    return (
        <>
        <CurrentConfiguration/>
            {isAdmin ?
                <Button
                    variant={configurations.length===0? "contained":"outlined"}
                    sx={{
                        position: "fixed",
                        bottom: "30px",
                        right: "20px",
                    }}
                    onClick={() => setCurrentView(CONFIGURATION_VIEWS.CREATE)}
                >
                    Agregar configuración
                </Button> :<></>}

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
                :(configurations.length>0? 
                    <Box sx={{width: '90%', bgcolor: 'background.paper', margin:"5%"}}>

                    <Box sx={{
                        display:"flex",
                        flexDirection: "horizontal",
                        justifyContent:"space-between"}}
                    >
                        <span style={{ fontWeight: 'bold' }}>Nombre de configuracion</span>
                        <span style={{ fontWeight: 'bold', marginRight: 50}}>Acción</span>
                    </Box>
                    <Line></Line>
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
                                            <IconButton aria-label="trash" onClick={() => { setCurrentView(CONFIGURATION_VIEWS.VIEW); setSelectedConfigurationID(configuration.Id); }}>
                                                <VisibilityOutlinedIcon color='primary'/>
                                            </IconButton>
                                            {isAdmin ?
                                            <>
                                                <IconButton aria-label="trash" onClick={() => { setCurrentView(CONFIGURATION_VIEWS.EDIT); setSelectedConfigurationID(configuration.Id); }}>
                                                    <EditIcon color='primary'/>
                                                </IconButton>
                                                <IconButton aria-label="trash" onClick={() => {
                                                    presenter.onDeleteConfigPressed(getDeleteConfigModalContent( configuration, presenter, handleDelete))
                                                    }}>
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
                </Box>
                    :
                    <>
                <div style={styles.mainContainer}>
                    <ManageSearchIcon sx={styles.icon}/>
                    <h1 style={styles.text}>No se encontraron configuraciones</h1>
                </div>
            </>
                )
                
            }
        </>
    );
}