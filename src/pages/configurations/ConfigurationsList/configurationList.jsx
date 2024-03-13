import React from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Line from '../../../components/line/line';
import { Box, Button, ListItemButton } from '@mui/material';
import { CreateConfigurations } from '../createConfigurations/createConfigurations';
import { HomePresenter } from '../../../presenters/homePresenter';

function getDeleteConfigModalContent(value){
    return(
        <div>
            <h4>
                ¿Estas seguro que quieres eliminar {value}?
            </h4>
            <Button>
                Si
            </Button>
            <Button>
                No
            </Button>
        </div>
    )
}

export const ConfigurationsList = () => {
    const presenter = new HomePresenter()
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
            <List>
                {["configuracion 1", "Configuracion 2", "configuracion 3"].map((value) => (
                    <ListItemButton
                        onClick={() => ( <CreateConfigurations/> )}
                    >
                        <ListItem
                            key={value}
                            disableGutters
                            secondaryAction={
                                <IconButton aria-label="trash" onClick={() => presenter.onDeleteConfigPressed(getDeleteConfigModalContent( value ))}>
                                    <DeleteForeverIcon color='error'/>
                                </IconButton>
                            }
                        >
                            <ListItemText primary={`${value}`} />
                        </ListItem>
                    </ListItemButton>
                ))}
            </List>
            <Button variant="outlined" color="warning" sx={{marginTop:"5%"}}>Agregar configuración</Button>
        </Box>
    );
}