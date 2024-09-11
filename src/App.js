import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BezierProvider, LightFoundation } from "@channel.io/bezier-react";
// import SettingPage from "./pages/settingPage.jsx";
import AnimalTestPage from "./pages/AnimalTestPage";
import GuidePage from "./pages/GuidePage.jsx";
import { LandingPage } from "./pages/landing-page.js";
import SettingPage from "./pages/settingPage.jsx";
import MeetingChoice from "./pages/meetingChoice.jsx";
import ApplyPage from "./pages/applyPage.jsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route
          path="/test"
          element={
            <BezierProvider foundation={LightFoundation}>
              <AnimalTestPage />
            </BezierProvider>
          }
        />
        <Route path="/choice" element={<MeetingChoice />} />
        <Route path="/apply" element={<ApplyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
