import { Configurations } from '../pages/configurations/configuraciones';
import { Stations } from '../pages/stations/stations';
import { Nodes } from '../pages/nodes/nodes';
import { Outputs } from '../pages/outputs/outputs';
import { Series } from '../pages/series/series';
import SettingsIcon from '@mui/icons-material/Settings';
import HouseboatIcon from '@mui/icons-material/Houseboat';
import OutputIcon from '@mui/icons-material/Output';
import InputIcon from '@mui/icons-material/Input';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CellTowerIcon from '@mui/icons-material/CellTower';
import { Inputs } from '../pages/inputs/inputs';

const appRoutes = [
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
			element: <Stations />,
			state: "Stations",
			sidebarProps: {
				displayText: "Estaciones",
				icon: <HouseboatIcon />
			}
		},
		{
			path: "/nodos",
			index: true,
			element: <Nodes />,
			state: "Nodos",
			sidebarProps: {
				displayText: "Nodos",
				icon: <CellTowerIcon />
			},
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
			path: "/outputs",
			index: true,
			element: <Outputs />,
			state: "Outputs",
			sidebarProps: {
				displayText: "Outputs",
				icon: <OutputIcon />
			}
		},
		{
			path: "/inputs",
			index: true,
			element: <Inputs />,
			state: "inputs",
			sidebarProps: {
				displayText: "Inputs",
				icon: <InputIcon />
			}
		}
	];
	
export default appRoutes;