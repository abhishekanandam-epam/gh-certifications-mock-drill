import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import Exam from "./pages/Exam";
import History from "./pages/History";
import AttemptDetail from "./pages/AttemptDetail";
import { CertificationProvider } from "./lib/certification";
import "./App.css";

function App() {
  return (
    <CertificationProvider>
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/exam" element={<Exam />} />
          <Route path="/history" element={<History />} />
          <Route path="/history/:id" element={<AttemptDetail />} />
        </Routes>
      </main>
    </CertificationProvider>
  );
}

export default App;
