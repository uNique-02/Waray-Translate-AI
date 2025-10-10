import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WarayTranscribeApp from "./pages/LandingPage";
import ChatPage from "./components/ChatSection2";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WarayTranscribeApp />} />
        <Route path="/new" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
