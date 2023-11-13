import { ListItemButton, ListItemIcon } from "@mui/material";
import { Link } from "react-router-dom";


const SidebarItem = ({ item }) => {

  return (
    item.sidebarProps && item.path ? (
      <ListItemButton
        component={Link}
        to={item.path}
        sx={{
          "&: hover": {
            backgroundColor: "blue"
          },
          paddingY: "12px",
          paddingX: "24px"
        }}
      >
        <ListItemIcon sx={{
          color:  "white"
        }}>
          {item.sidebarProps.icon && item.sidebarProps.icon}
        </ListItemIcon>
        {item.sidebarProps.displayText}
      </ListItemButton>
    ) : null
  );
};

export default SidebarItem;