import { Drawer, List,  } from "@mui/material";
import appRoutes from "../../routes/ReactRoutes";
import SidebarItem from "./sideBarItem";
import UserDataRow from "./userDataRow"


const Sidebar = () => {

    return (
        <Drawer
        variant="permanent"
        sx={{
            width: "300px",
            flexShrink: 0,
            "& .MuiDrawer-paper": {
                width: "300px",
                boxSizing: "border-box",
                borderRight: "0px",
                backgroundColor: "white",
                color: "#1A1F36",
            }}
        }>
        <List disablePadding>
            <UserDataRow />
            {appRoutes.map((route, index) => (
            route.sidebarProps ? (
                <SidebarItem item={route} key={index} />
            ) : null
            ))}
        </List>
        </Drawer>
    );
};

export default Sidebar;