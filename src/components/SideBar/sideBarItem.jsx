import { ListItemButton, ListItemIcon } from "@mui/material";
import ListItem from '@mui/material/ListItem';
import { Link } from "react-router-dom";
import { getConfigurationName } from '../../utils/storage';
import { useContext, useEffect, useState } from "react";
import { ConfigurationContext } from "../../providers/configProvider";


const SidebarItem = ({ item }) => {
  const {currentConfigID} = useContext(ConfigurationContext)
  
  return (
    item.sidebarProps && item.path ? (
      <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            ml: 0.5
          }}
          component={Link}
          to={item.path}
          disabled={currentConfigID===null && item.path!=="/configuraciones"}
        >
          <ListItemIcon sx={{
            color: "#1A1F36",
            justifyContent: 'left',
          }}>
            {item.sidebarProps.icon && item.sidebarProps.icon}
          </ListItemIcon>
          {item.sidebarProps.displayText}
        </ListItemButton>
      </ListItem>
    ) : null
  );
};



export default SidebarItem;