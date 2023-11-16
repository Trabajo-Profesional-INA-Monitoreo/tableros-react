import { Avatar, Drawer, List, Stack, Toolbar } from "@mui/material";
import appRoutes from "../../routes/ReactRoutes";
import SidebarItem from "./sideBarItem";
import { UserService } from "../../services/userService";

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
        }
        
        >
        <List disablePadding>
            <Toolbar sx={{ marginBottom: "20px" }}>
            <Stack
                sx={{ width: "100%" }}
                direction="row"
                justifyContent="left"
                onClick ={ () => {UserService.doLogout()}} // TODO
            >
                <Avatar/>
                <text
                    style={{
                        marginLeft: "30px",
                        }}
                > {UserService.getUsername()} </text>
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