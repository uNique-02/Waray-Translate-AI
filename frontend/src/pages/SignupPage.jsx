import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

  const { signup, googleAuth } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Redirecting to:", from);
    console.log("Form Data:", formData);
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
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Create Account
            </h2>
            <p className="text-sm text-center text-gray-500 mt-2">
              Start your journey with us today
            </p>
          </motion.div>

          <div>
            <motion.label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Full Name
            </motion.label>
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <User
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 z-10 ${
                  focusedInput === "name" ? "text-blue-500" : "text-gray-400"
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
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm relative"
                required
              />
            </motion.div>
          </div>

          <div>
            <motion.label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              Email Address
            </motion.label>
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
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
                placeholder="Create a password"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm relative"
                required
              />
            </motion.div>
          </div>

          <div>
            <motion.label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              Confirm Password
            </motion.label>
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Shield
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 z-10 ${
                  focusedInput === "confirmPassword"
                    ? "text-blue-500"
                    : "text-gray-400"
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
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 group hover:cursor-pointer"
          >
            Sign Up
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </motion.button>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex items-center justify-center space-x-3 my-6"
          >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <span className="text-sm text-gray-400 font-medium">or</span>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </motion.div>

          {/* Social Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <GoogleSignUpButton />
          </motion.div>

          {/* Terms and Privacy */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="text-xs text-gray-500 text-center mt-4"
          >
            By clicking "Sign Up", you agree to our{" "}
            <a
              href="#"
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            .
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-center text-gray-600"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
            >
              Login here
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
