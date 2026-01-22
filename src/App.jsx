import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import WebIDE from "./pages/WebIDE";
import SSOCallback from "./components/SSOCallback";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/webide" element={<WebIDE />} />
        <Route path="/sso-callback" element={<SSOCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
