import { useState } from "react";
import { Avatar, Stack, Toolbar, Tooltip, Menu, Typography, MenuItem   } from "@mui/material";
import  useUser  from "../../stores/useUser";
import {UserLogout} from "../../services/userService"

function mapMenuOptions() {
    return (
        <MenuItem key={"logout"} onClick={UserLogout}>
            <Typography textAlign="center">Cerrar sesión</Typography>
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
        <Toolbar disableGutters style={{marginLeft: 'auto'}}>
            <Tooltip title="Cerrar sesión">
                <Stack
                    direction="row"
                    justifyContent="left"
                    alignItems="center"
                    onClick={handleOpenUserMenu}
                    style={{cursor:"pointer"}}
                >         
                   <text style={{wordBreak: 'break-all', width: '100%', padding: '0px 10px 0px 10px'}}>
                        <b>{userInfo.userName}</b>
                    </text>
                    <Avatar/>
                </Stack>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={userMenu}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
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