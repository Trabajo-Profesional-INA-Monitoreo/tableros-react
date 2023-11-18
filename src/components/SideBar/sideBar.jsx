import { Avatar, Drawer, List, Stack, Toolbar } from "@mui/material";
import appRoutes from "../../routes/ReactRoutes";
import SidebarItem from "./sideBarItem";
import  useUser  from "../../stores/useUser";
import {UserLogout} from "../../services/userService"

const Sidebar = () => {
    const { userInfo } = useUser()
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
                onClick ={ () => {UserLogout()}}
            >
                <Avatar/>
                <text
                    style={{
                        marginLeft: "30px",
                        }}
                > {userInfo.userName} </text>
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