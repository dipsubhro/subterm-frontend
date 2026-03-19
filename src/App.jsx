import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import WebIDE from "./pages/WebIDE";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/webide" element={<WebIDE />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
