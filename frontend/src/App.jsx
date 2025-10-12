import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WarayTranscribeApp from "./pages/LandingPage";
import ChatPage from "./components/ChatSection2";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { Toaster } from "react-hot-toast";
import useUserStore from "./stores/useUserStore.js";
import { useEffect } from "react";
import { div } from "framer-motion/client";

function App() {
  const { user, checkingAuth, initializeAuth } = useUserStore();

  useEffect(() => {
    initializeAuth(); // Calls /auth/me to check if user is logged in via cookie
  }, []);

  if (checkingAuth) {
    return <div className="text-center mt-20">Loading...</div>;
  }
  return (
    <>
      <div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<WarayTranscribeApp />} />
          <Route path="/new" element={<ChatPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
