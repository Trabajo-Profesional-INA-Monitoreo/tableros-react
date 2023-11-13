import { Route } from "react-router-dom";
import appRoutes from "./ReactRoutes";

const generateRoute = (routes) => {
    return routes.map((route, index) => (
        route.index ? (
        <Route
            index
            path={route.path}
            element=
            {route.element}
            key={index}
        />
        ) : (
        <Route
            path={route.path}
            element={route.element}
            key={index}
        >
            {route.child && (
            generateRoute(route.child)
            )}
        </Route>
        )
    ));
};

export const routes = generateRoute(appRoutes);