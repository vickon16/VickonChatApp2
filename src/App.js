import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoutes from "./components/ProtectedRoutes"

function App() {
  return (
    <BrowserRouter>
      <main className="bg-bgHeroImage bg-appColor w-full h-screen mix-blend-overlay flex items-center justify-center">
        <Routes>
          <Route path="/">
            <Route index element={<ProtectedRoutes><Home /></ProtectedRoutes>} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<div className="text-4xl text-center text-white w-ful">...Page not found...</div>} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
