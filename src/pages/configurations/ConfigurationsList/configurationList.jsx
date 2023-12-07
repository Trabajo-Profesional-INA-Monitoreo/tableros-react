import React from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Line from '../../../components/line/line';
import { Box, Button, ListItemButton } from '@mui/material';
import { CreateConfigurations } from '../createConfigurations/createConfigurations';


export const ConfigurationsList = () => {

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
                        onClick={()=>( <CreateConfigurations></CreateConfigurations> )}
                    >
                        <ListItem
                            key={value}
                            disableGutters
                            secondaryAction={
                            <IconButton aria-label="trash">
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