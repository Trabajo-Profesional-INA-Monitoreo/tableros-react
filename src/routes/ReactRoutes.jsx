import { Navigate } from 'react-router-dom';
import { Configurations } from '../pages/configurations/configuraciones';
import { Stations } from '../pages/stations/stations';
import { Nodes } from '../pages/nodes/nodes';
import { Outputs } from '../pages/outputs/outputs';
import { Series } from '../pages/series/series';
import { Inputs } from '../pages/inputs/inputs';
import SettingsIcon from '@mui/icons-material/Settings';
import HouseboatIcon from '@mui/icons-material/Houseboat';
import CellTowerIcon from '@mui/icons-material/CellTower';
import PestControlIcon from '@mui/icons-material/PestControl';
import InsertChartOutlinedOutlinedIcon from '@mui/icons-material/InsertChartOutlinedOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';

const appRoutes = [
		{
			path: "/",
			element: <Navigate to="/configuraciones"/>,
		},
		{
			path: "/configuraciones",	
			element: <Configurations />,
			sidebarProps: {
				displayText: "Configuraciones",
				icon: <SettingsIcon />
			}
		},
		{
			path: "/inputs",
			element: <Inputs />,
			sidebarProps: {
				displayText: "Inputs",
				icon: <InsertChartOutlinedOutlinedIcon />
			}
		},
		{
			path: "/estaciones",
			element: <Stations />,
			sidebarProps: {
				displayText: "Estaciones",
				icon: <HouseboatIcon />
			}
		},
		{
			path: "/nodos",
			element: <Nodes />,
			sidebarProps: {
				displayText: "Nodos",
				icon: <CellTowerIcon />
			},
		},
		{
			path: "/series",
			element: <Series />,
			sidebarProps: {
				displayText: "Series",
				icon: <TimelineOutlinedIcon />
			}
		},
		{
			path: "/outputs",
			element: <Outputs />,
			sidebarProps: {
				displayText: "Outputs",
				icon: <PestControlIcon />
			}
		},	
];
	
export default appRoutes;