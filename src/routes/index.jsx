import { Route } from "react-router-dom";
import appRoutes from "./ReactRoutes";

const generateRoute = (routes) => {
    return routes.map((route, index) => <Route index path={route.path} element={route.element} key={index}/>);
};

export const routes = generateRoute(appRoutes);