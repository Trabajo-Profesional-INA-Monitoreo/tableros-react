import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "../SideBar/sideBar";


const Layout = () => {
    return (
        <Box sx={{ display: "flex" }}>
        <Box
            component="nav"
            sx={{
            width: "300px",
            flexShrink: 0
            }}
        >
            <Sidebar />
        </Box>
        <Box
            component="main"
            sx={{
            flexGrow: 1,
            p: 3,
            width: `calc(100% - ${"300px"})`,
            minHeight: "100vh",
            backgroundColor: "white",
            }}
        >
            <Toolbar />
            <Outlet />
        </Box>
        </Box>
    );
    };

export default Layout;