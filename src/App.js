import { BrowserRouter, Route, Routes } from "react-router-dom";
import SettingPage from "./pages/settingPage";
import AnimalTestPage from "./pages/AnimalTestPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SettingPage />} />
                <Route path="/test" element={<AnimalTestPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
