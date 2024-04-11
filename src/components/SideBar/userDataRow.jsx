import { useState } from "react";
import { Avatar, Stack, Toolbar, Tooltip, Menu, Typography, MenuItem   } from "@mui/material";
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

const UserDataRow = () => {

    const [userMenu, setOpenMenu] = useState(null);
  
    const handleOpenUserMenu = (event) => {
      setOpenMenu(event.currentTarget);
    };
  
    const handleCloseUserMenu = () => {
      setOpenMenu(null);
    };

    const { userInfo } = useUser()

    return (
        <Toolbar sx={{ marginBottom: "20px" }}>
            <Tooltip title="Acciones de usuario">
                <Stack
                    direction="row"
                    justifyContent="left"
                    alignItems="center"
                    onClick={handleOpenUserMenu}
                    style={{cursor:"pointer"}}
                >
                    <Avatar/>
                   <text style={{wordBreak: 'break-all', width: '100%', padding: '0px 10px 0px 10px'}}>
                        <b>{userInfo.userName}</b>
                    </text>
                </Stack>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={userMenu}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={Boolean(userMenu)}
                onClose={handleCloseUserMenu}
            >
                {mapMenuOptions()}
            </Menu>
        </Toolbar>
    )
}

export default UserDataRow;