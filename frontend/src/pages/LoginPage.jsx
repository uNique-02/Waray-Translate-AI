import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useUserStore from "../stores/useUserStore.js";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import useAiStore from "../stores/aiStore.js";

export default function AuthForm() {
  const location = useLocation();
  const isSignUp = location.pathname === "/signup";
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const reset = useAiStore((s) => s.reset);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [focusedInput, setFocusedInput] = useState(null);

  const { user, checkingAuth, login } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("Redirecting to:", from);
    // console.log("Form Data:", formData);
    try {
      const { success, message } = await login(formData);
      if (success) {
        // console.log("CONFIRMING USER LOGGED IN", user);
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error("Login failed. Please try again later.");
      console.error("Login error:", err);
    }
  };

  useEffect(() => {
    if (!checkingAuth && user) {
      reset();
      navigate(from, { replace: true });
    }
  }, [checkingAuth, user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 border border-white/20"
      >
        {/* Logo/Brand */}
        <div className="flex items-center justify-center mb-6">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="mr-2"
          >
            <Sparkles className="w-6 h-6 text-blue-500" />
          </motion.div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Waray Transcribe AI
          </h1>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-xl">
          <Link
            to="/signup"
            className="relative w-1/2 py-2.5 text-center font-medium rounded-lg transition-all duration-300"
          >
            <span
              className={`relative z-10 ${
                isSignUp ? "text-white" : "text-gray-600"
              }`}
            >
              Sign Up
            </span>
            {isSignUp && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Link>
          <Link
            to="/login"
            className="relative w-1/2 py-2.5 text-center font-medium rounded-lg transition-all duration-300"
          >
            <span
              className={`relative z-10 ${
                !isSignUp ? "text-white" : "text-gray-600"
              }`}
            >
              Login
            </span>
            {!isSignUp && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Welcome Back
            </h2>
            <p className="text-sm text-center text-gray-500 mt-2">
              Login to continue your journey
            </p>
          </motion.div>

          <div>
            <motion.label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Email Address
            </motion.label>
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Mail
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 z-10 ${
                  focusedInput === "email" ? "text-blue-500" : "text-gray-400"
                }`}
              />
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                placeholder="john.doe@example.com"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm relative"
                required
              />
            </motion.div>
          </div>

          <div>
            <motion.label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Password
            </motion.label>
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Lock
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 z-10 ${
                  focusedInput === "password"
                    ? "text-blue-500"
                    : "text-gray-400"
                }`}
              />
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm relative"
                required
              />
            </motion.div>
          </div>

          <motion.button
            type="submit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            Login
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-center text-gray-600"
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
            >
              Sign up here
            </Link>
          </motion.p>
        </form>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-sm text-gray-500 mt-6 relative z-10"
      >
        Made with{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-semibold">
          Waray Transcribe AI
        </span>
      </motion.footer>
    </div>
  );
}
