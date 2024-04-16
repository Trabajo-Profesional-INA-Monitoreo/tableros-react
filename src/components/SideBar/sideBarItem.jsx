import { ListItemButton, ListItemIcon } from "@mui/material";
import ListItem from '@mui/material/ListItem';
import { Link } from "react-router-dom";


const SidebarItem = ({ item }) => {

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
        >
          <ListItemIcon sx={{
            color:  "#1A1F36",
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