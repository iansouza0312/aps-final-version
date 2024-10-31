import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Login } from "./screens/login";
import { Dashboard } from "./screens/(logged-in)/dashboard";
import { Admin } from "./screens/(logged-in)/admins";
import { Public } from "./screens/(logged-in)/public";

export function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/public" element={<Public />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}
