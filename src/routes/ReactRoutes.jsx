import { Home } from '../pages/home/home';
import HomeIcon from '@mui/icons-material/Home';
import { Configuraciones } from '../pages/Configuraciones/configuraciones';
import SettingsIcon from '@mui/icons-material/Settings';

const appRoutes = [
		{
			path: "/inicio",
			index: true,
			element: <Home />,
			state: "inicio",
			sidebarProps: {
				displayText: "Inicio",
				icon: <HomeIcon />
			}
		},
		{
			path: "/configuraciones",
			index: true,
			element: <Configuraciones />,
			state: "Configuraciones",
			sidebarProps: {
				displayText: "Configuraciones",
				icon: <SettingsIcon />
			}
		}
	];
	
export default appRoutes;