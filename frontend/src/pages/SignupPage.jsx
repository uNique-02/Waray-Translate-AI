import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import useUserStore from "../stores/useUserStore.js";
import GoogleSignUpButton from "../components/OAuthGoogleButton.jsx";
import { Mail, Lock, User, ArrowRight, Sparkles, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function AuthForm() {
  const location = useLocation();
  const isSignUp = location.pathname === "/signup";
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [focusedInput, setFocusedInput] = useState(null);

  const { signup } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await signup(formData);

      // Check if signup() returned a valid response object
      if (response?.success) {
        toast.success(response.message);
        navigate(from, { replace: true });
      } else {
        // Covers known user errors like "Account already exists"
        toast.error(response?.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      // Covers network/server issues or thrown exceptions
      console.error("Signup error:", err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

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
        <form onSubmit={handleSubmit} className="space-y-5">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
              <h2 className="text-2xl font-bold text-slate-900 text-center">
              Create Account
            </h2>
            <p className="text-sm text-center text-slate-600 mt-2">
              Start your journey with us today
            </p>
          </Motion.div>

          <div>
            <Motion.label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Full Name
            </Motion.label>
            <Motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <User
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 z-10 ${
                  focusedInput === "name" ? "text-blue-600" : "text-slate-400"
                }`}
              />
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                onFocus={() => setFocusedInput("name")}
                onBlur={() => setFocusedInput(null)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:outline-none transition-all duration-200 bg-white text-slate-900 placeholder-slate-400 backdrop-blur-sm relative"
                required
              />
            </Motion.div>
          </div>

          <div>
            <Motion.label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              Email Address
            </Motion.label>
            <Motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
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
                placeholder="Create a password"
                className="w-full pl-10 pr-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:outline-none transition-all duration-200 bg-white text-slate-900 placeholder-slate-400 backdrop-blur-sm relative"
                required
              />
            </Motion.div>
          </div>

          <div>
            <Motion.label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-700 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              Confirm Password
            </Motion.label>
            <Motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Shield
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 z-10 ${
                  focusedInput === "confirmPassword"
                    ? "text-blue-600"
                    : "text-slate-400"
                }`}
              />
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                onFocus={() => setFocusedInput("confirmPassword")}
                onBlur={() => setFocusedInput(null)}
                placeholder="Confirm your password"
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
            className="w-full bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-900/30 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 flex items-center justify-center gap-2 group hover:cursor-pointer"
          >
            Sign Up
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Motion.button>

          {/* Divider */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex items-center justify-center space-x-3 my-6"
          >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <span className="text-sm text-gray-400 font-medium">or</span>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </Motion.div>

          {/* Social Buttons */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <GoogleSignUpButton />
          </Motion.div>

          {/* Terms and Privacy */}
          <Motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="text-xs text-slate-600 text-center mt-4"
          >
            By clicking "Sign Up", you agree to our{" "}
            <a
              href="#"
              className="text-blue-700 font-medium hover:text-blue-600 transition-colors duration-200"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-blue-700 font-medium hover:text-blue-600 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            .
          </Motion.p>

          <Motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-center text-slate-700"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-700 font-semibold hover:text-blue-600 transition-colors duration-200"
            >
              Login here
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
