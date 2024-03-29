import { Home } from '../pages/home/home';
import { Configurations } from '../pages/configurations/configuraciones';
import { Estaciones } from '../pages/estaciones/estaciones';
import { Redes } from '../pages/redes/redes';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import HouseboatIcon from '@mui/icons-material/Houseboat';
import SpokeIcon from '@mui/icons-material/Spoke';
import { Series } from '../pages/series/series';
import ShowChartIcon from '@mui/icons-material/ShowChart';

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
			element: <Configurations />,
			state: "Configurations",
			sidebarProps: {
				displayText: "Configuraciones",
				icon: <SettingsIcon />
			}
		},
		{
			path: "/estaciones",
			index: true,
			element: <Estaciones />,
			state: "Estaciones",
			sidebarProps: {
				displayText: "Estaciones",
				icon: <HouseboatIcon />
			}
		},
		{
			path: "/series",
			index: true,
			element: <Series />,
			state: "Series",
			sidebarProps: {
				displayText: "Series",
				icon: <ShowChartIcon />
			}
		},
		{
			path: "/redes",
			index: true,
			element: <Redes />,
			state: "Redes",
			sidebarProps: {
				displayText: "Redes",
				icon: <SpokeIcon />
			}
		},
	];
	
export default appRoutes;