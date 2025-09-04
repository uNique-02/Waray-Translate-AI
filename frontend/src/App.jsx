import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WarayTranscribeApp from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";

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
