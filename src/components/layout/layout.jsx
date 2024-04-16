import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../sideBar/sideBar";


const Layout = () => {
    return (
        <Box sx={{ display: "flex" }}>
        <Box
            component="nav"
            sx={{
            width: "300px",
            flexShrink: 0,
            }}
            borderRight={0.5}
            borderColor="#E3E8EE"
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
            <Outlet />
        </Box>
        </Box>
    );
    };

export default Layout;