import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <Motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-slate-100/95 backdrop-blur-xl p-8 rounded-2xl shadow-[0_24px_80px_rgba(2,6,23,0.45)] w-full max-w-md relative z-10 border border-blue-200/80 ring-1 ring-white/40"
      >
        {/* Logo/Brand */}
        <div className="flex items-center justify-center mb-6">
          <Motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="mr-2"
          >
            <Sparkles className="w-6 h-6 text-cyan-300" />
          </Motion.div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
            Waray Transcribe AI
          </h1>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-8 p-1 bg-blue-950/60 rounded-xl border border-blue-900/60">
          <Link
            to="/signup"
            className="relative w-1/2 py-2.5 text-center font-medium rounded-lg transition-all duration-300"
          >
            <span
              className={`relative z-10 ${
                isSignUp ? "text-white" : "text-slate-600"
              }`}
            >
              Sign Up
            </span>
            {isSignUp && (
              <Motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-lg shadow-md"
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
                !isSignUp ? "text-white" : "text-slate-600"
              }`}
            >
              Login
            </span>
            {!isSignUp && (
              <Motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-lg shadow-md"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
              <h2 className="text-2xl font-bold text-slate-900 text-center">
              Welcome Back
            </h2>
            <p className="text-sm text-center text-slate-600 mt-2">
              Login to continue your journey
            </p>
          </Motion.div>

          <div>
            <Motion.label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Email Address
            </Motion.label>
            <Motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Mail
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 z-10 ${
                  focusedInput === "email" ? "text-blue-600" : "text-slate-400"
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
                className="w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:outline-none transition-all duration-200 bg-white text-slate-900 placeholder-slate-400 backdrop-blur-sm relative"
                required
              />
            </Motion.div>
          </div>

          <div>
            <Motion.label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Password
            </Motion.label>
            <Motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Lock
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 z-10 ${
                  focusedInput === "password"
                    ? "text-blue-600"
                    : "text-slate-400"
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
                className="w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:outline-none transition-all duration-200 bg-white text-slate-900 placeholder-slate-400 backdrop-blur-sm relative"
                required
              />
            </Motion.div>
          </div>

          <Motion.button
            type="submit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-900/30 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            Login
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Motion.button>

          <Motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-center text-slate-700"
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-700 font-semibold hover:text-blue-600 transition-colors duration-200"
            >
              Sign up here
            </Link>
          </Motion.p>
        </form>
      </Motion.div>

      {/* Footer */}
      <Motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-sm text-slate-600 mt-6 relative z-10"
      >
        Made with{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600 font-semibold">
          Waray Transcribe AI
        </span>
      </Motion.footer>
    </div>
  );
}
