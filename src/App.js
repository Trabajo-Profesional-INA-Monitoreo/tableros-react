import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/layout";
import { routes } from "./routes";
import { UserContext } from "./stores/userContext";
import MainProvider from "./providers/mainProvider";
import Modal from "./components/modal/modal";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  return (
    <UserContext>
      <MainProvider>
        <LocalizationProvider  dateAdapter={AdapterDayjs } >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                {routes}
              </Route>
            </Routes>
          </BrowserRouter>
          <Modal/>
        </LocalizationProvider>
      </MainProvider>
    </UserContext>
  );
}

export default App;