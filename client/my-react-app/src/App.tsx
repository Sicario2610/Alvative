import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./Pages/dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
