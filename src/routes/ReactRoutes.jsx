import { Configurations } from '../pages/configurations/configuraciones';
import { Stations } from '../pages/stations/stations';
import { Nodes } from '../pages/nodes/nodes';
import { Outputs } from '../pages/outputs/outputs';
import { Series } from '../pages/series/series';
import SettingsIcon from '@mui/icons-material/Settings';
import HouseboatIcon from '@mui/icons-material/Houseboat';
import CellTowerIcon from '@mui/icons-material/CellTower';
import { Inputs } from '../pages/inputs/inputs';
import PestControlIcon from '@mui/icons-material/PestControl';
import InsertChartOutlinedOutlinedIcon from '@mui/icons-material/InsertChartOutlinedOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';

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
			path: "/inputs",
			index: true,
			element: <Inputs />,
			state: "inputs",
			sidebarProps: {
				displayText: "Inputs",
				icon: <InsertChartOutlinedOutlinedIcon />
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
				icon: <TimelineOutlinedIcon />
			}
		},
		{
			path: "/outputs",
			index: true,
			element: <Outputs />,
			state: "Outputs",
			sidebarProps: {
				displayText: "Outputs",
				icon: <PestControlIcon />
			}
		},
		
	];
	
export default appRoutes;