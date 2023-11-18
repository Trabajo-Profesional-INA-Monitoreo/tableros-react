import { useState } from "react";
import { Avatar, Drawer, List, Stack, Toolbar, Tooltip, Menu, Typography,MenuItem   } from "@mui/material";
import appRoutes from "../../routes/ReactRoutes";
import SidebarItem from "./sideBarItem";
import  useUser  from "../../stores/useUser";
import {UserLogout} from "../../services/userService"
import {Blue900} from "../../resources/colors/colors"


function mapMenuOptions() {
    return (
        <MenuItem key={"logout"} onClick={UserLogout}>
            <Typography textAlign="center">Cerrar sesion</Typography>
        </MenuItem>
    )
}


const Sidebar = () => {

    const [anchorElUser, setAnchorElUser] = useState(null);
  
    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
  
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };

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
        }>
        <List disablePadding>
            <Toolbar sx={{ marginBottom: "20px" }}>
                <Tooltip title="Acciones de usuario">
                    <Stack
                        sx={{ width: "100%" }}
                        direction="row"
                        justifyContent="left"
                        alignItems="center"
                        onClick={handleOpenUserMenu}
                        style={{cursor:"pointer"}}
                    >
                        <Avatar/>
                        <text
                            style={{
                                marginLeft: "30px",
                                color: Blue900,
                                fontWeight: "bold"
                                }}
                        > {userInfo.userName} </text>
                    </Stack>
                </Tooltip>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    {mapMenuOptions()}
                </Menu>
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