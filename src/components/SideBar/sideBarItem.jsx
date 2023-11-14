import { ListItemButton, ListItemIcon } from "@mui/material";
import { Link } from "react-router-dom";


const SidebarItem = ({ item }) => {

  return (
    item.sidebarProps && item.path ? (
      <ListItemButton
        component={Link}
        to={item.path}
      >
        <ListItemIcon sx={{
          color:  "#1A1F36"
        }}>
          {item.sidebarProps.icon && item.sidebarProps.icon}
        </ListItemIcon>
        {item.sidebarProps.displayText}
      </ListItemButton>
    ) : null
  );
};

export default SidebarItem;