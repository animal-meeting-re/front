import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BezierProvider, LightFoundation } from "@channel.io/bezier-react";
import SettingPage from "./pages/settingPage.jsx";
import AnimalTestPage from "./pages/AnimalTestPage";

function App() {
    return (
        <BezierProvider foundation={LightFoundation}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<SettingPage />} />
                    <Route path="/test" element={<AnimalTestPage />} />
                </Routes>
            </BrowserRouter>
        </BezierProvider>
    );
}

export default App;
