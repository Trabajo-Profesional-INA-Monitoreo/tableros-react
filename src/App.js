import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/layout";
import { routes } from "./routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routes}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;