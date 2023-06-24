import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Inspect from "./pages/Inspect";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index path="" element={<Home />} />
        <Route path="/collections/:collectionSlug" element={<Dashboard />} />
        <Route path="/collections/:collectionSlug/inspect" element={<Inspect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
