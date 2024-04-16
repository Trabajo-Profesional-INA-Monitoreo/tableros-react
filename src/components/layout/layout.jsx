import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import SideBar from "../sideBar/sideBar";

const Layout = () => {
    return (
        <Box>
            <SideBar>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        width: `calc(100%)`,
                        minHeight: "100vh",
                        backgroundColor: "white",
                    }}
                >
                    <Outlet />
                </Box>
            </SideBar>
        </Box>
    );
    };

export default Layout;