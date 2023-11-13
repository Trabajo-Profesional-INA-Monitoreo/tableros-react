import { Avatar, Drawer, List, Stack, Toolbar } from "@mui/material";
import appRoutes from "../../routes/ReactRoutes";
import SidebarItem from "./sideBarItem";
import sidebarStyle from "./sideBarStyle"


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
                backgroundColor: "gray",
                color: "white",
            }}
        }
        >
        <List disablePadding>
            <Toolbar sx={{ marginBottom: "20px" }}>
            <Stack
                sx={{ width: "100%" }}
                direction="row"
                justifyContent="center"
            >
                <Avatar/>
            </Stack>
            </Toolbar>
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